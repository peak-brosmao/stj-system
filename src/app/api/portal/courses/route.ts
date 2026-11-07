import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

function normalizeCourse(raw: Record<string, any>) {
  const rawLeaders = Array.isArray(raw.leaders) ? raw.leaders : [];
  const leaders = rawLeaders.map((l: Record<string, any>) => {
    const fullNameKh = l.fullNameKh || l.full_name_kh || "";
    const fullNameEn = l.fullNameEn || l.full_name_en || "";
    const email = l.email || "";
    const studentId = l.studentId || l.student_id || email.split("@")[0] || "";
    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (m) =>
        (studentId && m.studentId.toLowerCase() === studentId.toLowerCase()) ||
        (email && m.email.toLowerCase() === email.toLowerCase()) ||
        (fullNameKh && m.nameKh === fullNameKh)
    );
    return {
      fullNameKh: fullNameKh || rosterMatch?.nameKh || "ប្រធានក្រុម",
      fullNameEn: fullNameEn || rosterMatch?.nameEn || "Course Leader",
      email: email || rosterMatch?.email || "",
      phone: l.phone || rosterMatch?.phone || "",
      studentId: studentId || rosterMatch?.studentId || "",
      department: l.department || rosterMatch?.dept || "ITC",
      year: l.year || rosterMatch?.year || "",
    };
  });

  const rawMembers = Array.isArray(raw.enrolledMembers) ? raw.enrolledMembers : [];
  const enrolledMembers = rawMembers.map((m: Record<string, any>, idx: number) => {
    const rawMemberId = String(m.memberId || m.member_id || "");
    const rawStudentId = String(m.studentId || m.student_id || "");
    const fullNameKh = String(m.fullNameKh || m.full_name_kh || "");
    const fullNameEn = String(m.fullNameEn || m.full_name_en || "");

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (r) =>
        (rawMemberId && r.memberId.toLowerCase() === rawMemberId.toLowerCase()) ||
        (rawMemberId && r.studentId.toLowerCase() === rawMemberId.toLowerCase()) ||
        (rawStudentId && r.studentId.toLowerCase() === rawStudentId.toLowerCase()) ||
        (fullNameKh && r.nameKh === fullNameKh) ||
        (fullNameEn && r.nameEn.toLowerCase() === fullNameEn.toLowerCase())
    );

    return {
      memberId: rosterMatch?.memberId || rawMemberId || `STJ-${idx + 1}`,
      studentId: rosterMatch?.studentId || rawStudentId || rawMemberId || "",
      fullNameKh: fullNameKh || rosterMatch?.nameKh || "សមាជិក STJ",
      fullNameEn: fullNameEn || rosterMatch?.nameEn || "STJ Member",
      department: m.department || rosterMatch?.dept || "",
      year: m.year || rosterMatch?.year || "",
    };
  });

  return {
    ...raw,
    leaders,
    enrolledMembers,
    enrolledMembersCount: Number(raw.enrolledMembersCount ?? enrolledMembers.length),
  };
}

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const res = await backendFetch(`portal/courses${query}`);
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return NextResponse.json(
        { success: false, courses: [], course: null, error: data?.error || "Failed to load courses" },
        { status: res.status || 500 }
      );
    }

    if (data.course && typeof data.course === "object") {
      return NextResponse.json({
        ...data,
        success: true,
        course: normalizeCourse(data.course),
      });
    }

    const courses = Array.isArray(data.courses) ? data.courses.map(normalizeCourse) : [];
    return NextResponse.json({
      ...data,
      success: true,
      courses,
    });
  } catch {
    return NextResponse.json({ success: false, courses: [], course: null }, { status: 500 });
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "portal/courses");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
