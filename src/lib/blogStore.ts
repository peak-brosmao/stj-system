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
      return {
        items: parsed?.items && typeof parsed.items === "object" ? parsed.items : {},
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
  const courseCode = s.course?.code || s.courseCode || "PROG101";
  const courseTitle = s.course?.title_en || s.course?.title_kh || s.courseTitle || "General";
  const courseTitleKh = s.course?.title_kh || s.course?.title_en || s.courseTitle || "មុខវិជ្ជាទូទៅ";
  const richContent = decoded.richContent || "";
  const notes = decoded.notes || "";
  const attachments = Array.isArray(decoded.attachments) ? decoded.attachments : [];

  // For regular lessons without rich content, notes, or attachments, keep them as LESSON items
  const dateStr = s.date ? String(s.date).slice(0, 10) : new Date().toISOString().slice(0, 10);
  const snippet = extractPlainTextSnippet(richContent, notes, 180);

  return {
    id: String(s.id),
    kind: isBlog ? "BLOG" : "LESSON",
    title: String(s.title || "មេរៀន STJ"),
    summary: notes || snippet || "មេរៀន និងឯកសារសិក្សាដែលរៀបចំដោយរៀមច្បង STJ សម្រាប់សិស្សប្អូន ITC។",
    richContent: richContent || (notes ? `<p>${notes}</p>` : ""),
    attachments,
    visibility: decoded.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
    thumbnailUrl: decoded.thumbnailUrl || getDefaultCourseThumbnail(courseCode),
    category: decoded.category || (isBlog ? "អត្ថបទចែករំលែក (Blog)" : courseTitle),
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
    authorNameKh: decoded.authorNameKh || "រៀមច្បង STJ (Senior Mentor)",
    authorNameEn: decoded.authorNameEn || "STJ Senior Mentor",
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

const DEFAULT_SHOWCASE_ITEMS: BlogOrLessonItem[] = [
  {
    id: "stj-guide-c-programming-101",
    kind: "BLOG",
    title: "មេរៀនទី១៖ មូលដ្ឋានគ្រឹះភាសា C និងការរៀបចំ Algorithm សម្រាប់និស្សិតឆ្នាំទី១",
    summary:
      "ស្វែងយល់អំពីរចនាសម្ព័ន្ធកូដ C ដំបូង ការប្រើប្រាស់អថេរ (Variables) និងដំណាក់កាលដោះស្រាយបញ្ហា (Algorithm & Flowchart) សម្រាប់សិស្សប្អូនឆ្នាំមូលដ្ឋាន ITC។",
    richContent: `<h2>១. សេចក្តីផ្តើមអំពីកម្មវិធីកុំព្យូទ័រ (Introduction to C Programming)</h2>
<p>ភាសា <strong>C Programming</strong> គឺជាមូលដ្ឋានគ្រឹះដ៏សំខាន់បំផុតសម្រាប់និស្សិតវិស្វកម្មនៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។ វាជួយឱ្យយើងយល់ច្បាស់ពីដំណើរការ Memory, Logic និងការបង្កើត Algorithm ប្រកបដោយប្រសិទ្ធភាព។</p>
<h3>២. ដំណាក់កាលនៃការដោះស្រាយបញ្ហា (Algorithm Steps)</h3>
<ul>
  <li><strong>ជំហានទី១៖</strong> កំណត់ និងវិភាគបញ្ហាឱ្យបានច្បាស់លាស់ (Input / Output)។</li>
  <li><strong>ជំហានទី២៖</strong> រៀបចំដំណោះស្រាយជាលំដាប់ជំហាន (Pseudocode ឬ Flowchart)។</li>
  <li><strong>ជំហានទី៣៖</strong> បម្លែងទៅជាកូដក្នុងកម្មវិធី (Coding in C)។</li>
  <li><strong>ជំហានទី៤៖</strong> ដំណើរការ និងពិនិត្យកំហុស (Testing &amp; Debugging)។</li>
</ul>
<h3>៣. កូដគំរូដំបូង (First C Program in VS Code)</h3>
<pre data-lang="c">#include &lt;stdio.h&gt;

int main() {
    int year = 1;
    printf("សួស្តីពិភពលោក! សូមស្វាគមន៍មកកាន់ការសិក្សា C Programming ឆ្នាំទី %d!\\n", year);
    return 0;
}</pre>
<p>នៅពេលយើង Compile និង Run កូដខាងលើ តាមរយៈ <code>gcc main.c -o main</code> នោះវានឹងបង្ហាញសារស្វាគមន៍នៅលើ Terminal។</p>`,
    attachments: [],
    visibility: "PUBLIC",
    thumbnailUrl: "/images/gallery/IMG_2847.JPG",
    category: "Programming (C/C++)",
    courseId: "",
    courseCode: "PROG101",
    courseTitle: "Programming",
    courseTitleKh: "កូដកម្មវិធី (Programming)",
    date: "2026-11-03",
    startTime: "11:30",
    endTime: "13:00",
    room: "SF2",
    status: "COMPLETED",
    authorId: "stj-senior-prog",
    authorStudentId: "e20240704",
    authorNameKh: "លាង ជីងហេង",
    authorNameEn: "LEANG CHINGHENG",
    authorRole: "ប្រធានមុខវិជ្ជា Programming",
    updatedAt: "2026-11-03T11:30:00.000Z",
  },
  {
    id: "stj-guide-calculus-physics-latex",
    kind: "BLOG",
    title: "សង្ខេបរូបមន្តគណិតវិទ្យាវិភាគ និងរូបវិទ្យាមេកានិច (Calculus & Classical Mechanics)",
    summary:
      "បណ្ដុំរូបមន្តលីមីត ដេរីវេ អាំងតេក្រាលកំណត់ និងច្បាប់ចលនា Newton សម្រាប់ត្រៀមប្រឡងពាក់កណ្តាលឆមាសរបស់សិស្សប្អូនឆ្នាំទី១។",
    richContent: `<h2>១. រូបមន្តគណិតវិទ្យាវិភាគ (Calculus I Fundamentals)</h2>
<p>ខាងក្រោមនេះគឺជារូបមន្តគ្រឹះសំខាន់ៗដែលសិស្សប្អូនត្រូវចងចាំសម្រាប់ដោះស្រាយលំហាត់លីមីត និងអាំងតេក្រាល៖</p>
<p>$$\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$$</p>
<p>រូបមន្តសមីការដឺក្រេទី២ និងលីមីតត្រីកោណមាត្រគ្រឹះ៖</p>
<p>$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad , \\quad \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$</p>
<h2>២. រូបវិទ្យាមេកានិច និងថាមពលស៊ីនេទិច (Mechanics &amp; Energy)</h2>
<p>តាមច្បាប់ទី២ នៃចលនារបស់ Newton កម្លាំងផ្គួបដែលមានអំពើលើអង្គធាតុស្មើនឹងផលគុណរវាងម៉ាស និងសំទុះ៖</p>
<p>$$\\sum \\vec{F} = m\\vec{a} = m\\frac{d\\vec{v}}{dt} \\quad , \\quad E_k = \\frac{1}{2}mv^2$$</p>
<pre data-lang="python"># គណនាថាមពលស៊ីនេទិចដោយប្រើ Python
def kinetic_energy(mass: float, velocity: float) -&gt; float:
    return 0.5 * mass * (velocity ** 2)

print("Ek =", kinetic_energy(2.5, 10.0), "Joules")</pre>`,
    attachments: [],
    visibility: "PUBLIC",
    thumbnailUrl: "/images/gallery/IMG_2849.JPG",
    category: "គណិតវិទ្យា & រូបវិទ្យា",
    courseId: "",
    courseCode: "MATH101",
    courseTitle: "Mathematics & Physics",
    courseTitleKh: "គណិតវិទ្យា និងរូបវិទ្យា",
    date: "2026-11-05",
    startTime: "11:30",
    endTime: "13:00",
    room: "SF1 & SF2",
    status: "COMPLETED",
    authorId: "stj-senior-math",
    authorStudentId: "e20251455",
    authorNameKh: "ពៀក ប្រុសម៉ៅ",
    authorNameEn: "PEAK BROSMAO",
    authorRole: "សមាជិក STJ",
    updatedAt: "2026-11-05T11:30:00.000Z",
  },
];

export async function getAllBlogAndLessonItems(
  explicitSessions?: Record<string, any>[]
): Promise<BlogOrLessonItem[]> {
  const cache = readLocalBlogCache();
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

  // Load cached/synced items first
  const refreshedCache = readLocalBlogCache();
  for (const [id, item] of Object.entries(refreshedCache.items)) {
    if (!refreshedCache.deletedIds.includes(id)) {
      mergedMap.set(id, item);
    }
  }

  // Overlay live sessions if provided
  if (Array.isArray(sessions)) {
    for (const s of sessions) {
      const item = normalizeSessionToBlogOrLesson(s);
      if (item && !refreshedCache.deletedIds.includes(item.id)) {
        mergedMap.set(item.id, item);
      }
    }
  }

  // Ensure default showcase items are always available for public reading unless deleted
  for (const def of DEFAULT_SHOWCASE_ITEMS) {
    if (!mergedMap.has(def.id) && !refreshedCache.deletedIds.includes(def.id)) {
      mergedMap.set(def.id, def);
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) =>
    String(b.date || b.updatedAt).localeCompare(String(a.date || a.updatedAt))
  );
}
