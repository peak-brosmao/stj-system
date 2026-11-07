import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const memberId = String(body?.memberId || "");
  if (!memberId) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  // If Course Leader, verify the target member belongs to one of the leader's assigned courses
  if (scope.isCourseLeader) {
    const allowedCodes = Array.from(scope.assignedCourseCodes);
    let foundInLeaderCourse = false;

    for (const code of allowedCodes) {
      const mRes = await backendFetch(`members?course=${encodeURIComponent(code)}`);
      const mData = await mRes.json().catch(() => null);
      const list: any[] = Array.isArray(mData?.members) ? mData.members : [];
      if (
        list.some(
          (m) =>
            String(m.id) === memberId ||
            String(m.memberId) === memberId ||
            String(m.studentId) === memberId
        )
      ) {
        foundInLeaderCourse = true;
        break;
      }
    }

    if (!foundInLeaderCourse) {
      return NextResponse.json(
        {
          error:
            "អ្នកអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញ (Reset Password) សម្រាប់តែសមាជិកក្នុងមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ",
        },
        { status: 403 }
      );
    }
  }

  const res = await backendFetch("members/reset-password", {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data || { success: res.ok }, { status: res.status });
}
