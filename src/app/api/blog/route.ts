import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";
import {
  BLOG_MARKER_ROOM,
  decodeRichNotes,
  encodeRichNotes,
  getDefaultCourseThumbnail,
} from "@/lib/richContent";
import {
  BlogOrLessonItem,
  getAllBlogAndLessonItems,
  normalizeSessionToBlogOrLesson,
  removeBlogCacheItem,
  syncSessionsToBlogCache,
  upsertBlogCacheItem,
} from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const isAuthenticated = Boolean(session?.id);
  const itemId = req.nextUrl.searchParams.get("id")?.trim();
  const scopeParam = req.nextUrl.searchParams.get("scope") || "public";
  const courseFilter = req.nextUrl.searchParams.get("course")?.trim().toUpperCase();

  let explicitSessions: Record<string, any>[] | undefined;
  let courses: Record<string, any>[] = [];

  if (isAuthenticated) {
    try {
      const res = await backendFetch("sessions");
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (Array.isArray(data?.sessions)) {
          explicitSessions = data.sessions;
          syncSessionsToBlogCache(data.sessions);
        }
        if (Array.isArray(data?.courses)) {
          courses = data.courses;
        }
      }
    } catch {
      // ignore
    }
  }

  const allItems = await getAllBlogAndLessonItems(explicitSessions);

  // Single item lookup (?id=...)
  if (itemId) {
    const found = allItems.find((item) => item.id === itemId);
    if (!found) {
      return NextResponse.json(
        { error: "រកមិនឃើញមេរៀន ឬអត្ថបទនេះទេ (Lesson or article not found)" },
        { status: 404 }
      );
    }

    if (found.visibility === "PRIVATE" && !isAuthenticated) {
      return NextResponse.json(
        {
          error: "មេរៀន ឬអត្ថបទនេះត្រូវបានកំណត់ជាឯកជន (Private សម្រាប់តែសមាជិកក្នុងក្រុម STJ)",
          requiresAuth: true,
          visibility: "PRIVATE",
          title: found.title,
          courseTitleKh: found.courseTitleKh,
          courseCode: found.courseCode,
        },
        { status: 403 }
      );
    }

    const canEdit =
      isAuthenticated &&
      Boolean(
        session?.roles?.some((r: string) =>
          ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "COURSE_LEADER"].includes(r)
        ) ||
          (found.authorId && found.authorId === session?.id) ||
          (found.authorStudentId &&
            session?.studentId &&
            found.authorStudentId.toLowerCase() === session.studentId.toLowerCase())
      );

    return NextResponse.json({
      success: true,
      item: found,
      isAuthenticated,
      canEdit,
    });
  }

  // Filter list
  let filtered = allItems.filter((item) => {
    // Only include BLOG posts OR lessons that have rich content / notes / attachments / public visibility
    const hasContent =
      item.kind === "BLOG" ||
      Boolean(item.richContent && item.richContent.trim().length > 0) ||
      item.attachments.length > 0 ||
      item.visibility === "PUBLIC";

    if (!hasContent) return false;

    if (courseFilter && courseFilter !== "ALL") {
      if (item.courseCode.toUpperCase() !== courseFilter) return false;
    }

    if (scopeParam === "mine" && isAuthenticated) {
      const matchId = item.authorId && item.authorId === session?.id;
      const matchSid =
        item.authorStudentId &&
        session?.studentId &&
        item.authorStudentId.toLowerCase() === session.studentId.toLowerCase();
      return Boolean(matchId || matchSid);
    }

    if (scopeParam === "portal" && isAuthenticated) {
      return true; // Both PUBLIC and PRIVATE items visible to logged-in STJ members
    }

    // Default: public scope
    return item.visibility === "PUBLIC";
  });

  return NextResponse.json({
    success: true,
    items: filtered,
    courses,
    isAuthenticated,
    currentUser: session
      ? {
          id: session.id,
          studentId: session.studentId,
          fullNameKh: session.fullNameKh,
          fullNameEn: session.fullNameEn,
          roles: session.roles,
        }
      : null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: "សូមចូលគណនីជាមុនសិន (Unauthorized)" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !String(body.title || "").trim()) {
    return NextResponse.json(
      { error: "សូមបញ្ចូលចំណងជើងអត្ថបទ ឬមេរៀន (Title is required)" },
      { status: 400 }
    );
  }

  // Resolve a valid courseId from backend sessions if needed
  let targetCourseId = String(body.courseId || "").trim();
  let targetCourseCode = String(body.courseCode || "PROG101").trim().toUpperCase();
  let targetCourseTitle = String(body.courseTitle || "Programming");
  let targetCourseTitleKh = String(body.courseTitleKh || "អត្ថបទចែករំលែក (Blog)");

  try {
    const listRes = await backendFetch("sessions");
    if (listRes.ok) {
      const listData = await listRes.json().catch(() => null);
      const courses: any[] = Array.isArray(listData?.courses) ? listData.courses : [];
      if (courses.length > 0) {
        const matched =
          courses.find(
            (c) =>
              String(c.id) === targetCourseId ||
              String(c.code || "").toUpperCase() === targetCourseCode ||
              String(c.code || "").toUpperCase() === targetCourseId.toUpperCase()
          ) || courses[0];
        if (matched) {
          targetCourseId = String(matched.id);
          targetCourseCode = String(matched.code || targetCourseCode).toUpperCase();
          targetCourseTitle = String(matched.title_en || matched.title || targetCourseTitle);
          targetCourseTitleKh = String(matched.title_kh || matched.title || targetCourseTitleKh);
        }
      }
    }
  } catch {
    // ignore
  }

  const visibility: "PRIVATE" | "PUBLIC" =
    body.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE";
  const thumbnailUrl =
    String(body.thumbnailUrl || "").trim() || getDefaultCourseThumbnail(targetCourseCode);
  const category = String(body.category || targetCourseTitleKh || "អត្ថបទសិក្សា (Study Blog)").trim();
  const roles = Array.isArray(session.roles) ? session.roles : [];
  const authorRole = roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT")
    ? "គណៈកម្មការ STJ"
    : roles.includes("COURSE_LEADER")
    ? "ប្រធានមុខវិជ្ជា (Course Leader)"
    : "សមាជិក STJ (Senior Mentor)";

  const nowIso = new Date().toISOString();
  const todayDate = body.date ? String(body.date).slice(0, 10) : nowIso.slice(0, 10);

  const encodedNotes = encodeRichNotes({
    notes: String(body.summary || body.notes || "").trim(),
    richContent: String(body.richContent || "").trim(),
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    visibility,
    thumbnailUrl,
    category,
    authorId: session.id,
    authorStudentId: session.studentId || "",
    authorNameKh: session.fullNameKh || session.fullNameEn || "សមាជិក STJ",
    authorNameEn: session.fullNameEn || session.fullNameKh || "STJ Member",
    authorRole,
    updatedAt: nowIso,
  });

  let createdId = `blog-${Date.now()}`;

  if (targetCourseId) {
    try {
      const createRes = await backendFetch("sessions", {
        method: "POST",
        body: JSON.stringify({
          courseId: targetCourseId,
          title: String(body.title).trim(),
          sessionDate: todayDate,
          startTime: "08:00",
          endTime: "10:00",
          room: BLOG_MARKER_ROOM,
          status: "COMPLETED",
          notes: encodedNotes,
        }),
      });
      const createData = await createRes.json().catch(() => null);
      if (createRes.ok && createData?.session?.id) {
        createdId = String(createData.session.id);
      }
    } catch {
      // Fallback to local cache ID if backend call fails
    }
  }

  const item: BlogOrLessonItem = {
    id: createdId,
    kind: "BLOG",
    title: String(body.title).trim(),
    summary:
      String(body.summary || body.notes || "").trim() ||
      "អត្ថបទ និងមេរៀនចែករំលែកដោយរៀមច្បង STJ សម្រាប់សិស្សប្អូន។",
    richContent: String(body.richContent || "").trim(),
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    visibility,
    thumbnailUrl,
    category,
    courseId: targetCourseId,
    courseCode: targetCourseCode,
    courseTitle: targetCourseTitle,
    courseTitleKh: targetCourseTitleKh,
    date: todayDate,
    startTime: "08:00",
    endTime: "10:00",
    room: BLOG_MARKER_ROOM,
    status: "COMPLETED",
    authorId: session.id,
    authorStudentId: session.studentId || "",
    authorNameKh: session.fullNameKh || session.fullNameEn || "សមាជិក STJ",
    authorNameEn: session.fullNameEn || session.fullNameKh || "STJ Member",
    authorRole,
    updatedAt: nowIso,
  };

  upsertBlogCacheItem(item);

  return NextResponse.json({
    success: true,
    item,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: "សូមចូលគណនីជាមុនសិន (Unauthorized)" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = String(body?.id || req.nextUrl.searchParams.get("id") || "").trim();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const allItems = await getAllBlogAndLessonItems();
  const existing = allItems.find((i) => i.id === id);

  const scope = await resolveLeaderScope();
  const isAuthor =
    existing &&
    ((existing.authorId && existing.authorId === session.id) ||
      (existing.authorStudentId &&
        session.studentId &&
        existing.authorStudentId.toLowerCase() === session.studentId.toLowerCase()));

  if (!scope.isSystemAdmin && !scope.isCourseLeader && !isAuthor) {
    return NextResponse.json(
      { error: "អ្នកអាចកែប្រែបានតែអត្ថបទរបស់អ្នកប៉ុណ្ណោះ" },
      { status: 403 }
    );
  }

  const nextVisibility: "PRIVATE" | "PUBLIC" =
    body.visibility === "PUBLIC"
      ? "PUBLIC"
      : body.visibility === "PRIVATE"
      ? "PRIVATE"
      : existing?.visibility || "PRIVATE";

  const nextThumbnail =
    body.thumbnailUrl !== undefined
      ? String(body.thumbnailUrl || "").trim() ||
        getDefaultCourseThumbnail(existing?.courseCode || body.courseCode)
      : existing?.thumbnailUrl || getDefaultCourseThumbnail(body.courseCode);

  const nextTitle =
    body.title !== undefined ? String(body.title).trim() : existing?.title || "មេរៀន STJ";
  const nextSummary =
    body.summary !== undefined
      ? String(body.summary).trim()
      : body.notes !== undefined
      ? String(body.notes).trim()
      : existing?.summary || "";
  const nextRichContent =
    body.richContent !== undefined
      ? String(body.richContent).trim()
      : existing?.richContent || "";
  const nextAttachments = Array.isArray(body.attachments)
    ? body.attachments
    : existing?.attachments || [];
  const nextCategory =
    body.category !== undefined
      ? String(body.category).trim()
      : existing?.category || "អត្ថបទសិក្សា (Blog)";

  const nowIso = new Date().toISOString();

  const encodedNotes = encodeRichNotes({
    notes: nextSummary,
    richContent: nextRichContent,
    attachments: nextAttachments,
    visibility: nextVisibility,
    thumbnailUrl: nextThumbnail,
    category: nextCategory,
    authorId: existing?.authorId || session.id,
    authorStudentId: existing?.authorStudentId || session.studentId || "",
    authorNameKh:
      existing?.authorNameKh || session.fullNameKh || session.fullNameEn || "រៀមច្បង STJ",
    authorNameEn:
      existing?.authorNameEn || session.fullNameEn || session.fullNameKh || "STJ Senior Mentor",
    authorRole: existing?.authorRole || "សមាជិក STJ",
    updatedAt: nowIso,
  });

  // Update backend session if it's a real DB session
  try {
    await backendFetch(`sessions/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({
        title: nextTitle,
        notes: encodedNotes,
      }),
    });
  } catch {
    // ignore
  }

  const updatedItem: BlogOrLessonItem = {
    ...(existing || {
      id,
      kind: "BLOG",
      courseId: String(body.courseId || ""),
      courseCode: String(body.courseCode || "PROG101"),
      courseTitle: "Programming",
      courseTitleKh: "កូដកម្មវិធី",
      date: nowIso.slice(0, 10),
      startTime: "08:00",
      endTime: "10:00",
      room: BLOG_MARKER_ROOM,
      status: "COMPLETED",
      authorId: session.id,
      authorStudentId: session.studentId || "",
      authorNameKh: session.fullNameKh || "សមាជិក STJ",
      authorNameEn: session.fullNameEn || "STJ Member",
      authorRole: "សមាជិក STJ",
    }),
    title: nextTitle,
    summary: nextSummary,
    richContent: nextRichContent,
    attachments: nextAttachments,
    visibility: nextVisibility,
    thumbnailUrl: nextThumbnail,
    category: nextCategory,
    updatedAt: nowIso,
  };

  upsertBlogCacheItem(updatedItem);

  return NextResponse.json({
    success: true,
    item: updatedItem,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = String(req.nextUrl.searchParams.get("id") || "").trim();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const allItems = await getAllBlogAndLessonItems();
  const existing = allItems.find((i) => i.id === id);
  const scope = await resolveLeaderScope();
  const isAuthor =
    existing &&
    ((existing.authorId && existing.authorId === session.id) ||
      (existing.authorStudentId &&
        session.studentId &&
        existing.authorStudentId.toLowerCase() === session.studentId.toLowerCase()));

  if (!scope.isSystemAdmin && !scope.isCourseLeader && !isAuthor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await backendFetch(`sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch {
    // ignore
  }

  removeBlogCacheItem(id);

  return NextResponse.json({ success: true });
}
