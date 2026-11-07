"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Eraser,
  UploadCloud,
  FileText,
  Film,
  FileArchive,
  ExternalLink,
  Trash2,
  Plus,
  Cloud,
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
}

function detectAttachmentType(
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

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function RichTextEditor({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  courseCode = "STJ",
  placeholder = "សរសេរមាតិកាមេរៀន សេចក្តីពន្យល់ គោលបំណងមេរៀន ឬកំណត់ចំណាំសម្រាប់សមាជិក...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);

  const [uploading, setUploading] = useState(false);
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

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const syncEditorValue = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    syncEditorValue();
  };

  const handleInsertLink = () => {
    const url = window.prompt("បញ្ចូលតំណភ្ជាប់ (URL):", "https://");
    if (!url || url === "https://") return;
    exec("createLink", url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const newAttachments: CourseAttachment[] = [...attachments];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type || "application/octet-stream";
        let uploadedUrl = "";
        let uploadedKey = "";

        // Step 1: Request Presigned PUT URL from /api/storage/r2 for direct browser -> Cloudflare R2 upload
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
        if (!presignRes.ok) {
          throw new Error(
            presignData?.error || "មិនអាចតភ្ជាប់ទៅកាន់ Cloudflare R2 បានទេ"
          );
        }

        // Try direct browser PUT to Cloudflare R2 first (supports large videos & PDFs without server limits)
        let directSuccess = false;
        if (presignData?.uploadUrl) {
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
            // Fallback to server proxy upload if bucket CORS blocks direct browser PUT
            directSuccess = false;
          }
        }

        // Step 2: Fallback to server-side R2 upload if direct PUT was blocked by CORS
        if (!directSuccess) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("courseCode", courseCode);

          const directRes = await fetch("/api/storage/r2", {
            method: "POST",
            body: formData,
          });
          const directData = await directRes.json().catch(() => null);
          if (!directRes.ok) {
            throw new Error(
              directData?.error || "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ Cloudflare R2"
            );
          }
          uploadedUrl = directData.publicUrl;
          uploadedKey = directData.key;
        }

        newAttachments.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          url: uploadedUrl,
          key: uploadedKey,
          type: detectAttachmentType(file.name, file.type),
          size: file.size,
          mimeType: file.type,
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
    <div className="space-y-3">
      {/* Rich Text Editor Box */}
      <div className="rounded-xl border border-input bg-background overflow-hidden">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/40">
          <button
            type="button"
            onClick={() => exec("formatBlock", "H2")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "H3")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground text-xs font-bold inline-flex items-center gap-1"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => exec("bold")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("italic")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("underline")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => exec("formatBlock", "BLOCKQUOTE")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Quote / Note"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec("formatBlock", "PRE")}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              exec("removeFormat");
              exec("formatBlock", "P");
            }}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground ml-auto"
            title="Clear Formatting"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editable Content Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncEditorValue}
          onBlur={syncEditorValue}
          data-placeholder={placeholder}
          className="min-h-[150px] max-h-[360px] overflow-y-auto p-3.5 text-xs sm:text-sm text-foreground focus:outline-none prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-1.5 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_pre]:bg-muted [&_pre]:p-2.5 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_a]:text-primary [&_a]:underline"
        />
      </div>

      {/* Cloudflare R2 Upload & Materials Section */}
      <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                ឯកសារមេរៀន PDF, Video &amp; ស្លាយ (Cloudflare R2 Object Storage)
              </p>
              <p className="text-[10px] text-muted-foreground">
                រក្សាទុកឯកសារទំហំធំ (PDF, MP4, PPTX, ZIP) នៅលើ Cloudflare R2 ដើម្បីការពារកុំឱ្យពេញ Storage Hosting
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.mp4,.webm,.mov,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs space-x-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploading ? "កំពុងបង្ហោះទៅ R2..." : "បង្ហោះ PDF / Video (R2)"}</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowUrlForm((v) => !v)}
              className="h-8 text-xs space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ដាក់ Link R2 / PDF / Video</span>
            </Button>
          </div>
        </div>

        {r2Status && !r2Status.configured && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
            សម្គាល់៖ ដើម្បីបង្ហោះឯកសារផ្ទាល់ទៅ Cloudflare R2 សូមបន្ថែម{" "}
            <code className="font-mono">R2_ACCOUNT_ID</code>,{" "}
            <code className="font-mono">R2_ACCESS_KEY_ID</code>,{" "}
            <code className="font-mono">R2_SECRET_ACCESS_KEY</code>,{" "}
            <code className="font-mono">R2_BUCKET_NAME</code>, និង{" "}
            <code className="font-mono">R2_PUBLIC_URL</code> ក្នុង Environment Variables ឬប្រើប៊ូតុង{" "}
            <strong>&ldquo;ដាក់ Link R2 / PDF / Video&rdquo;</strong> ខាងលើ។
          </div>
        )}

        {uploadError && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
            {uploadError}
          </div>
        )}

        {/* External R2 / PDF / Video URL Form */}
        {showUrlForm && (
          <div className="p-3 rounded-lg border border-border bg-card grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">
                ឈ្មោះឯកសារ (ឧ. Slide មេរៀនទី ១)
              </label>
              <input
                type="text"
                value={externalName}
                onChange={(e) => setExternalName(e.target.value)}
                placeholder="ឧ. C Programming Chapter 1.pdf"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">
                URL ឯកសារ (Cloudflare R2 / PDF / Video Link)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://pub-xxx.r2.dev/courses/PROG101/ch1.pdf"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">
                ប្រភេទ
              </label>
              <select
                value={externalType}
                onChange={(e) =>
                  setExternalType(e.target.value as "pdf" | "video" | "document" | "link")
                }
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-input bg-background"
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={handleAddExternalLink}
                className="h-8 w-full text-xs"
              >
                បន្ថែម
              </Button>
            </div>
          </div>
        )}

        {/* Attached Files List */}
        {attachments.length > 0 && (
          <div className="space-y-1.5">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg border border-border bg-card text-xs"
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
                    <span className="font-medium text-foreground">{att.name}</span>
                    {att.size ? (
                      <span className="text-[10px] text-muted-foreground ml-2">
                        ({formatFileSize(att.size)})
                      </span>
                    ) : null}
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase shrink-0">
                    {att.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-primary hover:bg-primary/10 rounded"
                    title="បើកមើលឯកសារ"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded"
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

  const hasRich = Boolean(richContent && richContent.trim());
  const hasNotes = Boolean(notes && notes.trim());
  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

  if (!hasRich && !hasNotes && !hasAttachments) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {hasRich ? (
        <div
          className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_pre]:bg-muted [&_pre]:p-2.5 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: richContent || "" }}
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
                <span className="font-semibold text-foreground">ការមើលឯកសារ PDF ផ្ទាល់ (PDF Preview)</span>
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
