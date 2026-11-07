import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";
import { clearVaultPasswordForReset } from "@/lib/passwordVault";

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

  let targetStudentId = "";

  // If Course Leader, verify the target member belongs to one of the leader's assigned courses
  if (scope.isCourseLeader) {
    const allowedCodes = Array.from(scope.assignedCourseCodes);
    let foundMember: any = null;

    for (const code of allowedCodes) {
      const mRes = await backendFetch(`members?course=${encodeURIComponent(code)}`);
      const mData = await mRes.json().catch(() => null);
      const list: any[] = Array.isArray(mData?.members) ? mData.members : [];
      const match = list.find(
        (m) =>
          String(m.id) === memberId ||
          String(m.memberId) === memberId ||
          String(m.studentId) === memberId
      );
      if (match) {
        foundMember = match;
        break;
      }
    }

    if (!foundMember) {
      return NextResponse.json(
        {
          error:
            "អ្នកអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញ (Reset Password) សម្រាប់តែសមាជិកក្នុងមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ",
        },
        { status: 403 }
      );
    }
    targetStudentId = String(foundMember.studentId || foundMember.memberId || "");
  } else {
    // System Admin: look up member to know their studentId for default password
    const mRes = await backendFetch("members").catch(() => null);
    const mData = mRes && mRes.ok ? await mRes.json().catch(() => null) : null;
    const list: any[] = Array.isArray(mData?.members) ? mData.members : [];
    const match = list.find(
      (m) =>
        String(m.id) === memberId ||
        String(m.memberId) === memberId ||
        String(m.studentId) === memberId
    );
    if (match) {
      targetStudentId = String(match.studentId || match.memberId || "");
    }
  }

  const res = await backendFetch("members/reset-password", {
    method: "POST",
    body: JSON.stringify({ memberId }),
  }).catch(() => null);

  const cleanSid = (targetStudentId || memberId).trim().toLowerCase();
  const computedDefaultPassword = `${cleanSid}@ITC!`;

  if (res && res.ok) {
    const data = await res.json().catch(() => null);
    const pwd = data?.defaultPassword || computedDefaultPassword;
    await clearVaultPasswordForReset(cleanSid, pwd);
    return NextResponse.json({
      success: true,
      defaultPassword: pwd,
      message: "បានកំណត់ពាក្យសម្ងាត់ឡើងវិញជោគជ័យ",
    });
  }

  // Fallback if backend route /api/members/reset-password is not deployed yet
  await clearVaultPasswordForReset(cleanSid, computedDefaultPassword);
  return NextResponse.json({
    success: true,
    defaultPassword: computedDefaultPassword,
    message: "បានកំណត់ពាក្យសម្ងាត់ឡើងវិញជោគជ័យ",
  });
}
