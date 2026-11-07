"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Globe,
  Lock,
  MapPin,
  QrCode,
  UserCheck,
  Users,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { LessonBlogSharePanel, RichContentViewer } from "@/ui/RichTextEditor";
import {
  extractPlainTextSnippet,
  getDefaultCourseThumbnail,
  type CourseAttachment,
} from "@/lib/richContent";

interface CourseLesson {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  status: string;
  notes?: string;
  richContent?: string;
  attachments?: CourseAttachment[];
  visibility?: "PRIVATE" | "PUBLIC";
  thumbnailUrl?: string;
  authorNameKh?: string;
  authorNameEn?: string;
}

interface CourseDetail {
  id?: string;
  code: string;
  slug?: string;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  academicTerm: string;
  leaders: Array<{
    fullNameKh?: string;
    full_name_kh?: string;
    fullNameEn?: string;
    full_name_en?: string;
    email: string;
    phone?: string;
    studentId?: string;
    department?: string;
    year?: string;
  }>;
  syllabus?: {
    notes?: string;
    richContent?: string;
    attachments?: CourseAttachment[];
  };
  sessions: CourseLesson[];
  enrolledMembers: Array<{
    memberId?: string;
    member_id?: string;
    studentId?: string;
    fullNameKh?: string;
    full_name_kh?: string;
    fullNameEn?: string;
    full_name_en?: string;
    department?: string;
    year?: string;
  }>;
}

