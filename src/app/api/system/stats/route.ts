import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceRate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let totalMembers = 0;
    let activeMembers = 0;
    let totalLeaders = 0;
    let totalCourses = 0;
    let totalSessions = 0;
    let attendanceRate = 0;
    let deptDistribution: Array<{ name: string; count: number }> = [];
    let yearDistribution: Array<{ name: string; count: number }> = [];
    let recentSessions: Array<{ id: string; title: string; course: string; date: string; status: string }> = [];

    try {
      totalMembers = await prisma.member.count();
      activeMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
      totalLeaders = await prisma.courseLeader.count();
      totalCourses = await prisma.course.count({ where: { status: "ACTIVE" } });
      totalSessions = await prisma.teachingSession.count();

      // Attendance records calculations
      const attendances = await prisma.attendanceRecord.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      for (const a of attendances) {
        if (a.status === "PRESENT") present = a._count.status;
        else if (a.status === "LATE") late = a._count.status;
        else if (a.status === "ABSENT") absent = a._count.status;
        else if (a.status === "EXCUSED") excused = a._count.status;
      }

      const totalRecords = present + late + absent + excused;
      attendanceRate = calculateAttendanceRate(present, late, totalRecords, excused);

      // Dept distribution
      const depts = await prisma.department.findMany({
        include: { _count: { select: { members: true } } },
      });
      deptDistribution = depts.map((d) => ({ name: d.code, count: d._count.members }));

      // Year distribution
      const years = await prisma.academicYear.findMany({
        include: { _count: { select: { members: true } } },
        orderBy: { order: "asc" },
      });
      yearDistribution = years.map((y) => ({ name: y.code, count: y._count.members }));

      // Recent sessions
      const sessions = await prisma.teachingSession.findMany({
        take: 5,
        orderBy: { sessionDate: "desc" },
        include: { course: true },
      });
      recentSessions = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        course: s.course.code,
        date: new Date(s.sessionDate).toISOString().split("T")[0],
        status: s.status,
      }));
    } finally {
      // nothing to clean up
    }

    return NextResponse.json({
      summary: {
        totalMembers,
        activeMembers,
        totalLeaders,
        totalCourses,
        totalSessions,
        attendanceRate,
      },
      charts: {
        deptDistribution,
        yearDistribution,
      },
      recentSessions,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

