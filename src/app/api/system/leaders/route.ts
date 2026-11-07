import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { fetchLiveMembersLookup } from "@/lib/memberSync";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const [res, membersLookup] = await Promise.all([
      backendFetch(`leaders${query}`),
      fetchLiveMembersLookup(),
    ]);

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        data || { error: "Failed to load leaders" },
        { status: res.status || 500 }
      );
    }

    const leaders = Array.isArray(data.leaders)
      ? data.leaders.map((l: Record<string, any>) => {
          const matched = membersLookup.find({
            id: l.memberId,
            memberId: l.memberId,
            studentId: l.studentId,
            email: l.email,
            nameKh: l.fullNameKh || l.nameKh,
            nameEn: l.fullNameEn || l.nameEn,
          });

          if (!matched) return l;

          return {
            ...l,
            memberId: matched.memberId || l.memberId,
            studentId: matched.studentId || l.studentId,
            fullNameKh: matched.fullNameKh || l.fullNameKh || l.nameKh,
            fullNameEn: matched.fullNameEn || l.fullNameEn || l.nameEn,
            phone: matched.phone || l.phone || null,
            email: matched.email || l.email,
            department: matched.department?.code || l.department,
            academicYear: matched.academicYear?.code || l.academicYear,
            status: matched.status || l.status || "ACTIVE",
          };
        })
      : [];

    return NextResponse.json({
      ...data,
      leaders,
    });
  } catch {
    return proxyToBackend(req, "leaders");
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "leaders");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
