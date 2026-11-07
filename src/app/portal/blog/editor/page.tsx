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
  CloudflareR2AttachmentManager,
  LessonBlogSharePanel,
  RichTextEditor,
  ThumbnailAndVisibilityCard,
} from "@/ui/RichTextEditor";
import type { CourseAttachment } from "@/lib/richContent";

const COURSE_CATEGORIES = [
  { code: "PROG101", category: "Programming (C/C++)", titleKh: "កូដកម្មវិធី (Programming)" },
  { code: "MATH101", category: "គណិតវិទ្យា (Mathematics)", titleKh: "គណិតវិទ្យា (Mathematics)" },
  { code: "PHYS101", category: "រូបវិទ្យា (Physics)", titleKh: "រូបវិទ្យា (Physics)" },
  { code: "CHEM101", category: "គីមីវិទ្យា (Chemistry)", titleKh: "គីមីវិទ្យា (Chemistry)" },
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
    summary: "",
    courseCode: "PROG101",
    category: "Programming (C/C++)",
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
            summary: d.item.summary || "",
            courseCode: d.item.courseCode || "PROG101",
            category: d.item.category || "Programming (C/C++)",
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
      setError("សូមបញ្ចូលចំណងជើងអត្ថបទ ឬមេរៀន (Title is required)");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const autoSummary =
        form.summary.trim() ||
        form.richContent
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 240);

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
          ? "បានរក្សាទុក និងផ្សព្វផ្សាយអត្ថបទជាសាធារណៈ (Public) លើ Home Page & Blog ដោយជោគជ័យ!"
          : "បានរក្សាទុកអត្ថបទជាលក្ខណៈឯកជន (Private សម្រាប់សមាជិក STJ) ដោយជោគជ័យ!"
      );
      setTimeout(() => {
        router.push("/portal/blog");
      }, 900);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout portalType="portal">
      <form onSubmit={handleSave} className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              href="/portal/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ទៅបញ្ជីអត្ថបទចែករំលែក (Back to STJ Blog)</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
              <PenTool className="w-5 h-5 text-primary" />
              <span>
                {postId
                  ? "កែសម្រួលអត្ថបទ និងមេរៀនចែករំលែក (Edit Blog / Study Article)"
                  : "សរសេរអត្ថបទ និងមេរៀនចែករំលែកថ្មី (Write STJ Blog & Lesson)"}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              អាចសរសេរកូដពណ៌ដូច VS Code, សមីការគណិត-រូបវិទ្យា (LaTeX), ដាក់វីដេអូ YouTube, បង្ហោះឯកសារ R2 និងកំណត់ Thumbnail សម្រាប់ OpenGraph &amp; Home Page។
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/portal/blog">
              <Button type="button" variant="outline" size="sm" className="text-xs">
                បោះបង់ (Cancel)
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              disabled={saving || loading}
              className="text-xs space-x-1.5 px-4"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saving
                  ? "កំពុងរក្សាទុក..."
                  : form.visibility === "PUBLIC"
                  ? "រក្សាទុក & ផ្សាយជាសាធារណៈ (Publish Public)"
                  : "រក្សាទុកជាឯកជន (Save Private)"}
              </span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            កំពុងរៀបចំផ្ទាំងសរសេរអត្ថបទ...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Title, Summary & Rich Text Studio */}
            <div className="lg:col-span-8 space-y-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      ចំណងជើងអត្ថបទ ឬមេរៀន (Article / Lesson Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="ឧ. មេរៀនសង្ខេប៖ ការប្រើប្រាស់ Pointer និង Struct ក្នុងភាសា C សម្រាប់សិស្សប្អូនឆ្នាំទី១"
                      className="w-full px-3.5 py-2.5 text-base sm:text-lg font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      សេចក្តីសង្ខេបខ្លី (Short Summary សម្រាប់បង្ហាញខាងក្រៅ &amp; OpenGraph Preview)
                    </label>
                    <textarea
                      rows={2}
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      placeholder="សរសេរសេចក្តីសង្ខេប ១-២ បន្ទាត់ អំពីអត្ថបទនេះ (ប្រសិនបើទុកទទេ ប្រព័ន្ធនឹងទាញចេញពីអត្ថបទដោយស្វ័យប្រវត្តិ)..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 px-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>
                    ខ្លឹមសារអត្ថបទ កូដគំរូ (VS Code) និងរូបមន្តគណិត-រូបវិទ្យា (Math / LaTeX)
                  </span>
                </label>

                <RichTextEditor
                  value={form.richContent}
                  onChange={(html) => setForm((prev) => ({ ...prev, richContent: html }))}
                  attachments={form.attachments}
                  onAttachmentsChange={(items) =>
                    setForm((prev) => ({ ...prev, attachments: items }))
                  }
                  courseCode={form.courseCode}
                  minHeightClass="min-h-[480px]"
                  hideInlineAttachments={true}
                  placeholder="សរសេរអត្ថបទពន្យល់មេរៀន ចុចប៊ូតុង 'VS Code' ដើម្បីដាក់កូដមានពណ៌ ឬចុច 'Math / LaTeX' ដើម្បីសរសេររូបមន្តគណិតវិទ្យា និងរូបវិទ្យា..."
                />
              </div>
            </div>

            {/* Right 4 Columns: Subject, Visibility, Thumbnail, QR & R2 Attachments */}
            <div className="lg:col-span-4 space-y-5">
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>មុខវិជ្ជា និងប្រភេទអត្ថបទ (Subject &amp; Category)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      មុខវិជ្ជាពាក់ព័ន្ធ (Subject)
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
                      className="w-full p-2.5 rounded-xl border border-input bg-background font-medium"
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
                      ស្លាកប្រភេទអត្ថបទ (Category Tag)
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="ឧ. Programming (C/C++) ឬ ត្រៀមប្រឡង Final"
                      className="w-full p-2.5 rounded-xl border border-input bg-background"
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

              <CloudflareR2AttachmentManager
                attachments={form.attachments}
                onAttachmentsChange={(items) =>
                  setForm((prev) => ({ ...prev, attachments: items }))
                }
                courseCode={form.courseCode}
              />
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
