import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const res = await backendFetch(`portal/attendance${query}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return NextResponse.json(
        { error: data?.error || "Failed to load attendance" },
        { status: res.status || 500 }
      );
    }

    const courses = Array.isArray(data.courses) ? data.courses : [];
    let upcoming = Array.isArray(data.upcoming) ? data.upcoming : [];

    // Derive upcoming lessons from enrolled course sessions if backend returned empty array
    if (upcoming.length === 0 && courses.length > 0) {
      const derived: any[] = [];
      for (const c of courses) {
        const sessions = Array.isArray(c.sessions) ? c.sessions : [];
        for (const s of sessions) {
          if (s.status === "SCHEDULED" || s.status === "IN_PROGRESS") {
            const [startTime = "11:30", endTime = "13:00"] = String(s.time || "")
              .split("-")
              .map((part) => part.trim());
            derived.push({
              id: s.id,
              title: s.title,
              sessionDate: s.date || s.sessionDate || new Date().toISOString().split("T")[0],
              startTime: s.startTime || startTime,
              endTime: s.endTime || endTime,
              room: s.room || "SF1 & SF2",
              status: s.status,
              course: {
                code: c.code || "STJ",
                titleKh: c.titleKh || "មុខវិជ្ជា STJ",
              },
            });
          }
        }
      }
      upcoming = derived;
    }

    return NextResponse.json({
      ...data,
      success: true,
      upcoming,
    });
  } catch {
    return NextResponse.json(
      { success: false, records: [], courses: [], upcoming: [], pending: [] },
      { status: 500 }
    );
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "portal/attendance");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
