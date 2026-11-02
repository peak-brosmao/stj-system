import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (m) =>
        (session.studentId && m.studentId.toLowerCase() === session.studentId.toLowerCase()) ||
        (session.email && m.email.toLowerCase() === session.email.toLowerCase()) ||
        (session.id && m.memberId.toLowerCase() === session.id.toLowerCase())
    );

    const roles = session.roles && session.roles.length > 0
      ? session.roles
      : rosterMatch?.isLeader
      ? ["COURSE_LEADER", "MEMBER"]
      : rosterMatch?.studentId === "e20221334"
      ? ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "MEMBER"]
      : ["MEMBER"];

    let dashboardUrl = "/portal/member";
    if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT") || roles.includes("STJ_ADMIN") || roles.includes("STUDENT_ASSOCIATION")) {
      dashboardUrl = "/system/dashboard";
    } else if (roles.includes("COURSE_LEADER")) {
      dashboardUrl = "/leader/dashboard";
    } else {
      dashboardUrl = "/portal/member";
    }

    let roleLabel = "សមាជិក STJ (Member)";
    if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT")) {
      roleLabel = "ប្រធាន STJ (President)";
    } else if (roles.includes("COURSE_LEADER")) {
      roleLabel = "ប្រធានក្រុម (Course Leader)";
    } else if (roles.includes("STJ_ADMIN") || roles.includes("STUDENT_ASSOCIATION")) {
      roleLabel = "គណៈគ្រប់គ្រង (Admin)";
    } else if (rosterMatch?.role) {
      roleLabel = rosterMatch.role;
    }

    const fullNameKh = session.fullNameKh || rosterMatch?.nameKh || "សមាជិក STJ";
    const fullNameEn = session.fullNameEn || rosterMatch?.nameEn || "";
    const memberId = session.memberId || rosterMatch?.memberId || "STJ";
    const studentId = session.studentId || rosterMatch?.studentId || null;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: fullNameKh,
        fullNameKh,
        fullNameEn,
        memberId,
        studentId,
        profileImage: session.profileImage || null,
        roles,
        roleLabel,
        dashboardUrl,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
