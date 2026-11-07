"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table,
  Minus,
  Info,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Palette,
  Highlighter,
  Type,
  Undo2,
  Redo2,
  Eraser,
  UploadCloud,
  FileText,
  Film,
  FileArchive,
  ExternalLink,
  Trash2,
  Plus,
  Cloud,
  Eye,
  Edit3,
  FileCode,
  X,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import type { CourseAttachment } from "@/lib/richContent";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  attachments: CourseAttachment[];
  onAttachmentsChange: (items: CourseAttachment[]) => void;
  courseCode?: string;
  placeholder?: string;
  minHeightClass?: string;
  hideInlineAttachments?: boolean;
}

const TEXT_COLORS = [
  { label: "Default", color: "#e2e8f0" },
  { label: "Blue", color: "#3b82f6" },
  { label: "Cyan", color: "#06b6d4" },
  { label: "Emerald", color: "#10b981" },
  { label: "Amber", color: "#f59e0b" },
  { label: "Orange", color: "#f97316" },
  { label: "Red", color: "#ef4444" },
  { label: "Purple", color: "#a855f7" },
  { label: "Pink", color: "#ec4899" },
  { label: "Slate", color: "#64748b" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", color: "transparent" },
  { label: "Yellow", color: "rgba(234, 179, 8, 0.28)" },
  { label: "Green", color: "rgba(16, 185, 129, 0.28)" },
  { label: "Blue", color: "rgba(59, 130, 246, 0.28)" },
  { label: "Purple", color: "rgba(168, 85, 247, 0.28)" },
  { label: "Red", color: "rgba(239, 68, 68, 0.28)" },
  { label: "Cyan", color: "rgba(6, 182, 212, 0.28)" },
];

export function detectAttachmentType(
  fileNameOrUrl: string,
  mimeType?: string
): "pdf" | "video" | "document" | "link" {
  const lower = fileNameOrUrl.toLowerCase();
  const mime = (mimeType || "").toLowerCase();
  if (mime.includes("pdf") || lower.endsWith(".pdf")) return "pdf";
  if (
    mime.startsWith("video/") ||
    /\.(mp4|webm|mov|mkv|avi|m4v)(\?|$)/.test(lower) ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be")
  ) {
    return "video";
  }
  if (/\.(doc|docx|ppt|pptx|xls|xlsx|zip|rar|txt|csv)(\?|$)/.test(lower)) {
    return "document";
  }
  return mime ? "document" : "link";
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Converts YouTube watch/short URLs, Google Drive links, or raw <iframe> strings into
 * a safe, responsive 16:9 embed HTML snippet.
 */
export function buildResponsiveEmbedHtml(rawInput: string, customTitle?: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return "";

  // 1. If the input is already an <iframe ...>...</iframe> tag
  if (/^<iframe[\s\S]*<\/iframe>$/i.test(trimmed)) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    const titleMatch = trimmed.match(/title=["']([^"']+)["']/i);
    const src = srcMatch?.[1] || "";
    const title = customTitle || titleMatch?.[1] || "Embedded Media";
    if (src) {
      return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${src}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p><br/></p>`;
    }
  }

  // 2. Check if it's a YouTube URL (watch?v=, youtu.be/, shorts/, embed/)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    const embedSrc = `https://www.youtube.com/embed/${videoId}`;
    const title = customTitle || "YouTube Video Lesson";
    return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${embedSrc}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p><br/></p>`;
  }

  // 3. Direct MP4 / WebM / MOV video URL
  if (/\.(mp4|webm|mov)(\?|$)/i.test(trimmed)) {
    return `<div style="margin:14px 0;"><video src="${trimmed}" controls preload="metadata" style="width:100%;max-height:460px;border-radius:12px;background:#000;"></video></div><p><br/></p>`;
  }

  // 4. Generic URL (Google Drive preview, PDF, Vimeo, etc.)
  let finalUrl = trimmed;
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (gdriveMatch?.[1]) {
    finalUrl = `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }
  const title = customTitle || "Embedded Resource";
  return `<div class="stj-embed-wrapper" style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;border:1px solid rgba(148,163,184,0.25);background:#0f172a;"><iframe src="${finalUrl}" title="${title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div><p><br/></p>`;
}

/**
 * Unescapes any `&lt;iframe ...&gt;&lt;/iframe&gt;` that was accidentally pasted as literal text
 * so it renders as an interactive responsive video/iframe.
 */
export function normalizeRichHtml(html?: string | null): string {
  if (!html) return "";
  return html.replace(
    /&lt;iframe\b([\s\S]*?)&gt;([\s\S]*?)&lt;\/iframe&gt;/gi,
    (_full, attrsRaw: string) => {
      const unescapedAttrs = attrsRaw
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
      const rawIframe = `<iframe ${unescapedAttrs}></iframe>`;
      return buildResponsiveEmbedHtml(rawIframe);
    }
  );
}

/**
 * Shared helper to upload a single File to Cloudflare R2 (with graceful fallback for images).
 */
export async function uploadSingleFileToR2(
  file: File,
  courseCode = "STJ"
): Promise<{
  url: string;
  key?: string;
  name: string;
  size: number;
  mimeType: string;
  type: "pdf" | "video" | "document" | "link";
}> {
  const fileType = file.type || "application/octet-stream";
  let uploadedUrl = "";
  let uploadedKey = "";

  try {
    const presignRes = await fetch("/api/storage/r2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "presign",
        fileName: file.name,
        fileType,
        fileSize: file.size,
        courseCode,
      }),
    });

    const presignData = await presignRes.json().catch(() => null);
    let directSuccess = false;

    if (presignRes.ok && presignData?.uploadUrl) {
      try {
        const putRes = await fetch(presignData.uploadUrl, {
          method: "PUT",
          body: file,
        });
        if (putRes.ok) {
          directSuccess = true;
          uploadedUrl = presignData.publicUrl;
          uploadedKey = presignData.key;
        }
      } catch {
        directSuccess = false;
      }
    }

    if (!directSuccess) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseCode", courseCode);

      const directRes = await fetch("/api/storage/r2", {
        method: "POST",
        body: formData,
      });
      const directData = await directRes.json().catch(() => null);
      if (directRes.ok && directData?.publicUrl) {
        uploadedUrl = directData.publicUrl;
        uploadedKey = directData.key;
      } else if (fileType.startsWith("image/") && file.size <= 4 * 1024 * 1024) {
        // Fallback for inline images when R2 env keys are not yet configured
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("មិនអាចអានរូបភាពបានទេ"));
          reader.readAsDataURL(file);
        });
      } else {
        throw new Error(
          directData?.error ||
            presignData?.error ||
            "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ Cloudflare R2"
        );
      }
    }
  } catch (err) {
    if (fileType.startsWith("image/") && file.size <= 4 * 1024 * 1024) {
      uploadedUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(err);
        reader.readAsDataURL(file);
      });
    } else {
      throw err;
    }
  }

  return {
    url: uploadedUrl,
    key: uploadedKey,
    name: file.name,
    size: file.size,
    mimeType: fileType,
    type: detectAttachmentType(file.name, fileType),
  };
}

