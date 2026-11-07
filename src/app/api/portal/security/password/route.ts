import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { backendFetch } from "@/lib/backendProxy";
import { saveVaultPasswordChange } from "@/lib/passwordVault";

export const dynamic = "force-dynamic";

async function handleChangePassword(req: NextRequest) {
  const session = await getSession();
  const body = await req.json().catch(() => null);
  const currentPassword = String(body?.currentPassword || "");
  const newPassword = String(body?.newPassword || "");
  const confirmPassword = body?.confirmPassword ? String(body.confirmPassword) : newPassword;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "សូមបំពេញលេខកូដសម្ងាត់បច្ចុប្បន្ន និងលេខកូដសម្ងាត់ថ្មី" },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "លេខកូដសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៨ តួអក្សរ (Minimum 8 characters)" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "ការបញ្ជាក់លេខកូដសម្ងាត់ថ្មីមិនត្រូវគ្នាឡើយ (Passwords do not match)" },
      { status: 400 }
    );
  }

  // Resolve user identifier from session or /portal/profile
  let emailOrStudentId = session?.studentId || session?.email || "";
  if (!emailOrStudentId) {
    const profRes = await backendFetch("portal/profile").catch(() => null);
    if (profRes && profRes.ok) {
      const profData = await profRes.json().catch(() => null);
      const p = profData?.profile || profData?.user;
      emailOrStudentId = p?.studentId || p?.email || "";
    }
  }

  if (!emailOrStudentId) {
    return NextResponse.json(
      { error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធម្តងទៀត (Session expired)" },
      { status: 401 }
    );
  }

  // 1. Try native Laravel /api/portal/security/password endpoint first
  const res = await backendFetch("portal/security/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  }).catch(() => null);

  if (res && res.ok) {
    const data = await res.json().catch(() => null);
    // Keep vault in sync if user previously had a vault entry
    await saveVaultPasswordChange({
      emailOrStudentId,
      currentPassword,
      newPassword,
    }).catch(() => {});
    return NextResponse.json(
      data || {
        success: true,
        message: "លេខកូដសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)",
      }
    );
  }

  // If backend explicitly returned 400/422 (wrong current password), return that error if user has no vault entry
  if (res && (res.status === 400 || res.status === 422)) {
    const vaultTry = await saveVaultPasswordChange({
      emailOrStudentId,
      currentPassword,
      newPassword,
    });
    if (vaultTry.ok) {
      return NextResponse.json({
        success: true,
        message: "លេខកូដសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)",
      });
    }
    const errData = await res.json().catch(() => null);
    return NextResponse.json(
      {
        error:
          errData?.error ||
          vaultTry.error ||
          "លេខកូដសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ",
      },
      { status: 400 }
    );
  }

  // 2. Fallback to AES-256-GCM encrypted SQLite credential vault (when backend route is 404/405)
  const vaultResult = await saveVaultPasswordChange({
    emailOrStudentId,
    currentPassword,
    newPassword,
  });

  if (!vaultResult.ok) {
    return NextResponse.json(
      { error: vaultResult.error || "ការផ្លាស់ប្តូរលេខកូដសម្ងាត់មិនជោគជ័យ" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "លេខកូដសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)",
  });
}

export const POST = handleChangePassword;
export const PUT = handleChangePassword;
export const PATCH = handleChangePassword;
