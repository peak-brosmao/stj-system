import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";
import { getSession } from "@/lib/auth";
import { resolveLeaderScope } from "@/lib/leaderScope";
import {
  encodeRichNotes,
  decodeRichNotes,
  isSyllabusSession,
  SYLLABUS_MARKER_TITLE,
  SYLLABUS_MARKER_ROOM,
} from "@/lib/richContent";
import {
  normalizeSessionToBlogOrLesson,
  removeBlogCacheItem,
  resolveAuthorFields,
  syncSessionsToBlogCache,
  upsertBlogCacheItem,
} from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const scope = await resolveLeaderScope();
  const query = req.nextUrl.search;
  const res = await backendFetch(`sessions${query}`);
  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      { success: false, sessions: [], courses: [], error: data?.error || "Failed to load sessions" },
      { status: res.status || 500 }
    );
  }

  let rawCourses: any[] = Array.isArray(data.courses) ? data.courses : [];
  let rawSessions: any[] = Array.isArray(data.sessions) ? data.sessions : [];

  // Sync all fetched sessions into blog cache for public/portal access
  syncSessionsToBlogCache(rawSessions);

  // Strict Course Leader scoping: only return their own assigned courses and sessions
  if (scope.isCourseLeader) {
    rawCourses = rawCourses.filter(
      (c) => scope.matchesCourse(c?.id) || scope.matchesCourse(c?.code)
    );
    rawSessions = rawSessions.filter(
      (s) =>
        scope.matchesCourse(s?.courseId) ||
        scope.matchesCourse(s?.courseCode) ||
        scope.matchesCourse(s?.course?.id) ||
        scope.matchesCourse(s?.course?.code)
    );
  }

  const courseSyllabuses: Record<
    string,
    {
      sessionId: string;
      courseId: string;
      courseCode: string;
      notes: string;
      richContent: string;
      attachments: any[];
      visibility?: "PRIVATE" | "PUBLIC";
      thumbnailUrl?: string;
    }
  > = {};

  const normalSessions: any[] = [];

  for (const s of rawSessions) {
    const decoded = decodeRichNotes(s.notes);
    const code = String(s.courseCode || s.course?.code || "").toUpperCase();
    const cid = String(s.courseId || s.course?.id || code);

    if (isSyllabusSession(s)) {
      if (s.status === "SYLLABUS" || s.room === SYLLABUS_MARKER_ROOM || s.title === SYLLABUS_MARKER_TITLE) {
        const entry = {
          sessionId: String(s.id),
          courseId: cid,
          courseCode: code,
          notes: decoded.notes,
          richContent: decoded.richContent,
          attachments: decoded.attachments,
          visibility: decoded.visibility || "PRIVATE",
          thumbnailUrl: decoded.thumbnailUrl,
        };
        if (code) courseSyllabuses[code] = entry;
        if (cid) courseSyllabuses[cid] = entry;
      }
      continue;
    }

    normalSessions.push({
      ...s,
      notes: decoded.notes,
      richContent: decoded.richContent,
      attachments: decoded.attachments,
      visibility: decoded.visibility || "PRIVATE",
      thumbnailUrl: decoded.thumbnailUrl,
      category: decoded.category,
      authorNameKh: decoded.authorNameKh,
      authorNameEn: decoded.authorNameEn,
    });
  }

  return NextResponse.json({
    ...data,
    success: true,
    courses: rawCourses,
    sessions: normalSessions,
    courseSyllabuses,
  });
}