export function CloudflareR2AttachmentManager({
  attachments,
  onAttachmentsChange,
  courseCode = "STJ",
}: {
  attachments: CourseAttachment[];
  onAttachmentsChange: (items: CourseAttachment[]) => void;
  courseCode?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [r2Status, setR2Status] = useState<{
    configured: boolean;
    bucketName?: string;
    missingKeys?: string[];
  } | null>(null);

  const [showUrlForm, setShowUrlForm] = useState(false);
  const [externalName, setExternalName] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalType, setExternalType] = useState<"pdf" | "video" | "document" | "link">("pdf");

  useEffect(() => {
    fetch("/api/storage/r2")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setR2Status({
            configured: Boolean(d.configured),
            bucketName: d.bucketName,
            missingKeys: d.missingKeys,
          });
        }
      })
      .catch(() => {});
  }, []);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const newAttachments: CourseAttachment[] = [...attachments];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await uploadSingleFileToR2(file, courseCode);
        newAttachments.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: uploaded.name,
          url: uploaded.url,
          key: uploaded.key,
          type: uploaded.type,
          size: uploaded.size,
          mimeType: uploaded.mimeType,
          uploadedAt: new Date().toISOString(),
        });
      }
      onAttachmentsChange(newAttachments);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "បរាជ័យក្នុងការបង្ហោះឯកសារ"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(e.target.files);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleAddExternalLink = () => {
    const cleanUrl = externalUrl.trim();
    if (!cleanUrl) return;
    const cleanName =
      externalName.trim() ||
      cleanUrl.split("/").pop()?.split("?")[0] ||
      "ឯកសារមេរៀន (Course Material)";

    const item: CourseAttachment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      url: cleanUrl,
      type: externalType || detectAttachmentType(cleanUrl),
      uploadedAt: new Date().toISOString(),
    };

    onAttachmentsChange([...attachments, item]);
    setExternalName("");
    setExternalUrl("");
    setShowUrlForm(false);
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              ឯកសារមេរៀន PDF, Video &amp; ស្លាយ (Cloudflare R2 Dropzone)
            </p>
            <p className="text-[11px] text-muted-foreground">
              អូសទម្លាក់ឯកសារ (Drag &amp; Drop) ឬចុចជ្រើសរើសដើម្បីផ្ទុកលើ Cloudflare R2
            </p>
          </div>
        </div>
        <Badge variant={r2Status?.configured ? "success" : "info"} className="text-[10px] shrink-0">
          {r2Status?.configured ? "R2 Connected" : "R2 Cloud / URL"}
        </Badge>
      </div>

      {/* Drag & Drop Upload Dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp,.gif,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all rounded-xl p-4 text-center cursor-pointer space-y-1.5 ${
          isDraggingOver
            ? "border-primary bg-primary/15 scale-[1.01]"
            : "border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10"
        }`}
      >
        <UploadCloud className="w-6 h-6 text-primary mx-auto" />
        <p className="text-xs font-semibold text-foreground">
          {uploading
            ? "កំពុងបង្ហោះឯកសារទៅកាន់ Cloudflare R2..."
            : isDraggingOver
              ? "ទម្លាក់ឯកសារទីនេះដើម្បីបង្ហោះទៅ Cloudflare R2!"
              : "អូសទម្លាក់ឯកសារ (Drop File) ឬចុចជ្រើសរើស PDF, Video, រូបភាព, ស្លាយ"}
        </p>
        <p className="text-[10px] text-muted-foreground">
          គាំទ្រ PDF, MP4, WebM, PNG/JPG, PPTX, DOCX, XLSX, ZIP (Cloudflare R2 Storage)
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">
          ឯកសារភ្ជាប់សរុប៖ <strong className="text-foreground">{attachments.length}</strong>
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowUrlForm((v) => !v)}
          className="h-7 text-xs space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>បន្ថែម Link R2 / PDF / Video</span>
        </Button>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          {uploadError}
        </div>
      )}

      {showUrlForm && (
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-foreground mb-1">
              ឈ្មោះឯកសារ (ឧ. C Programming Chapter 1.pdf)
            </label>
            <input
              type="text"
              value={externalName}
              onChange={(e) => setExternalName(e.target.value)}
              placeholder="បញ្ចូលឈ្មោះឯកសារ..."
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-foreground mb-1">
              តំណភ្ជាប់ URL (Cloudflare R2 / Google Drive / YouTube / PDF Link)
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://pub-xxx.r2.dev/courses/PROG101/lesson1.pdf"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            />
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <select
              value={externalType}
              onChange={(e) =>
                setExternalType(e.target.value as "pdf" | "video" | "document" | "link")
              }
              className="px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
            >
              <option value="pdf">ឯកសារ PDF</option>
              <option value="video">វីដេអូមេរៀន (Video)</option>
              <option value="document">ឯកសារផ្សេងៗ (Slide / Doc)</option>
              <option value="link">តំណភ្ជាប់ (External Link)</option>
            </select>
            <Button
              type="button"
              size="sm"
              onClick={handleAddExternalLink}
              className="h-8 text-xs"
            >
              ភ្ជាប់ឯកសារនេះ
            </Button>
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2 pt-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                {att.type === "pdf" ? (
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                ) : att.type === "video" ? (
                  <Film className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <FileArchive className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-medium text-foreground truncate">{att.name}</p>
                  {att.size ? (
                    <span className="text-[10px] text-muted-foreground">
                      {formatFileSize(att.size)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Badge variant="outline" className="text-[9px] uppercase">
                  {att.type}
                </Badge>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                  title="បើកមើលឯកសារ"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                  title="លុបឯកសារ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  courseCode = "STJ",
  placeholder = "សរសេរមាតិកាមេរៀន សេចក្តីពន្យល់ គោលបំណងមេរៀន កូដគំរូ ឬអូសទម្លាក់រូបភាព/PDF/វីដេអូ (Drop files to Cloudflare R2)...",
  minHeightClass = "min-h-[420px]",
  hideInlineAttachments = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const inlineFileDropInputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);

  const [mode, setMode] = useState<"write" | "html" | "preview">("write");
  const [activePanel, setActivePanel] = useState<
    null | "color" | "highlight" | "iframe" | "image" | "link"
  >(null);

  // Inline tool states
  const [embedInput, setEmbedInput] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageAltInput, setImageAltInput] = useState("");
  const [imageWidth, setImageWidth] = useState<"100%" | "75%" | "50%">("100%");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkTextInput, setLinkTextInput] = useState("");

  // Drag & drop / upload state inside editor
  const [isDraggingOnEditor, setIsDraggingOnEditor] = useState(false);
  const [editorUploading, setEditorUploading] = useState(false);
  const [editorUploadMsg, setEditorUploadMsg] = useState<string | null>(null);

  // Sync incoming value into contentEditable (auto-unescaping any literal <iframe> tags)
  useEffect(() => {
    if (!editorRef.current || mode !== "write") return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const normalized = normalizeRichHtml(value || "");
    if (editorRef.current.innerHTML !== normalized) {
      editorRef.current.innerHTML = normalized;
    }
  }, [value, mode]);

  const syncEditorValue = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const normalized = normalizeRichHtml(editorRef.current.innerHTML);
    if (normalized !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = normalized;
    }
    onChange(normalized);
  };

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current || mode !== "write") return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    syncEditorValue();
  };

  const insertHtmlSnippet = (html: string) => {
    if (mode === "html") {
      onChange((value || "") + "\n" + html);
      return;
    }
    if (!editorRef.current) return;
    editorRef.current.focus();
    const inserted = document.execCommand("insertHTML", false, html);
    if (!inserted) {
      editorRef.current.innerHTML += html;
    }
    syncEditorValue();
  };

  const handleFontSize = (sizeValue: string) => {
    if (!sizeValue) return;
    exec("fontSize", sizeValue);
  };

  const handleInsertEmbed = () => {
    const html = buildResponsiveEmbedHtml(embedInput, embedTitle);
    if (!html) return;
    insertHtmlSnippet(html);
    setEmbedInput("");
    setEmbedTitle("");
    setActivePanel(null);
  };

  const handleInsertImageByUrl = () => {
    const cleanUrl = imageUrlInput.trim();
    if (!cleanUrl) return;
    const alt = imageAltInput.trim() || "Lesson Image";
    insertHtmlSnippet(
      `<figure style="margin:14px 0;text-align:center;"><img src="${cleanUrl}" alt="${alt}" style="max-width:${imageWidth};height:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.25);display:inline-block;" />${
        imageAltInput.trim()
          ? `<figcaption style="font-size:11px;color:#94a3b8;margin-top:6px;">${imageAltInput.trim()}</figcaption>`
          : ""
      }</figure><p><br/></p>`
    );
    setImageUrlInput("");
    setImageAltInput("");
    setActivePanel(null);
  };

  const handleInsertLinkConfirm = () => {
    const cleanUrl = linkUrlInput.trim();
    if (!cleanUrl) return;
    const text = linkTextInput.trim() || cleanUrl;
    insertHtmlSnippet(
      `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline;font-weight:600;">${text}</a>&nbsp;`
    );
    setLinkUrlInput("");
    setLinkTextInput("");
    setActivePanel(null);
  };

  /**
   * Uploads dropped, pasted, or selected files to Cloudflare R2 and embeds them directly into the editor
   * AND appends non-image files to the lesson's R2 attachments list!
   */
  const handleFilesIntoEditor = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setEditorUploading(true);
    setEditorUploadMsg("កំពុងបង្ហោះឯកសារទៅកាន់ Cloudflare R2...");

    const updatedAttachments: CourseAttachment[] = [...attachments];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
        const uploaded = await uploadSingleFileToR2(file, courseCode);

        if (isImage) {
          insertHtmlSnippet(
            `<figure style="margin:14px 0;text-align:center;"><img src="${uploaded.url}" alt="${uploaded.name}" style="max-width:${imageWidth};height:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.25);display:inline-block;" /><figcaption style="font-size:11px;color:#94a3b8;margin-top:6px;">${uploaded.name}</figcaption></figure><p><br/></p>`
          );
        } else {
          updatedAttachments.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: uploaded.name,
            url: uploaded.url,
            key: uploaded.key,
            type: uploaded.type,
            size: uploaded.size,
            mimeType: uploaded.mimeType,
            uploadedAt: new Date().toISOString(),
          });

          if (uploaded.type === "video") {
            insertHtmlSnippet(
              `<div style="margin:14px 0;"><video src="${uploaded.url}" controls preload="metadata" style="width:100%;max-height:440px;border-radius:12px;background:#000;"></video><p style="font-size:11px;color:#94a3b8;margin-top:4px;">🎬 ${uploaded.name}</p></div><p><br/></p>`
            );
          } else if (uploaded.type === "pdf") {
            insertHtmlSnippet(
              `<div style="margin:14px 0;padding:12px 16px;border-radius:12px;border:1px solid rgba(59,130,246,0.35);background:rgba(59,130,246,0.08);display:flex;align-items:center;justify-content:space-between;gap:12px;"><span>📄 <strong>${uploaded.name}</strong> (${formatFileSize(uploaded.size)})</span><a href="${uploaded.url}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;font-weight:700;text-decoration:underline;">បើកមើល / ទាញយក PDF ↗</a></div><p><br/></p>`
            );
          } else {
            insertHtmlSnippet(
              `<div style="margin:14px 0;padding:12px 16px;border-radius:12px;border:1px solid rgba(16,185,129,0.35);background:rgba(16,185,129,0.08);display:flex;align-items:center;justify-content:space-between;gap:12px;"><span>📎 <strong>${uploaded.name}</strong> (${formatFileSize(uploaded.size)})</span><a href="${uploaded.url}" target="_blank" rel="noopener noreferrer" style="color:#10b981;font-weight:700;text-decoration:underline;">ទាញយកឯកសារ ↗</a></div><p><br/></p>`
            );
          }
        }
      }

      if (updatedAttachments.length !== attachments.length) {
        onAttachmentsChange(updatedAttachments);
      }
      setEditorUploadMsg("បានបង្ហោះ និងដាក់បញ្ចូលក្នុងមេរៀនរួចរាល់!");
      setTimeout(() => setEditorUploadMsg(null), 3000);
      setActivePanel(null);
    } catch (err: unknown) {
      setEditorUploadMsg(
        err instanceof Error ? err.message : "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ R2"
      );
      setTimeout(() => setEditorUploadMsg(null), 5000);
    } finally {
      setEditorUploading(false);
    }
  };

  /**
   * Smart Paste Handler:
   * - Intercepts pasted files/images from clipboard and uploads them to R2
   * - Intercepts pasted `<iframe ...></iframe>` or YouTube links and embeds them as responsive video players
   */
  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardFiles = e.clipboardData?.files;
    if (clipboardFiles && clipboardFiles.length > 0) {
      e.preventDefault();
      await handleFilesIntoEditor(clipboardFiles);
      return;
    }

    const pastedText = e.clipboardData?.getData("text/plain")?.trim() || "";
    if (!pastedText) return;

    // Auto-convert pasted <iframe> code or standalone YouTube watch/short URLs
    const isIframeCode = /^<iframe[\s\S]*<\/iframe>$/i.test(pastedText);
    const isYoutubeUrl =
      /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/i.test(
        pastedText
      );

    if (isIframeCode || isYoutubeUrl) {
      e.preventDefault();
      const embedHtml = buildResponsiveEmbedHtml(pastedText);
      if (embedHtml) {
        insertHtmlSnippet(embedHtml);
      }
    }
  };

  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOnEditor(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      await handleFilesIntoEditor(e.dataTransfer.files);
    }
  };

  const handleInsertTable = () => {
    insertHtmlSnippet(
      `<table style="width:100%; border-collapse:collapse; margin:12px 0;">
        <thead>
          <tr style="background:rgba(59,130,246,0.12);">
            <th style="border:1px solid #334155; padding:8px; text-align:left;">ប្រធានបទ (Topic)</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">ខ្លឹមសារសំខាន់ (Details)</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">កំណត់សម្គាល់ (Notes)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">ផ្នែកទី ១</td>
            <td style="border:1px solid #334155; padding:8px;">សេចក្តីផ្តើម</td>
            <td style="border:1px solid #334155; padding:8px;">-</td>
          </tr>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">ផ្នែកទី ២</td>
            <td style="border:1px solid #334155; padding:8px;">ការអនុវត្តលំហាត់</td>
            <td style="border:1px solid #334155; padding:8px;">-</td>
          </tr>
        </tbody>
      </table><p><br/></p>`
    );
  };

  const handleInsertCallout = () => {
    insertHtmlSnippet(
      `<blockquote style="border-left:4px solid #3b82f6;background:rgba(59,130,246,0.08);padding:12px 16px;border-radius:0 12px 12px 0;margin:12px 0;"><strong>💡 ចំណុចសំខាន់ (Key Takeaway)៖</strong> សរសេរសេចក្តីសង្ខេប ឬចំណាំសំខាន់សម្រាប់សមាជិកនៅទីនេះ...</blockquote><p><br/></p>`
    );
  };

  const handleInsertChecklist = () => {
    insertHtmlSnippet(
      `<ul style="list-style:none;padding-left:4px;margin:10px 0;">
        <li>☑️ គោលបំណងមេរៀនទី ១</li>
        <li>☑️ គោលបំណងមេរៀនទី ២</li>
        <li>⬜ លំហាត់អនុវត្តបន្ថែម</li>
      </ul><p><br/></p>`
    );
  };

  const handleInsertCodeBlock = () => {
    insertHtmlSnippet(
      `<pre style="background:#0f172a;color:#e2e8f0;padding:14px 16px;border-radius:12px;font-family:monospace;font-size:12px;overflow-x:auto;border:1px solid #1e293b;margin:12px 0;"><code>#include &lt;stdio.h&gt;\n\nint main() {\n    printf("Hello STJ ITC!\\n");\n    return 0;\n}</code></pre><p><br/></p>`
    );
  };

  const plainText = (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;

  return (
    <div className="space-y-4">
      {/* Hidden file inputs for inline editor Image & R2 File Drop buttons */}
      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFilesIntoEditor(e.target.files)}
        className="hidden"
      />
      <input
        ref={inlineFileDropInputRef}
        type="file"
        accept=".pdf,.mp4,.webm,.mov,.png,.jpg,.jpeg,.webp,.gif,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
        multiple
        onChange={(e) => e.target.files && handleFilesIntoEditor(e.target.files)}
        className="hidden"
      />

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Top Professional Formatting Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border-b border-border bg-muted/40">
          <div className="flex flex-wrap items-center gap-1">
            {/* Headings & Font Size */}
            <button
              type="button"
              onClick={() => exec("formatBlock", "H1")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងធំ (Heading 1)"
            >
              <Heading1 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H1</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "H2")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងរង (Heading 2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H2</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "H3")}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
              title="ចំណងជើងតូច (Heading 3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span className="text-[11px]">H3</span>
            </button>

            <div className="inline-flex items-center px-1">
              <Type className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              <select
                defaultValue="3"
                onChange={(e) => handleFontSize(e.target.value)}
                className="h-7 px-1.5 rounded-md border border-border bg-background text-[11px] text-foreground focus:outline-none"
                title="ទំហំអក្សរ (Font Size)"
              >
                <option value="2">តូច (Small)</option>
                <option value="3">ធម្មតា (Normal)</option>
                <option value="4">មធ្យម (Medium)</option>
                <option value="5">ធំ (Large)</option>
                <option value="6">ធំខ្លាំង (XL)</option>
              </select>
            </div>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Inline Styles */}
            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="អក្សរដិត (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="អក្សរទ្រេត (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="គូសបន្ទាត់ពីក្រោម (Underline)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("strikeThrough")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="គូសឆូត (Strikethrough)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            {/* Text Color & Highlight Color Buttons */}
            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "color" ? null : "color"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "color"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="ពណ៌អក្សរ (Text Color)"
            >
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span className="hidden md:inline text-[11px]">ពណ៌អក្សរ</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "highlight" ? null : "highlight"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "highlight"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="ពណ៌ផ្ទៃអក្សរ (Highlight Color)"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline text-[11px]">Highlight</span>
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Alignment */}
            <button
              type="button"
              onClick={() => exec("justifyLeft")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមឆ្វេង (Align Left)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyCenter")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមកណ្តាល (Align Center)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyRight")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមស្តាំ (Align Right)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyFull")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="តម្រឹមពេញ (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Lists & Checklist */}
            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីចំណុច (Bullet List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីលេខរៀង (Numbered List)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleInsertChecklist}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ជីធីក (Checklist)"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Media & R2 Tools: Image, Iframe/YouTube, Drop File R2, Link */}
            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "image" ? null : "image"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "image"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-emerald-500"
              }`}
              title="បញ្ចូលរូបភាព ឬបង្ហោះទៅ Cloudflare R2 (Insert / Upload Image)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="text-[11px]">រូបភាព</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "iframe" ? null : "iframe"))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                activePanel === "iframe"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-red-500"
              }`}
              title="បញ្ចូលវីដេអូ YouTube ឬកូដ Iframe (Embed Video / Iframe)"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="text-[11px]">Iframe / YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => inlineFileDropInputRef.current?.click()}
              disabled={editorUploading}
              className="px-2 py-1.5 rounded-lg hover:bg-primary/10 text-primary text-xs font-semibold inline-flex items-center gap-1 border border-primary/30"
              title="បង្ហោះឯកសារ PDF/Video/Image ទៅ Cloudflare R2 រួចដាក់ចូលមេរៀនភ្លាម (Upload to R2 & Insert)"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="text-[11px]">Drop File (R2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((p) => (p === "link" ? null : "link"))}
              className={`p-1.5 rounded-lg ${
                activePanel === "link"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              title="បញ្ចូលតំណភ្ជាប់ (Insert Link)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            {/* Rich Blocks */}
            <button
              type="button"
              onClick={handleInsertCallout}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-primary text-xs font-medium inline-flex items-center gap-1"
              title="បញ្ចូលប្រអប់ចំណាំសំខាន់ (Callout Box)"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">ប្រអប់ចំណាំ</span>
            </button>
            <button
              type="button"
              onClick={handleInsertTable}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1"
              title="បញ្ចូលតារាង (Insert Table)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">តារាង</span>
            </button>
            <button
              type="button"
              onClick={handleInsertCodeBlock}
              className="px-2 py-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1"
              title="បញ្ចូលកូដគំរូ (Code Block)"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Code</span>
            </button>
            <button
              type="button"
              onClick={() => exec("formatBlock", "BLOCKQUOTE")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="សម្រង់សម្តី (Quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("insertHorizontalRule")}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បន្ទាត់ខណ្ឌចែក (Divider)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-border mx-1" />

            <button
              type="button"
              onClick={() => exec("undo")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="ត្រឡប់ក្រោយ (Undo)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec("redo")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="ទៅមុខវិញ (Redo)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                exec("removeFormat");
                exec("formatBlock", "P");
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              title="សម្អាតទម្រង់អក្សរ (Clear Formatting)"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher: Visual Write | HTML Source | Live Preview */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setMode("write")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "write"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>សរសេរ (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "html"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="កែប្រែកូដ HTML / Iframe ផ្ទាល់"
            >
              <FileCode className="w-3 h-3" />
              <span>HTML</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                mode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>មើលគំរូ (Preview)</span>
            </button>
          </div>
        </div>

        {/* Inline Action Panels (Color, Highlight, Iframe/YouTube, Image, Link) */}
        {activePanel === "color" && (
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">ជ្រើសរើសពណ៌អក្សរ (Text Color)៖</span>
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    exec("foreColor", c.color);
                    setActivePanel(null);
                  }}
                  className="w-6 h-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
              <label className="inline-flex items-center gap-1.5 ml-2 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                <span>ពណ៌ផ្សេងទៀត៖</span>
                <input
                  type="color"
                  defaultValue="#3b82f6"
                  onChange={(e) => exec("foreColor", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activePanel === "highlight" && (
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">ពណ៌ផ្ទៃអក្សរ (Highlight Color)៖</span>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    exec("hiliteColor", c.color);
                    setActivePanel(null);
                  }}
                  className="px-2.5 py-1 rounded-md border border-border text-[11px] font-medium hover:scale-105 transition-transform"
                  style={{ backgroundColor: c.color }}
                >
                  {c.label}
                </button>
              ))}
              <label className="inline-flex items-center gap-1.5 ml-2 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                <span>ជ្រើសរើសផ្ទាល់៖</span>
                <input
                  type="color"
                  defaultValue="#fef08a"
                  onChange={(e) => exec("hiliteColor", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activePanel === "iframe" && (
          <div className="p-4 border-b border-border bg-muted/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-500" />
                បញ្ចូលវីដេអូ YouTube, Google Drive ឬកូដ &lt;iframe&gt; (Embed Video / Iframe)
              </span>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="md:col-span-2">
                <label className="block text-[11px] text-muted-foreground mb-1">
                  តំណភ្ជាប់ YouTube / Video URL ឬកូដ &lt;iframe ...&gt;&lt;/iframe&gt; *
                </label>
                <input
                  type="text"
                  value={embedInput}
                  onChange={(e) => setEmbedInput(e.target.value)}
                  placeholder='https://www.youtube.com/watch?v=... ឬ <iframe src="https://www.youtube.com/embed/..." ...></iframe>'
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  ចំណងជើងវីដេអូ (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                    placeholder="ឧ. មេរៀនទី ១ - C Programming"
                    className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleInsertEmbed}
                    className="h-8 text-xs shrink-0"
                  >
                    ដាក់បញ្ចូល
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "image" && (
          <div className="p-4 border-b border-border bg-muted/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                បញ្ចូលរូបភាពក្នុងមេរៀន (បង្ហោះទៅ Cloudflare R2 ឬដាក់ Image URL)
              </span>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="sm"
                onClick={() => inlineImageInputRef.current?.click()}
                disabled={editorUploading}
                className="h-8 text-xs space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>
                  {editorUploading
                    ? "កំពុងបង្ហោះរូបភាព..."
                    : "ជ្រើសរើសរូបភាពពីកុំព្យូទ័រ (Upload to R2)"}
                </span>
              </Button>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-muted-foreground">ទំហំរូបភាព៖</span>
                {(["100%", "75%", "50%"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setImageWidth(w)}
                    className={`px-2 py-1 rounded border text-[11px] font-mono ${
                      imageWidth === w
                        ? "border-primary bg-primary/15 text-primary font-bold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 border-t border-border/60">
              <div className="md:col-span-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="ឬបញ្ចូលតំណភ្ជាប់រូបភាព (https://.../diagram.png)"
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                  placeholder="ពិពណ៌នារូបភាព (Caption)"
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleInsertImageByUrl}
                  className="h-8 text-xs shrink-0"
                >
                  ដាក់ URL
                </Button>
              </div>
            </div>
          </div>
        )}

        {activePanel === "link" && (
          <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <input
                type="text"
                value={linkTextInput}
                onChange={(e) => setLinkTextInput(e.target.value)}
                placeholder="អត្ថបទបង្ហាញ (ឧ. ទាញយកស្លាយមេរៀន)"
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs w-full sm:w-56"
              />
              <input
                type="url"
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
                placeholder="https://..."
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs flex-1 min-w-[200px]"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleInsertLinkConfirm}
                className="h-8 text-xs"
              >
                ដាក់តំណភ្ជាប់
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {editorUploadMsg && (
          <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-primary text-xs font-medium flex items-center justify-between">
            <span>{editorUploadMsg}</span>
            <button type="button" onClick={() => setEditorUploadMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Editor Canvas / HTML Source / Live Preview */}
        {mode === "preview" ? (
          <div className={`${minHeightClass} p-6 bg-background/50`}>
            {value || attachments.length > 0 ? (
              <RichContentViewer richContent={value} attachments={attachments} />
            ) : (
              <p className="text-xs text-muted-foreground italic">
                មិនទាន់មានខ្លឹមសារសម្រាប់បង្ហាញគំរូនៅឡើយទេ...
              </p>
            )}
          </div>
        ) : mode === "html" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="កែប្រែកូដ HTML ឬបិទភ្ជាប់កូដ <iframe ...></iframe> នៅទីនេះ..."
            className={`${minHeightClass} w-full p-5 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-y`}
          />
        ) : (
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingOnEditor(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOnEditor(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) {
                setIsDraggingOnEditor(false);
              }
            }}
            onDrop={handleEditorDrop}
            className="relative"
          >
            {isDraggingOnEditor && (
              <div className="absolute inset-2 z-20 rounded-xl border-2 border-dashed border-primary bg-primary/15 backdrop-blur-xs flex flex-col items-center justify-center gap-2 pointer-events-none">
                <UploadCloud className="w-10 h-10 text-primary animate-bounce" />
                <p className="text-sm font-bold text-foreground">
                  ទម្លាក់ឯកសារទីនេះដើម្បីបង្ហោះទៅ Cloudflare R2 និងដាក់ក្នុងមេរៀន!
                </p>
                <p className="text-xs text-muted-foreground">
                  គាំទ្រ រូបភាព (PNG/JPG), ឯកសារ PDF, វីដេអូ (MP4) និងស្លាយមេរៀន
                </p>
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorValue}
              onBlur={syncEditorValue}
              onPaste={handleEditorPaste}
              data-placeholder={placeholder}
              className={`${minHeightClass} p-5 text-sm text-foreground leading-relaxed focus:outline-none prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&_h1]:text-xl [&_h1]:font-extrabold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-2.5 [&_h2]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:my-2 [&_pre]:bg-muted [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 [&_a]:text-primary [&_a]:underline [&_hr]:my-4 [&_hr]:border-border [&_img]:rounded-xl [&_img]:my-2 [&_iframe]:w-full [&_iframe]:rounded-xl`}
            />
          </div>
        )}

        {/* Editor Status Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              ពាក្យ (Words): <strong className="text-foreground">{wordCount}</strong>
            </span>
            <span>
              តួអក្សរ (Characters): <strong className="text-foreground">{charCount}</strong>
            </span>
            <span>
              ឯកសារ R2: <strong className="text-primary">{attachments.length}</strong>
            </span>
          </div>
          <span>
            គាំទ្រ Paste YouTube / &lt;iframe&gt; • Drag &amp; Drop រូបភាព/PDF/Video ទៅ Cloudflare R2
          </span>
        </div>
      </div>

      {!hideInlineAttachments && (
        <CloudflareR2AttachmentManager
          attachments={attachments}
          onAttachmentsChange={onAttachmentsChange}
          courseCode={courseCode}
        />
      )}
    </div>
  );
}

/**
 * Safe HTML & Cloudflare R2 Attachments Viewer for Course Members and Leaders
 */
export function RichContentViewer({
  richContent,
  notes,
  attachments = [],
}: {
  richContent?: string;
  notes?: string;
  attachments?: CourseAttachment[];
}) {
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const normalizedRich = normalizeRichHtml(richContent);
  const hasRich = Boolean(normalizedRich && normalizedRich.trim());
  const hasNotes = Boolean(notes && notes.trim());
  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

  if (!hasRich && !hasNotes && !hasAttachments) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {hasRich ? (
        <div
          className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mt-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:text-foreground [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_a]:text-primary [&_a]:underline [&_hr]:my-3 [&_hr]:border-border [&_img]:rounded-xl [&_img]:max-w-full [&_iframe]:w-full [&_iframe]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: normalizedRich }}
        />
      ) : hasNotes ? (
        <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
          {notes}
        </p>
      ) : null}

      {hasAttachments && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            ឯកសារភ្ជាប់ និងវីដេអូមេរៀន (Course Materials • Cloudflare R2)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((att) => (
              <div
                key={att.id || att.url}
                className="flex flex-col justify-between p-2.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {att.type === "pdf" ? (
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    ) : att.type === "video" ? (
                      <Film className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <FileArchive className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-foreground truncate">
                      {att.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {att.type === "pdf" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewPdfUrl((cur) => (cur === att.url ? null : att.url))
                        }
                        className="px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-medium"
                      >
                        {previewPdfUrl === att.url ? "បិទ PDF" : "មើល PDF"}
                      </button>
                    )}
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground text-[11px] font-medium"
                    >
                      <span>ទាញយក / បើក</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {att.type === "video" &&
                  /\.(mp4|webm|mov)(\?|$)/i.test(att.url) && (
                    <video
                      src={att.url}
                      controls
                      preload="metadata"
                      className="w-full rounded-lg max-h-60 bg-black mt-1"
                    />
                  )}
              </div>
            ))}
          </div>

          {previewPdfUrl && (
            <div className="rounded-xl border border-border overflow-hidden bg-background mt-2">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border text-xs">
                <span className="font-semibold text-foreground">
                  ការមើលឯកសារ PDF ផ្ទាល់ (PDF Preview)
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(null)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  បិទ (Close)
                </button>
              </div>
              <iframe
                src={previewPdfUrl}
                title="PDF Viewer"
                className="w-full h-[480px] border-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