const STATUS: Record<string, { v: "info" | "warning" | "success" | "destructive"; t: string }> = {
  SCHEDULED: { v: "info", t: "តាមកាលវិភាគ (Scheduled)" },
  IN_PROGRESS: { v: "warning", t: "កំពុងបង្រៀន (In progress)" },
  COMPLETED: { v: "success", t: "បានបង្រៀនរួច (Completed)" },
  CANCELLED: { v: "destructive", t: "បានលុបចោល (Cancelled)" },
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (params?.courseId as string) || "";
  const lessonParam = searchParams.get("lesson") || "";

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(lessonParam);
  const [showSharePanel, setShowSharePanel] = useState(false);

  useEffect(() => {
    setSelectedLessonId(lessonParam);
    setShowSharePanel(false);
  }, [lessonParam]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/portal/courses?id=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.course) setCourse(d.course);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const openLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowSharePanel(false);
    router.push(`/portal/courses/${encodeURIComponent(slug)}?lesson=${encodeURIComponent(lessonId)}`);
  };

  const closeSingleLesson = () => {
    setSelectedLessonId("");
    setShowSharePanel(false);
    router.push(`/portal/courses/${encodeURIComponent(slug)}`);
  };

  const handleToggleVisibility = async (
    lesson: CourseLesson,
    nextVisibility: "PRIVATE" | "PUBLIC"
  ) => {
    if (!course) return;
    setCourse({
      ...course,
      sessions: course.sessions.map((s) =>
        s.id === lesson.id ? { ...s, visibility: nextVisibility } : s
      ),
    });

    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lesson.id,
          title: lesson.title,
          notes: lesson.notes || "",
          richContent: lesson.richContent || "",
          attachments: lesson.attachments || [],
          visibility: nextVisibility,
          thumbnailUrl: lesson.thumbnailUrl,
          courseId: course.id,
          courseCode: course.code,
        }),
      });
    } catch {
      // ignore
    }
  };

  const hasSyllabus = Boolean(
    course?.syllabus &&
      (course.syllabus.richContent ||
        course.syllabus.notes ||
        (course.syllabus.attachments && course.syllabus.attachments.length > 0))
  );

  const activeLessonIndex = course
    ? course.sessions.findIndex((s) => String(s.id) === String(selectedLessonId))
    : -1;
  const activeLesson =
    activeLessonIndex >= 0 && course ? course.sessions[activeLessonIndex] : null;
  const prevLesson =
    activeLessonIndex > 0 && course ? course.sessions[activeLessonIndex - 1] : null;
  const nextLesson =
    activeLessonIndex >= 0 && course && activeLessonIndex < course.sessions.length - 1
      ? course.sessions[activeLessonIndex + 1]
      : null;

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        {!course && (
          <>
            <Link
              href="/portal/courses"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ថយក្រោយទៅមុខវិជ្ជាទាំងអស់ (Back to My Courses)</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              {loading ? "កំពុងដំណើរការ..." : "រកមិនឃើញមុខវិជ្ជាឡើយ (Course not found.)"}
            </p>
          </>
        )}

        {/* ========================================================= */}
        {/* SINGLE LESSON DEDICATED VIEW (?lesson=<lessonId>)         */}
        {/* ========================================================= */}
        {course && activeLesson && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeSingleLesson}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  ត្រឡប់ទៅបញ្ជីមេរៀនក្នុងមុខវិជ្ជា {course.titleKh} ({course.code})
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    activeLesson.visibility === "PUBLIC"
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                  }`}
                >
                  {activeLesson.visibility === "PUBLIC" ? (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>សាធារណៈ (Public សម្រាប់សិស្សប្អូន)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>ឯកជន (Private ក្នុងក្រុម STJ)</span>
                    </>
                  )}
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant={showSharePanel ? "default" : "outline"}
                  onClick={() => setShowSharePanel((v) => !v)}
                  className="h-8 text-xs space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>តំណមេរៀន &amp; QR Code (Share Lesson)</span>
                </Button>
              </div>
            </div>

            {showSharePanel && (
              <LessonBlogSharePanel
                title={activeLesson.title}
                shareUrl={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/blog/${activeLesson.id}`
                    : `/blog/${activeLesson.id}`
                }
                visibility={activeLesson.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE"}
              />
            )}

            <Card className="overflow-hidden border-primary/30 shadow-lg">
              {/* Thumbnail Banner */}
              <div className="relative h-48 sm:h-60 w-full bg-slate-900 overflow-hidden border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activeLesson.thumbnailUrl || getDefaultCourseThumbnail(course.code)
                  }
                  alt={activeLesson.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold">
                      {course.code} • {course.titleKh}
                    </span>
                    <Badge variant={STATUS[activeLesson.status]?.v || "info"}>
                      {STATUS[activeLesson.status]?.t || activeLesson.status}
                    </Badge>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                        activeLesson.visibility === "PUBLIC"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {activeLesson.visibility === "PUBLIC" ? (
                        <>
                          <Globe className="w-3 h-3" />
                          <span>Public (សិស្សប្អូនអាចចូលមើលបាន)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Private (សម្រាប់តែសមាជិកក្រុម)</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                    {activeLesson.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>
                        {activeLesson.date} ({activeLesson.time})
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>បន្ទប់ {activeLesson.room}</span>
                    </span>
                    {activeLesson.authorNameKh && (
                      <span className="inline-flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>រៀបចំដោយ៖ {activeLesson.authorNameKh}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-5 sm:p-7">
                {activeLesson.richContent ||
                activeLesson.notes ||
                (activeLesson.attachments && activeLesson.attachments.length > 0) ? (
                  <RichContentViewer
                    richContent={activeLesson.richContent}
                    notes={activeLesson.notes}
                    attachments={activeLesson.attachments}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground py-8 text-center">
                    មេរៀននេះពុំទាន់មានខ្លឹមសារពិស្តារ ឬឯកសារភ្ជាប់នៅឡើយទេ។
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Single-Lesson Footer Navigation (Prev / All / Next) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {prevLesson ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openLesson(prevLesson.id)}
                  className="text-xs space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="max-w-[200px] truncate">មេរៀនមុន៖ {prevLesson.title}</span>
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeSingleLesson}
                className="text-xs"
              >
                មើលបញ្ជីមេរៀនទាំងអស់ ({course.sessions.length})
              </Button>

              {nextLesson ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openLesson(nextLesson.id)}
                  className="text-xs space-x-1.5"
                >
                  <span className="max-w-[200px] truncate">មេរៀនបន្ទាប់៖ {nextLesson.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* COURSE OVERVIEW & COMPACT LESSON CARDS (No ?lesson=...)   */}
        {/* ========================================================= */}
        {course && !activeLesson && (
          <>
            <Link
              href="/portal/courses"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ថយក្រោយ (Back to My Courses)</span>
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="font-mono">{course.code}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{course.titleKh}</h1>
              <p className="text-xs text-muted-foreground mt-1">{course.descriptionKh}</p>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-primary" />
                  ប្រធានក្រុមបង្រៀន (Course Leaders)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {course.leaders.length === 0 && (
                  <p className="text-muted-foreground">ពុំទាន់បានចាត់តាំង (Not assigned yet.)</p>
                )}
                {course.leaders.map((l, idx) => {
                  const nameKh = l.fullNameKh || l.full_name_kh || "ប្រធានក្រុម";
                  const nameEn = l.fullNameEn || l.full_name_en || "";
                  const meta = [l.phone, l.email].filter(Boolean).join(" • ");
                  return (
                    <div
                      key={l.email || idx}
                      className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/60"
                    >
                      <div className="font-semibold text-foreground">
                        {nameKh}{" "}
                        {nameEn ? (
                          <span className="text-muted-foreground font-normal">({nameEn})</span>
                        ) : null}
                      </div>
                      {meta && (
                        <span className="text-muted-foreground font-mono text-[11px]">{meta}</span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Course Overview, Syllabus & Cloudflare R2 Materials */}
            {hasSyllabus && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    មាតិកាមុខវិជ្ជា និងឯកសារមេរៀនរួម (Course Overview &amp; PDF/Video Materials)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentViewer
                    richContent={course.syllabus?.richContent}
                    notes={course.syllabus?.notes}
                    attachments={course.syllabus?.attachments}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  មេរៀន និងឯកសារបង្រៀនតាមវគ្គនីមួយៗ (Lessons — ចុចលើមេរៀនដើម្បីអានពេញលេញ)
                </CardTitle>
                <span className="text-xs text-muted-foreground font-mono">
                  {course.sessions.length} មេរៀន
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.sessions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)
                  </p>
                )}
                {course.sessions.map((s) => {
                  const snippet = extractPlainTextSnippet(s.richContent, s.notes, 160);
                  const attachCount = Array.isArray(s.attachments) ? s.attachments.length : 0;
                  const thumb = s.thumbnailUrl || getDefaultCourseThumbnail(course.code);
                  return (
                    <div
                      key={s.id}
                      className="flex flex-col sm:flex-row gap-3.5 p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all"
                    >
                      {/* Lesson Thumbnail */}
                      <div
                        onClick={() => openLesson(s.id)}
                        className="cursor-pointer w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-border/60 relative"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt={s.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-md ${
                            s.visibility === "PUBLIC"
                              ? "bg-emerald-500/80 text-white"
                              : "bg-slate-900/85 text-amber-300"
                          }`}
                        >
                          {s.visibility === "PUBLIC" ? (
                            <>
                              <Globe className="w-2.5 h-2.5" />
                              <span>Public</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-2.5 h-2.5" />
                              <span>Private</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Lesson Info & 2-Line Preview */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => openLesson(s.id)}
                              className="font-bold text-sm text-foreground hover:text-primary text-left"
                            >
                              {s.title}
                            </button>
                            <Badge variant={STATUS[s.status]?.v || "info"}>
                              {STATUS[s.status]?.t || s.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-primary" />
                              {s.date} ({s.time})
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              {s.room}
                            </span>
                            {attachCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                                <FileText className="w-3 h-3" />
                                {attachCount} ឯកសារ (R2)
                              </span>
                            )}
                          </div>

                          {snippet && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-0.5">
                              {snippet}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Link
                            href={`/blog/${encodeURIComponent(s.id)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-medium text-muted-foreground hover:text-foreground"
                            title="បើកតំណភ្ជាប់ផ្ទាល់សម្រាប់មេរៀននេះតែមួយ (Direct Single Lesson Link)"
                          >
                            <QrCode className="w-3 h-3 text-primary" />
                            <span>តំណផ្ទាល់ &amp; QR</span>
                          </Link>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openLesson(s.id)}
                            className="h-7 text-xs space-x-1"
                          >
                            <span>ចូលមើលមេរៀននេះ</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  ក្រុមគ្រូបង្រៀន (Team) - {course.enrolledMembers.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {course.enrolledMembers.map((m, idx) => {
                  const memberId = m.memberId || m.member_id || `STJ-${idx + 1}`;
                  const nameKh = m.fullNameKh || m.full_name_kh || "សមាជិក STJ";
                  const nameEn = m.fullNameEn || m.full_name_en || "";
                  const deptBadge = [m.year, m.department].filter(Boolean).join("-");
                  return (
                    <div
                      key={`${memberId}-${idx}`}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20"
                    >
                      <div className="min-w-0 truncate">
                        <span className="font-mono text-[11px] font-bold text-primary mr-2">
                          {memberId}
                        </span>
                        <span className="font-semibold text-foreground">{nameKh}</span>
                        {nameEn && (
                          <span className="text-muted-foreground ml-1">({nameEn})</span>
                        )}
                      </div>
                      {deptBadge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                          {deptBadge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
