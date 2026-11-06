import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const academicYearTerm = searchParams.get("academicYear") || "2026-2027";

    // 1. Fetch all active courses
    const courses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, code: true, titleKh: true, titleEn: true },
      orderBy: { code: "asc" },
    });

    // 2. Fetch all teaching sessions in the system (e.g. 5 days taught)
    const sessions = await prisma.teachingSession.findMany({
      where: { status: { not: "CANCELLED" } },
      select: {
        id: true,
        courseId: true,
        sessionDate: true,
        title: true,
      },
      orderBy: { sessionDate: "asc" },
    });

    // 3. Fetch all active members with their enrollments and attendance records
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

    let totalAttendedCount = 0;
    let totalEligibleCount = 0;
    let membersWithSessionsCount = 0;
    let highPerformersCount = 0;

    const reportItems = members.map((m, idx) => {
      const isExecutive = m.memberId === "STJ001" || m.memberId === "STJ002";
      const enrolledCourses = m.enrollments.map((e) => e.course.code);
      const enrolledCourseIds = m.enrollments.map((e) => e.course.id);

      let executiveRoleTitle: string | null = null;
      let displayCourse = enrolledCourses.length > 0 ? enrolledCourses.join(", ") : "Unassigned";

      if (m.memberId === "STJ001") {
        displayCourse = "សមាគមនិស្សិត";
        executiveRoleTitle = "គណៈកម្មាធិការសមាគមនិស្សិត";
      } else if (m.memberId === "STJ002") {
        displayCourse = "ប្រធាន STJ";
        executiveRoleTitle = "ប្រធានក្រុមដឹកនាំ STJ";
      }

      // Executive leaders: Not evaluated for teaching sessions
      if (isExecutive) {
        return {
          no: idx + 1,
          id: m.id,
          memberId: m.memberId,
          studentId: m.studentId || "-",
          nameKh: m.fullNameKh,
          nameEn: m.fullNameEn,
          dept: m.department?.code || "-",
          yr: m.academicYear?.code || "-",
          course: displayCourse,
          courses: [displayCourse],
          isExecutive: true,
          executiveRoleTitle,
          present: 0,
          late: 0,
          absent: 0,
          excused: 0,
          total: 0,
          rate: 0,
          hasSessions: false,
        };
      }

      // 4. Per-member logic:
      // Filter sessions to only the courses this member is actually enrolled to teach!
      // Example:
      // - PEOU CHUMRATTANAK (enrolled in MATH101 & PHYS101) -> 2 Math + 2 Phys = 4 sessions total
      // - CHAI CHICHOU (enrolled in PROG101) -> 1 Prog session total
      // - ORN Socheat (enrolled in MATH101) -> 2 Math sessions total
      // - Chemistry tutors (enrolled in CHEM101) -> 0 sessions total
      const memberSessions = sessions.filter((s) => enrolledCourseIds.includes(s.courseId));
      const totalExpected = memberSessions.length;

      // Index this member's recorded attendances by sessionId
      const attMap = new Map<string, string>();
      for (const rec of m.attendanceRecords) {
        attMap.set(rec.sessionId, rec.status);
      }

      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      for (const s of memberSessions) {
        const status = attMap.get(s.id);
        if (status === "PRESENT") present++;
        else if (status === "LATE") late++;
        else if (status === "EXCUSED") excused++;
        else if (status === "ABSENT") absent++;
        else absent++; // If not marked in an expected session, counts as absent
      }

      const total = totalExpected;
      const eligible = total - excused;
      let rate = 0;

      if (total > 0) {
        membersWithSessionsCount++;
        rate = eligible > 0 ? Math.round(((present + late * 0.5) / eligible) * 100) : 100;
        totalAttendedCount += (present + late * 0.5);
        totalEligibleCount += eligible;
        if (rate >= 90) highPerformersCount++;
      }

      return {
        no: idx + 1,
        id: m.id,
        memberId: m.memberId,
        studentId: m.studentId || "-",
        nameKh: m.fullNameKh,
        nameEn: m.fullNameEn,
        dept: m.department?.code || "-",
        yr: m.academicYear?.code || "-",
        course: displayCourse,
        courses: enrolledCourses.length > 0 ? enrolledCourses : ["Unassigned"],
        isExecutive: false,
        executiveRoleTitle: null,
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
      : 100;

    return NextResponse.json({
      success: true,
      summary: {
        totalMembers: members.length,
        totalTutors: members.length - 2,
        totalSessions: sessions.length,
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
