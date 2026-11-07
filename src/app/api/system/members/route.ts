import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";

export const dynamic = "force-dynamic";

function memberMatchesLeaderScope(
  member: Record<string, any>,
  matchesCourse: (c: string | null | undefined) => boolean
): boolean {
  if (Array.isArray(member.enrollments)) {
    for (const e of member.enrollments) {
      if (matchesCourse(e?.course?.code) || matchesCourse(e?.course?.id)) {
        return true;
      }
    }
  }
  if (typeof member.notes === "string" && member.notes) {
    const tokens = member.notes.split(/[\s,|•/]+/);
    for (const t of tokens) {
      if (matchesCourse(t)) return true;
    }
  }
  return false;
}

export async function GET(req: NextRequest) {
  const scope = await resolveLeaderScope();
  const requestedCourse = req.nextUrl.searchParams.get("course");

  // If a Course Leader requests members, enforce their assigned course filter
  if (scope.isCourseLeader) {
    const allowedCodes = Array.from(scope.assignedCourseCodes);
    const effectiveCourse =
      requestedCourse && requestedCourse !== "ALL" && scope.matchesCourse(requestedCourse)
        ? requestedCourse
        : allowedCodes[0] || "";

    const query = effectiveCourse ? `?course=${encodeURIComponent(effectiveCourse)}` : "";
    const res = await backendFetch(`members${query}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        { success: false, members: [], error: data?.error || "Failed to load members" },
        { status: res.status || 500 }
      );
    }

    const rawMembers: any[] = Array.isArray(data.members) ? data.members : [];
    const scopedMembers = rawMembers.filter((m) =>
      memberMatchesLeaderScope(m, scope.matchesCourse)
    );

    return NextResponse.json({
      ...data,
      success: true,
      members: scopedMembers,
      assignedCourses: allowedCodes,
    });
  }

  return proxyToBackend(req, "members");
}

export async function POST(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.isSystemAdmin) {
    return NextResponse.json(
      { error: "មានតែប្រធាន STJ ឬអ្នកគ្រប់គ្រងប្រព័ន្ធប៉ុណ្ណោះដែលអាចបន្ថែមសមាជិកថ្មីចូលស្ថាប័នបាន" },
      { status: 403 }
    );
  }
  return proxyToBackend(req, "members");
}

export async function PUT(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.isSystemAdmin && !scope.isCourseLeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return proxyToBackend(req, "members");
}

export async function PATCH(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.isSystemAdmin && !scope.isCourseLeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return proxyToBackend(req, "members");
}

export async function DELETE(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.isSystemAdmin) {
    return NextResponse.json(
      { error: "មានតែប្រធាន STJ ឬអ្នកគ្រប់គ្រងប្រព័ន្ធប៉ុណ្ណោះដែលអាចលុបសមាជិកចេញពីស្ថាប័នបាន" },
      { status: 403 }
    );
  }
  return proxyToBackend(req, "members");
}
