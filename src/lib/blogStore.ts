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

export const GENERIC_AUTHOR_NAMES = new Set([
  "",
  "រៀមច្បង STJ (Senior Mentor)",
  "រៀមច្បង STJ",
  "សមាជិក STJ",
  "សមាជិក STJ (Senior Mentor)",
  "ប្រធានមុខវិជ្ជា STJ",
  "ប្រធានមុខវិជ្ជា",
  "ប្រធានក្រុម",
  "STJ Member",
  "STJ Senior Mentor",
  "STJ Course Leader",
  "Course Leader",
]);

const MEMBER_NAME_DIRECTORY: Record<string, { kh: string; en: string }> = {
  e20230969: { kh: "សុខ សេងលី", en: "SOK SENGLY" },
  e20221334: { kh: "ផល ដាវិត", en: "PHAL David" },
  e20240096: { kh: "គ្រួយ អ៊ីខាង", en: "KRUY Ykhang" },
  e20240866: { kh: "ឈិន តុលា", en: "CHHIN TOLA" },
  e20240662: { kh: "ឡាន បូរិន", en: "LAN BORIN" },
  e20241183: { kh: "ប៉ាក់ ច័ន្ទបូរី", en: "PAK CHANBOREY" },
  e20241143: { kh: "វី ពិទូយ", en: "VY PITOU" },
  e20250861: { kh: "ពៅ ជុំរតនៈ", en: "PEOU CHUMRATTANAK" },
  e20250220: { kh: "សុង ស្រីពេជ", en: "SONG SREYPICH" },
  e20251192: { kh: "សុខា អ៊ីអ៊ីង", en: "SOKHA EEING" },
  e20251185: { kh: "តឹក ឈាវវិសាល", en: "TEK CHHEAVVISAL" },
  e20250642: { kh: "អេង ស៊ូអ៊ី", en: "Eng Sou Y" },
  e20221423: { kh: "គឹម រតនៈ", en: "KIM Ratanak" },
  e20221678: { kh: "ប៊ុន សុខបញ្ញា", en: "BUN Sokpanha" },
  e20241028: { kh: "ឡេង ច័ន្ទវង្សា", en: "VONG Sa" },
  e20250175: { kh: "ជាតិ វិសាល", en: "CHEAT Visal" },
  e20251044: { kh: "អ៊ិន សុជាតិ", en: "ORN Socheat" },
  e20251246: { kh: "ម៉ឹង ហាក់", en: "MOEUNG Hak" },
  e20250345: { kh: "ស៊ុំ សុធាវី", en: "SOM Sotheavy" },
  e20250687: { kh: "ហង់ សុជាតា", en: "HANG Socheata" },
  e20250258: { kh: "ជាលី អមរិន្ទ", en: "CHEALY Amrin" },
  e20251290: { kh: "ឈុំ បញ្ញា", en: "CHHUM Panha" },
  e20241375: { kh: "លៀងលី សុខឡេង", en: "LEANGLY Sokleng" },
  e20240704: { kh: "លាង ជីងហេង", en: "LEANG JINGHENG" },
  e20230078: { kh: "ឃន វិចទ័រ", en: "KHORN VICTOR" },
  e20230757: { kh: "ប៉ិន ប៊ុណ្ណាកា", en: "PEN BUNNAKA" },
  e20240672: { kh: "ស៊ឹង វិច្ឆិកា", en: "SOUNG VICHKA" },
  e20240232: { kh: "សេង មិញហាវ", en: "SENG MINGHAO" },
  e20250475: { kh: "ណាំ ម៉េងហួត", en: "NAM MENGHOUT" },
  e20250731: { kh: "ចៃ ជីជូរ", en: "CHAI CHICHOU" },
  e20251399: { kh: "ហាក់ ដូនីឡា", en: "HAK DONYLA" },
  e20251455: { kh: "ពៀក ប្រុសម៉ៅ", en: "PEAK BROSMAO" },
  e20250414: { kh: "ចំរើន ដេន", en: "CHAMROEN DEN" },
  e20240046: { kh: "ខេង លីយូសា", en: "KHENG Lyussa" },
  e20240945: { kh: "ឯល មូហាំម៉ាត់សាហ្វី", en: "EL Muhammadshafi" },
  e20240561: { kh: "ឃឿន ធារី", en: "KHOEUN Theary" },
  e20240670: { kh: "ហាប់ ស៊ីឈាង", en: "HAB Sychheang" },
  e20241214: { kh: "ឌិន ម៉េងហុង", en: "DIN Menghong" },
  e20240124: { kh: "ហួត សំណាង", en: "HOUT Samnang" },
};

