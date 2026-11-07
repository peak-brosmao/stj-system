import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";
import { isBlogSession, isSyllabusSession } from "@/lib/richContent";
import { getAllBlogAndLessonItems } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const scope = await resolveLeaderScope();
  const query = req.nextUrl.search;
  const targetSessionId = req.nextUrl.searchParams.get("sessionId");

  // Load all known blog items to strictly enforce separation
  const allItems = await getAllBlogAndLessonItems().catch(() => []);
  const blogIds = new Set(
    allItems.filter((item) => item.kind === "BLOG").map((item) => String(item.id))
  );

  // If attempting to get attendance roster for a blog, reject immediately
  if (targetSessionId && blogIds.has(String(targetSessionId))) {
    return NextResponse.json(
      { error: "អត្ថបទ Blog មិនមែនជាមេរៀនបង្រៀនឡើយ មិនអាចស្រង់វត្តមានបានទេ (Blog posts cannot collect attendance)" },
      { status: 422 }
    );
  }

  const res = await backendFetch(`attendance${query}`);
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      data || { error: "Failed to load attendance" },
      { status: res.status || 500 }
    );
  }

  // Double check single session response
  if (data?.session) {
    if (
      isBlogSession(data.session) ||
      blogIds.has(String(data.session.id)) ||
      data.session.status === "BLOG_POST" ||
      data.session.room === "__BLOG__"
    ) {
      return NextResponse.json(
        { error: "អត្ថបទ Blog មិនមែនជាមេរៀនបង្រៀនឡើយ មិនអាចស្រង់វត្តមានបានទេ (Blog posts cannot collect attendance)" },
        { status: 422 }
      );
    }
  }

  if (Array.isArray(data.courses)) {
    let courses = data.courses.map((c: any) => ({
      ...c,
      sessions: Array.isArray(c.sessions)
        ? c.sessions.filter(
            (s: any) =>
              !isSyllabusSession(s) &&
              !isBlogSession(s) &&
              !blogIds.has(String(s.id)) &&
              s.status !== "BLOG_POST" &&
              s.room !== "__BLOG__"
          )
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
  try {
    const clone = req.clone();
    const body = await clone.json().catch(() => null);
    if (body?.sessionId) {
      const allItems = await getAllBlogAndLessonItems().catch(() => []);
      const blogIds = new Set(
        allItems.filter((item) => item.kind === "BLOG").map((item) => String(item.id))
      );
      if (blogIds.has(String(body.sessionId))) {
        return NextResponse.json(
          { error: "អត្ថបទ Blog មិនមែនជាមេរៀនបង្រៀនឡើយ មិនអាចស្រង់វត្តមានបានទេ (Blog posts cannot collect attendance)" },
          { status: 422 }
        );
      }
    }
  } catch {
    // ignore
  }

  return proxyToBackend(req, "attendance");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
