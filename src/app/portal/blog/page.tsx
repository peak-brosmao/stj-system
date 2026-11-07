"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Lock,
  PenTool,
  Plus,
  QrCode,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { LessonBlogSharePanel } from "@/ui/RichTextEditor";
import {
  extractPlainTextSnippet,
  getDefaultCourseThumbnail,
  type CourseAttachment,
} from "@/lib/richContent";

interface BlogPostItem {
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
  authorId: string;
  authorStudentId: string;
  authorNameKh: string;
  authorNameEn: string;
  authorRole: string;
  updatedAt: string;
}

export default function PortalBlogPage() {
  const [items, setItems] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [qrModalItem, setQrModalItem] = useState<BlogPostItem | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog?scope=mine");
      const data = await res.json().catch(() => null);
      if (Array.isArray(data?.items)) {
        setItems(data.items);
      }
      if (data?.currentUser) {
        setCurrentUser(data.currentUser);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleToggleVisibility = async (
    item: BlogPostItem,
    nextVisibility: "PRIVATE" | "PUBLIC"
  ) => {
    setItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, visibility: nextVisibility } : p))
    );
    setQrModalItem((prev) =>
      prev && prev.id === item.id ? { ...prev, visibility: nextVisibility } : prev
    );
    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          visibility: nextVisibility,
        }),
      });
      if (!res.ok) {
        await loadPosts();
      }
    } catch {
      await loadPosts();
    }
  };

  const handleDelete = async (item: BlogPostItem) => {
    if (!confirm(`តើអ្នកពិតជាចង់លុបអត្ថបទ "${item.title}" មែនទេ?`)) return;
    const res = await fetch(`/api/blog?id=${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    }
  };

  const filteredItems = items.filter((item) => {
    if (visibilityFilter !== "ALL" && item.visibility !== visibilityFilter) {
      return false;
    }
    if (courseFilter !== "ALL" && item.courseCode.toUpperCase() !== courseFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <PenTool className="w-4 h-4" />
              <span>
                {currentUser?.fullNameKh
                  ? `អត្ថបទផ្ទាល់ខ្លួនរបស់៖ ${currentUser.fullNameKh}`
                  : "My Personal Study Blog"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              អត្ថបទរបស់ខ្ញុំ (My Blog &amp; Study Articles)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ទំព័រនេះបង្ហាញតែអត្ថបទដែលអ្នកជាអ្នកបង្កើតផ្ទាល់ប៉ុណ្ណោះ។ មានតែអ្នកម្នាក់គត់ដែលអាចកែប្រែ លុប ឬកំណត់{" "}
              <strong className="text-emerald-500">សាធារណៈ (Public)</strong> /{" "}
              <strong className="text-amber-500">ឯកជន (Private)</strong> សម្រាប់អត្ថបទរបស់អ្នក។
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/blog" target="_blank">
              <Button variant="outline" size="sm" className="text-xs space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>មើលទំព័រ Blog សាធារណៈ</span>
              </Button>
            </Link>
            <Link href="/portal/blog/editor">
              <Button size="sm" className="text-xs space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>សរសេរអត្ថបទថ្មី (Write Blog)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: "ALL", label: "ទាំងអស់ (All My Posts)" },
                { key: "PUBLIC", label: "សាធារណៈ (Public)" },
                { key: "PRIVATE", label: "ឯកជន (Private)" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setVisibilityFilter(t.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  visibilityFilter === t.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}

            <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

            {["ALL", "PROG101", "MATH101", "PHYS101", "CHEM101"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCourseFilter(code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                  courseFilter === code
                    ? "bg-primary/15 text-primary border border-primary/40"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {code === "ALL" ? "គ្រប់មុខវិជ្ជា" : code}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកអត្ថបទរបស់ខ្ញុំ..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-input bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            កំពុងទាញយកអត្ថបទរបស់អ្នក...
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center space-y-3">
              <PenTool className="w-8 h-8 text-primary mx-auto opacity-80" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  អ្នកមិនទាន់បានសរសេរអត្ថបទនៅឡើយទេ
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  ចុចប៊ូតុងខាងក្រោមដើម្បីសរសេរអត្ថបទ ឬមេរៀនសង្ខេបផ្ទាល់ខ្លួនរបស់អ្នក ហើយអ្នកអាចកំណត់ជា Private សម្រាប់ទុកមើលខ្លួនឯង ឬ Public សម្រាប់ចែករំលែកដល់សិស្សប្អូននៅលើ Home Page។
                </p>
              </div>
              <Link href="/portal/blog/editor" className="inline-block pt-1">
                <Button size="sm" className="text-xs space-x-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>សរសេរអត្ថបទដំបូងរបស់ខ្ញុំ</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const snippet = extractPlainTextSnippet(item.richContent, item.summary, 140);
              const thumb =
                item.thumbnailUrl || getDefaultCourseThumbnail(item.courseCode);

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    {/* Thumbnail Cover */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground font-mono text-[10px] font-bold shadow">
                          {item.courseCode} • {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQrModalItem(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md shadow ${
                            item.visibility === "PUBLIC"
                              ? "bg-emerald-500/90 text-white"
                              : "bg-slate-900/90 text-amber-300 border border-amber-500/40"
                          }`}
                          title="ចុចដើម្បីមើល QR Code ឬប្តូរ Public / Private"
                        >
                          {item.visibility === "PUBLIC" ? (
                            <>
                              <Globe className="w-3 h-3" />
                              <span>សាធារណៈ (Public)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>ឯកជន (Private)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200">
                        <span className="inline-flex items-center gap-1 font-medium truncate">
                          <User className="w-3 h-3 text-sky-400 shrink-0" />
                          <span className="truncate">
                            {item.authorNameKh || currentUser?.fullNameKh}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-300 shrink-0">
                          <CalendarDays className="w-3 h-3 text-sky-400" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="info">អត្ថបទរបស់ខ្ញុំ (My Blog)</Badge>
                        {item.attachments?.length > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                            {item.attachments.length} ឯកសារ R2
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/blog/${encodeURIComponent(item.id)}`}
                        className="block font-bold text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {snippet || item.summary}
                      </p>
                    </CardContent>
                  </div>

                  {/* Card Actions */}
                  <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQrModalItem(item)}
                        className="h-7 text-[11px] space-x-1 px-2.5"
                      >
                        <QrCode className="w-3 h-3 text-primary" />
                        <span>Link &amp; QR</span>
                      </Button>

                      <Link href={`/portal/blog/editor?id=${encodeURIComponent(item.id)}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          title="កែប្រែអត្ថបទរបស់ខ្ញុំ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="h-7 text-[11px] px-2 text-destructive hover:bg-destructive/10"
                        title="លុបអត្ថបទរបស់ខ្ញុំ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <Link href={`/blog/${encodeURIComponent(item.id)}`}>
                      <Button size="sm" className="h-7 text-[11px] space-x-1 px-3">
                        <BookOpen className="w-3 h-3" />
                        <span>អានពេញលេញ</span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Share Link & QR Code Modal */}
        {qrModalItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] font-mono font-bold text-primary">
                    {qrModalItem.courseCode} • {qrModalItem.authorNameKh}
                  </span>
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {qrModalItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQrModalItem(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <LessonBlogSharePanel
                title={qrModalItem.title}
                shareUrl={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/blog/${qrModalItem.id}`
                    : `/blog/${qrModalItem.id}`
                }
                visibility={qrModalItem.visibility}
                onVisibilityChange={(vis) => handleToggleVisibility(qrModalItem, vis)}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Link
                  href={`/blog/${encodeURIComponent(qrModalItem.id)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>បើកទំព័រអានអត្ថបទនេះ</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
