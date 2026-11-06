import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceRate } from "@/lib/utils";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. If backend API is configured, prioritize pulling live from datastj.peakbrosmao.me
    if (LARAVEL_API_BASE) {
      const remoteRes = await fetchFromLaravel("stats");
      if (remoteRes && remoteRes.ok) {
        const remoteData = await remoteRes.json();
        if (remoteData && remoteData.summary) {
          return NextResponse.json(remoteData);
        }
      }
    }

    // 2. Query database directly
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
    const totalLeaders = await prisma.courseLeader.count();
    const totalCourses = await prisma.course.count({ where: { status: "ACTIVE" } });
    const totalSessions = await prisma.teachingSession.count();

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
    const attendanceRate = calculateAttendanceRate(present, late, totalRecords, excused);

    // Dept distribution
    const depts = await prisma.department.findMany({
      include: { _count: { select: { members: true } } },
    });
    const deptDistribution = depts.map((d) => ({ name: d.code, count: d._count.members }));

    // Year distribution
    const years = await prisma.academicYear.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { order: "asc" },
    });
    const yearDistribution = years.map((y) => ({ name: y.code, count: y._count.members }));

    // Recent sessions
    const sessions = await prisma.teachingSession.findMany({
      take: 5,
      orderBy: { sessionDate: "desc" },
      include: { course: true },
    });
    const recentSessions = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      course: s.course.code,
      date: new Date(s.sessionDate).toISOString().split("T")[0],
      status: s.status,
    }));

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
    return NextResponse.json({
      summary: {
        totalMembers: 0,
        activeMembers: 0,
        totalLeaders: 0,
        totalCourses: 0,
        totalSessions: 0,
        attendanceRate: 0,
      },
      charts: {
        deptDistribution: [],
        yearDistribution: [],
      },
      recentSessions: [],
      error: msg,
    }, { status: 200 });
  }
}
