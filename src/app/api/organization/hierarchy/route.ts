import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";
import { fetchLiveMembersLookup, LiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

function buildLiveHierarchy(
  selectedYear: string,
  membersLookup: LiveMembersLookup,
  liveCourses: Array<Record<string, any>>
) {
  const davidRoster =
    OFFICIAL_STJ_ROSTER.find((m) => m.studentId === "e20221334") || OFFICIAL_STJ_ROSTER[1];
  const davidLive = membersLookup.find({
    memberId: "STJ002",
    studentId: "e20221334",
  });

  const president = {
    nameKh: davidLive?.fullNameKh || davidRoster.nameKh,
    nameEn: davidLive?.fullNameEn || davidRoster.nameEn,
    roleKh: "ប្រធាន STJ កណ្តាល (STJ President)",
    roleEn: "Overall STJ President & Central Administrator",
    studentId: davidLive?.studentId || davidRoster.studentId,
    memberId: davidLive?.memberId || davidRoster.memberId,
    department: davidLive?.department?.code || davidRoster.dept,
    generation: davidLive?.academicYear?.code || davidRoster.year,
    email: davidLive?.email || davidRoster.email,
    phone: davidLive?.phone || davidRoster.phone,
    avatar: null,
    status: "ACTIVE",
    academicYear: selectedYear,
  };

  const defaultCourseDefs = [
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

  const courses = defaultCourseDefs.map((def) => {
    const liveCourse = liveCourses.find((c) => c.code === def.code);
    const leaderStudentId = liveCourse?.leaderStudentId || def.leaderStudentId;
    const leaderMemberId = liveCourse?.leaderMemberId;

    const liveLeader = membersLookup.find({
      id: leaderMemberId,
      memberId: leaderMemberId,
      studentId: leaderStudentId,
      nameKh: liveCourse?.leaders,
    });
    const rosterLeader =
      OFFICIAL_STJ_ROSTER.find(
        (m) => m.studentId.toLowerCase() === String(leaderStudentId).toLowerCase()
      ) || OFFICIAL_STJ_ROSTER[0];

    const liveEnrolled = membersLookup.list.filter((m) => {
      if (m.memberId === "STJ001" || m.memberId === "STJ002" || m.status !== "ACTIVE") {
        return false;
      }
      const codes = [
        ...(m.courseCodes || []),
        ...(m.courses?.map((c) => c.code) || []),
        ...(m.enrollments?.map((e) => e.course?.code) || []),
        ...(m.courseCode ? [m.courseCode] : []),
      ];
      return codes.includes(def.code);
    });

    const members =
      liveEnrolled.length > 0
        ? liveEnrolled.map((m) => ({
            id: `member-${m.memberId.toLowerCase()}`,
            memberId: m.memberId,
            studentId: m.studentId,
            nameKh: m.fullNameKh,
            nameEn: m.fullNameEn,
            gender: m.gender || "M",
            department: m.department?.code || "GIC",
            generation: m.academicYear?.code || "I3",
            email: m.email || `${m.studentId}@itc.edu.kh`,
            phone: m.phone || "",
            avatar: null,
            roleKh: "សមាជិកបង្រៀន (Senior Tutor)",
          }))
        : OFFICIAL_STJ_ROSTER.filter((m) => m.assignedCourse === def.code).map((m) => {
            const liveM = membersLookup.find({ memberId: m.memberId, studentId: m.studentId });
            return {
              id: `member-${m.memberId.toLowerCase()}`,
              memberId: liveM?.memberId || m.memberId,
              studentId: liveM?.studentId || m.studentId,
              nameKh: liveM?.fullNameKh || m.nameKh,
              nameEn: liveM?.fullNameEn || m.nameEn,
              gender: liveM?.gender || m.gender,
              department: liveM?.department?.code || m.dept,
              generation: liveM?.academicYear?.code || m.year,
              email: liveM?.email || m.email,
              phone: liveM?.phone || m.phone,
              avatar: null,
              roleKh: "សមាជិកបង្រៀន (Senior Tutor)",
            };
          });

    return {
      id: liveCourse?.id || `course-${def.code.toLowerCase()}`,
      code: def.code,
      nameKh: liveCourse?.titleKh || def.titleKh,
      nameEn: liveCourse?.titleEn || def.titleEn,
      leader: {
        nameKh: liveLeader?.fullNameKh || rosterLeader.nameKh,
        nameEn: liveLeader?.fullNameEn || rosterLeader.nameEn,
        roleKh: `ប្រធានក្រុម ${def.code} (Course Leader)`,
        roleEn: `${liveCourse?.titleEn || def.titleEn} Team Leader`,
        studentId: liveLeader?.studentId || rosterLeader.studentId,
        department: liveLeader?.department?.code || rosterLeader.dept,
        email: liveLeader?.email || rosterLeader.email,
        avatar: null,
      },
      memberCount: members.length,
      members,
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
        presidentName: president.nameKh,
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
    const [membersLookup, coursesRes] = await Promise.all([
      fetchLiveMembersLookup(),
      backendFetch("courses").catch(() => null),
    ]);
    const coursesData = coursesRes && coursesRes.ok ? await coursesRes.json().catch(() => null) : null;
    const liveCourses = Array.isArray(coursesData?.courses) ? coursesData.courses : [];
    return NextResponse.json(buildLiveHierarchy(requestedYear, membersLookup, liveCourses));
  } catch {
    const emptyLookup = await fetchLiveMembersLookup();
    return NextResponse.json(buildLiveHierarchy(requestedYear, emptyLookup, []));
  }
}
