import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchLiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const membersLookup = await fetchLiveMembersLookup();
    const liveMember = membersLookup.find({
      id: session.id,
      memberId: session.memberId,
      studentId: session.studentId,
      email: session.email,
    });

    const roles =
      session.roles && session.roles.length > 0 ? session.roles : ["MEMBER"];

    let dashboardUrl = "/portal/member";
    if (
      roles.includes("SUPER_ADMIN") ||
      roles.includes("STJ_PRESIDENT") ||
      roles.includes("STJ_ADMIN") ||
      roles.includes("STUDENT_ASSOCIATION")
    ) {
      dashboardUrl = "/system/dashboard";
    } else if (roles.includes("COURSE_LEADER")) {
      dashboardUrl = "/leader/dashboard";
    }

    let roleLabel = "សមាជិក STJ (Member)";
    if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT")) {
      roleLabel = "ប្រធាន STJ (President)";
    } else if (roles.includes("COURSE_LEADER")) {
      roleLabel = "ប្រធានក្រុម (Course Leader)";
    } else if (roles.includes("STJ_ADMIN") || roles.includes("STUDENT_ASSOCIATION")) {
      roleLabel = "គណៈគ្រប់គ្រង (Admin)";
    }

    const fullNameKh = liveMember?.fullNameKh || session.fullNameKh || "សមាជិក STJ";
    const fullNameEn = liveMember?.fullNameEn || session.fullNameEn || "";
    const memberId = liveMember?.memberId || session.memberId || null;
    const studentId = liveMember?.studentId || session.studentId || null;

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
