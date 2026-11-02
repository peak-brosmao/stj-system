"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Clock, MapPin, CalendarCheck, X, Pencil, Trash2, Ban } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
  titleEn: string;
}

interface SessionItem {
  id: string;
  courseId: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  notes: string | null;
  course: { code: string; titleKh: string };
  _count?: { attendance: number };
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
  SCHEDULED: "បានកំណត់ពេល (Scheduled)",
  IN_PROGRESS: "កំពុងបង្រៀន (In progress)",
  COMPLETED: "បានបង្រៀនរួច (Completed)",
  CANCELLED: "បានលុបចោល (Cancelled)",
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
  startTime: "08:00",
  endTime: "10:00",
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
    const defaultCourse = courseFilter !== "ALL" ? courseFilter : courses[0]?.id || "";
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
    if (!confirm("តើអ្នកចង់លុបចោលមេរៀននេះឬទេ? (Cancel this lesson?)")) return;
    await fetch("/api/system/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, status: "CANCELLED" }),
    });
    load();
  };

  const remove = async (s: SessionItem) => {
    if (!confirm("តើអ្នកចង់លុបមេរៀននេះជាស្ថាពរឬទេ? (Delete this lesson permanently?)")) return;
    const res = await fetch(`/api/system/sessions?id=${encodeURIComponent(s.id)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error || "Delete failed");
    load();
  };

  const visible = sessions.filter((s) => courseFilter === "ALL" || s.courseId === courseFilter);
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
              គ្រប់គ្រងមេរៀន និងកាលវិភាគ (Lessons &amp; Schedule)
            </h1>
            <p className="text-xs text-muted-foreground">
              មេរៀនដែលបង្កើតនៅទីនេះ នឹងបង្ហាញដល់សមាជិកក្នុងក្រុមរបស់មុខវិជ្ជានោះតែប៉ុណ្ណោះ។
              (Lessons created here become visible to that course team only.)
            </p>
          </div>
          <Button size="sm" onClick={openCreate} disabled={courses.length === 0} className="text-xs space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>បង្កើតមេរៀនថ្មី (New lesson)</span>
          </Button>
        </div>

        {courses.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {[{ id: "ALL", code: "ALL" }, ...courses].map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseFilter(c.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  courseFilter === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.code === "ALL" ? "ទាំងអស់ (All)" : c.code}
              </button>
            ))}
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
                    វត្តមានកត់ត្រារួច៖ <strong className="text-foreground">{s._count?.attendance || 0}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link href={attendanceHref(s.id)}>
                      <Button variant="outline" size="sm" className="h-7 text-xs space-x-1">
                        <CalendarCheck className="w-3 h-3 text-primary" />
                        <span>ស្រង់វត្តមាន</span>
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
                ? "កំពុងទាញយកទិន្នន័យ..."
                : "មិនទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយ។ សូមចុច \"បង្កើតមេរៀនថ្មី\"។ (No lessons yet. Create the first one.)"}
            </div>
          )}
        </div>

        {form && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">
                    {form.id ? "កែប្រែមេរៀន (Edit lesson)" : "បង្កើតមេរៀនថ្មី (New lesson)"}
                  </h3>
                  <button onClick={() => setForm(null)} aria-label="Close">
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">មុខវិជ្ជា (Course)</label>
                    <select
                      value={form.courseId}
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                      disabled={courses.length === 1}
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
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">ម៉ោងចាប់ផ្តើម (Start)</label>
                      <input
                        type="time"
                        required
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ម៉ោងបញ្ចប់ (End)</label>
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
                    <label className="block font-medium mb-1">បន្ទប់ (Room)</label>
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
                      <label className="block font-medium mb-1">ស្ថានភាព (Status)</label>
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
                    <label className="block font-medium mb-1">កំណត់ចំណាំ (Notes)</label>
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
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក (Save)"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

