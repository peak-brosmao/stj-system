import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { fetchLiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [res, membersLookup] = await Promise.all([
      backendFetch("portal/profile"),
      fetchLiveMembersLookup(),
    ]);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.profile) {
      return NextResponse.json(
        { error: data?.error || "Failed to load profile" },
        { status: res.status || 401 }
      );
    }

    const p = data.profile;
    const studentId = String(p.studentId || p.member?.studentId || "").toLowerCase();
    const memberId = String(p.member?.memberId || "").toLowerCase();
    const email = String(p.email || "").toLowerCase();

    const liveMatch = membersLookup.find({
      memberId,
      studentId,
      email,
      nameKh: p.fullNameKh,
      nameEn: p.fullNameEn,
    });

    const fullNameKh = liveMatch?.fullNameKh || p.fullNameKh || "";
    const fullNameEn = liveMatch?.fullNameEn || p.fullNameEn || "";
    const deptCode = liveMatch?.department?.code || p.member?.department?.code || "ITC";
    const yearCode =
      liveMatch?.academicYear?.label ||
      liveMatch?.academicYear?.code ||
      p.member?.academicYear?.label ||
      p.member?.academicYear?.code ||
      "";
    const phone = liveMatch?.phone || p.phone || "";
    const gender = liveMatch?.gender || p.gender || "M";

    const fields = [fullNameKh, fullNameEn, p.email, phone, p.telegram, p.bio, p.address];
    const filled = fields.filter((v) => typeof v === "string" && v.trim().length > 0).length;
    const completeness = p.completeness || Math.min(100, Math.round((filled / fields.length) * 100));

    return NextResponse.json({
      ...data,
      success: true,
      completeness,
      profile: {
        ...p,
        fullNameKh,
        fullNameEn,
        displayName: fullNameEn || p.displayName,
        phone,
        gender,
        member: p.member || liveMatch
          ? {
              ...(p.member || {}),
              memberId: liveMatch?.memberId || p.member?.memberId,
              studentId: liveMatch?.studentId || p.member?.studentId || p.studentId,
              department: liveMatch?.department || p.member?.department || {
                code: deptCode,
                nameKh: deptCode,
              },
              academicYear: liveMatch?.academicYear || p.member?.academicYear || {
                code: yearCode,
                label: yearCode,
              },
              enrollments: liveMatch?.enrollments || p.member?.enrollments || [],
            }
          : null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "portal/profile");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
