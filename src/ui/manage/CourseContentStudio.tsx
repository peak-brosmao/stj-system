"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import {
  RichTextEditor,
  CloudflareR2AttachmentManager,
  ThumbnailAndVisibilityCard,
  LessonBlogSharePanel,
} from "@/ui/RichTextEditor";
import type { CourseAttachment } from "@/lib/richContent";

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
}

interface StudioProps {
  portalType: "leader" | "system";
  userRole: string;
  userName?: string;
}

function StudioInner({ portalType, userRole, userName = "" }: StudioProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") || "lesson"; // "syllabus" | "lesson"
  const sessionIdParam = searchParams.get("id") || "";
  const courseIdParam = searchParams.get("courseId") || "";

  const isSyllabusMode = modeParam === "syllabus";
  const backHref = portalType === "leader" ? "/leader/sessions" : "/system/sessions";

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    courseId: courseIdParam,
    title: "",
    sessionDate: new Date().toISOString().split("T")[0],
    startTime: "11:30",
    endTime: "13:00",
    room: "SF1 & SF2",
    status: "SCHEDULED",
    richContent: "",
    attachments: [] as CourseAttachment[],
    visibility: "PRIVATE" as "PRIVATE" | "PUBLIC",
    thumbnailUrl: "",
  });

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, ovRes] = await Promise.all([
        fetch("/api/system/sessions"),
        portalType === "leader" ? fetch("/api/portal/overview") : Promise.resolve(null),
      ]);
      const d = await res.json().catch(() => null);
      const ov = ovRes && ovRes.ok ? await ovRes.json().catch(() => null) : null;

      let cs: CourseOption[] = Array.isArray(d?.courses) ? d.courses : [];
      const sessions: any[] = Array.isArray(d?.sessions) ? d.sessions : [];
      const sylMap: Record<string, any> = d?.courseSyllabuses || {};

      if (portalType === "leader" && ov?.leader?.courses) {
        const leaderCourses: any[] = Array.isArray(ov.leader.courses) ? ov.leader.courses : [];
        if (leaderCourses.length > 0) {
          const allowedCodes = new Set(
            leaderCourses.map((c) => String(c.code || "").toUpperCase())
          );
          const allowedIds = new Set(leaderCourses.map((c) => String(c.id || "")));
          cs = cs.filter(
            (c) =>
              allowedCodes.has(String(c.code || "").toUpperCase()) ||
              allowedIds.has(String(c.id || ""))
          );
          if (cs.length === 0) {
            cs = leaderCourses.map((c) => ({
              id: c.id,
              code: c.code,
              titleKh: c.titleKh,
            }));
          }
        }
      }

      setCourses(cs);

      const defaultCourse =
        cs.find((c) => c.id === courseIdParam || c.code === courseIdParam) || cs[0];

      if (isSyllabusMode && defaultCourse) {
        const existingSyl = sylMap[defaultCourse.code] || sylMap[defaultCourse.id];
        setForm((prev) => ({
          ...prev,
          courseId: defaultCourse.id,
          title: `មាតិកាមុខវិជ្ជា ${defaultCourse.code} - ${defaultCourse.titleKh}`,
          richContent: existingSyl?.richContent || existingSyl?.notes || "",
          attachments: Array.isArray(existingSyl?.attachments) ? existingSyl.attachments : [],
          visibility: existingSyl?.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
          thumbnailUrl: existingSyl?.thumbnailUrl || "",
        }));
      } else if (sessionIdParam) {
        const target = sessions.find((s) => String(s.id) === sessionIdParam);
        if (target) {
          setForm({
            courseId: target.courseId || defaultCourse?.id || "",
            title: target.title || "",
            sessionDate: target.sessionDate
              ? new Date(target.sessionDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            startTime: target.startTime || "11:30",
            endTime: target.endTime || "13:00",
            room: target.room || "SF1 & SF2",
            status: target.status || "SCHEDULED",
            richContent:
              target.richContent || (target.notes ? `<p>${target.notes}</p>` : ""),
            attachments: Array.isArray(target.attachments) ? target.attachments : [],
            visibility: target.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
            thumbnailUrl: target.thumbnailUrl || "",
          });
        }
      } else if (defaultCourse) {
        setForm((prev) => ({
          ...prev,
          courseId: defaultCourse.id,
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [portalType, courseIdParam, isSyllabusMode, sessionIdParam]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const activeCourse =
    courses.find((c) => c.id === form.courseId || c.code === form.courseId) || courses[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const plainSummary = form.richContent
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500);

      if (isSyllabusMode) {
        const res = await fetch("/api/system/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isSyllabus: true,
            courseId: form.courseId || activeCourse?.id,
            richContent: form.richContent,
            notes: plainSummary,
            attachments: form.attachments,
            visibility: form.visibility,
            thumbnailUrl: form.thumbnailUrl,
          }),
        });
        const d = await res.json().catch(() => null);
        if (!res.ok) {
          setError(d?.error || "មិនអាចរក្សាទុកមាតិកាមុខវិជ្ជាបានទេ");
          return;
        }
        setSuccessMsg("បានរក្សាទុកមាតិកាមុខវិជ្ជា និងឯកសារ Cloudflare R2 ដោយជោគជ័យ!");
        setTimeout(() => router.push(backHref), 900);
        return;
      }

      if (!form.title.trim()) {
        setError("សូមបញ្ចូលចំណងជើងមេរៀន (Lesson title is required)");
        return;
      }

      const payload = {
        ...(sessionIdParam ? { id: sessionIdParam } : {}),
        courseId: form.courseId || activeCourse?.id,
        title: form.title,
        sessionDate: form.sessionDate,
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room,
        status: form.status,
        notes: plainSummary,
        richContent: form.richContent,
        attachments: form.attachments,
        visibility: form.visibility,
        thumbnailUrl: form.thumbnailUrl,
      };

      const res = await fetch("/api/system/sessions", {
        method: sessionIdParam ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.error || "មិនអាចរក្សាទុកមេរៀនបានទេ");
        return;
      }

      setSuccessMsg("បានរក្សាទុកមេរៀន និងមាតិកាបង្រៀនដោយជោគជ័យ!");
      setTimeout(() => router.push(backHref), 900);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout portalType={portalType} userRole={userRole} userName={userName}>
      <form onSubmit={handleSave} className="space-y-6 max-w-7xl mx-auto">
        {/* Top Studio Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ថយក្រោយទៅបញ្ជីមេរៀន (Back to Lessons &amp; Schedule)</span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {isSyllabusMode
                  ? "សរសេរមាតិកាមុខវិជ្ជា និងឯកសារមេរៀនរួម (Course Syllabus Studio)"
                  : sessionIdParam
                  ? "កែសម្រួលមេរៀន និងមាតិកាបង្រៀន (Lesson Content Studio)"
                  : "បង្កើតមេរៀនថ្មី និងសរសេរមាតិកាបង្រៀន (New Lesson Studio)"}
              </h1>
              {activeCourse && (
                <Badge variant="info" className="font-mono text-xs">
                  {activeCourse.code} • {activeCourse.titleKh}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              សរសេរសេចក្តីពន្យល់មេរៀនពេញលេញ (Rich Text Editor) និងភ្ជាប់ឯកសារ PDF, Video ឬស្លាយបង្រៀននៅលើ Cloudflare R2 សម្រាប់ឱ្យសមាជិកចូលមើល។
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={backHref}>
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
                  : isSyllabusMode
                  ? "រក្សាទុកមាតិកាមុខវិជ្ជា (Save Syllabus)"
                  : "រក្សាទុកមេរៀន & មាតិកា (Save & Publish)"}
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
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            កំពុងរៀបចំផ្ទាំងសរសេរមាតិកាមេរៀន (Loading Studio)...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Full Document Title & Rich Text Studio */}
            <div className="lg:col-span-8 space-y-4">
              {!isSyllabusMode && (
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      ចំណងជើងមេរៀន (Lesson Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="ឧ. ជំពូកទី ១៖ Pointer និងការគ្រប់គ្រង Memory ក្នុងភាសា C"
                      className="w-full px-3.5 py-2.5 text-base sm:text-lg font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>
                      {isSyllabusMode
                        ? "ខ្លឹមសារពន្យល់អំពីមុខវិជ្ជា គោលបំណង និងកម្មវិធីសិក្សា (Course Syllabus & Overview)"
                        : "ខ្លឹមសារមេរៀន សេចក្តីពន្យល់ កូដគំរូ និងលំហាត់ (Lesson Rich Content)"}
                    </span>
                  </label>
                </div>

                <RichTextEditor
                  value={form.richContent}
                  onChange={(html) => setForm((prev) => ({ ...prev, richContent: html }))}
                  attachments={form.attachments}
                  onAttachmentsChange={(items) =>
                    setForm((prev) => ({ ...prev, attachments: items }))
                  }
                  courseCode={activeCourse?.code || "STJ"}
                  minHeightClass="min-h-[460px]"
                  hideInlineAttachments={true}
                  placeholder={
                    isSyllabusMode
                      ? "សរសេរអំពីមុខវិជ្ជាដែលត្រូវបង្រៀន គោលការណ៍វត្តមាន មាតិកាមេរៀនប្រចាំឆមាស និងការណែនាំសម្រាប់សមាជិក..."
                      : "សរសេរខ្លឹមសារមេរៀន ចំណុចសំខាន់ៗ កូដគំរូ ឬលំហាត់អនុវត្តសម្រាប់ឱ្យសមាជិកអាចចូលអានបាន..."
                  }
                />
              </div>
            </div>

            {/* Right 4 Columns: Schedule Metadata & Cloudflare R2 Storage Manager */}
            <div className="lg:col-span-4 space-y-5">
              {/* Course & Schedule Settings Card */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>
                      {isSyllabusMode
                        ? "ព័ត៌មានមុខវិជ្ជា (Course Target)"
                        : "កាលវិភាគ និងបន្ទប់បង្រៀន (Schedule & Room)"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      មុខវិជ្ជាទទួលខុសត្រូវ (Course)
                    </label>
                    <select
                      value={form.courseId}
                      disabled={Boolean(sessionIdParam) || courses.length <= 1}
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-input bg-background font-medium disabled:opacity-70"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!isSyllabusMode && (
                    <>
                      <div>
                        <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-primary" />
                          <span>កាលបរិច្ឆេទបង្រៀន (Date)</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={form.sessionDate}
                          onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-input bg-background"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>ម៉ោងចាប់ផ្តើម</span>
                          </label>
                          <input
                            type="time"
                            required
                            value={form.startTime}
                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-input bg-background"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>ម៉ោងបញ្ចប់</span>
                          </label>
                          <input
                            type="time"
                            required
                            value={form.endTime}
                            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-input bg-background"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>បន្ទប់បង្រៀន (Room / Building)</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.room}
                          onChange={(e) => setForm({ ...form, room: e.target.value })}
                          placeholder="ឧ. SF1 & SF2"
                          className="w-full p-2.5 rounded-xl border border-input bg-background"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          <span>ស្ថានភាពមេរៀន (Status)</span>
                        </label>
                        <select
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-input bg-background"
                        >
                          <option value="SCHEDULED">បានកំណត់ពេល (Scheduled)</option>
                          <option value="COMPLETED">បានបង្រៀនរួច (Completed)</option>
                          <option value="CANCELLED">បានលុបចោល (Cancelled)</option>
                        </select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Thumbnail, OpenGraph & Public/Private Visibility Card */}
              {!isSyllabusMode && (
                <ThumbnailAndVisibilityCard
                  visibility={form.visibility}
                  onVisibilityChange={(vis) => setForm((prev) => ({ ...prev, visibility: vis }))}
                  thumbnailUrl={form.thumbnailUrl}
                  onThumbnailChange={(url) => setForm((prev) => ({ ...prev, thumbnailUrl: url }))}
                  courseCode={activeCourse?.code || "STJ"}
                  titlePreview={form.title}
                />
              )}

              {/* Direct Lesson Share Link & QR Code if editing an existing lesson */}
              {!isSyllabusMode && sessionIdParam && (
                <LessonBlogSharePanel
                  title={form.title || "មេរៀន STJ"}
                  shareUrl={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/blog/${sessionIdParam}`
                      : `/blog/${sessionIdParam}`
                  }
                  visibility={form.visibility}
                  onVisibilityChange={(vis) => setForm((prev) => ({ ...prev, visibility: vis }))}
                />
              )}

              {/* Cloudflare R2 Attachments Manager Card */}
              <CloudflareR2AttachmentManager
                attachments={form.attachments}
                onAttachmentsChange={(items) =>
                  setForm((prev) => ({ ...prev, attachments: items }))
                }
                courseCode={activeCourse?.code || "STJ"}
              />
            </div>
          </div>
        )}
      </form>
    </PortalLayout>
  );
}

export function CourseContentStudio(props: StudioProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-xs text-muted-foreground">
          កំពុងរៀបចំផ្ទាំងសរសេរមាតិកា...
        </div>
      }
    >
      <StudioInner {...props} />
    </Suspense>
  );
}

