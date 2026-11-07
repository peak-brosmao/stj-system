import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";

export const dynamic = "force-dynamic";

export async function GET() {
  const scope = await resolveLeaderScope();
  const res = await backendFetch("share-links");
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      { success: false, links: [], error: data?.error || "Failed to load share links" },
      { status: res.status || 500 }
    );
  }

  let links: any[] = Array.isArray(data.links) ? data.links : [];
  if (scope.isCourseLeader) {
    links = links.filter(
      (l) =>
        scope.matchesCourse(l?.course?.code) ||
        scope.matchesCourse(l?.course?.id) ||
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
  const courseId = String(body?.courseId || "");

  if (scope.isCourseLeader && !scope.matchesCourse(courseId)) {
    return NextResponse.json(
      { error: "អ្នកអាចបង្កើតតំណភ្ជាប់ចែករំលែកសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
      { status: 403 }
    );
  }

  const res = await backendFetch("share-links", {
    method: "POST",
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data || { success: res.ok }, { status: res.status });
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
    const links: any[] = Array.isArray(listData?.links) ? listData.links : [];
    const target = links.find((l) => String(l.id) === id);
    if (
      !target ||
      (!scope.matchesCourse(target?.course?.code) &&
        !scope.matchesCourse(target?.course?.id) &&
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
