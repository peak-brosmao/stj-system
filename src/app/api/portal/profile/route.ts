import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await backendFetch("portal/profile");
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

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (r) =>
        (studentId && r.studentId.toLowerCase() === studentId) ||
        (memberId && r.memberId.toLowerCase() === memberId) ||
        (email && r.email.toLowerCase() === email)
    );

    const deptCode = p.member?.department?.code || rosterMatch?.dept || "ITC";
    const yearCode = p.member?.academicYear?.label || p.member?.academicYear?.code || rosterMatch?.year || "I3";
    const phone = p.phone || rosterMatch?.phone || "";
    const gender = p.gender || rosterMatch?.gender || "M";

    const fields = [p.fullNameKh, p.fullNameEn, p.email, phone, p.telegram, p.bio, p.address];
    const filled = fields.filter((v) => typeof v === "string" && v.trim().length > 0).length;
    const completeness = p.completeness || Math.min(100, Math.round((filled / fields.length) * 100));

    return NextResponse.json({
      ...data,
      success: true,
      completeness,
      profile: {
        ...p,
        phone,
        gender,
        member: p.member
          ? {
              ...p.member,
              memberId: rosterMatch?.memberId || p.member.memberId,
              studentId: rosterMatch?.studentId || p.member.studentId || p.studentId,
              department: p.member.department || {
                code: deptCode,
                nameKh: deptCode,
              },
              academicYear: p.member.academicYear || {
                code: yearCode,
                label: yearCode,
              },
              enrollments:
                p.member.enrollments ||
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
