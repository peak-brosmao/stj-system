"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  Edit3,
  Globe,
  Lock,
  LogIn,
  MapPin,
  QrCode,
  User,
} from "lucide-react";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { LessonBlogSharePanel, RichContentViewer } from "@/ui/RichTextEditor";
import { getDefaultCourseThumbnail, type CourseAttachment } from "@/lib/richContent";

interface BlogDetailItem {
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
  authorNameKh: string;
  authorNameEn: string;
  authorRole: string;
}

export function BlogDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<BlogDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [privateTitle, setPrivateTitle] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/blog?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (r.status === 403 && d?.requiresAuth) {
          setRequiresAuth(true);
          setPrivateTitle(d.title || "មេរៀនឯកជនក្នុងក្រុម STJ");
          return;
        }
        if (d?.item) {
          setItem(d.item);
          setCanEdit(Boolean(d.canEdit));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleVisibility = async (nextVis: "PRIVATE" | "PUBLIC") => {
    if (!item) return;
    setItem({ ...item, visibility: nextVis });
    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          visibility: nextVis,
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ទៅបណ្ណាល័យអត្ថបទ &amp; មេរៀន (Back to STJ Blog)</span>
            </Link>

            {item && (
              <div className="flex flex-wrap items-center gap-2">
                {canEdit && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisibility(
                          item.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"
                        )
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        item.visibility === "PUBLIC"
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/25"
                      }`}
                    >
                      {item.visibility === "PUBLIC" ? (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          <span>Public (សិស្សប្អូនមើលបាន)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Private (សម្រាប់សមាជិក STJ)</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={
                        item.kind === "BLOG"
                          ? `/portal/blog/editor?id=${encodeURIComponent(item.id)}`
                          : `/portal/blog/editor?id=${encodeURIComponent(item.id)}`
                      }
                    >
                      <Button variant="outline" size="sm" className="h-8 text-xs space-x-1">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>កែប្រែអត្ថបទ</span>
                      </Button>
                    </Link>
                  </>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant={showSharePanel ? "default" : "outline"}
                  onClick={() => setShowSharePanel((v) => !v)}
                  className="h-8 text-xs space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>តំណមេរៀន &amp; QR Code</span>
                </Button>
              </div>
            )}
          </div>

          {loading && (
            <div className="py-20 text-center text-xs text-muted-foreground">
              កំពុងទាញយកមាតិកាមេរៀន និងអត្ថបទ...
            </div>
          )}

          {/* Private Content Gate for Unauthenticated Visitors */}
          {!loading && requiresAuth && (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardContent className="p-8 sm:p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-lg mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    មាតិកាឯកជនក្នុងក្រុម (Private STJ Content)
                  </span>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">
                    {privateTitle}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    មេរៀន ឬអត្ថបទនេះត្រូវបានកំណត់ជាលក្ខណៈឯកជន (<strong>Private</strong>) សម្រាប់តែសមាជិកក្នុងក្រុម STJ ប៉ុណ្ណោះ។ សូមចូលគណនីសមាជិក STJ ដើម្បីអាន ឬទាក់ទងប្រធានមុខវិជ្ជាដើម្បីបើកជាសាធារណៈ (Public)។
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/login">
                    <Button className="text-xs space-x-1.5 px-5">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>ចូលគណនីសមាជិក STJ (Member Login)</span>
                    </Button>
                  </Link>
                  <Link href="/blog">
                    <Button variant="outline" className="text-xs space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>មើលមេរៀនសាធារណៈផ្សេងទៀត</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !requiresAuth && !item && (
            <Card>
              <CardContent className="p-10 text-center space-y-3">
                <p className="text-sm font-bold text-foreground">
                  រកមិនឃើញមេរៀន ឬអត្ថបទនេះឡើយ (Article or Lesson not found)
                </p>
                <Link href="/blog">
                  <Button variant="outline" size="sm" className="text-xs">
                    ត្រឡប់ទៅបណ្ណាល័យអត្ថបទ STJ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Full Single Lesson / Blog Article Reader */}
          {!loading && item && (
            <div className="space-y-5">
              {showSharePanel && (
                <LessonBlogSharePanel
                  title={item.title}
                  shareUrl={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/blog/${item.id}`
                      : `/blog/${item.id}`
                  }
                  visibility={item.visibility}
                  onVisibilityChange={canEdit ? handleToggleVisibility : undefined}
                />
              )}

              <Card className="overflow-hidden border-primary/30 shadow-xl">
                {/* Cover Thumbnail Banner */}
                <div className="relative h-56 sm:h-72 w-full bg-slate-950 overflow-hidden border-b border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl || getDefaultCourseThumbnail(item.courseCode)}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold">
                        {item.courseCode} • {item.category}
                      </span>
                      <Badge variant={item.kind === "BLOG" ? "info" : "success"}>
                        {item.kind === "BLOG" ? "អត្ថបទចែករំលែក (Blog)" : "មេរៀនបង្រៀន (Lesson)"}
                      </Badge>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          item.visibility === "PUBLIC"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {item.visibility === "PUBLIC" ? (
                          <>
                            <Globe className="w-3 h-3" />
                            <span>សាធារណៈ (Public សម្រាប់សិស្សប្អូន)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>ឯកជន (Private ក្នុងក្រុម STJ)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
                      {item.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                      <span className="inline-flex items-center gap-1.5 font-medium text-white">
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>
                          {item.authorNameKh} ({item.authorRole})
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
                        <span>{item.date}</span>
                      </span>
                      {item.kind === "LESSON" && (
                        <>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            <span>
                              {item.startTime} - {item.endTime}
                            </span>
                          </span>
                          {item.room && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-sky-400" />
                              <span>បន្ទប់ {item.room}</span>
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rich Content Body */}
                <CardContent className="p-6 sm:p-9">
                  <RichContentViewer
                    richContent={item.richContent}
                    notes={item.summary}
                    attachments={item.attachments}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
