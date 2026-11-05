import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course");
    const dept = searchParams.get("dept");
    const year = searchParams.get("year");
    const academicYearTerm = searchParams.get("academicYear") || "2026-2027";

    // 1. Fetch all active courses
    const courses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, code: true, titleKh: true, titleEn: true },
      orderBy: { code: "asc" },
    });

    // 2. Fetch all members with their enrollments and attendance records
    const members = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
        ...(cohortYearFilter(academicYearTerm)),
      },
      include: {
        department: true,
        academicYear: true,
        enrollments: {
          include: {
            course: true,
          },
        },
        attendanceRecords: {
          include: {
            session: true,
          },
        },
      },
      orderBy: { memberId: "asc" },
    });

    // Total completed or scheduled sessions
    const totalSessionsCount = await prisma.teachingSession.count({
      where: { status: { not: "CANCELLED" } },
    });

    let totalAttendedCount = 0;
    let totalEligibleCount = 0;
    let membersWithSessionsCount = 0;
    let highPerformersCount = 0;

    const reportItems = members.map((m, idx) => {
      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      for (const rec of m.attendanceRecords) {
        if (rec.status === "PRESENT") present++;
        else if (rec.status === "LATE") late++;
        else if (rec.status === "ABSENT") absent++;
        else if (rec.status === "EXCUSED") excused++;
      }

      const total = present + late + absent + excused;
      const eligible = total - excused;
      let rate = 0;

      if (total > 0) {
        membersWithSessionsCount++;
        rate = eligible > 0 ? Math.round(((present + late * 0.5) / eligible) * 100) : 100;
        totalAttendedCount += (present + late * 0.5);
        totalEligibleCount += eligible;
        if (rate >= 90) highPerformersCount++;
      }

      const assignedCourseCode = m.enrollments?.[0]?.course.code || "Unassigned";

      return {
        no: idx + 1,
        id: m.id,
        memberId: m.memberId,
        studentId: m.studentId || "-",
        nameKh: m.fullNameKh,
        nameEn: m.fullNameEn,
        dept: m.department?.code || "-",
        yr: m.academicYear?.code || "-",
        course: assignedCourseCode,
        present,
        late,
        absent,
        excused,
        total,
        rate: total > 0 ? rate : 0,
        hasSessions: total > 0,
      };
    });

    const averageRate = totalEligibleCount > 0
      ? Math.round((totalAttendedCount / totalEligibleCount) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      summary: {
        totalMembers: members.length,
        totalSessions: totalSessionsCount,
        averageRate,
        highPerformers: highPerformersCount,
        membersWithSessionsCount,
      },
      courses,
      members: reportItems,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error generating reports";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function cohortYearFilter(year: string) {
  if (!year || year === "ALL") return {};
  return { cohortYear: year };
}

