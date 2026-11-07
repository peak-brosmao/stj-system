import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";

export const dynamic = "force-dynamic";

function normalizeShareLink(raw: Record<string, any>) {
  return {
    id: String(raw.id ?? ""),
    token: String(raw.token ?? ""),
    title: String(raw.title ?? "របាយការណ៍វត្តមាន STJ"),
    isRevoked: Boolean(raw.isRevoked ?? raw.is_revoked ?? false),
    accessCount: Number(raw.accessCount ?? raw.access_count ?? 0),
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    expiresAt: raw.expiresAt || raw.expires_at || null,
    courseId: String(raw.courseId ?? raw.course_id ?? ""),
    course:
      raw.course && typeof raw.course === "object"
        ? {
            code: String(raw.course.code ?? raw.course_code ?? "STJ"),
            titleKh: String(raw.course.titleKh ?? raw.course_name ?? "មុខវិជ្ជា STJ"),
          }
        : {
            code: String(raw.course_code ?? raw.courseCode ?? "STJ"),
            titleKh: String(raw.course_name ?? raw.courseName ?? "មុខវិជ្ជា STJ"),
          },
    session:
      raw.session && typeof raw.session === "object"
        ? raw.session
        : raw.session_title
        ? { title: String(raw.session_title) }
        : null,
    createdBy:
      raw.createdBy && typeof raw.createdBy === "object"
        ? {
            fullNameEn: String(raw.createdBy.fullNameEn ?? "STJ Administration"),
            email: String(raw.createdBy.email ?? "stj@itc.edu.kh"),
          }
        : {
            fullNameEn: String(raw.created_by_name ?? "STJ Administration"),
            email: String(raw.created_by_email ?? "stj@itc.edu.kh"),
          },
  };
}

export async function GET(req: NextRequest) {
  const scope = await resolveLeaderScope();
  const query = req.nextUrl.search;
  const res = await backendFetch(`share-links${query}`);
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      { success: false, links: [], error: data?.error || "Failed to load share links" },
      { status: res.status || 500 }
    );
  }

  const rawLinks: any[] = Array.isArray(data.links) ? data.links : [];
  let links = rawLinks.map(normalizeShareLink);

  if (scope.isCourseLeader) {
    links = links.filter(
      (l) =>
        scope.matchesCourse(l?.course?.code) ||
        scope.matchesCourse(l?.courseId)
    );
  }

  return NextResponse.json({
    ...data,
    success: true,
    links,
  });
}

export async function POST(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const fallbackCourse = Array.from(scope.assignedCourseCodes)[0] || "";
  const courseId = String(body?.courseId || fallbackCourse).trim();

  if (!courseId) {
    return NextResponse.json(
      { error: "សូមជ្រើសរើសមុខវិជ្ជាជាមុនសិន (Course is required)" },
      { status: 400 }
    );
  }

  if (scope.isCourseLeader && !scope.matchesCourse(courseId)) {
    return NextResponse.json(
      { error: "អ្នកអាចបង្កើតតំណភ្ជាប់ចែករំលែកវត្តមានសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
      { status: 403 }
    );
  }

  const title =
    typeof body?.title === "string" && body.title.trim().length >= 3
      ? body.title.trim()
      : `របាយការណ៍វត្តមាន ${courseId}`;

  const payload = {
    courseId,
    sessionId: body?.sessionId ? String(body.sessionId) : null,
    title,
    showStats: body?.showStats ?? true,
  };

  const res = await backendFetch("share-links", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      {
        error:
          data?.error ||
          data?.message ||
          "មិនអាចបង្កើតតំណភ្ជាប់ចែករំលែកវត្តមានបានទេ",
      },
      { status: res.status || 500 }
    );
  }

  const token = String(data.token || data?.link?.token || "");
  return NextResponse.json(
    {
      ...data,
      success: true,
      token,
      link: {
        ...(data.link || {}),
        token,
      },
    },
    { status: res.status }
  );
}

export async function DELETE(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Share link ID is required" }, { status: 400 });
  }

  if (scope.isCourseLeader) {
    const listRes = await backendFetch("share-links");
    const listData = await listRes.json().catch(() => null);
    const rawLinks: any[] = Array.isArray(listData?.links) ? listData.links : [];
    const links = rawLinks.map(normalizeShareLink);
    const target = links.find((l) => String(l.id) === id || String(l.token) === id);
    if (
      !target ||
      (!scope.matchesCourse(target?.course?.code) &&
        !scope.matchesCourse(target?.courseId))
    ) {
      return NextResponse.json(
        { error: "អ្នកអាចលុបតំណភ្ជាប់ចែករំលែកសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
        { status: 403 }
      );
    }
  }

  const res = await backendFetch(`share-links/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data || { success: res.ok }, { status: res.status });
}
