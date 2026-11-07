import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";

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
    course: raw.course && typeof raw.course === "object"
      ? {
          code: String(raw.course.code ?? raw.course_code ?? "STJ"),
          titleKh: String(raw.course.titleKh ?? raw.course_name ?? "មុខវិជ្ជា STJ"),
        }
      : {
          code: String(raw.course_code ?? raw.courseCode ?? "STJ"),
          titleKh: String(raw.course_name ?? raw.courseName ?? "មុខវិជ្ជា STJ"),
        },
    session: raw.session && typeof raw.session === "object"
      ? raw.session
      : raw.session_title
      ? { title: String(raw.session_title) }
      : null,
    createdBy: raw.createdBy && typeof raw.createdBy === "object"
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
  try {
    const query = req.nextUrl.search;
    const res = await backendFetch(`share-links${query}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        { success: false, links: [], error: data?.error || "Failed to load share links" },
        { status: res.status || 500 }
      );
    }
    const rawLinks = Array.isArray(data.links) ? data.links : [];
    return NextResponse.json({
      ...data,
      success: true,
      links: rawLinks.map(normalizeShareLink),
    });
  } catch {
    return NextResponse.json({ success: false, links: [] }, { status: 200 });
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "share-links");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
