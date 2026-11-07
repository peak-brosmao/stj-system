import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { getSession } from "@/lib/auth";
import { fetchLiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [session, res, membersLookup, attRes, reportsRes] = await Promise.all([
      getSession(),
      backendFetch("portal/overview"),
      fetchLiveMembersLookup(),
      backendFetch("portal/attendance").catch(() => null),
      backendFetch("reports").catch(() => null),
    ]);

    const data = await res.json().catch(() => null);
    const attData = attRes && attRes.ok ? await attRes.json().catch(() => null) : null;
    const reportsData = reportsRes && reportsRes.ok ? await reportsRes.json().catch(() => null) : null;

    if (!res.ok || !data) {
      if (session) {
        const liveUser = membersLookup.find({
          memberId: session.memberId,
          studentId: session.studentId,
          email: session.email,
        });
        return NextResponse.json({
          success: true,
          user: {
            fullNameKh: liveUser?.fullNameKh || session.fullNameKh,
            fullNameEn: liveUser?.fullNameEn || session.fullNameEn,
            displayName: liveUser?.fullNameEn || session.displayName || session.fullNameEn,
            email: liveUser?.email || session.email,
            studentId: liveUser?.studentId || session.studentId,
            memberId: liveUser?.memberId || session.memberId,
            department: liveUser?.department || (session.departmentCode
              ? { code: session.departmentCode, nameKh: session.departmentCode }
              : null),
            academicYear: liveUser?.academicYear || (session.academicYearCode ? { code: session.academicYearCode } : null),
            status: "ACTIVE",
            roles: session.roles || ["MEMBER"],
          },
          member: {
            courses: [],
            stats: attData?.stats || { present: 0, late: 0, absent: 0, excused: 0, total: 0, rate: 0 },
            totalLessons: 0,
            monthly: [],
            upcoming: [],
            recent: [],
          },
          leader: {
            courses: [],
            totalMembers: 0,
            totalLessons: 0,
            completedLessons: 0,
            stats: { total: 0, rate: 100 },
            monthly: [],
            upcoming: [],
            recentAttendance: [],
          },
          announcements: [],
        });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: res.status || 401 });
    }

    const roles: string[] = Array.isArray(data.user?.roles) && data.user.roles.length > 0
      ? data.user.roles
      : session?.roles || ["MEMBER"];

    const liveUser = membersLookup.find({
      memberId: data.user?.memberId || session?.memberId,
      studentId: data.user?.studentId || session?.studentId,
      email: data.user?.email || session?.email,
      nameKh: data.user?.fullNameKh,
      nameEn: data.user?.fullNameEn,
    });

    const rawMemberCourses = Array.isArray(data.member?.courses) ? data.member.courses : [];
    const memberCourses = rawMemberCourses.map((c: any) => {
      const rawLeaders = Array.isArray(c.leaders) ? c.leaders : [];
      const leaders = rawLeaders.map((l: any) => {
        const matched = membersLookup.find({
          studentId: l.studentId || l.student_id,
          email: l.email,
          nameKh: l.fullNameKh || l.full_name_kh,
          nameEn: l.fullNameEn || l.full_name_en,
        });
        return {
          ...l,
          fullNameKh: matched?.fullNameKh || l.fullNameKh || l.full_name_kh || "",
          fullNameEn: matched?.fullNameEn || l.fullNameEn || l.full_name_en || "",
        };
      });
      return {
        ...c,
        leaderName: leaders[0]?.fullNameKh || leaders[0]?.fullNameEn || c.leaderName,
        leaders,
      };
    });

    const memberStats =
      attData?.stats && Number(attData.stats.total) > 0
        ? attData.stats
        : data.member?.stats || { present: 0, late: 0, absent: 0, excused: 0, total: 0, rate: 0 };

    const recentRecords = Array.isArray(attData?.records)
      ? attData.records.slice(0, 5).map((r: any) => ({
          id: r.id,
          status: r.status,
          remarks: r.remarks,
          date: r.session?.sessionDate || "",
          lesson: r.session?.title || "",
          courseCode: r.session?.course?.code || "",
        }))
      : data.member?.recent || [];

    const upcomingSessions: any[] = [];
    for (const c of memberCourses) {
      const sessions = Array.isArray(c.sessions) ? c.sessions : [];
      for (const s of sessions) {
        if (s.status !== "CANCELLED") {
          const [startTime = "", endTime = ""] = String(s.time || "").split(" - ");
          upcomingSessions.push({
            id: s.id,
            title: s.title,
            courseCode: c.code,
            date: String(s.date || "").slice(0, 10),
            startTime,
            endTime,
            room: s.room || "SF1",
            status: s.status,
            marked: 0,
          });
        }
      }
    }

    const totalLessonsCount = memberCourses.reduce(
      (sum: number, c: any) => sum + Number(c.totalLessons ?? (Array.isArray(c.sessions) ? c.sessions.length : 0)),
      0
    );
    const completedLessonsCount = memberCourses.reduce(
      (sum: number, c: any) =>
        sum + (Array.isArray(c.sessions) ? c.sessions.filter((s: any) => s.status === "COMPLETED").length : 0),
      0
    );

    const reportMembers = Array.isArray(reportsData?.members) ? reportsData.members : [];

    const leaderCourses = memberCourses.map((c: any) => {
      const courseMembers = reportMembers.filter(
        (m: any) => !m.isExecutive && ((Array.isArray(m.courses) && m.courses.includes(c.code)) || m.course === c.code)
      );
      const membersWithSessions = courseMembers.filter((m: any) => Number(m.total) > 0);
      const courseRate =
        membersWithSessions.length > 0
          ? Math.round(
              membersWithSessions.reduce((acc: number, m: any) => acc + Number(m.rate || 0), 0) /
                membersWithSessions.length
            )
          : 100;

      return {
        id: c.id,
        code: c.code,
        titleKh: c.titleKh,
        memberCount: Number(c.enrolledMembersCount ?? c.enrolled ?? courseMembers.length),
        lessonCount: Number(c.totalLessons ?? (Array.isArray(c.sessions) ? c.sessions.length : 0)),
        completedCount: Array.isArray(c.sessions)
          ? c.sessions.filter((s: any) => s.status === "COMPLETED").length
          : 0,
        rate: courseRate,
      };
    });

    const leaderData = data.leader || {
      courses: leaderCourses,
      totalMembers: leaderCourses.reduce((sum: number, c: any) => sum + Number(c.memberCount || 0), 0),
      totalLessons: totalLessonsCount,
      completedLessons: completedLessonsCount,
      stats: {
        total: completedLessonsCount || memberStats.total || 0,
        rate: leaderCourses[0]?.rate ?? memberStats.rate ?? 100,
      },
      monthly: data.member?.monthly || [],
      upcoming: upcomingSessions,
      recentAttendance: [],
    };

    return NextResponse.json({
      ...data,
      success: true,
      user: {
        ...(data.user || {}),
        fullNameKh: liveUser?.fullNameKh || data.user?.fullNameKh,
        fullNameEn: liveUser?.fullNameEn || data.user?.fullNameEn,
        displayName: liveUser?.fullNameEn || data.user?.displayName || data.user?.fullNameEn,
        studentId: liveUser?.studentId || data.user?.studentId,
        memberId: liveUser?.memberId || data.user?.memberId,
        department: liveUser?.department || data.user?.department,
        academicYear: liveUser?.academicYear || data.user?.academicYear,
        roles,
      },
      member: {
        ...(data.member || {}),
        courses: memberCourses,
        stats: memberStats,
        totalLessons: totalLessonsCount,
        upcoming: upcomingSessions,
        recent: recentRecords,
      },
      leader: leaderData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load portal overview" }, { status: 500 });
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "portal/overview");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
