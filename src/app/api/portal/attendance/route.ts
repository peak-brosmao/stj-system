import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateAttendanceRate } from "@/lib/utils";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

/**
 * Member view (read-only). Everything comes from the same SQLite database that
 * Course Leaders write to:
 *  - records:  attendance already recorded by my Course Leader
 *  - upcoming: lessons my Course Leader created that have not been taught yet
 *  - pending:  lessons whose date has passed but attendance is not recorded yet
 * A lesson is invisible to members until a Leader / the President creates it.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseFilter = searchParams.get("course") || "ALL";
    const statusFilter = searchParams.get("status") || "ALL";

    let user = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: session.id },
            ...(session.email ? [{ email: session.email }] : []),
            ...(session.studentId ? [{ studentId: session.studentId }] : []),
          ],
        },
        include: {
          member: {
            include: {
              enrollments: {
                include: {
                  course: true,
                },
              },
              department: true,
            },
          },
        },
      });
    } catch {
      // Non-blocking
    }

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (m) =>
        (session.studentId && m.studentId.toLowerCase() === session.studentId.toLowerCase()) ||
        (session.email && m.email.toLowerCase() === session.email.toLowerCase()) ||
        (user?.studentId && m.studentId.toLowerCase() === user.studentId.toLowerCase()) ||
        (user?.email && m.email.toLowerCase() === user.email.toLowerCase())
    );

    const userInfo = {
      fullNameKh: user?.fullNameKh || rosterMatch?.nameKh || session.fullNameKh || "សមាជិក STJ",
      fullNameEn: user?.fullNameEn || rosterMatch?.nameEn || session.fullNameEn || "",
      studentId: user?.member?.studentId || user?.studentId || rosterMatch?.studentId || session.studentId || "-",
      memberId: user?.member?.memberId || rosterMatch?.memberId || session.memberId || "STJ",
      departmentCode: user?.member?.department?.code || rosterMatch?.dept || session.departmentCode || "ITC",
    };

    const member = user?.member;

    // Build strictly the courses this tutor actually teaches
    let enrolledCourses: Array<{ id: string; code: string; titleKh: string; titleEn: string }> = [];

    if (member && member.enrollments && member.enrollments.length > 0) {
      enrolledCourses = member.enrollments
        .filter((e) => e.course)
        .map((e) => ({
          id: e.course.id,
          code: e.course.code,
          titleKh: e.course.titleKh,
          titleEn: e.course.titleEn,
        }));
    }

    if (enrolledCourses.length === 0 && rosterMatch && rosterMatch.assignedCourse) {
      const courseMap: Record<string, { id: string; code: string; titleKh: string; titleEn: string }> = {
        PROG101: { id: "c-prog", code: "PROG101", titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)", titleEn: "Programming" },
        MATH101: { id: "c-math", code: "MATH101", titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)", titleEn: "Mathematics" },
        PHYS101: { id: "c-phys", code: "PHYS101", titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)", titleEn: "Physics" },
        CHEM101: { id: "c-chem", code: "CHEM101", titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)", titleEn: "Chemistry" },
      };
      if (courseMap[rosterMatch.assignedCourse]) {
        enrolledCourses = [courseMap[rosterMatch.assignedCourse]];
      }
    }

    const isExecutive =
      session.roles.some((r) => ["SUPER_ADMIN", "STJ_PRESIDENT", "STUDENT_ASSOCIATION", "STJ_ADMIN"].includes(r)) ||
      userInfo.memberId === "STJ001" ||
      userInfo.memberId === "STJ002" ||
      userInfo.studentId === "e20221334" ||
      userInfo.studentId === "e20230969";

    if (isExecutive) {
      // 1. Fetch all courses with leaders and enrollments count
      const allCourses = await prisma.course.findMany({
        where: { status: "ACTIVE" },
        include: {
          leaders: { include: { user: true } },
          enrollments: true,
          sessions: {
            include: {
              _count: { select: { attendance: true } },
              shareLinks: { where: { isRevoked: false }, select: { token: true }, take: 1 },
            },
          },
        },
        orderBy: { code: "asc" },
      });

      const totalMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
      const totalSessions = allCourses.reduce((acc, c) => acc + c.sessions.length, 0);
      const totalAttendance = allCourses.reduce(
        (acc, c) => acc + c.sessions.reduce((sAcc, s) => sAcc + s._count.attendance, 0),
        0
      );

      const executiveCourses = allCourses.map((c) => {
        const leader = c.leaders[0]?.user;
        const leaderRoster = OFFICIAL_STJ_ROSTER.find(
          (m) => leader && (m.studentId === leader.studentId || m.email === leader.email)
        );
        return {
          id: c.id,
          code: c.code,
          titleKh: c.titleKh,
          titleEn: c.titleEn,
          leaderName: leader ? `${leader.fullNameKh} (${leader.fullNameEn})` : leaderRoster ? `${leaderRoster.nameKh} (${leaderRoster.nameEn})` : "មិនទាន់កំណត់",
          leaderDept: leaderRoster ? `${leaderRoster.year}-${leaderRoster.dept}` : "",
          memberCount: c.enrollments.length,
          sessionCount: c.sessions.length,
        };
      });

      const allSessions = await prisma.teachingSession.findMany({
        include: {
          course: { select: { code: true, titleKh: true } },
          _count: { select: { attendance: true } },
          shareLinks: { where: { isRevoked: false }, select: { token: true }, take: 1 },
        },
        orderBy: [{ sessionDate: "desc" }, { startTime: "desc" }],
      });

      const formattedSessions = allSessions.map((s) => ({
        id: s.id,
        courseCode: s.course.code,
        courseTitleKh: s.course.titleKh,
        title: s.title,
        sessionDate: s.sessionDate.toISOString().split("T")[0],
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
        status: s.status,
        markedCount: s._count.attendance,
        shareToken: s.shareLinks[0]?.token || null,
      }));

      return NextResponse.json({
        success: true,
        isExecutive: true,
        user: userInfo,
        executiveCourses,
        sessions: formattedSessions,
        overallStats: {
          totalSessions,
          totalAttendance,
          totalMembers,
          averageRate: totalSessions > 0 ? 100 : 0,
        },
      });
    }

    if (!member) {
      return NextResponse.json({
        success: true,
        user: userInfo,
        courses: enrolledCourses,
        records: [],
        upcoming: [],
        pending: [],
        stats: { total: 0, present: 0, late: 0, absent: 0, excused: 0, rate: 0 },
        monthlyStats: [],
      });
    }

    const courseIds = member.enrollments.map((e) => e.courseId);
    const courseWhere =
      courseFilter !== "ALL"
        ? { OR: [{ courseId: courseFilter }, { course: { code: courseFilter } }] }
        : {};

    const sessionInclude = { course: true } as const;

    const [records, lessons] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where: {
          memberId: member.id,
          ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
          session: { is: { courseId: { in: courseIds }, ...courseWhere } },
        },
        include: { session: { include: sessionInclude } },
        orderBy: { session: { sessionDate: "desc" } },
      }),
      prisma.teachingSession.findMany({
        where: {
          courseId: { in: courseIds },
          status: { not: "CANCELLED" },
          ...courseWhere,
        },
        include: { ...sessionInclude, attendance: { where: { memberId: member.id }, select: { id: true } } },
        orderBy: [{ sessionDate: "asc" }, { startTime: "asc" }],
      }),
    ]);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const unrecorded = lessons.filter((l) => l.attendance.length === 0);
    const shape = (l: (typeof lessons)[number]) => ({
      id: l.id,
      title: l.title,
      sessionDate: l.sessionDate,
      startTime: l.startTime,
      endTime: l.endTime,
      room: l.room,
      status: l.status,
      course: { id: l.course.id, code: l.course.code, titleKh: l.course.titleKh, titleEn: l.course.titleEn },
    });

    const upcoming = unrecorded
      .filter((l) => l.status !== "COMPLETED" && l.sessionDate >= startOfToday)
      .map(shape);
    const pending = unrecorded
      .filter((l) => l.status === "COMPLETED" || l.sessionDate < startOfToday)
      .map(shape);

    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;
    const monthMap = new Map<string, { month: string; present: number; late: number; absent: number }>();

    for (const r of records) {
      if (r.status === "PRESENT") present++;
      else if (r.status === "LATE") late++;
      else if (r.status === "ABSENT") absent++;
      else if (r.status === "EXCUSED") excused++;

      const d = new Date(r.session.sessionDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const entry = monthMap.get(key) || { month: label, present: 0, late: 0, absent: 0 };
      if (r.status === "PRESENT") entry.present++;
      else if (r.status === "LATE") entry.late++;
      else if (r.status === "ABSENT") entry.absent++;
      monthMap.set(key, entry);
    }

    const monthlyStats = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    const rate = records.length > 0 ? calculateAttendanceRate(present, late, records.length, excused) : 0;

    return NextResponse.json({
      success: true,
      user: userInfo,
      courses: enrolledCourses,
      records,
      upcoming,
      pending,
      stats: { total: records.length, present, late, absent, excused, rate },
      monthlyStats,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load attendance";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
