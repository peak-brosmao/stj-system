import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";
import { isSyllabusSession } from "@/lib/richContent";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const scope = await resolveLeaderScope();
  const query = req.nextUrl.search;
  const res = await backendFetch(`attendance${query}`);
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      data || { error: "Failed to load attendance" },
      { status: res.status || 500 }
    );
  }

  if (Array.isArray(data.courses)) {
    let courses = data.courses.map((c: any) => ({
      ...c,
      sessions: Array.isArray(c.sessions)
        ? c.sessions.filter((s: any) => !isSyllabusSession(s))
        : [],
    }));

    if (scope.isCourseLeader) {
      courses = courses.filter(
        (c: any) => scope.matchesCourse(c?.id) || scope.matchesCourse(c?.code)
      );
    }

    return NextResponse.json({
      ...data,
      courses,
    });
  }

  return NextResponse.json(data, { status: res.status });
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "attendance");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
