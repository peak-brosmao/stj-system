import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const res = await backendFetch("portal/overview");
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      if (session) {
        return NextResponse.json({
          success: true,
          user: {
            fullNameKh: session.fullNameKh,
            fullNameEn: session.fullNameEn,
            displayName: session.displayName || session.fullNameEn,
            email: session.email,
            studentId: session.studentId,
            memberId: session.memberId,
            department: session.departmentCode
              ? { code: session.departmentCode, nameKh: session.departmentCode }
              : null,
            academicYear: session.academicYearCode ? { code: session.academicYearCode } : null,
            status: "ACTIVE",
            roles: session.roles || ["MEMBER"],
          },
          member: {
            courses: [],
            stats: { present: 0, late: 0, absent: 0, excused: 0, total: 0, rate: 0 },
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

    const memberCourses = Array.isArray(data.member?.courses) ? data.member.courses : [];
    const leaderData = data.leader || {
      courses: memberCourses.map((c: any) => ({
        id: c.id,
        code: c.code,
        titleKh: c.titleKh,
        memberCount: Number(c.enrolledMembersCount ?? c.enrolled ?? 0),
        lessonCount: Number(c.totalLessons ?? (Array.isArray(c.sessions) ? c.sessions.length : 0)),
        completedCount: Array.isArray(c.sessions)
          ? c.sessions.filter((s: any) => s.status === "COMPLETED").length
          : 0,
        rate: Number(c.rate ?? 100),
      })),
      totalMembers: memberCourses.reduce(
        (sum: number, c: any) => sum + Number(c.enrolledMembersCount ?? c.enrolled ?? 0),
        0
      ),
      totalLessons: Number(data.member?.totalLessons ?? 0),
      completedLessons: 0,
      stats: data.member?.stats || { total: 0, rate: 100 },
      monthly: data.member?.monthly || [],
      upcoming: data.member?.upcoming || [],
      recentAttendance: [],
    };

    return NextResponse.json({
      ...data,
      success: true,
      user: {
        ...(data.user || {}),
        roles,
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
