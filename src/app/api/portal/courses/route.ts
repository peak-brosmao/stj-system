import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { fetchLiveMembersLookup, LiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

function normalizeCourse(raw: Record<string, any>, membersLookup: LiveMembersLookup) {
  const rawLeaders = Array.isArray(raw.leaders) ? raw.leaders : [];
  const leaders = rawLeaders.map((l: Record<string, any>) => {
    const rawKh = l.fullNameKh || l.full_name_kh || "";
    const rawEn = l.fullNameEn || l.full_name_en || "";
    const email = l.email || "";
    const studentId = l.studentId || l.student_id || email.split("@")[0] || "";
    const memberId = l.memberId || l.member_id || "";

    const liveMatch = membersLookup.find({
      id: memberId,
      memberId,
      studentId,
      email,
      nameKh: rawKh,
      nameEn: rawEn,
    });

    return {
      fullNameKh: liveMatch?.fullNameKh || rawKh || "ប្រធានក្រុម",
      fullNameEn: liveMatch?.fullNameEn || rawEn || "Course Leader",
      email: liveMatch?.email || email || "",
      phone: liveMatch?.phone || l.phone || "",
      studentId: liveMatch?.studentId || studentId || "",
      department: liveMatch?.department?.code || l.department || "ITC",
      year: liveMatch?.academicYear?.code || l.year || "",
    };
  });

  const rawMembers = Array.isArray(raw.enrolledMembers) ? raw.enrolledMembers : [];
  const enrolledMembers = rawMembers.map((m: Record<string, any>, idx: number) => {
    const rawMemberId = String(m.memberId || m.member_id || "");
    const rawStudentId = String(m.studentId || m.student_id || "");
    const rawKh = String(m.fullNameKh || m.full_name_kh || "");
    const rawEn = String(m.fullNameEn || m.full_name_en || "");

    const liveMatch = membersLookup.find({
      id: rawMemberId,
      memberId: rawMemberId,
      studentId: rawStudentId,
      nameKh: rawKh,
      nameEn: rawEn,
    });

    return {
      memberId: liveMatch?.memberId || rawMemberId || `STJ-${idx + 1}`,
      studentId: liveMatch?.studentId || rawStudentId || rawMemberId || "",
      fullNameKh: liveMatch?.fullNameKh || rawKh || "សមាជិក STJ",
      fullNameEn: liveMatch?.fullNameEn || rawEn || "STJ Member",
      department: liveMatch?.department?.code || m.department || "",
      year: liveMatch?.academicYear?.code || m.year || "",
    };
  });

  const leaderName =
    leaders[0]?.fullNameKh ||
    leaders[0]?.fullNameEn ||
    raw.leaderName ||
    "មិនទាន់ចាត់តាំង";

  return {
    ...raw,
    leaderName,
    leaders,
    enrolledMembers,
    enrolledMembersCount: Number(raw.enrolledMembersCount ?? enrolledMembers.length),
  };
}

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const [res, membersLookup] = await Promise.all([
      backendFetch(`portal/courses${query}`),
      fetchLiveMembersLookup(),
    ]);
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
        course: normalizeCourse(data.course, membersLookup),
      });
    }

    const courses = Array.isArray(data.courses)
      ? data.courses.map((c: Record<string, any>) => normalizeCourse(c, membersLookup))
      : [];
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
