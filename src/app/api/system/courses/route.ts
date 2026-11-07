import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { fetchLiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const [res, membersLookup] = await Promise.all([
      backendFetch(`courses${query}`),
      fetchLiveMembersLookup(),
    ]);

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        data || { error: "Failed to load courses" },
        { status: res.status || 500 }
      );
    }

    const courses = Array.isArray(data.courses)
      ? data.courses.map((c: Record<string, any>) => {
          const matchedLeader = membersLookup.find({
            id: c.leaderMemberId,
            memberId: c.leaderMemberId,
            studentId: c.leaderStudentId,
            nameKh: c.leaders && c.leaders !== "មិនទាន់ចាត់តាំង" ? c.leaders : undefined,
            nameEn: c.leaderNameEn,
          });

          if (!matchedLeader) return c;

          return {
            ...c,
            leaders: matchedLeader.fullNameKh || matchedLeader.fullNameEn || c.leaders,
            leaderNameEn: matchedLeader.fullNameEn || c.leaderNameEn,
            leaderMemberId: matchedLeader.memberId || matchedLeader.id || c.leaderMemberId,
            leaderStudentId: matchedLeader.studentId || c.leaderStudentId,
          };
        })
      : [];

    const rawEligible = Array.isArray(data.eligibleLeaders) ? data.eligibleLeaders : [];
    const eligibleLeaders = rawEligible.map((el: Record<string, any>) => {
      const matched = membersLookup.find({
        id: el.id,
        memberId: el.memberId,
        studentId: el.studentId,
        nameKh: el.fullNameKh,
        nameEn: el.fullNameEn,
      });

      if (!matched) return el;

      return {
        ...el,
        id: el.id || matched.id,
        memberId: matched.memberId || el.memberId,
        studentId: matched.studentId || el.studentId,
        fullNameKh: matched.fullNameKh || el.fullNameKh,
        fullNameEn: matched.fullNameEn || el.fullNameEn,
        department: matched.department || el.department,
        academicYear: matched.academicYear || el.academicYear,
      };
    });

    return NextResponse.json({
      ...data,
      courses,
      eligibleLeaders,
    });
  } catch {
    return proxyToBackend(req, "courses");
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "courses");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
