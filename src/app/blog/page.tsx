"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Globe,
  PenTool,
  QrCode,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { LessonBlogSharePanel } from "@/ui/RichTextEditor";
import {
  extractPlainTextSnippet,
  getDefaultCourseThumbnail,
  type CourseAttachment,
} from "@/lib/richContent";

interface PublicBlogItem {
  id: string;
  kind: "BLOG" | "LESSON";
  title: string;
  summary: string;
  richContent: string;
  attachments: CourseAttachment[];
  visibility: "PRIVATE" | "PUBLIC";
  thumbnailUrl: string;
  category: string;
  courseCode: string;
  courseTitle: string;
  courseTitleKh: string;
  date: string;
  authorNameKh: string;
  authorNameEn: string;
  authorRole: string;
}

export default function PublicBlogCatalogPage() {
  const [items, setItems] = useState<PublicBlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModalItem, setQrModalItem] = useState<PublicBlogItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/blog?scope=public")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.items)) {
          setItems(d.items);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    if (courseFilter !== "ALL" && item.courseCode.toUpperCase() !== courseFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.authorNameKh.toLowerCase().includes(q) ||
        item.authorNameEn.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>STJ Knowledge Hub &amp; Senior Mentorship Blog</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  បណ្ណាល័យអត្ថបទ &amp; មេរៀនរៀមច្បង STJ (Senior Blog &amp; Lessons)
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  បណ្ដុំអត្ថបទសិក្សា មេរៀនសង្ខេប កូដគំរូ (C/C++, Python) និងរូបមន្តគណិត-រូបវិទ្យា-គីមីវិទ្យា ដែលរៀបចំដោយនិស្សិតរៀមច្បង STJ ដើម្បីជួយសម្រួលដល់ការសិក្សារបស់សិស្សប្អូននៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                <Link href="/portal/blog/editor">
                  <Button className="w-full text-xs space-x-2 px-5 py-2.5">
                    <PenTool className="w-4 h-4" />
                    <span>សរសេរអត្ថបទចែករំលែក (សម្រាប់សមាជិក STJ)</span>
                  </Button>
                </Link>
                <Link href="/portal/blog">
                  <Button variant="outline" className="w-full text-xs space-x-2 px-5 py-2">
                    <BookOpen className="w-4 h-4" />
                    <span>គ្រប់គ្រងអត្ថបទរបស់ខ្ញុំ (Member Portal)</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Subject Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { code: "ALL", label: "ទាំងអស់ (All Subjects)" },
                { code: "PROG101", label: "PROG101 • Programming" },
                { code: "MATH101", label: "MATH101 • គណិតវិទ្យា" },
                { code: "PHYS101", label: "PHYS101 • រូបវិទ្យា" },
                { code: "CHEM101", label: "CHEM101 • គីមីវិទ្យា" },
              ].map((tab) => (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => setCourseFilter(tab.code)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    courseFilter === tab.code
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកមេរៀន កូដ C ឬរូបមន្ត..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-input bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Public Blog & Lessons Grid */}
          {loading ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              កំពុងទាញយកអត្ថបទ និងមេរៀនសាធារណៈ...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl">
              មិនទាន់មានអត្ថបទ ឬមេរៀនសាធារណៈក្នុងផ្នែកនេះនៅឡើយទេ។
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const snippet = extractPlainTextSnippet(item.richContent, item.summary, 150);
                const thumb =
                  item.thumbnailUrl || getDefaultCourseThumbnail(item.courseCode);

                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden flex flex-col justify-between hover:border-primary/50 hover:shadow-lg transition-all group"
                  >
                    <div>
                      <Link
                        href={`/blog/${encodeURIComponent(item.id)}`}
                        className="block relative h-48 w-full bg-slate-900 overflow-hidden border-b border-border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-[10px] font-bold shadow">
                            {item.courseCode} • {item.category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow">
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200">
                          <span className="inline-flex items-center gap-1 font-medium truncate">
                            <User className="w-3 h-3 text-sky-400 shrink-0" />
                            <span className="truncate">{item.authorNameKh}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-300 shrink-0">
                            <CalendarDays className="w-3 h-3 text-sky-400" />
                            <span>{item.date}</span>
                          </span>
                        </div>
                      </Link>

                      <CardContent className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Badge variant={item.kind === "BLOG" ? "info" : "success"}>
                            {item.kind === "BLOG"
                              ? "អត្ថបទចែករំលែក (Blog)"
                              : "មេរៀនបង្រៀន (Lesson)"}
                          </Badge>
                          {item.attachments?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                              <FileText className="w-3 h-3" />
                              {item.attachments.length} ឯកសារ R2
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/blog/${encodeURIComponent(item.id)}`}
                          className="block font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                        >
                          {item.title}
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {snippet || item.summary}
                        </p>
                      </CardContent>
                    </div>

                    <div className="px-5 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setQrModalItem(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                      >
                        <QrCode className="w-3.5 h-3.5 text-primary" />
                        <span>QR Code សម្រាប់សិស្សប្អូន</span>
                      </button>

                      <Link
                        href={`/blog/${encodeURIComponent(item.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>អានមេរៀនពេញ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* QR Code Popup Modal for Junior Students */}
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
                visibility="PUBLIC"
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