const COURSE_DEFAULT_LEADER: Record<string, { studentId: string; kh: string; en: string }> = {
  PROG101: { studentId: "e20240704", kh: "លាង ជីងហេង", en: "LEANG JINGHENG" },
  MATH101: { studentId: "e20221423", kh: "គឹម រតនៈ", en: "KIM Ratanak" },
  PHYS101: { studentId: "e20240096", kh: "គ្រួយ អ៊ីខាង", en: "KRUY Ykhang" },
  CHEM101: { studentId: "e20240046", kh: "ខេង លីយូសា", en: "KHENG Lyussa" },
};

export function resolveRealAuthorIdentity(params: {
  studentId?: string | null;
  email?: string | null;
  nameKh?: string | null;
  nameEn?: string | null;
  courseCode?: string | null;
  isLesson?: boolean;
}): { studentId: string; nameKh: string; nameEn: string } {
  const rawSid = String(
    params.studentId || (params.email ? params.email.split("@")[0] : "") || ""
  )
    .trim()
    .toLowerCase();

  if (rawSid && MEMBER_NAME_DIRECTORY[rawSid]) {
    return {
      studentId: rawSid,
      nameKh: MEMBER_NAME_DIRECTORY[rawSid].kh,
      nameEn: MEMBER_NAME_DIRECTORY[rawSid].en,
    };
  }

  const cleanKh = String(params.nameKh || "").trim();
  const cleanEn = String(params.nameEn || "").trim();

  if (cleanKh && !GENERIC_AUTHOR_NAMES.has(cleanKh)) {
    return {
      studentId: rawSid,
      nameKh: cleanKh,
      nameEn: cleanEn && !GENERIC_AUTHOR_NAMES.has(cleanEn) ? cleanEn : cleanKh,
    };
  }

  const code = String(params.courseCode || "").toUpperCase();
  if (code && COURSE_DEFAULT_LEADER[code]) {
    return {
      studentId: rawSid || COURSE_DEFAULT_LEADER[code].studentId,
      nameKh: COURSE_DEFAULT_LEADER[code].kh,
      nameEn: COURSE_DEFAULT_LEADER[code].en,
    };
  }

  return {
    studentId: rawSid,
    nameKh: cleanKh || cleanEn || "សមាជិក STJ",
    nameEn: cleanEn || cleanKh || "STJ Member",
  };
}

/**
 * Resolve full author fields (id, studentId, Khmer/English name, role) for
 * saving Blog posts and Lessons, so the real writer's name is always stored.
 */
export function resolveAuthorFields(params: {
  authorId?: string | null;
  authorStudentId?: string | null;
  authorNameKh?: string | null;
  authorNameEn?: string | null;
  authorRole?: string | null;
  courseCode?: string | null;
}): {
  authorId: string;
  authorStudentId: string;
  authorNameKh: string;
  authorNameEn: string;
  authorRole: string;
} {
  const resolved = resolveRealAuthorIdentity({
    studentId: params.authorStudentId,
    nameKh: params.authorNameKh,
    nameEn: params.authorNameEn,
    courseCode: params.courseCode,
  });
  return {
    authorId: String(params.authorId || ""),
    authorStudentId: resolved.studentId,
    authorNameKh: resolved.nameKh,
    authorNameEn: resolved.nameEn,
    authorRole: String(params.authorRole || "សមាជិក STJ").replace(/\s*\(Course Leader\)\s*/i, ""),
  };
}

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
          const item = v as BlogOrLessonItem;
          const resolvedAuthor = resolveRealAuthorIdentity({
            studentId: item.authorStudentId,
            nameKh: item.authorNameKh,
            nameEn: item.authorNameEn,
            courseCode: item.courseCode,
            isLesson: item.kind === "LESSON",
          });
          cleanedItems[k] = {
            ...item,
            authorStudentId: resolvedAuthor.studentId || item.authorStudentId,
            authorNameKh: resolvedAuthor.nameKh,
            authorNameEn: resolvedAuthor.nameEn,
          };
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

  const resolvedAuthor = resolveRealAuthorIdentity({
    studentId: decoded.authorStudentId,
    nameKh: decoded.authorNameKh,
    nameEn: decoded.authorNameEn,
    courseCode,
    isLesson: !isBlog,
  });

  return {
    id: sid,
    kind: isBlog ? "BLOG" : "LESSON",
    title: String(s.title || "មេរៀន STJ"),
    summary: snippet || notes || "",
    richContent: richContent || (notes ? `<p>${notes}</p>` : ""),
    attachments,
    visibility: decoded.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
    thumbnailUrl: decoded.thumbnailUrl || getDefaultCourseThumbnail(courseCode),
    category: decoded.category || (isBlog ? "អត្ថបទសិក្សា" : courseTitleKh),
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
    authorStudentId: resolvedAuthor.studentId,
    authorNameKh: resolvedAuthor.nameKh,
    authorNameEn: resolvedAuthor.nameEn,
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

export function removeBlogCacheItem(id: void | string): void {
  if (!id) return;
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
