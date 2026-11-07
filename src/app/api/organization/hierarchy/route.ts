import { NextRequest, NextResponse } from "next/server";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

function buildCanonicalHierarchy(selectedYear = "2026-2027") {
  const david =
    OFFICIAL_STJ_ROSTER.find((m) => m.studentId === "e20221334") || OFFICIAL_STJ_ROSTER[1];

  const president = {
    nameKh: david.nameKh,
    nameEn: david.nameEn,
    roleKh: "ប្រធាន STJ កណ្តាល (STJ President)",
    roleEn: "Overall STJ President & Central Administrator",
    studentId: david.studentId,
    memberId: david.memberId,
    department: david.dept,
    generation: david.year,
    email: david.email,
    phone: david.phone,
    avatar: null,
    status: "ACTIVE",
    academicYear: selectedYear,
  };

  const courseDefs = [
    {
      code: "PROG101",
      titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
      titleEn: "Computer Programming & Algorithms",
      leaderStudentId: "e20240704",
    },
    {
      code: "MATH101",
      titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      titleEn: "Engineering Mathematics",
      leaderStudentId: "e20221423",
    },
    {
      code: "PHYS101",
      titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      titleEn: "Engineering Physics",
      leaderStudentId: "e20240096",
    },
    {
      code: "CHEM101",
      titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)",
      titleEn: "General Chemistry",
      leaderStudentId: "e20240046",
    },
  ];

  const courses = courseDefs.map((c) => {
    const leaderMember =
      OFFICIAL_STJ_ROSTER.find((m) => m.studentId === c.leaderStudentId) || OFFICIAL_STJ_ROSTER[0];
    const members = OFFICIAL_STJ_ROSTER.filter((m) => m.assignedCourse === c.code);

    return {
      id: `course-${c.code.toLowerCase()}`,
      code: c.code,
      nameKh: c.titleKh,
      nameEn: c.titleEn,
      leader: {
        nameKh: leaderMember.nameKh,
        nameEn: leaderMember.nameEn,
        roleKh: `ប្រធានក្រុម ${c.code} (Course Leader)`,
        roleEn: `${c.titleEn} Team Leader`,
        studentId: leaderMember.studentId,
        department: leaderMember.dept,
        email: leaderMember.email,
        avatar: null,
      },
      memberCount: members.length,
      members: members.map((m) => ({
        id: `member-${m.memberId.toLowerCase()}`,
        memberId: m.memberId,
        studentId: m.studentId,
        nameKh: m.nameKh,
        nameEn: m.nameEn,
        gender: m.gender,
        department: m.dept,
        generation: m.year,
        email: m.email,
        phone: m.phone,
        avatar: null,
        roleKh: "សមាជិកបង្រៀន (Senior Tutor)",
      })),
    };
  });

  return {
    success: true,
    selectedYear,
    currentYear: "2026-2027",
    isCurrentActiveMandate: true,
    availableYears: [
      {
        academicYear: "2026-2027",
        themeKh: "អាណត្តិ STJ 2026-2027",
        presidentName: david.nameKh,
        status: "ACTIVE",
        isCurrent: true,
        isLocked: false,
      },
    ],
    hierarchy: {
      president,
      courses,
      totalTutors: courses.reduce((acc, c) => acc + c.memberCount, 0),
      totalCourses: courses.length,
    },
  };
}

export async function GET(req: NextRequest) {
  const requestedYear = req.nextUrl.searchParams.get("year") || "2026-2027";
  try {
    const query = req.nextUrl.search;
    const res = await fetch(`${LARAVEL_API_BASE}/organization/hierarchy${query}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const totalTutors = Number(data?.hierarchy?.totalTutors ?? 0);
      const presidentStudentId = String(data?.hierarchy?.president?.studentId ?? "").toLowerCase();
      // Only use backend response if it returned the complete operational roster (not filtered by I5 only)
      if (data?.success && totalTutors >= 10 && presidentStudentId === "e20221334") {
        return NextResponse.json(data);
      }
    }
  } catch {
    // Fall back to canonical hierarchy
  }

  return NextResponse.json(buildCanonicalHierarchy(requestedYear));
}
