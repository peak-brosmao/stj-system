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
  X,
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
import { RichTextEditor, RichContentViewer } from "@/ui/RichTextEditor";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  // Course Syllabus / Overview Editor Modal state
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusCourseId, setSyllabusCourseId] = useState("");
  const [syllabusRichContent, setSyllabusRichContent] = useState("");
  const [syllabusAttachments, setSyllabusAttachments] = useState<CourseAttachment[]>([]);
  const [savingSyllabus, setSavingSyllabus] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    sessionDate: "2026-11-02",
    startTime: "11:30",
    endTime: "13:00",
    room: "SF1 & SF2",
    status: "SCHEDULED",
    notes: "",
    richContent: "",
    attachments: [] as CourseAttachment[],
  });

  const attendanceHref = portalType === "leader" ? "/leader/attendance" : "/system/attendance";

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

          list = list.filter(
            (s) =>
              allowedCodes.has(String(s.course?.code || s.courseCode || "").toUpperCase()) ||
              allowedIds.has(String(s.courseId || s.course?.id || ""))
          );
        }
      }

      setSessions(list);
      setCourses(cs);
      setSyllabuses(sylMap);

      if (cs.length === 1) {
        setCourseFilter(cs[0].code);
      }
      if (cs[0]) {
        setForm((f) => ({ ...f, courseId: f.courseId || cs[0].id }));
        setSyllabusCourseId((prev) => prev || cs[0].id);
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

  const openSyllabusEditor = (course?: CourseOption) => {
    const target = course || activeCourseObj || courses[0];
    if (!target) return;
    const existing = syllabuses[target.code] || syllabuses[target.id];
    setSyllabusCourseId(target.id);
    setSyllabusRichContent(existing?.richContent || existing?.notes || "");
    setSyllabusAttachments(Array.isArray(existing?.attachments) ? existing.attachments : []);
    setError(null);
    setSyllabusModalOpen(true);
  };

  const handleSaveSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusCourseId) return;
    setSavingSyllabus(true);
    setError(null);
    try {
      const res = await fetch("/api/system/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSyllabus: true,
          courseId: syllabusCourseId,
          richContent: syllabusRichContent,
          notes: syllabusRichContent.replace(/<[^>]+>/g, " ").trim().slice(0, 300),
          attachments: syllabusAttachments,
        }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.error || "មិនអាចរក្សាទុកមាតិកាមុខវិជ្ជាបានទេ");
        return;
      }
      setSyllabusModalOpen(false);
      await load();
    } finally {
      setSavingSyllabus(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setError(null);
    const defaultCourseId = activeCourseObj?.id || courses[0]?.id || "";
    setForm({
      courseId: defaultCourseId,
      title: "",
      sessionDate: new Date().toISOString().split("T")[0],
      startTime: "11:30",
      endTime: "13:00",
      room: "SF1 & SF2",
      status: "SCHEDULED",
      notes: "",
      richContent: "",
      attachments: [],
    });
    setModalOpen(true);
  };

  const openEdit = (s: SessionItem) => {
    setEditing(s);
    setError(null);
    setForm({
      courseId: s.courseId,
      title: s.title,
      sessionDate: new Date(s.sessionDate).toISOString().split("T")[0],
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room || "",
      status: s.status,
      notes: s.notes || "",
      richContent: s.richContent || (s.notes ? `<p>${s.notes}</p>` : ""),
      attachments: Array.isArray(s.attachments) ? s.attachments : [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const plainSummary =
        form.richContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || form.notes;
      const payload = {
        ...form,
        notes: plainSummary,
      };

      const res = await fetch("/api/system/sessions", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "រក្សាទុកមិនបាន");
        return;
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

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

  const selectedFormCourseCode =
    courses.find((c) => c.id === form.courseId || c.code === form.courseId)?.code ||
    activeCourseObj?.code ||
    "STJ";

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
              សរសេរមាតិកាមុខវិជ្ជា (Rich Text Editor) បង្ហោះឯកសារ PDF/Video ទៅលើ Cloudflare R2 និងគ្រប់គ្រងមេរៀនសម្រាប់សមាជិកក្នុងក្រុមរបស់អ្នក។
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {courses.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openSyllabusEditor()}
                className="text-xs space-x-1.5 border-primary/40 text-primary hover:bg-primary/10"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>សរសេរអំពីមុខវិជ្ជា &amp; ដាក់ PDF (Course Content)</span>
              </Button>
            )}
            <Button
              size="sm"
              onClick={openCreate}
              disabled={courses.length === 0}
              className="text-xs space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បង្កើតមេរៀនថ្មី (New lesson)</span>
            </Button>
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
                      មាតិកាមុខវិជ្ជា និងឯកសារមេរៀនរួម — [{activeCourseObj.code}] {activeCourseObj.titleKh}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      សមាជិកក្នុងមុខវិជ្ជានេះអាចចូលមើលសេចក្តីពន្យល់មុខវិជ្ជា និងទាញយកឯកសារ PDF / Video ពី Cloudflare R2 នៅក្នុងទំព័រមុខវិជ្ជារបស់ពួកគេ។
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openSyllabusEditor(activeCourseObj)}
                  className="h-8 text-xs space-x-1.5 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>កែប្រែមាតិកាមុខវិជ្ជា &amp; ឯកសារ R2</span>
                </Button>
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
                  <strong>&ldquo;កែប្រែមាតិកាមុខវិជ្ជា &amp; ឯកសារ R2&rdquo;</strong> ដើម្បីសរសេរ (Rich Text Editor) និងបង្ហោះឯកសារ។
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        className="h-7 text-xs"
                        title="កែប្រែមេរៀន និងមាតិកា"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
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

        {/* Modal 1: Create / Edit Lesson with Rich Text Editor & Cloudflare R2 */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {editing
                    ? "កែប្រែមេរៀន និងមាតិកាបង្រៀន (Edit Lesson & Rich Content)"
                    : "បង្កើតមេរៀនថ្មី និងមាតិកាបង្រៀន (New Lesson & Rich Content)"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {error && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">មុខវិជ្ជា (Course)</label>
                    <select
                      value={form.courseId}
                      disabled={Boolean(editing) || courses.length === 1}
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background disabled:opacity-60"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">ចំណងជើងមេរៀន (Lesson title)</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="ឧ. ជំពូកទី ១៖ Pointer និងការគ្រប់គ្រង Memory"
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium mb-1">កាលបរិច្ឆេទ (Date)</label>
                    <input
                      type="date"
                      required
                      value={form.sessionDate}
                      onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">ម៉ោងចាប់ផ្តើម</label>
                    <input
                      type="time"
                      required
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">ម៉ោងបញ្ចប់</label>
                    <input
                      type="time"
                      required
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">បន្ទប់ (Room)</label>
                    <input
                      type="text"
                      required
                      value={form.room}
                      onChange={(e) => setForm({ ...form, room: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                {editing && (
                  <div>
                    <label className="block font-medium mb-1">ស្ថានភាព (Status)</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    >
                      <option value="SCHEDULED">បានកំណត់ពេល (Scheduled)</option>
                      <option value="COMPLETED">បានបង្រៀនរួច (Completed)</option>
                      <option value="CANCELLED">បានលុបចោល (Cancelled)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold mb-1.5 text-foreground">
                    មាតិកាមេរៀន សេចក្តីពន្យល់ និងឯកសារ PDF/Video (Rich Text Editor &amp; Cloudflare R2)
                  </label>
                  <RichTextEditor
                    value={form.richContent}
                    onChange={(html) => setForm((prev) => ({ ...prev, richContent: html }))}
                    attachments={form.attachments}
                    onAttachmentsChange={(items) =>
                      setForm((prev) => ({ ...prev, attachments: items }))
                    }
                    courseCode={selectedFormCourseCode}
                    placeholder="សរសេរខ្លឹមសារមេរៀន ចំណុចសំខាន់ៗ លំហាត់ ឬកូដគំរូសម្រាប់ឱ្យសមាជិកអាចចូលមើលបាន..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    បោះបង់
                  </Button>
                  <Button type="submit" size="sm" disabled={saving}>
                    {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកមេរៀន & ឯកសារ"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Course Overview / Syllabus Rich Text Editor & Cloudflare R2 */}
        {syllabusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    សរសេរអំពីមុខវិជ្ជាត្រូវបង្រៀន និងឯកសារ PDF/Video (Course Overview &amp; R2 Materials)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    មាតិកានេះនឹងបង្ហាញដល់សមាជិកទាំងអស់ដែលស្ថិតក្នុងមុខវិជ្ជារបស់អ្នកនៅទំព័រមុខវិជ្ជា (/portal/courses)។
                  </p>
                </div>
                <button
                  onClick={() => setSyllabusModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveSyllabus} className="space-y-4 text-xs">
                {courses.length > 1 && (
                  <div>
                    <label className="block font-medium mb-1">ជ្រើសរើសមុខវិជ្ជា (Course)</label>
                    <select
                      value={syllabusCourseId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        setSyllabusCourseId(cid);
                        const cObj = courses.find((c) => c.id === cid || c.code === cid);
                        const ex = cObj ? syllabuses[cObj.code] || syllabuses[cObj.id] : null;
                        setSyllabusRichContent(ex?.richContent || ex?.notes || "");
                        setSyllabusAttachments(Array.isArray(ex?.attachments) ? ex.attachments : []);
                      }}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold mb-1.5 text-foreground">
                    សេចក្តីពន្យល់អំពីមុខវិជ្ជា គោលការណ៍បង្រៀន និងឯកសារភ្ជាប់ (Rich Text Editor)
                  </label>
                  <RichTextEditor
                    value={syllabusRichContent}
                    onChange={setSyllabusRichContent}
                    attachments={syllabusAttachments}
                    onAttachmentsChange={setSyllabusAttachments}
                    courseCode={
                      courses.find((c) => c.id === syllabusCourseId)?.code ||
                      activeCourseObj?.code ||
                      "STJ"
                    }
                    placeholder="សរសេរអំពីមុខវិជ្ជាដែលត្រូវបង្រៀន មាតិកាមេរៀនប្រចាំឆមាស និងបង្ហោះឯកសារ PDF / Video ទៅកាន់ Cloudflare R2..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSyllabusModalOpen(false)}
                  >
                    បោះបង់
                  </Button>
                  <Button type="submit" size="sm" disabled={savingSyllabus}>
                    {savingSyllabus ? "កំពុងរក្សាទុក..." : "រក្សាទុកមាតិកាមុខវិជ្ជា"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
