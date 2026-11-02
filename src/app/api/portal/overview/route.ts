import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, getManageableCourseIds } from "@/lib/auth";
import { calculateAttendanceRate } from "@/lib/utils";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

type Counts = { present: number; late: number; absent: number; excused: number; total: number };

function emptyCounts(): Counts {
  return { present: 0, late: 0, absent: 0, excused: 0, total: 0 };
}

function addStatus(c: Counts, status: string) {
  c.total++;
  if (status === "PRESENT") c.present++;
  else if (status === "LATE") c.late++;
  else if (status === "ABSENT") c.absent++;
  else if (status === "EXCUSED") c.excused++;
}

function withRate(c: Counts) {
  return { ...c, rate: c.total > 0 ? calculateAttendanceRate(c.present, c.late, c.total, c.excused) : 0 };
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Dashboard data for the logged-in person, read only from the database.
 * Lessons appear here only after a Course Leader / the President created them.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
              department: true,
              academicYear: true,
              enrollments: {
                include: { course: { include: { leaders: { include: { user: true } } } } },
              },
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

    if (!user && !rosterMatch) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // ---------------- Member view ----------------
    const member = user?.member;
    let memberView: Record<string, unknown> | null = null;

    if (member) {
      const courseIds = member.enrollments.map((e) => e.courseId);
      const [records, lessons] = await Promise.all([
        prisma.attendanceRecord.findMany({
          where: { memberId: member.id },
          include: { session: { include: { course: true } } },
          orderBy: { session: { sessionDate: "desc" } },
        }),
        prisma.teachingSession.findMany({
          where: { courseId: { in: courseIds }, status: { not: "CANCELLED" } },
          include: { course: true, attendance: { where: { memberId: member.id }, select: { id: true } } },
          orderBy: [{ sessionDate: "asc" }, { startTime: "asc" }],
        }),
      ]);

      const total = emptyCounts();
      const monthly = new Map<string, { month: string; present: number; late: number; absent: number }>();
      const perCourse = new Map<string, Counts>();
      for (const r of records) {
        addStatus(total, r.status);
        const pc = perCourse.get(r.session.courseId) || emptyCounts();
        addStatus(pc, r.status);
        perCourse.set(r.session.courseId, pc);
        const d = new Date(r.session.sessionDate);
        const k = monthKey(d);
        const m = monthly.get(k) || { month: monthLabel(d), present: 0, late: 0, absent: 0 };
        if (r.status === "PRESENT") m.present++;
        else if (r.status === "LATE") m.late++;
        else if (r.status === "ABSENT") m.absent++;
        monthly.set(k, m);
      }

      memberView = {
        courses: member.enrollments.map((e) => ({
          id: e.course.id,
          code: e.course.code,
          slug: e.course.slug,
          titleKh: e.course.titleKh,
          titleEn: e.course.titleEn,
          descriptionKh: e.course.descriptionKh,
          leaders: e.course.leaders.map((l) => ({ nameKh: l.user.fullNameKh, nameEn: l.user.fullNameEn })),
          totalLessons: lessons.filter((l) => l.courseId === e.courseId).length,
          rate: withRate(perCourse.get(e.courseId) || emptyCounts()).rate,
        })),
        stats: withRate(total),
        totalLessons: lessons.length,
        monthly: Array.from(monthly.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, v]) => v),
        upcoming: lessons
          .filter((l) => l.attendance.length === 0 && l.status !== "COMPLETED" && l.sessionDate >= startOfToday)
          .slice(0, 6)
          .map((l) => ({
            id: l.id,
            title: l.title,
            courseCode: l.course.code,
            date: new Date(l.sessionDate).toISOString().split("T")[0],
            startTime: l.startTime,
            endTime: l.endTime,
            room: l.room,
            status: l.status,
          })),
        recent: records.slice(0, 5).map((r) => ({
          id: r.id,
          title: r.session.title,
          courseCode: r.session.course.code,
          date: new Date(r.session.sessionDate).toISOString().split("T")[0],
          status: r.status,
        })),
      };
    }

    // ---------------- Leader view ----------------
    const manageable = await getManageableCourseIds(session);
    const isLeader = session.roles.includes("COURSE_LEADER") || manageable === null;
    let leaderView: Record<string, unknown> | null = null;

    if (isLeader) {
      const courseWhere = manageable === null ? { status: "ACTIVE" } : { id: { in: manageable }, status: "ACTIVE" };
      const courses = await prisma.course.findMany({
        where: courseWhere,
        orderBy: { code: "asc" },
        include: {
          enrollments: true,
          sessions: {
            where: { status: { not: "CANCELLED" } },
            orderBy: [{ sessionDate: "asc" }, { startTime: "asc" }],
            include: { attendance: true },
          },
        },
      });

      const overall = emptyCounts();
      const monthly = new Map<string, { month: string; present: number; late: number; absent: number }>();
      const courseCards = courses.map((c) => {
        const cc = emptyCounts();
        for (const s of c.sessions) {
          for (const a of s.attendance) {
            addStatus(cc, a.status);
            addStatus(overall, a.status);
            const d = new Date(s.sessionDate);
            const k = monthKey(d);
            const m = monthly.get(k) || { month: monthLabel(d), present: 0, late: 0, absent: 0 };
            if (a.status === "PRESENT") m.present++;
            else if (a.status === "LATE") m.late++;
            else if (a.status === "ABSENT") m.absent++;
            monthly.set(k, m);
          }
        }
        return {
          id: c.id,
          code: c.code,
          titleKh: c.titleKh,
          titleEn: c.titleEn,
          memberCount: c.enrollments.length,
          lessonCount: c.sessions.length,
          completedCount: c.sessions.filter((s) => s.status === "COMPLETED").length,
          rate: withRate(cc).rate,
        };
      });

      const allSessions = courses.flatMap((c) => c.sessions.map((s) => ({ s, code: c.code })));
      const recentRecords = await prisma.attendanceRecord.findMany({
        where: manageable === null ? {} : { session: { courseId: { in: manageable } } },
        include: { member: true, session: { include: { course: true } } },
        orderBy: { updatedAt: "desc" },
        take: 8,
      });

      leaderView = {
        courses: courseCards,
        totalMembers: courseCards.reduce((n, c) => n + c.memberCount, 0),
        totalLessons: allSessions.length,
        completedLessons: allSessions.filter((x) => x.s.status === "COMPLETED").length,
        stats: withRate(overall),
        monthly: Array.from(monthly.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, v]) => v),
        upcoming: allSessions
          .filter((x) => x.s.status !== "COMPLETED" && x.s.sessionDate >= startOfToday)
          .slice(0, 6)
          .map((x) => ({
            id: x.s.id,
            title: x.s.title,
            courseCode: x.code,
            date: new Date(x.s.sessionDate).toISOString().split("T")[0],
            startTime: x.s.startTime,
            endTime: x.s.endTime,
            room: x.s.room,
            status: x.s.status,
            marked: x.s.attendance.length,
          })),
        recentAttendance: recentRecords.map((r) => ({
          id: r.id,
          memberName: `${r.member.fullNameKh} (${r.member.fullNameEn})`,
          courseCode: r.session.course.code,
          lesson: r.session.title,
          date: new Date(r.session.sessionDate).toISOString().split("T")[0],
          status: r.status,
        })),
      };
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [
          { scope: "GLOBAL" },
          ...(member ? [{ courseId: { in: member.enrollments.map((e) => e.courseId) } }] : []),
          ...(manageable ? [{ courseId: { in: manageable } }] : []),
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, titleKh: true, titleEn: true, contentKh: true, publishedAt: true, scope: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        fullNameKh: user?.fullNameKh || rosterMatch?.nameKh || session.fullNameKh || "សមាជិក STJ",
        fullNameEn: user?.fullNameEn || rosterMatch?.nameEn || session.fullNameEn || "",
        displayName: user?.displayName || rosterMatch?.nameKh || session.fullNameKh || "សមាជិក STJ",
        profileImage: user?.profileImage || session.profileImage || null,
        email: user?.email || session.email || rosterMatch?.email || "user@itc.edu.kh",
        studentId: member?.studentId || user?.studentId || rosterMatch?.studentId || session.studentId,
        memberId: member?.memberId || rosterMatch?.memberId || session.memberId || null,
        department: member?.department
          ? { code: member.department.code, nameKh: member.department.nameKh }
          : rosterMatch
          ? { code: rosterMatch.dept, nameKh: rosterMatch.dept }
          : null,
        academicYear: member?.academicYear ? { code: member.academicYear.code } : null,
        status: member?.status || user?.status || "ACTIVE",
        roles: session.roles,
      },
      member: memberView || (rosterMatch ? {
        courses: rosterMatch.assignedCourse ? [{
          id: rosterMatch.assignedCourse,
          code: rosterMatch.assignedCourse,
          slug: rosterMatch.assignedCourse.toLowerCase(),
          titleKh: rosterMatch.assignedCourse,
          titleEn: rosterMatch.assignedCourse,
          leaders: [],
          totalLessons: 0,
          rate: 100,
        }] : [],
        stats: { present: 0, late: 0, absent: 0, excused: 0, total: 0, rate: 0 },
        totalLessons: 0,
        monthly: [],
        upcoming: [],
        recent: [],
      } : null),
      leader: leaderView,
      announcements,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load overview";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

