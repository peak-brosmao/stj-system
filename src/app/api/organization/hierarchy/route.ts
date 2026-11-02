import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedYear = searchParams.get("year");

    // 1. Fetch all mandates to populate the Academic Year Selector
    const mandates = await prisma.stjMandate.findMany({
      orderBy: { academicYear: "desc" },
    });

    const activeMandate = mandates.find((m) => m.status === "ACTIVE") || mandates[0];
    const currentYear = activeMandate?.academicYear || "2026-2027";
    const selectedYear = requestedYear || currentYear;

    const availableYears = mandates.length > 0
      ? mandates.map((m) => ({
          academicYear: m.academicYear,
          themeKh: m.titleKh || `អាណត្តិ STJ ${m.academicYear}`,
          presidentName: m.presidentNameKh,
          status: m.status,
          isCurrent: m.academicYear === currentYear,
          isLocked: m.isLocked,
        }))
      : [
          {
            academicYear: "2026-2027",
            themeKh: "អាណត្តិ STJ 2026-2027",
            presidentName: "ផល ដាវីត",
            status: "ACTIVE",
            isCurrent: true,
            isLocked: false,
          },
        ];

    // Target mandate
    const targetMandate = mandates.find((m) => m.academicYear === selectedYear) || activeMandate;

    // 2. STJ President Node (Apex of the tree)
    const targetStudentId = targetMandate?.presidentStudentId || "e20221334";
    const presidentMember = await prisma.member.findFirst({
      where: {
        OR: [
          { studentId: targetStudentId },
          { email: `${targetStudentId}@itc.edu.kh` },
        ],
      },
      include: {
        department: true,
        user: true,
      },
    });

    const president = {
      nameKh: targetMandate?.presidentNameKh || presidentMember?.fullNameKh || "ផល ដាវីត",
      nameEn: presidentMember?.fullNameEn || "PHAL David",
      roleKh: "ប្រធាន STJ កណ្តាល (STJ President)",
      roleEn: "Overall STJ President & Central Administrator",
      studentId: presidentMember?.studentId || targetStudentId,
      memberId: presidentMember?.memberId || "STJ-PRESIDENT",
      department: presidentMember?.department?.code || "GIC",
      generation: "I3",
      email: `${targetStudentId}@itc.edu.kh`,
      phone: presidentMember?.phone || "+855 23 880 370",
      avatar: presidentMember?.user?.profileImage || null,
      status: targetMandate?.status || "ACTIVE",
      academicYear: selectedYear,
    };

    // 3. Courses, Course Leaders, and Enrolled Members
    const courses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      include: {
        leaders: {
          include: {
            user: {
              include: {
                member: {
                  include: {
                    department: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          include: {
            member: {
              include: {
                department: true,
                user: true,
              },
            },
          },
        },
      },
      orderBy: { code: "asc" },
    });

    // If enrollments with academicYear are empty (e.g. initial seed without enrollment year link),
    // fetch all members belonging to this cohort or active members
    const allMembers = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        department: true,
        user: true,
        enrollments: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { memberId: "asc" },
    });

    // Helper map of leader details fallback
    const leaderFallbacks: Record<string, { nameKh: string; nameEn: string; studentId: string; dept: string }> = {
      PROG101: { nameKh: "លាង ជីងហេង", nameEn: "LEANG JINGHENG", studentId: "e20240704", dept: "GTI" },
      MATH101: { nameKh: "គឹម រតនៈ", nameEn: "KIM RATANAK", studentId: "e20221423", dept: "AMS" },
      PHYS101: { nameKh: "គ្រុយ អីុខាង", nameEn: "KRUY IKORNG", studentId: "e20240096", dept: "GEE" },
      CHEM101: { nameKh: "ខេង លីឧស្សាហ៍", nameEn: "KHENG LYOUSOR", studentId: "e20240046", dept: "GCA" },
    };

    const treeCourses = courses.map((course) => {
      // Find course leader
      const activeLeader = course.leaders[0];
      const fallback = leaderFallbacks[course.code] || {
        nameKh: "ប្រធានមុខវិជ្ជា",
        nameEn: "Course Leader",
        studentId: "N/A",
        dept: "ITC",
      };

      const leaderData = {
        nameKh: activeLeader?.user.fullNameKh || fallback.nameKh,
        nameEn: activeLeader?.user.fullNameEn || fallback.nameEn,
        roleKh: `ប្រធានក្រុម ${course.titleKh} (Leader)`,
        roleEn: `${course.titleEn} Team Leader`,
        studentId: activeLeader?.user.studentId || fallback.studentId,
        department: activeLeader?.user.member?.department?.code || fallback.dept,
        email: activeLeader?.user.email || `${fallback.studentId}@itc.edu.kh`,
        avatar: activeLeader?.user.profileImage || null,
      };

      // Find members enrolled in this course
      let courseMembers = course.enrollments
        .map((e) => e.member)
        .filter((m) => m && m.status === "ACTIVE");

      // If enrollment join is sparse, check member.enrollments
      if (courseMembers.length === 0) {
        courseMembers = allMembers.filter((m) =>
          m.enrollments.some((enr) => enr.courseId === course.id || enr.course.code === course.code)
        );
      }

      // If still sparse, distribute evenly by official roster index
      if (courseMembers.length === 0) {
        if (course.code === "PROG101") {
          courseMembers = allMembers.slice(0, 10);
        } else if (course.code === "MATH101") {
          courseMembers = allMembers.slice(10, 20);
        } else if (course.code === "PHYS101") {
          courseMembers = allMembers.slice(20, 30);
        } else {
          courseMembers = allMembers.slice(30);
        }
      }

      return {
        id: course.id,
        code: course.code,
        nameKh: course.titleKh,
        nameEn: course.titleEn,
        leader: leaderData,
        memberCount: courseMembers.length,
        members: courseMembers.map((m) => ({
          id: m.id,
          memberId: m.memberId,
          studentId: m.studentId,
          nameKh: m.fullNameKh,
          nameEn: m.fullNameEn,
          gender: m.gender,
          department: m.department?.code || "ITC",
          generation: "I2",
          email: m.email,
          phone: m.phone,
          avatar: m.user?.profileImage || null,
          roleKh: "សមាជិកបង្រៀន (Senior Tutor)",
          isCurrentUser: m.studentId === "e20251455", // Highlight user PEAK BROSMAO
        })),
      };
    });

    return NextResponse.json({
      success: true,
      selectedYear,
      currentYear,
      isCurrentActiveMandate: selectedYear === currentYear,
      availableYears,
      hierarchy: {
        president,
        courses: treeCourses,
        totalTutors: treeCourses.reduce((acc, c) => acc + c.memberCount, 0),
        totalCourses: treeCourses.length,
      },
    });
  } catch (error) {
    console.error("[Hierarchy API Error]:", error);
    return NextResponse.json(
      { error: "Failed to load STJ hierarchy." },
      { status: 500 }
    );
  }
}
