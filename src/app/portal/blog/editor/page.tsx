"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Layers,
  PenTool,
  Save,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import {
  LessonBlogSharePanel,
  RichTextEditor,
  ThumbnailAndVisibilityCard,
} from "@/ui/RichTextEditor";
import { extractPlainTextSnippet, type CourseAttachment } from "@/lib/richContent";

const COURSE_CATEGORIES = [
  { code: "PROG101", category: "Programming", titleKh: "កូដកម្មវិធី" },
  { code: "MATH101", category: "Mathematics", titleKh: "គណិតវិទ្យា" },
  { code: "PHYS101", category: "Physics", titleKh: "រូបវិទ្យា" },
  { code: "CHEM101", category: "Chemistry", titleKh: "គីមីវិទ្យា" },
];

function BlogEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id") || "";

  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    courseCode: "PROG101",
    category: "Programming",
    visibility: "PUBLIC" as "PRIVATE" | "PUBLIC",
    thumbnailUrl: "",
    richContent: "",
    attachments: [] as CourseAttachment[],
  });

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    fetch(`/api/blog?id=${encodeURIComponent(postId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.item) {
          setForm({
            title: d.item.title || "",
            courseCode: d.item.courseCode || "PROG101",
            category: d.item.category || "Programming",
            visibility: d.item.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
            thumbnailUrl: d.item.thumbnailUrl || "",
            richContent: d.item.richContent || "",
            attachments: Array.isArray(d.item.attachments) ? d.item.attachments : [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("សូមបញ្ចូលចំណងជើងអត្ថបទ");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const autoSummary =
        extractPlainTextSnippet(form.richContent, "", 200) || form.title.trim();

      const matchedCat =
        COURSE_CATEGORIES.find((c) => c.code === form.courseCode) || COURSE_CATEGORIES[0];

      const res = await fetch("/api/blog", {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(postId ? { id: postId } : {}),
          title: form.title.trim(),
          summary: autoSummary,
          courseCode: form.courseCode,
          courseTitle: matchedCat.category,
          courseTitleKh: matchedCat.titleKh,
          category: form.category || matchedCat.category,
          visibility: form.visibility,
          thumbnailUrl: form.thumbnailUrl,
          richContent: form.richContent,
          attachments: form.attachments,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "មិនអាចរក្សាទុកអត្ថបទបានទេ");
        return;
      }

      setSuccessMsg(
        form.visibility === "PUBLIC"
          ? "បានរក្សាទុក និងផ្សព្វផ្សាយជាសាធារណៈដោយជោគជ័យ"
          : "បានរក្សាទុកជាលក្ខណៈឯកជនដោយជោគជ័យ"
      );
      setTimeout(() => {
        router.push("/portal/blog");
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout portalType="portal">
      <form onSubmit={handleSave} className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              href="/portal/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ក្រោយ</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
              <PenTool className="w-4 h-4 text-primary" />
              <span>{postId ? "កែសម្រួលអត្ថបទ" : "សរសេរអត្ថបទថ្មី"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/portal/blog">
              <Button type="button" variant="outline" size="sm" className="text-xs">
                បោះបង់
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              disabled={saving || loading}
              className="text-xs space-x-1.5 px-4"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            កំពុងផ្ទុកអត្ថបទ...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 Columns: Title & Rich Text Studio */}
            <div className="lg:col-span-8 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    ចំណងជើងអត្ថបទ *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="បញ្ចូលចំណងជើងអត្ថបទ..."
                    className="w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </CardContent>
              </Card>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 px-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>ខ្លឹមសារអត្ថបទ</span>
                </label>

                <RichTextEditor
                  value={form.richContent}
                  onChange={(html) => setForm((prev) => ({ ...prev, richContent: html }))}
                  attachments={form.attachments}
                  onAttachmentsChange={(items) =>
                    setForm((prev) => ({ ...prev, attachments: items }))
                  }
                  courseCode={form.courseCode}
                  minHeightClass="min-h-[500px]"
                  hideInlineAttachments={true}
                  placeholder="សរសេរអត្ថបទ កូដ (VS Code) ឬរូបមន្ត (Math / LaTeX)..."
                />
              </div>
            </div>

            {/* Right 4 Columns: Subject, Visibility, Thumbnail, QR */}
            <div className="lg:col-span-4 space-y-4">
              <Card>
                <CardHeader className="py-3 px-4 border-b border-border">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>មុខវិជ្ជា និងប្រភេទអត្ថបទ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      មុខវិជ្ជា
                    </label>
                    <select
                      value={form.courseCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const matched = COURSE_CATEGORIES.find((c) => c.code === code);
                        setForm({
                          ...form,
                          courseCode: code,
                          category: matched?.category || form.category,
                        });
                      }}
                      className="w-full p-2 rounded-xl border border-input bg-background font-medium"
                    >
                      {COURSE_CATEGORIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      ប្រភេទអត្ថបទ
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="ឧ. Programming"
                      className="w-full p-2 rounded-xl border border-input bg-background"
                    />
                  </div>
                </CardContent>
              </Card>

              <ThumbnailAndVisibilityCard
                visibility={form.visibility}
                onVisibilityChange={(vis) => setForm((prev) => ({ ...prev, visibility: vis }))}
                thumbnailUrl={form.thumbnailUrl}
                onThumbnailChange={(url) => setForm((prev) => ({ ...prev, thumbnailUrl: url }))}
                courseCode={form.courseCode}
                titlePreview={form.title}
              />

              {postId && (
                <LessonBlogSharePanel
                  title={form.title || "អត្ថបទ STJ"}
                  shareUrl={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/blog/${postId}`
                      : `/blog/${postId}`
                  }
                  visibility={form.visibility}
                  onVisibilityChange={(vis) => setForm((prev) => ({ ...prev, visibility: vis }))}
                />
              )}
            </div>
          </div>
        )}
      </form>
    </PortalLayout>
  );
}

export default function PortalBlogEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-xs text-muted-foreground">
          កំពុងរៀបចំផ្ទាំងសរសេរអត្ថបទ...
        </div>
      }
    >
      <BlogEditorInner />
    </Suspense>
  );
}

