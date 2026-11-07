import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";
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

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (r) =>
        (studentId && r.studentId.toLowerCase() === studentId) ||
        (memberId && r.memberId.toLowerCase() === memberId) ||
        (email && r.email.toLowerCase() === email)
    );

    const fullNameKh = liveMatch?.fullNameKh || p.fullNameKh || rosterMatch?.nameKh || "";
    const fullNameEn = liveMatch?.fullNameEn || p.fullNameEn || rosterMatch?.nameEn || "";
    const deptCode = liveMatch?.department?.code || p.member?.department?.code || rosterMatch?.dept || "ITC";
    const yearCode =
      liveMatch?.academicYear?.label ||
      liveMatch?.academicYear?.code ||
      p.member?.academicYear?.label ||
      p.member?.academicYear?.code ||
      rosterMatch?.year ||
      "I3";
    const phone = liveMatch?.phone || p.phone || rosterMatch?.phone || "";
    const gender = liveMatch?.gender || p.gender || rosterMatch?.gender || "M";

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
              memberId: liveMatch?.memberId || rosterMatch?.memberId || p.member?.memberId,
              studentId: liveMatch?.studentId || rosterMatch?.studentId || p.member?.studentId || p.studentId,
              department: liveMatch?.department || p.member?.department || {
                code: deptCode,
                nameKh: deptCode,
              },
              academicYear: liveMatch?.academicYear || p.member?.academicYear || {
                code: yearCode,
                label: yearCode,
              },
              enrollments:
                liveMatch?.enrollments ||
                p.member?.enrollments ||
                (rosterMatch?.assignedCourse
                  ? [
                      {
                        course: {
                          code: rosterMatch.assignedCourse,
                          titleKh: rosterMatch.assignedCourse,
                        },
                      },
                    ]
                  : []),
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
