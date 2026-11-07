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
}

const PREFIX = "STJ_RICH_V1:";

export function encodeRichNotes(payload: Partial<RichNotesPayload>): string {
  const cleanNotes = (payload.notes || "").trim();
  const cleanRich = (payload.richContent || "").trim();
  const cleanAttachments = Array.isArray(payload.attachments) ? payload.attachments : [];

  if (!cleanRich && cleanAttachments.length === 0) {
    return cleanNotes;
  }

  const data: RichNotesPayload = {
    notes: cleanNotes,
    richContent: cleanRich,
    attachments: cleanAttachments,
  };

  const json = JSON.stringify(data);
  if (typeof Buffer !== "undefined") {
    return PREFIX + Buffer.from(json, "utf8").toString("base64");
  }
  return PREFIX + btoa(unescape(encodeURIComponent(json)));
}

export function decodeRichNotes(raw: string | null | undefined): RichNotesPayload {
  if (!raw || typeof raw !== "string") {
    return { notes: "", richContent: "", attachments: [] };
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
      };
    } catch {
      return { notes: "", richContent: "", attachments: [] };
    }
  }

  return {
    notes: trimmed,
    richContent: "",
    attachments: [],
  };
}

export const SYLLABUS_MARKER_TITLE = "__COURSE_SYLLABUS__";
export const SYLLABUS_MARKER_ROOM = "__SYLLABUS__";

export function isSyllabusSession(session: Record<string, any> | null | undefined): boolean {
  if (!session) return false;
  return (
    session.status === "SYLLABUS" ||
    session.room === SYLLABUS_MARKER_ROOM ||
    session.title === SYLLABUS_MARKER_TITLE
  );
}
