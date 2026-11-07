import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { backendFetch } from "@/lib/backendProxy";
import { resolveLeaderScope } from "@/lib/leaderScope";
import {
  BLOG_MARKER_ROOM,
  encodeRichNotes,
  getDefaultCourseThumbnail,
} from "@/lib/richContent";
import {
  BlogOrLessonItem,
  getAllBlogAndLessonItems,
  removeBlogCacheItem,
  syncSessionsToBlogCache,
  upsertBlogCacheItem,
} from "@/lib/blogStore";

export const dynamic = "force-dynamic";

function isExactBlogAuthor(item: BlogOrLessonItem, session: any): boolean {
  if (!session?.id) return false;
  if (item.authorId && String(item.authorId) === String(session.id)) {
    return true;
  }
  if (
    item.authorStudentId &&
    session.studentId &&
    String(item.authorStudentId).toLowerCase() === String(session.studentId).toLowerCase()
  ) {
    return true;
  }
  return false;
}

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

    const isOwner = isExactBlogAuthor(found, session);
    let canEdit = isOwner;

    if (!canEdit && found.kind === "LESSON" && isAuthenticated) {
      const scope = await resolveLeaderScope();
      if (scope.isCourseLeader && scope.matchesCourse(found.courseCode)) {
        canEdit = true;
      }
    }

    // Strict privacy check:
    // - A PRIVATE Blog post can ONLY be viewed by its author (isOwner)
    // - A PRIVATE Lesson can ONLY be viewed by authenticated STJ members
    if (found.visibility === "PRIVATE") {
      if (found.kind === "BLOG" && !isOwner) {
        return NextResponse.json(
          {
            error: "អត្ថបទនេះត្រូវបានកំណត់ជាឯកជន (Private) ដោយម្ចាស់អត្ថបទ។",
            requiresAuth: !isAuthenticated,
            visibility: "PRIVATE",
            title: found.title,
            courseTitleKh: found.courseTitleKh,
            courseCode: found.courseCode,
          },
          { status: 403 }
        );
      }
      if (found.kind === "LESSON" && !isAuthenticated) {
        return NextResponse.json(
          {
            error: "មេរៀននេះត្រូវបានកំណត់ជាឯកជន (Private សម្រាប់តែសមាជិកក្នុងក្រុម STJ)។",
            requiresAuth: true,
            visibility: "PRIVATE",
            title: found.title,
            courseTitleKh: found.courseTitleKh,
            courseCode: found.courseCode,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      item: found,
      isAuthenticated,
      canEdit,
    });
  }

  // Filter list
  const filtered = allItems.filter((item) => {
    if (courseFilter && courseFilter !== "ALL") {
      if (item.courseCode.toUpperCase() !== courseFilter) return false;
    }

    // In /portal/blog ("mine" or "portal"): strictly return ONLY the logged-in user's own Blog posts!
    if (scopeParam === "mine" || scopeParam === "portal") {
      if (!isAuthenticated) return false;
      return item.kind === "BLOG" && isExactBlogAuthor(item, session);
    }

    // Public scope (/blog and Home page): return items explicitly marked PUBLIC that have content
    const hasContent =
      item.kind === "BLOG" ||
      Boolean(item.richContent && item.richContent.trim().length > 0) ||
      item.attachments.length > 0;

    return item.visibility === "PUBLIC" && hasContent;
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
      { error: "សូមបញ្ចូលចំណងជើងអត្ថបទ (Title is required)" },
      { status: 400 }
    );
  }

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
  const category = String(
    body.category || targetCourseTitleKh || "អត្ថបទសិក្សា (Study Blog)"
  ).trim();
  const roles = Array.isArray(session.roles) ? session.roles : [];
  const authorRole =
    roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT")
      ? "គណៈកម្មការ STJ"
      : roles.includes("COURSE_LEADER")
      ? "ប្រធានមុខវិជ្ជា"
      : "សមាជិក STJ";

  const nowIso = new Date().toISOString();
  const todayDate = body.date ? String(body.date).slice(0, 10) : nowIso.slice(0, 10);

  const authorNameKh = session.fullNameKh || session.fullNameEn || "សមាជិក STJ";
  const authorNameEn = session.fullNameEn || session.fullNameKh || "STJ Member";

  const encodedNotes = encodeRichNotes({
    notes: String(body.summary || body.notes || "").trim(),
    richContent: String(body.richContent || "").trim(),
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    visibility,
    thumbnailUrl,
    category,
    authorId: String(session.id),
    authorStudentId: String(session.studentId || ""),
    authorNameKh,
    authorNameEn,
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
      "អត្ថបទ និងមេរៀនចែករំលែកដោយសមាជិក STJ សម្រាប់សិស្សប្អូន។",
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
    authorId: String(session.id),
    authorStudentId: String(session.studentId || ""),
    authorNameKh,
    authorNameEn,
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

  if (!existing) {
    return NextResponse.json({ error: "រកមិនឃើញអត្ថបទនេះទេ" }, { status: 404 });
  }

  const isOwner = isExactBlogAuthor(existing, session);

  // Strict rule: For BLOG posts, ONLY the exact author who posted it can edit or toggle Private/Public!
  if (existing.kind === "BLOG") {
    if (!isOwner) {
      return NextResponse.json(
        {
          error:
            "គ្មានអ្នកណាម្នាក់អាចកែប្រែ ឬប្តូរ Private/Public លើអត្ថបទ Blog របស់អ្នកដទៃបានឡើយ។",
        },
        { status: 403 }
      );
    }
  } else {
    // For LESSON items, only the author or the assigned Course Leader of that course can update
    const scope = await resolveLeaderScope();
    const canManageLesson =
      isOwner || (scope.isCourseLeader && scope.matchesCourse(existing.courseCode));
    if (!canManageLesson) {
      return NextResponse.json(
        { error: "អ្នកអាចកែប្រែបានតែមេរៀនក្នុងមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ។" },
        { status: 403 }
      );
    }
  }

  const nextVisibility: "PRIVATE" | "PUBLIC" =
    body.visibility === "PUBLIC"
      ? "PUBLIC"
      : body.visibility === "PRIVATE"
      ? "PRIVATE"
      : existing.visibility || "PRIVATE";

  const nextThumbnail =
    body.thumbnailUrl !== undefined
      ? String(body.thumbnailUrl || "").trim() ||
        getDefaultCourseThumbnail(existing.courseCode || body.courseCode)
      : existing.thumbnailUrl || getDefaultCourseThumbnail(body.courseCode);

  const nextTitle =
    body.title !== undefined ? String(body.title).trim() : existing.title || "មេរៀន STJ";
  const nextSummary =
    body.summary !== undefined
      ? String(body.summary).trim()
      : body.notes !== undefined
      ? String(body.notes).trim()
      : existing.summary || "";
  const nextRichContent =
    body.richContent !== undefined
      ? String(body.richContent).trim()
      : existing.richContent || "";
  const nextAttachments = Array.isArray(body.attachments)
    ? body.attachments
    : existing.attachments || [];
  const nextCategory =
    body.category !== undefined
      ? String(body.category).trim()
      : existing.category || "អត្ថបទសិក្សា (Blog)";

  const nowIso = new Date().toISOString();

  const authorId = existing.authorId || String(session.id);
  const authorStudentId = existing.authorStudentId || String(session.studentId || "");
  const authorNameKh =
    existing.authorNameKh && existing.authorNameKh !== "សមាជិក STJ"
      ? existing.authorNameKh
      : session.fullNameKh || session.fullNameEn || "សមាជិក STJ";
  const authorNameEn =
    existing.authorNameEn && existing.authorNameEn !== "STJ Member"
      ? existing.authorNameEn
      : session.fullNameEn || session.fullNameKh || "STJ Member";

  const encodedNotes = encodeRichNotes({
    notes: nextSummary,
    richContent: nextRichContent,
    attachments: nextAttachments,
    visibility: nextVisibility,
    thumbnailUrl: nextThumbnail,
    category: nextCategory,
    authorId,
    authorStudentId,
    authorNameKh,
    authorNameEn,
    authorRole: existing.authorRole || "សមាជិក STJ",
    updatedAt: nowIso,
  });

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
    ...existing,
    title: nextTitle,
    summary: nextSummary,
    richContent: nextRichContent,
    attachments: nextAttachments,
    visibility: nextVisibility,
    thumbnailUrl: nextThumbnail,
    category: nextCategory,
    authorId,
    authorStudentId,
    authorNameKh,
    authorNameEn,
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
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = isExactBlogAuthor(existing, session);
  if (!isOwner) {
    return NextResponse.json(
      { error: "អ្នកអាចលុបបានតែអត្ថបទដែលអ្នកជាអ្នកបង្កើតផ្ទាល់ប៉ុណ្ណោះ។" },
      { status: 403 }
    );
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
