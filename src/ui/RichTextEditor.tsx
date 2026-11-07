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
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table,
  Minus,
  Info,
  Link as LinkIcon,
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
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              ឯកសារមេរៀន PDF, Video &amp; ស្លាយ (Cloudflare R2)
            </p>
            <p className="text-[11px] text-muted-foreground">
              ផ្ទុកឯកសារធំៗនៅលើ Cloudflare R2 ដើម្បីការពារកុំឱ្យពេញ Storage Hosting
            </p>
          </div>
        </div>
        <Badge variant={r2Status?.configured ? "success" : "info"} className="text-[10px] shrink-0">
          {r2Status?.configured ? "R2 Connected" : "R2 Cloud / URL"}
        </Badge>
      </div>

      {/* Upload Dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.mp4,.webm,.mov,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className="border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl p-4 text-center cursor-pointer space-y-1.5"
      >
        <UploadCloud className="w-6 h-6 text-primary mx-auto" />
        <p className="text-xs font-semibold text-foreground">
          {uploading
            ? "កំពុងបង្ហោះឯកសារទៅកាន់ Cloudflare R2..."
            : "ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ PDF, Video (MP4) ឬស្លាយបង្រៀន"}
        </p>
        <p className="text-[10px] text-muted-foreground">
          គាំទ្រ PDF, MP4, WebM, PPTX, DOCX, XLSX, ZIP (Direct S3 Presigned Upload)
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
  placeholder = "សរសេរមាតិកាមេរៀន សេចក្តីពន្យល់ គោលបំណងមេរៀន កូដគំរូ ឬលំហាត់សម្រាប់សមាជិក...",
  minHeightClass = "min-h-[380px]",
  hideInlineAttachments = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!editorRef.current || previewMode) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, previewMode]);

  const syncEditorValue = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current || previewMode) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    syncEditorValue();
  };

  const insertHtmlSnippet = (html: string) => {
    if (!editorRef.current || previewMode) return;
    editorRef.current.focus();
    document.execCommand("insertHTML", false, html);
    syncEditorValue();
  };

  const handleInsertLink = () => {
    const url = window.prompt("បញ្ចូលតំណភ្ជាប់ (URL):", "https://");
    if (!url || url === "https://") return;
    exec("createLink", url);
  };

  const handleInsertTable = () => {
    insertHtmlSnippet(
      `<table style="width:100%; border-collapse:collapse; margin:12px 0;">
        <thead>
          <tr>
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
      `<blockquote><strong>💡 ចំណុចសំខាន់ (Key Takeaway)៖</strong> សរសេរសេចក្តីសង្ខេប ឬចំណាំសំខាន់សម្រាប់សមាជិកនៅទីនេះ...</blockquote><p><br/></p>`
    );
  };

  const plainText = (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Top Professional Formatting Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border-b border-border bg-muted/40">
          <div className="flex flex-wrap items-center gap-1">
            {/* Headings & Block types */}
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

            <span className="w-px h-4 bg-border mx-1" />

            {/* Lists */}
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
              onClick={() => exec("formatBlock", "PRE")}
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
            <button
              type="button"
              onClick={handleInsertLink}
              className="p-1.5 rounded-lg hover:bg-muted text-foreground"
              title="បញ្ចូលតំណភ្ជាប់ (Insert Link)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
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

          {/* Write vs Live Preview Switcher */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                !previewMode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>សរសេរ (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1 transition-colors ${
                previewMode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>មើលគំរូ (Preview)</span>
            </button>
          </div>
        </div>

        {/* Main Editor Canvas or Live Preview */}
        {previewMode ? (
          <div className={`${minHeightClass} p-6 bg-background/50`}>
            {value || attachments.length > 0 ? (
              <RichContentViewer richContent={value} attachments={attachments} />
            ) : (
              <p className="text-xs text-muted-foreground italic">
                មិនទាន់មានខ្លឹមសារសម្រាប់បង្ហាញគំរូនៅឡើយទេ...
              </p>
            )}
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncEditorValue}
            onBlur={syncEditorValue}
            data-placeholder={placeholder}
            className={`${minHeightClass} p-5 text-sm text-foreground leading-relaxed focus:outline-none prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&_h1]:text-xl [&_h1]:font-extrabold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-2.5 [&_h2]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:my-2 [&_pre]:bg-muted [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 [&_a]:text-primary [&_a]:underline [&_hr]:my-4 [&_hr]:border-border`}
          />
        )}

        {/* Editor Status Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>ពាក្យ (Words): <strong className="text-foreground">{wordCount}</strong></span>
            <span>តួអក្សរ (Characters): <strong className="text-foreground">{charCount}</strong></span>
            <span>ឯកសារ R2: <strong className="text-primary">{attachments.length}</strong></span>
          </div>
          <span>Rich HTML Studio • Cloudflare R2 Ready</span>
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
          className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mt-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:text-foreground [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_a]:text-primary [&_a]:underline [&_hr]:my-3 [&_hr]:border-border"
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
