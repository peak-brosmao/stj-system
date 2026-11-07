import { NextRequest, NextResponse } from "next/server";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const res = await fetch(`${LARAVEL_API_BASE}/organization/hierarchy${query}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || data?.error || "Failed to fetch organization hierarchy from database",
        },
        { status: res.status || 500 }
      );
    }

    // Ensure each course's leader name reflects the latest live record in course.members (from the SQLite members table)
    const rawCourses = Array.isArray(data.hierarchy?.courses) ? data.hierarchy.courses : [];
    const courses = rawCourses.map((course: Record<string, any>) => {
      const members = Array.isArray(course.members) ? course.members : [];
      const leaderStudentId = String(course.leader?.studentId || "").toLowerCase();
      const matchedLeaderMember = leaderStudentId
        ? members.find(
            (m: Record<string, any>) =>
              String(m.studentId || "").toLowerCase() === leaderStudentId
          )
        : null;

      if (!matchedLeaderMember) return course;

      return {
        ...course,
        leader: {
          ...course.leader,
          nameKh: matchedLeaderMember.nameKh || course.leader?.nameKh,
          nameEn: matchedLeaderMember.nameEn || course.leader?.nameEn,
          department: matchedLeaderMember.department || course.leader?.department,
          email: matchedLeaderMember.email || course.leader?.email,
        },
      };
    });

    return NextResponse.json({
      ...data,
      hierarchy: {
        ...data.hierarchy,
        courses,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to connect to backend database" },
      { status: 502 }
    );
  }
}
