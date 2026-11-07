"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  CalendarCheck,
  X,
  Pencil,
  Trash2,
  Ban,
  Share2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
  titleEn: string;
}

interface SessionItem {
  id: string;
  courseId: string;
  courseCode?: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  notes: string | null;
  course: { id?: string; code: string; titleKh: string };
  _count?: { attendance: number };
  shareToken?: string | null;
  markedCount?: number;
  totalAttendance?: number;
}

interface FormState {
  id?: string;
  courseId: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  notes: string;
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€º (Scheduled)",
  IN_PROGRESS: "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (In progress)",
  COMPLETED: "Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€¦ (Completed)",
  CANCELLED: "Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€ºÃ¡Å¾Â»Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€žÃ¡Å¾â€º (Cancelled)",
};

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "destructive"> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

const emptyForm = (courseId: string): FormState => ({
  courseId,
  title: "",
  sessionDate: new Date().toISOString().split("T")[0],
  startTime: "11:30",
  endTime: "13:00",
  room: "",
  notes: "",
  status: "SCHEDULED",
});

interface Props {
  portalType: "system" | "leader";
  userRole: string;
  userName: string;
}

/**
 * Lesson (teaching session) manager shared by the Leader portal and the System
 * portal. Both talk to /api/system/sessions, so they use the same database and
 * the same permission rules (a Course Leader only sees and edits own course).
 */
