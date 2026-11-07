import fs from "fs";
import os from "os";
import path from "path";
import {
  CourseAttachment,
  decodeRichNotes,
  extractPlainTextSnippet,
  getDefaultCourseThumbnail,
  isBlogSession,
  isVaultSession,
  SYLLABUS_MARKER_ROOM,
  SYLLABUS_MARKER_TITLE,
} from "@/lib/richContent";
import { fetchSessionsWithServiceToken } from "@/lib/passwordVault";

export interface BlogOrLessonItem {
  id: string;
  kind: "BLOG" | "LESSON";
  title: string;
  summary: string;
  richContent: string;
  attachments: CourseAttachment[];
  visibility: "PRIVATE" | "PUBLIC";
  thumbnailUrl: string;
  category: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  courseTitleKh: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  authorId: string;
  authorStudentId: string;
  authorNameKh: string;
  authorNameEn: string;
  authorRole: string;
  updatedAt: string;
}

const BLOG_CACHE_PATH = path.join(os.tmpdir(), "stj-public-blog-cache.json");
const LEGACY_DEMO_IDS = new Set([
  "stj-guide-c-programming-101",
  "stj-guide-calculus-physics-latex",
]);

interface BlogCacheFile {
  items: Record<string, BlogOrLessonItem>;
  deletedIds: string[];
  updatedAt: string;
}

function readLocalBlogCache(): BlogCacheFile {
  try {
    if (fs.existsSync(BLOG_CACHE_PATH)) {
      const raw = fs.readFileSync(BLOG_CACHE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      const rawItems =
        parsed?.items && typeof parsed.items === "object" ? parsed.items : {};
      const cleanedItems: Record<string, BlogOrLessonItem> = {};
      for (const [k, v] of Object.entries(rawItems)) {
        if (!LEGACY_DEMO_IDS.has(k) && v && typeof v === "object") {
          cleanedItems[k] = v as BlogOrLessonItem;
        }
      }
      return {
        items: cleanedItems,
        deletedIds: Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [],
        updatedAt: parsed?.updatedAt || new Date().toISOString(),
      };
    }
  } catch {
    // ignore
  }
  return {
    items: {},
    deletedIds: [],
    updatedAt: new Date().toISOString(),
  };
}

function writeLocalBlogCache(cache: BlogCacheFile): void {
  try {
    fs.writeFileSync(BLOG_CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function normalizeSessionToBlogOrLesson(s: Record<string, any>): BlogOrLessonItem | null {
  if (!s || !s.id) return null;
  const sid = String(s.id);
  if (LEGACY_DEMO_IDS.has(sid)) return null;
  if (isVaultSession(s)) return null;
  if (
    s.status === "SYLLABUS" ||
    s.room === SYLLABUS_MARKER_ROOM ||
    s.title === SYLLABUS_MARKER_TITLE
  ) {
    return null;
  }

  const decoded = decodeRichNotes(s.notes);
  const isBlog = isBlogSession(s);
  const courseCode = String(s.course?.code || s.courseCode || "PROG101").toUpperCase();
  const courseTitle = s.course?.title_en || s.course?.title_kh || s.courseTitle || "General";
  const courseTitleKh =
    s.course?.title_kh || s.course?.title_en || s.courseTitle || "មុខវិជ្ជាទូទៅ";
  const richContent = decoded.richContent || "";
  const notes = decoded.notes || "";
  const attachments = Array.isArray(decoded.attachments) ? decoded.attachments : [];

  const dateStr = s.date
    ? String(s.date).slice(0, 10)
    : s.sessionDate
    ? String(s.sessionDate).slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const snippet = extractPlainTextSnippet(richContent, notes, 180);

  return {
    id: sid,
    kind: isBlog ? "BLOG" : "LESSON",
    title: String(s.title || "មេរៀន STJ"),
    summary:
      notes || snippet || "មេរៀន និងឯកសារសិក្សាដែលរៀបចំដោយសមាជិក STJ សម្រាប់សិស្សប្អូន ITC។",
    richContent: richContent || (notes ? `<p>${notes}</p>` : ""),
    attachments,
    visibility: decoded.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
    thumbnailUrl: decoded.thumbnailUrl || getDefaultCourseThumbnail(courseCode),
    category: decoded.category || (isBlog ? "អត្ថបទចែករំលែក (Blog)" : courseTitleKh),
    courseId: String(s.course_id || s.courseId || ""),
    courseCode,
    courseTitle,
    courseTitleKh,
    date: dateStr,
    startTime: s.start_time ? String(s.start_time).slice(0, 5) : s.startTime || "08:00",
    endTime: s.end_time ? String(s.end_time).slice(0, 5) : s.endTime || "10:00",
    room: String(s.room || ""),
    status: String(s.status || "SCHEDULED"),
    authorId: decoded.authorId || "",
    authorStudentId: decoded.authorStudentId || "",
    authorNameKh: decoded.authorNameKh || "សមាជិក STJ",
    authorNameEn: decoded.authorNameEn || "STJ Member",
    authorRole: decoded.authorRole || (isBlog ? "សមាជិក STJ" : "ប្រធានមុខវិជ្ជា"),
    updatedAt: decoded.updatedAt || s.updated_at || dateStr,
  };
}

export function syncSessionsToBlogCache(rawSessions: Record<string, any>[]): void {
  if (!Array.isArray(rawSessions)) return;
  const cache = readLocalBlogCache();
  for (const s of rawSessions) {
    const item = normalizeSessionToBlogOrLesson(s);
    if (!item) continue;
    if (cache.deletedIds.includes(item.id)) continue;
    cache.items[item.id] = item;
  }
  cache.updatedAt = new Date().toISOString();
  writeLocalBlogCache(cache);
}

export function upsertBlogCacheItem(item: BlogOrLessonItem): void {
  if (LEGACY_DEMO_IDS.has(item.id)) return;
  const cache = readLocalBlogCache();
  cache.deletedIds = cache.deletedIds.filter((id) => id !== item.id);
  cache.items[item.id] = item;
  cache.updatedAt = new Date().toISOString();
  writeLocalBlogCache(cache);
}

export function removeBlogCacheItem(id: string): void {
  const cache = readLocalBlogCache();
  delete cache.items[id];
  if (!cache.deletedIds.includes(id)) {
    cache.deletedIds.push(id);
  }
  cache.updatedAt = new Date().toISOString();
  writeLocalBlogCache(cache);
}

export async function getAllBlogAndLessonItems(
  explicitSessions?: Record<string, any>[]
): Promise<BlogOrLessonItem[]> {
  let sessions = explicitSessions;
  if (!sessions) {
    try {
      const fetched = await fetchSessionsWithServiceToken();
      if (Array.isArray(fetched) && fetched.length > 0) {
        sessions = fetched;
      }
    } catch {
      // ignore
    }
  }

  if (Array.isArray(sessions) && sessions.length > 0) {
    syncSessionsToBlogCache(sessions);
  }

  const mergedMap = new Map<string, BlogOrLessonItem>();
  const refreshedCache = readLocalBlogCache();

  for (const [id, item] of Object.entries(refreshedCache.items)) {
    if (!refreshedCache.deletedIds.includes(id) && !LEGACY_DEMO_IDS.has(id)) {
      mergedMap.set(id, item);
    }
  }

  if (Array.isArray(sessions)) {
    for (const s of sessions) {
      const item = normalizeSessionToBlogOrLesson(s);
      if (item && !refreshedCache.deletedIds.includes(item.id)) {
        mergedMap.set(item.id, item);
      }
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) =>
    String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt))
  );
}