export async function POST(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const targetCourseId = String(body.courseId || "");
  if (scope.isCourseLeader && !scope.matchesCourse(targetCourseId)) {
    return NextResponse.json(
      { error: "អ្នកអាចបង្កើតមេរៀន ឬកែប្រែមាតិកាសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
      { status: 403 }
    );
  }

  const userSession = await getSession();
  const resolvedAuthor = resolveAuthorFields({
    authorId: userSession?.id,
    authorStudentId: userSession?.studentId || undefined,
    authorNameKh: userSession?.fullNameKh,
    authorNameEn: userSession?.fullNameEn,
    authorRole: scope.isSystemAdmin ? "គណៈកម្មការ STJ" : "ប្រធានមុខវិជ្ជា",
    courseCode: body.courseCode || targetCourseId,
  });
  const encodedNotes = encodeRichNotes({
    notes: body.notes,
    richContent: body.richContent,
    attachments: body.attachments,
    visibility: body.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
    thumbnailUrl: body.thumbnailUrl,
    category: body.category,
    authorId: resolvedAuthor.authorId,
    authorStudentId: resolvedAuthor.authorStudentId,
    authorNameKh: resolvedAuthor.authorNameKh,
    authorNameEn: resolvedAuthor.authorNameEn,
    authorRole: resolvedAuthor.authorRole,
  });

  // Handle saving Course Syllabus / Overview
  if (body.isSyllabus) {
    // Check if a syllabus record already exists for this course
    const listRes = await backendFetch("sessions");
    const listData = await listRes.json().catch(() => null);
    const allSessions: any[] = Array.isArray(listData?.sessions) ? listData.sessions : [];
    const existing = allSessions.find(
      (s) =>
        isSyllabusSession(s) &&
        (String(s.courseId) === targetCourseId ||
          String(s.courseCode).toUpperCase() === targetCourseId.toUpperCase() ||
          String(s.course?.id) === targetCourseId ||
          String(s.course?.code).toUpperCase() === targetCourseId.toUpperCase())
    );

    if (existing?.id) {
      const updateRes = await backendFetch(`sessions/${encodeURIComponent(existing.id)}`, {
        method: "PUT",
        body: JSON.stringify({
          title: SYLLABUS_MARKER_TITLE,
          room: SYLLABUS_MARKER_ROOM,
          status: "SYLLABUS",
          notes: encodedNotes,
        }),
      });
      const updateData = await updateRes.json().catch(() => null);
      return NextResponse.json(
        updateData || { success: updateRes.ok },
        { status: updateRes.status }
      );
    }

    const createRes = await backendFetch("sessions", {
      method: "POST",
      body: JSON.stringify({
        courseId: targetCourseId,
        title: SYLLABUS_MARKER_TITLE,
        sessionDate: "2026-09-01",
        startTime: "08:00",
        endTime: "10:00",
        room: SYLLABUS_MARKER_ROOM,
        status: "SYLLABUS",
        notes: encodedNotes,
      }),
    });
    const createData = await createRes.json().catch(() => null);
    return NextResponse.json(
      createData || { success: createRes.ok },
      { status: createRes.status }
    );
  }

  const payload = {
    ...body,
    notes: encodedNotes,
  };

  const res = await backendFetch("sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (res.ok && data?.session) {
    const normalized = normalizeSessionToBlogOrLesson(data.session);
    if (normalized) upsertBlogCacheItem(normalized);
  }
  return NextResponse.json(data || { success: res.ok }, { status: res.status });
}

async function handleUpdateOrDelete(req: NextRequest, method: "PUT" | "PATCH" | "DELETE") {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const urlId = req.nextUrl.searchParams.get("id");
  const body = method === "DELETE" ? null : await req.json().catch(() => null);
  const sessionId = String(urlId || body?.id || "");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  // Verify Course Leader owns this session's course
  if (scope.isCourseLeader) {
    const listRes = await backendFetch("sessions");
    const listData = await listRes.json().catch(() => null);
    const allSessions: any[] = Array.isArray(listData?.sessions) ? listData.sessions : [];
    const targetSession = allSessions.find((s) => String(s.id) === sessionId);
    if (
      !targetSession ||
      (!scope.matchesCourse(targetSession.courseId) &&
        !scope.matchesCourse(targetSession.courseCode) &&
        !scope.matchesCourse(targetSession.course?.code))
    ) {
      return NextResponse.json(
        { error: "អ្នកអាចកែប្រែ ឬលុបមេរៀនសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
        { status: 403 }
      );
    }
  }

  if (method === "DELETE") {
    const res = await backendFetch(`sessions/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => null);
    removeBlogCacheItem(sessionId);
    return NextResponse.json(data || { success: res.ok }, { status: res.status });
  }

  const userSession = await getSession();
  const updatePayload: Record<string, any> = { ...body };
  if (
    "notes" in updatePayload ||
    "richContent" in updatePayload ||
    "attachments" in updatePayload ||
    "visibility" in updatePayload ||
    "thumbnailUrl" in updatePayload
  ) {
    const resolvedAuthor = resolveAuthorFields({
      authorId: userSession?.id,
      authorStudentId: userSession?.studentId || undefined,
      authorNameKh: userSession?.fullNameKh,
      authorNameEn: userSession?.fullNameEn,
      authorRole: scope.isSystemAdmin ? "គណៈកម្មការ STJ" : "ប្រធានមុខវិជ្ជា",
      courseCode: updatePayload.courseCode || updatePayload.courseId,
    });
    updatePayload.notes = encodeRichNotes({
      notes: updatePayload.notes,
      richContent: updatePayload.richContent,
      attachments: updatePayload.attachments,
      visibility: updatePayload.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
      thumbnailUrl: updatePayload.thumbnailUrl,
      category: updatePayload.category,
      authorId: resolvedAuthor.authorId,
      authorStudentId: resolvedAuthor.authorStudentId,
      authorNameKh: resolvedAuthor.authorNameKh,
      authorNameEn: resolvedAuthor.authorNameEn,
      authorRole: resolvedAuthor.authorRole,
    });
  }

  const res = await backendFetch(`sessions/${encodeURIComponent(sessionId)}`, {
    method: "PUT",
    body: JSON.stringify(updatePayload),
  });
  const data = await res.json().catch(() => null);
  if (res.ok && data?.session) {
    const normalized = normalizeSessionToBlogOrLesson(data.session);
    if (normalized) upsertBlogCacheItem(normalized);
  }
  return NextResponse.json(data || { success: res.ok }, { status: res.status });
}

export async function PUT(req: NextRequest) {
  return handleUpdateOrDelete(req, "PUT");
}

export async function PATCH(req: NextRequest) {
  return handleUpdateOrDelete(req, "PATCH");
}

export async function DELETE(req: NextRequest) {
  return handleUpdateOrDelete(req, "DELETE");
}