export function SessionManager({ portalType, userRole, userName }: Props) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [shareSession, setShareSession] = useState<SessionItem | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const openShareModal = async (s: SessionItem) => {
    setShareSession(s);
    setCopied(false);
    if (s.shareToken) {
      setShareToken(s.shareToken);
      return;
    }
    setShareLoading(true);
    try {
      const courseCode = s.course?.code || s.courseCode || "";
      const courseId = s.courseId || s.course?.id || courseCode;
      const res = await fetch("/api/system/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          sessionId: s.id,
          title: `Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ ${s.title || ""}${courseCode ? ` (${courseCode})` : ""}`,
          showStats: true,
        }),
      });
      const data = await res.json();
      const tok = data.token || data.shareLink?.token || (data.shareUrl ? data.shareUrl.replace("/share/", "") : null);
      if (tok) {
        setShareToken(tok);
        s.shareToken = tok;
      }
    } catch (err) {
      console.error("Failed to generate share link", err);
    } finally {
      setShareLoading(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/sessions");
      const data = await res.json();
      if (res.ok) {
        setSessions(data.sessions || []);
        setCourses(data.courses || []);
      } else {
        setError(data.error || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setError("");
    // If a specific course is filtered, default to that course.
    // Otherwise, do NOT auto-select courses[0] (wrong course bug) Ã¢â‚¬â€
    // leave the form courseId empty so the user must explicitly pick.
    const defaultCourse =
      courseFilter !== "ALL"
        ? courses.find((c) => c.code === courseFilter || c.id === courseFilter)?.id || ""
        : "";
    setForm(emptyForm(defaultCourse));
  };

  const openEdit = (s: SessionItem) => {
    setError("");
    setForm({
      id: s.id,
      courseId: s.courseId,
      title: s.title,
      sessionDate: new Date(s.sessionDate).toISOString().split("T")[0],
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
      notes: s.notes || "",
      status: s.status,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    // Guard: course MUST be explicitly selected (never fall through to a wrong default)
    if (!form.courseId) {
      setError("Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾ËœÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â€œ (Please select a course before saving)");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/system/sessions", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setForm(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const cancelLesson = async (s: SessionItem) => {
    if (!confirm("Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾â€¦Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¾Â»Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€žÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾Â¬Ã¡Å¾â€˜Ã¡Å¸Â? (Cancel this lesson?)")) return;
    await fetch("/api/system/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, status: "CANCELLED" }),
    });
    load();
  };

  const remove = async (s: SessionItem) => {
    if (!confirm("Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾â€¦Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¾Â»Ã¡Å¾â€Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾Å¡Ã¡Å¾Â¬Ã¡Å¾â€˜Ã¡Å¸Â? (Delete this lesson permanently?)")) return;
    const res = await fetch(`/api/system/sessions?id=${encodeURIComponent(s.id)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Delete failed");
    load();
  };

  const visible = sessions.filter((s) => {
    if (courseFilter === "ALL") return true;
    const selected = courses.find((c) => c.id === courseFilter || c.code === courseFilter);
    const targetCode = selected ? selected.code : courseFilter;
    const targetId = selected ? selected.id : courseFilter;
    return (
      s.courseId === targetId ||
      s.courseId === courseFilter ||
      s.course?.id === targetId ||
      s.course?.id === courseFilter ||
      s.courseCode === targetCode ||
      s.course?.code === targetCode ||
      s.courseCode === courseFilter ||
      s.course?.code === courseFilter
    );
  });
  const attendanceHref = (id: string) => `/${portalType}/attendance?sessionId=${id}`;

  return (
    <PortalLayout portalType={portalType} userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>STJ Lessons</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€š (Lessons &amp; Schedule)
            </h1>
            <p className="text-xs text-muted-foreground">
              Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡ Ã¡Å¾â€œÃ¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾Å Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â»Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾Å½Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¸â€
              (Lessons created here become visible to that course team only.)
            </p>
          </div>
          <Button size="sm" onClick={openCreate} disabled={courses.length === 0} className="text-xs space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸ (New lesson)</span>
          </Button>
        </div>

        {courses.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {[{ id: "ALL", code: "ALL" }, ...courses].map((c) => {
              const code = c.code === "ALL" ? "ALL" : c.code;
              const isSelected = courseFilter === code || courseFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCourseFilter(code)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {code === "ALL" ? "Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾Å¸Ã¡Å¸â€¹ (All)" : code}
                </button>
              );
            })}
          </div>
        )}

        {error && !form && (
          <div className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((s) => (
            <Card key={s.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {s.course.code}
                  </span>
                  <Badge variant={STATUS_VARIANT[s.status] || "info"}>{STATUS_LABEL[s.status] || s.status}</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.course.titleKh}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {new Date(s.sessionDate).toISOString().split("T")[0]} ({s.startTime} - {s.endTime})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{s.room}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€¦Ã¡Å¸â€“{" "}
                    <strong className="text-foreground font-semibold">
                      {s._count?.attendance ?? (s as any).totalAttendance ?? (s as any).markedCount ?? 0}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openShareModal(s)}
                      className="h-7 text-xs space-x-1 border-primary/30 text-primary hover:bg-primary/10"
                      title="Ã¡Å¾â€¦Ã¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€ºÃ¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ (Share attendance link with members)"
                    >
                      <Share2 className="w-3 h-3 text-primary" />
                      <span>Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹ (Share)</span>
                    </Button>
                    <Link href={attendanceHref(s.id)}>
                      <Button variant="outline" size="sm" className="h-7 text-xs space-x-1">
                        <CalendarCheck className="w-3 h-3 text-primary" />
                        <span>Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</span>
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openEdit(s)} title="Edit">
                      <Pencil className="w-3 h-3" />
                    </Button>
                    {s.status !== "CANCELLED" && (s._count?.attendance || 0) > 0 && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => cancelLesson(s)} title="Cancel lesson">
                        <Ban className="w-3 h-3" />
                      </Button>
                    )}
                    {(s._count?.attendance || 0) === 0 && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => remove(s)} title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {visible.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-xs">
              {loading
                ? "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢..."
                : "Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€¦ \"Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸\"Ã¡Å¸â€ (No lessons yet. Create the first one.)"}
            </div>
          )}
        </div>

        {form && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">
                    {form.id ? "Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Edit lesson)" : "Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸ (New lesson)"}
                  </h3>
                  <button onClick={() => setForm(null)} aria-label="Close">
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">
                      Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ (Course) <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={form.courseId}
                      required
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      className={`w-full p-2 rounded-lg border bg-background ${
                        !form.courseId ? "border-destructive/60 text-muted-foreground" : "border-input"
                      }`}
                      disabled={courses.length === 1}
                    >
                      {/* Placeholder option: forces user to actively pick a course */}
                      {!form.courseId && (
                        <option value="" disabled>
                          Ã¢â‚¬â€ Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾ËœÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“ Ã¢â‚¬â€
                        </option>
                      )}
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                    {!form.courseId && (
                      <p className="text-[10px] text-destructive mt-1">
                        Ã¢Å¡Â Ã¯Â¸Â Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾â€œÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€žÃ¡Å¾â€¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Lesson title)</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¸ÂÃ¡Å¾â€˜ (Date)</label>
                    <input
                      type="date"
                      required
                      value={form.sessionDate}
                      onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€žÃ¡Å¾â€žÃ¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾Ëœ (Start)</label>
                      <input
                        type="time"
                        required
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€žÃ¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾â€Ã¡Å¸â€¹ (End)</label>
                      <input
                        type="time"
                        required
                        value={form.endTime}
                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾â€Ã¡Å¸â€¹ (Room)</label>
                    <input
                      type="text"
                      required
                      value={form.room}
                      onChange={(e) => setForm({ ...form, room: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  {form.id && (
                    <div>
                      <label className="block font-medium mb-1">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“ (Status)</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      >
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-medium mb-1">Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¶Ã¡Å¸â€  (Notes)</label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  {error && <p className="text-destructive">{error}</p>}

                  <div className="pt-2 flex justify-end space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm(null)}>
                      Ã¡Å¾â€Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€¹
                    </Button>
                    <Button type="submit" size="sm" disabled={saving || !form.courseId}>
                      {saving ? "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬..." : "Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬ (Save)"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Share Attendance Link Modal */}
        {shareSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full shadow-2xl border-primary/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€ºÃ¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Share Attendance Link)
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {shareSession.course.code} Ã¢â‚¬Â¢ {shareSession.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShareSession(null);
                      setShareToken(null);
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {shareLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <p>Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€ºÃ¡Å¸â€šÃ¡Å¾â‚¬...</p>
                  </div>
                ) : shareToken ? (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                      <label className="block text-[11px] font-semibold text-foreground">
                        Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ (Public Attendance URL)
                      </label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== "undefined" ? `${window.location.origin}/share/${shareToken}` : `/share/${shareToken}`}
                          className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-input bg-background select-all"
                        />
                        <Button
                          size="sm"
                          variant={copied ? "default" : "outline"}
                          onClick={() => {
                            const url = `${window.location.origin}/share/${shareToken}`;
                            navigator.clipboard.writeText(url);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2500);
                          }}
                          className="h-8 text-xs shrink-0 space-x-1"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? "Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¦Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾â€ž!" : "Ã¡Å¾â€¦Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾â€ž"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-muted-foreground">
                        Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¸â€”Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¸â€¹ Login
                      </span>
                      <a
                        href={`/share/${shareToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary hover:underline font-semibold text-xs"
                      >
                        <span>Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-destructive">
                    Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾â€ºÃ¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾ÂÃ¡Å¸â€
                  </div>
                )}

                <div className="pt-3 border-t border-border flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShareSession(null);
                      setShareToken(null);
                    }}
                  >
                    Ã¡Å¾â€Ã¡Å¾Â·Ã¡Å¾â€˜
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

