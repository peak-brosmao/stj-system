export interface CourseAttachment {
  id: string;
  name: string;
  url: string;
  key?: string;
  type: "pdf" | "video" | "document" | "link";
  size?: number;
  mimeType?: string;
  uploadedAt?: string;
}

export interface RichNotesPayload {
  notes: string;
  richContent: string;
  attachments: CourseAttachment[];
  visibility?: "PRIVATE" | "PUBLIC";
  thumbnailUrl?: string;
  category?: string;
  authorId?: string;
  authorStudentId?: string;
  authorNameKh?: string;
  authorNameEn?: string;
  authorRole?: string;
  updatedAt?: string;
}

const PREFIX = "STJ_RICH_V1:";

export function encodeRichNotes(payload: Partial<RichNotesPayload>): string {
  const cleanNotes = (payload.notes || "").trim();
  const cleanRich = (payload.richContent || "").trim();
  const cleanAttachments = Array.isArray(payload.attachments) ? payload.attachments : [];
  const hasMetadata = Boolean(
    payload.visibility ||
      payload.thumbnailUrl ||
      payload.category ||
      payload.authorId ||
      payload.authorStudentId ||
      payload.authorNameKh ||
      payload.authorNameEn
  );

  if (!cleanRich && cleanAttachments.length === 0 && !hasMetadata) {
    return cleanNotes;
  }

  const data: RichNotesPayload = {
    notes: cleanNotes,
    richContent: cleanRich,
    attachments: cleanAttachments,
    visibility: payload.visibility || "PRIVATE",
    thumbnailUrl: (payload.thumbnailUrl || "").trim() || undefined,
    category: (payload.category || "").trim() || undefined,
    authorId: payload.authorId || undefined,
    authorStudentId: payload.authorStudentId || undefined,
    authorNameKh: payload.authorNameKh || undefined,
    authorNameEn: payload.authorNameEn || undefined,
    authorRole: payload.authorRole || undefined,
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };

  const json = JSON.stringify(data);
  if (typeof Buffer !== "undefined") {
    return PREFIX + Buffer.from(json, "utf8").toString("base64");
  }
  return PREFIX + btoa(unescape(encodeURIComponent(json)));
}

export function decodeRichNotes(raw: string | null | undefined): RichNotesPayload {
  if (!raw || typeof raw !== "string") {
    return {
      notes: "",
      richContent: "",
      attachments: [],
      visibility: "PRIVATE",
    };
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith(PREFIX)) {
    try {
      const b64 = trimmed.slice(PREFIX.length);
      const json =
        typeof Buffer !== "undefined"
          ? Buffer.from(b64, "base64").toString("utf8")
          : decodeURIComponent(escape(atob(b64)));
      const parsed = JSON.parse(json);
      return {
        notes: typeof parsed?.notes === "string" ? parsed.notes : "",
        richContent: typeof parsed?.richContent === "string" ? parsed.richContent : "",
        attachments: Array.isArray(parsed?.attachments) ? parsed.attachments : [],
        visibility: parsed?.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
        thumbnailUrl:
          typeof parsed?.thumbnailUrl === "string" && parsed.thumbnailUrl.trim()
            ? parsed.thumbnailUrl.trim()
            : undefined,
        category: typeof parsed?.category === "string" ? parsed.category : undefined,
        authorId: typeof parsed?.authorId === "string" ? parsed.authorId : undefined,
        authorStudentId:
          typeof parsed?.authorStudentId === "string" ? parsed.authorStudentId : undefined,
        authorNameKh:
          typeof parsed?.authorNameKh === "string" ? parsed.authorNameKh : undefined,
        authorNameEn:
          typeof parsed?.authorNameEn === "string" ? parsed.authorNameEn : undefined,
        authorRole: typeof parsed?.authorRole === "string" ? parsed.authorRole : undefined,
        updatedAt: typeof parsed?.updatedAt === "string" ? parsed.updatedAt : undefined,
      };
    } catch {
      return {
        notes: "",
        richContent: "",
        attachments: [],
        visibility: "PRIVATE",
      };
    }
  }

  return {
    notes: trimmed,
    richContent: "",
    attachments: [],
    visibility: "PRIVATE",
  };
}

export const SYLLABUS_MARKER_TITLE = "__COURSE_SYLLABUS__";
export const SYLLABUS_MARKER_ROOM = "__SYLLABUS__";
export const VAULT_MARKER_TITLE = "__STJ_AUTH_VAULT__";
export const VAULT_MARKER_ROOM = "__VAULT__";
export const BLOG_MARKER_ROOM = "__BLOG__";

export function isVaultSession(session: Record<string, any> | null | undefined): boolean {
  if (!session) return false;
  return (
    session.status === "CREDENTIAL_VAULT" ||
    session.room === VAULT_MARKER_ROOM ||
    session.title === VAULT_MARKER_TITLE
  );
}

export function isBlogSession(session: Record<string, any> | null | undefined): boolean {
  if (!session) return false;
  return (
    session.kind === "BLOG" ||
    session.room === BLOG_MARKER_ROOM ||
    session.room === "__BLOG__" ||
    session.status === "BLOG_POST" ||
    (typeof session.room === "string" && session.room.toUpperCase().includes("BLOG")) ||
    (typeof session.id === "string" &&
      (session.id.startsWith("blog-") || session.id.startsWith("post-")))
  );
}

export function isSyllabusSession(session: Record<string, any> | null | undefined): boolean {
  if (!session) return false;
  if (isVaultSession(session) || isBlogSession(session)) return true;
  return (
    session.status === "SYLLABUS" ||
    session.room === SYLLABUS_MARKER_ROOM ||
    session.title === SYLLABUS_MARKER_TITLE
  );
}

export function extractPlainTextSnippet(
  richContent?: string | null,
  notes?: string | null,
  maxLength = 150
): string {
  const source = (richContent && richContent.trim()) || (notes && notes.trim()) || "";
  if (!source) return "";
  const plain = source
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr|br)>/gi, " • ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/(\s*•\s*)+/g, " • ")
    .replace(/^(\s*•\s*)+|(\s*•\s*)+$/g, "")
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "…";
}

export function getDefaultCourseThumbnail(courseCode?: string): string {
  const code = String(courseCode || "").toUpperCase();
  if (code.includes("PROG")) return "/images/gallery/IMG_2847.JPG";
  if (code.includes("MATH")) return "/images/gallery/IMG_2849.JPG";
  if (code.includes("PHYS")) return "/images/gallery/IMG_2851.JPG";
  if (code.includes("CHEM")) return "/images/gallery/IMG_2854.JPG";
  return "/images/gallery/IMG_2847.JPG";
}
