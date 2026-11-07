import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { decodeRichNotes, isSyllabusSession } from "@/lib/richContent";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const [res, sessionsRes] = await Promise.all([
      backendFetch(`portal/attendance${query}`),
      backendFetch("sessions").catch(() => null),
    ]);
    const data = await res.json().catch(() => null);
    const sessionsData =
      sessionsRes && sessionsRes.ok ? await sessionsRes.json().catch(() => null) : null;
    const allBackendSessions: Record<string, any>[] = Array.isArray(sessionsData?.sessions)
      ? sessionsData.sessions
      : [];

    if (!res.ok || !data) {
      return NextResponse.json(
        { error: data?.error || "Failed to load attendance" },
        { status: res.status || 500 }
      );
    }

    const sessionLookup = new Map<string, Record<string, any>>();
    for (const bs of allBackendSessions) {
      if (isSyllabusSession(bs)) continue;
      const decoded = decodeRichNotes(bs.notes);
      sessionLookup.set(String(bs.id), {
        ...bs,
        notes: decoded.notes,
        richContent: decoded.richContent,
        attachments: decoded.attachments,
      });
    }

    const courses = Array.isArray(data.courses) ? data.courses : [];
    const enrolledCodes = new Set(
      courses.map((c: any) => String(c.code || "").toUpperCase()).filter(Boolean)
    );

    const enrichLesson = (l: any) => {
      const matched = sessionLookup.get(String(l.id));
      const decoded = matched
        ? {
            notes: matched.notes,
            richContent: matched.richContent,
            attachments: matched.attachments,
          }
        : decodeRichNotes(l.notes);
      const courseCode = l.course?.code || matched?.course?.code || matched?.courseCode || "STJ";
      return {
        ...l,
        course: {
          code: courseCode,
          titleKh:
            l.course?.titleKh ||
            matched?.course?.titleKh ||
            matched?.courseTitleKh ||
            "មុខវិជ្ជា STJ",
          slug: String(courseCode).toLowerCase(),
        },
        notes: decoded.notes,
        richContent: decoded.richContent,
        attachments: decoded.attachments,
      };
    };

    let upcoming = (Array.isArray(data.upcoming) ? data.upcoming : [])
      .filter((s: any) => !isSyllabusSession(s))
      .map(enrichLesson);

    const pending = (Array.isArray(data.pending) ? data.pending : [])
      .filter((s: any) => !isSyllabusSession(s))
      .map(enrichLesson);

    // Collect all non-cancelled lessons for the member's enrolled courses
    const allLessonsMap = new Map<string, any>();
    for (const c of courses) {
      const cSlug = c.slug || String(c.code || "stj").toLowerCase();
      const sessions = Array.isArray(c.sessions) ? c.sessions : [];
      for (const s of sessions) {
        if (isSyllabusSession(s) || s.status === "CANCELLED") continue;
        const [startTime = "11:30", endTime = "13:00"] = String(s.time || "")
          .split("-")
          .map((part) => part.trim());
        const enriched = enrichLesson({
          id: s.id,
          title: s.title,
          sessionDate: s.date || s.sessionDate || new Date().toISOString().split("T")[0],
          startTime: s.startTime || startTime,
          endTime: s.endTime || endTime,
          room: s.room || "SF1 & SF2",
          status: s.status || "SCHEDULED",
          notes: s.notes,
          course: {
            code: c.code || "STJ",
            titleKh: c.titleKh || "មុខវិជ្ជា STJ",
            slug: cSlug,
          },
        });
        enriched.course.slug = cSlug;
        allLessonsMap.set(String(s.id), enriched);
      }
    }

    for (const bs of sessionLookup.values()) {
      const bCode = String(bs.course?.code || bs.courseCode || "").toUpperCase();
      if (
        (enrolledCodes.size === 0 || enrolledCodes.has(bCode)) &&
        bs.status !== "CANCELLED" &&
        !allLessonsMap.has(String(bs.id))
      ) {
        allLessonsMap.set(
          String(bs.id),
          enrichLesson({
            id: bs.id,
            title: bs.title,
            sessionDate: bs.sessionDate || new Date().toISOString().split("T")[0],
            startTime: bs.startTime || "11:30",
            endTime: bs.endTime || "13:00",
            room: bs.room || "SF1 & SF2",
            status: bs.status || "SCHEDULED",
            notes: bs.notes,
            course: {
              code: bCode || "STJ",
              titleKh: bs.course?.titleKh || bs.courseTitleKh || "មុខវិជ្ជា STJ",
              slug: String(bCode || "stj").toLowerCase(),
            },
          })
        );
      }
    }

    const allLessons = Array.from(allLessonsMap.values());
    if (upcoming.length === 0) {
      upcoming = allLessons.filter(
        (l) => l.status === "SCHEDULED" || l.status === "IN_PROGRESS"
      );
    } else {
      upcoming = upcoming.filter(
        (l: any) => l.status === "SCHEDULED" || l.status === "IN_PROGRESS"
      );
    }

    const completed = allLessons.filter((l) => l.status === "COMPLETED");

    const records = (Array.isArray(data.records) ? data.records : []).filter(
      (r: any) => !isSyllabusSession(r.session || {})
    );

    return NextResponse.json({
      ...data,
      success: true,
      records,
      upcoming,
      completed,
      allLessons,
      pending,
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
