import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateAttendanceRate } from "@/lib/utils";

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

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { member: { include: { enrollments: true } } },
    });
    const member = user?.member;

    if (!member) {
      return NextResponse.json({
        success: true,
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
