"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  CalendarCheck,
  Share2,
  Check,
  BookOpen,
  FileText,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { RichContentViewer } from "@/ui/RichTextEditor";
import type { CourseAttachment } from "@/lib/richContent";

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
}

interface SessionItem {
  id: string;
  title: string;
  courseId: string;
  courseCode?: string;
  courseTitleKh?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  status: string;
  notes?: string | null;
  richContent?: string;
  attachments?: CourseAttachment[];
  course: { id: string; code: string; titleKh: string };
  _count: { attendance: number };
  shareToken?: string | null;
}

interface SyllabusData {
  sessionId?: string;
  courseId: string;
  courseCode: string;
  notes: string;
  richContent: string;
  attachments: CourseAttachment[];
}

interface Props {
  portalType: "system" | "leader";
  userRole: string;
  userName: string;
}

export function SessionManager({ portalType, userRole, userName }: Props) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [syllabuses, setSyllabuses] = useState<Record<string, SyllabusData>>({});
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const attendanceHref =
    portalType === "leader" ? "/leader/attendance" : "/system/attendance";
  const editorHref =
    portalType === "leader" ? "/leader/sessions/editor" : "/system/sessions/editor";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, ovRes] = await Promise.all([
        fetch("/api/system/sessions"),
        portalType === "leader" ? fetch("/api/portal/overview") : Promise.resolve(null),
      ]);
      const d = await res.json().catch(() => null);
      const ov = ovRes && ovRes.ok ? await ovRes.json().catch(() => null) : null;

      let list: SessionItem[] = Array.isArray(d?.sessions) ? d.sessions : [];
      let cs: CourseOption[] = Array.isArray(d?.courses) ? d.courses : [];
      const sylMap: Record<string, SyllabusData> = d?.courseSyllabuses || {};

      // Extra client-side safeguard for Leader portal: strictly scope to leader's assigned courses
      if (portalType === "leader" && ov?.leader?.courses) {
        const leaderCourses: any[] = Array.isArray(ov.leader.courses)
          ? ov.leader.courses
          : [];
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

          list = list.filter(
            (s) =>
              allowedCodes.has(
                String(s.course?.code || s.courseCode || "").toUpperCase()
              ) || allowedIds.has(String(s.courseId || s.course?.id || ""))
          );
        }
      }

      setSessions(list);
      setCourses(cs);
      setSyllabuses(sylMap);

      if (cs.length === 1) {
        setCourseFilter(cs[0].code);
      }
    } finally {
      setLoading(false);
    }
  }, [portalType]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCourseObj =
    courses.find((c) => c.code === courseFilter || c.id === courseFilter) || courses[0];

  const activeSyllabus: SyllabusData | null = activeCourseObj
    ? syllabuses[activeCourseObj.code] || syllabuses[activeCourseObj.id] || null
    : null;

  const handleDelete = async (s: SessionItem) => {
    if (!confirm(`លុបមេរៀន "${s.title}" មែនទេ?`)) return;
    const res = await fetch(`/api/system/sessions?id=${encodeURIComponent(s.id)}`, {
      method: "DELETE",
    });
    const d = await res.json();
    if (!res.ok) {
      alert(d.error || "លុបមិនបាន");
      return;
    }
    await load();
  };

  const handleShareSession = async (s: SessionItem) => {
    setSharingId(s.id);
    try {
      let token = s.shareToken;
      if (!token) {
        const res = await fetch("/api/system/share-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${s.course?.code || s.courseCode || "STJ"} - ${s.title}`,
            courseId: s.courseId || s.course?.id || s.course?.code,
            sessionId: s.id,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.link?.token) {
          alert(data?.error || "មិនអាចបង្កើតតំណភ្ជាប់ចែករំលែកបានទេ");
          return;
        }
        token = data.link.token;
        setSessions((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, shareToken: token } : item))
        );
      }

      const shareUrl = `${window.location.origin}/share/${token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      alert("មានបញ្ហាក្នុងការចម្លងតំណភ្ជាប់ចែករំលែក");
    } finally {
      setSharingId(null);
    }
  };

  const filtered = sessions.filter(
    (s) =>
      courseFilter === "ALL" ||
      s.course?.code === courseFilter ||
      s.courseCode === courseFilter
  );

  return (
    <PortalLayout portalType={portalType} userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>
                {portalType === "leader" && activeCourseObj
                  ? `${activeCourseObj.code} • ${activeCourseObj.titleKh}`
                  : "STJ Lessons & Course Content"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              គ្រប់គ្រងមេរៀន មាតិកាបង្រៀន និងកាលវិភាគ (Lessons &amp; Rich Course Materials)
            </h1>
            <p className="text-xs text-muted-foreground">
              សរសេរមាតិកាមុខវិជ្ជា (Full-Page Rich Text Studio) បង្ហោះឯកសារ PDF/Video ទៅលើ Cloudflare R2 និងគ្រប់គ្រងមេរៀនសម្រាប់សមាជិកក្នុងក្រុមរបស់អ្នក។
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeCourseObj && (
              <Link
                href={`${editorHref}?mode=syllabus&courseId=${encodeURIComponent(
                  activeCourseObj.id
                )}`}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs space-x-1.5 border-primary/40 text-primary hover:bg-primary/10"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>សរសេរអំពីមុខវិជ្ជា &amp; ដាក់ PDF (Course Content Studio)</span>
                </Button>
              </Link>
            )}
            <Link
              href={
                activeCourseObj
                  ? `${editorHref}?mode=lesson&courseId=${encodeURIComponent(
                      activeCourseObj.id
                    )}`
                  : `${editorHref}?mode=lesson`
              }
            >
              <Button
                size="sm"
                disabled={courses.length === 0}
                className="text-xs space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>បង្កើតមេរៀនថ្មី (New lesson)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Filter Tabs: Only show multiple tabs if user manages > 1 course */}
        {courses.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {portalType === "system" && (
              <button
                onClick={() => setCourseFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  courseFilter === "ALL"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                ទាំងអស់ (All)
              </button>
            )}
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseFilter(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  courseFilter === c.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                {c.code} • {c.titleKh}
              </button>
            ))}
          </div>
        )}

        {/* Course Overview / Syllabus & R2 Materials Card */}
        {activeCourseObj && (
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <div>
                    <h2 className="text-sm font-bold text-foreground">
                      មាតិកាមុខវិជ្ជា និងឯកសារមេរៀនរួម — [{activeCourseObj.code}]{" "}
                      {activeCourseObj.titleKh}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      សមាជិកក្នុងមុខវិជ្ជានេះអាចចូលមើលសេចក្តីពន្យល់មុខវិជ្ជា និងទាញយកឯកសារ PDF / Video ពី Cloudflare R2 នៅក្នុងទំព័រមុខវិជ្ជារបស់ពួកគេ។
                    </p>
                  </div>
                </div>
                <Link
                  href={`${editorHref}?mode=syllabus&courseId=${encodeURIComponent(
                    activeCourseObj.id
                  )}`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs space-x-1.5 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>បើកទំព័រកែប្រែមាតិកា &amp; ឯកសារ R2</span>
                  </Button>
                </Link>
              </div>

              {activeSyllabus &&
              (activeSyllabus.richContent ||
                activeSyllabus.notes ||
                (activeSyllabus.attachments && activeSyllabus.attachments.length > 0)) ? (
                <div className="pt-2 border-t border-border/60">
                  <RichContentViewer
                    richContent={activeSyllabus.richContent}
                    notes={activeSyllabus.notes}
                    attachments={activeSyllabus.attachments}
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  មិនទាន់មានការសរសេរមាតិកាមុខវិជ្ជា ឬឯកសារ PDF/Video ភ្ជាប់នៅឡើយទេ។ ចុចប៊ូតុង{" "}
                  <strong>&ldquo;បើកទំព័រកែប្រែមាតិកា &amp; ឯកសារ R2&rdquo;</strong> ដើម្បីចូលទៅកាន់ទំព័រ Rich Text Studio។
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => {
            const marked = s._count?.attendance ?? 0;
            const courseCode = s.course?.code || s.courseCode || "STJ";
            const courseTitleKh = s.course?.titleKh || s.courseTitleKh || "មុខវិជ្ជា STJ";
            const isCopied = copiedId === s.id;
            return (
              <Card key={s.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                      {courseCode}
                    </span>
                    <Badge variant={s.status === "COMPLETED" ? "success" : "info"}>
                      {s.status === "COMPLETED"
                        ? "បានបង្រៀនរួច (Completed)"
                        : "បានកំណត់ពេល (Scheduled)"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{courseTitleKh}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {new Date(s.sessionDate).toISOString().split("T")[0]} ({s.startTime} -{" "}
                        {s.endTime})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{s.room || "ITC"}</span>
                    </div>
                  </div>

                  {/* Render Rich Content & Cloudflare R2 Attachments for this lesson */}
                  <RichContentViewer
                    richContent={s.richContent}
                    notes={s.notes || undefined}
                    attachments={s.attachments}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                    <span className="text-[11px] text-muted-foreground">
                      វត្តមានកត់ត្រា៖ <strong className="text-foreground">{marked}</strong>
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={sharingId === s.id}
                        onClick={() => handleShareSession(s)}
                        className="h-7 text-xs space-x-1 border-primary/30 text-primary hover:bg-primary/10"
                        title="ចម្លងតំណភ្ជាប់សាធារណៈសម្រាប់មើលវត្តមាន (Public Share Link)"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">បានចម្លង Link!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>
                              {sharingId === s.id ? "កំពុងបង្កើត..." : "តំណភ្ជាប់ (Share)"}
                            </span>
                          </>
                        )}
                      </Button>

                      <Link href={`${attendanceHref}?sessionId=${s.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs space-x-1">
                          <CalendarCheck className="w-3 h-3" />
                          <span>ស្រង់វត្តមាន</span>
                        </Button>
                      </Link>
                      <Link href={`${editorHref}?mode=lesson&id=${encodeURIComponent(s.id)}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs space-x-1"
                          title="កែប្រែមេរៀន និងមាតិកាក្នុងទំព័រពេញ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>កែប្រែ</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s)}
                        disabled={marked > 0}
                        title={
                          marked > 0
                            ? "មិនអាចលុបមេរៀនដែលមានវត្តមានរួចហើយទេ"
                            : "លុបមេរៀន"
                        }
                        className="h-7 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-xs">
              {loading
                ? "កំពុងទាញយកទិន្នន័យ..."
                : "មិនទាន់មានមេរៀនត្រូវបានបង្កើតទេ។ (No lessons yet.)"}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
