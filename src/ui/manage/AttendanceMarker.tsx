"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

type Status = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

interface SessionRow {
  id: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface CourseRow {
  id: string;
  code: string;
  titleKh: string;
  sessions: SessionRow[];
}

interface Member {
  id: string;
  memberId: string;
  fullNameKh: string;
  fullNameEn: string;
  department: { code: string };
  academicYear: { code: string };
  isLeader?: boolean;
}

function sortRoster(list: Member[]): Member[] {
  const getYearRank = (code: string) => {
    const m = code.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 99;
  };

  return [...list].sort((a, b) => {
    // 1. Course Leader always on top
    if (a.isLeader && !b.isLeader) return -1;
    if (!a.isLeader && b.isLeader) return 1;

    // 2. Academic Year (I5 > I4 > I3 > I2 > I1)
    const yearA = getYearRank(a.academicYear?.code || "");
    const yearB = getYearRank(b.academicYear?.code || "");
    if (yearA !== yearB) return yearB - yearA;

    // 3. Alphabetical English name (A-Z)
    return (a.fullNameEn || "").localeCompare(b.fullNameEn || "");
  });
}

const OPTIONS: { value: Status; label: string; active: string }[] = [
  { value: "PRESENT", label: "មានវត្តមាន", active: "bg-green-500/20 text-green-600 border-green-500/50" },
  { value: "LATE", label: "យឺត", active: "bg-yellow-500/20 text-yellow-600 border-yellow-500/50" },
  { value: "ABSENT", label: "អវត្តមាន", active: "bg-red-500/20 text-red-600 border-red-500/50" },
  { value: "EXCUSED", label: "ច្បាប់", active: "bg-blue-500/20 text-blue-600 border-blue-500/50" },
];

interface Props {
  portalType: "system" | "leader";
  userRole: string;
  userName: string;
}

function MarkerInner({ portalType, userRole, userName }: Props) {
  const params = useSearchParams();
  const presetSession = params.get("sessionId");

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [courseId, setCourseId] = useState("");
  const [sessionId, setSessionId] = useState(presetSession || "");
  const [members, setMembers] = useState<Member[]>([]);
  const [marks, setMarks] = useState<Record<string, Status | undefined>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Load the courses (and their lessons) this user may manage
  useEffect(() => {
    fetch("/api/system/attendance")
      .then((r) => r.json())
      .then((d) => {
        const list: CourseRow[] = d.courses || [];
        setCourses(list);
        const owner = presetSession ? list.find((c) => c.sessions.some((s) => s.id === presetSession)) : undefined;
        setCourseId(owner?.id || list[0]?.id || "");
      })
      .finally(() => setLoading(false));
  }, [presetSession]);

  const course = courses.find((c) => c.id === courseId);
  const lessons = course?.sessions.filter((s) => s.status !== "CANCELLED") || [];

  // Keep selected lesson valid when the course changes
  useEffect(() => {
    if (!course) return;
    if (!lessons.some((l) => l.id === sessionId)) {
      setSessionId(lessons[0]?.id || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, courses]);

  const loadRoster = useCallback(async (id: string) => {
    if (!id) {
      setMembers([]);
      setMarks({});
      setRemarks({});
      return;
    }
    const res = await fetch(`/api/system/attendance?sessionId=${encodeURIComponent(id)}`);
    const d = await res.json();
    if (!res.ok) {
      setMessage({ kind: "err", text: d.error || "Failed to load" });
      return;
    }
    setMembers(sortRoster(d.enrolledMembers || []));
    const m: Record<string, Status> = {};
    const r: Record<string, string> = {};
    for (const rec of d.attendanceRecords || []) {
      m[rec.memberId] = rec.status as Status;
      if (rec.remarks) r[rec.memberId] = rec.remarks;
    }
    setMarks(m);
    setRemarks(r);
  }, []);

  useEffect(() => {
    setMessage(null);
    loadRoster(sessionId);
  }, [sessionId, loadRoster]);

  const markAll = (status: Status) => {
    const m: Record<string, Status> = {};
    members.forEach((x) => (m[x.id] = status));
    setMarks(m);
  };

  const save = async (finalize: boolean) => {
    if (!sessionId) {
      setMessage({ kind: "err", text: "សូមជ្រើសរើសមេរៀនជាមុនសិន (Select a lesson first)" });
      return;
    }

    const records = members
      .filter((m) => marks[m.id])
      .map((m) => ({ memberId: m.id, status: marks[m.id] as Status, remarks: remarks[m.id] || "" }));
    if (records.length === 0) {
      setMessage({ kind: "err", text: "សូមជ្រើសរើសស្ថានភាពយ៉ាងហោចណាស់មួយ (Mark at least one member)" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/system/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, records, finalize }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage({ kind: "err", text: d?.error || `រក្សាទុកមិនបាន (${res.status})` });
        return;
      }
      setMessage({ kind: "ok", text: "បានរក្សាទុកវត្តមាន (Attendance saved)" });
      // refresh lesson statuses and roster
      const refreshedResponse = await fetch("/api/system/attendance");
      const refreshed = await refreshedResponse.json().catch(() => null);
      if (!refreshedResponse.ok) {
        throw new Error(refreshed?.error || "មិនអាចទាញយកទិន្នន័យថ្មីបានឡើយ");
      }
      setCourses(refreshed.courses || []);
      await loadRoster(sessionId);
    } catch (err: unknown) {
      setMessage({
        kind: "err",
        text: err instanceof Error ? err.message : "រក្សាទុកវត្តមានមិនបាន",
      });
    } finally {
      setSaving(false);
    }
  };

  const markedCount = members.filter((m) => marks[m.id]).length;

  return (
    <PortalLayout portalType={portalType} userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>STJ Attendance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">ស្រង់វត្តមានកូនក្រុម (Mark Attendance)</h1>
          <p className="text-xs text-muted-foreground">
            ប្រធានក្រុមស្រង់ និងកែប្រែវត្តមានបានតែសមាជិកក្នុងមុខវិជ្ជារបស់ខ្លួនប៉ុណ្ណោះ។ (Leaders can only mark and edit
            their own course team.)
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-muted-foreground">កំពុងទាញយកទិន្នន័យ...</p>
        ) : courses.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            មិនមានមុខវិជ្ជាដែលអ្នកអាចគ្រប់គ្រងបានទេ។ (No course is assigned to you.)
          </p>
        ) : (
          <>
            <Card>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">មុខវិជ្ជា (Course)</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.code}] {c.titleKh}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">មេរៀន (Lesson)</label>
                  <select
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                    disabled={lessons.length === 0}
                  >
                    {lessons.length === 0 && <option value="">មិនទាន់មានមេរៀន (No lessons yet)</option>}
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {new Date(l.sessionDate).toISOString().split("T")[0]} {l.startTime} - {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {lessons.length === 0 && (
              <p className="text-xs text-muted-foreground">
                សូមបង្កើតមេរៀនជាមុនសិន នៅត្រង់ &quot;គ្រប់គ្រងមេរៀន&quot;។ (Create a lesson first in the Lessons page.)
              </p>
            )}

            {sessionId && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">ស្រង់ទាំងអស់ (Mark all):</span>
                    {OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => markAll(o.value)}
                        className={`text-[11px] px-2.5 py-1 rounded border font-medium ${o.active}`}
                      >
                        {o.label}
                      </button>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {markedCount} / {members.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {members.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 py-2 px-3 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {m.fullNameKh} ({m.fullNameEn})
                              </p>
                              {m.isLeader && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-300">
                                  ប្រធានក្រុម
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {m.memberId} · {m.academicYear.code}-{m.department.code}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {OPTIONS.map((o) => (
                            <button
                              key={o.value}
                              onClick={() => setMarks({ ...marks, [m.id]: o.value })}
                              className={`text-[11px] px-2.5 py-1 rounded border font-medium transition-colors ${
                                marks[m.id] === o.value
                                  ? o.active + " ring-1 ring-current"
                                  : "border-border text-muted-foreground hover:border-muted-foreground"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                          <input
                            type="text"
                            placeholder="កំណត់ចំណាំ"
                            value={remarks[m.id] || ""}
                            onChange={(e) => setRemarks({ ...remarks, [m.id]: e.target.value })}
                            className="text-[11px] px-2 py-1 rounded border border-input bg-background w-36"
                          />
                        </div>
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        មិនទាន់មានសមាជិកក្នុងក្រុមនេះ។ (No team members assigned.)
                      </p>
                    )}
                  </div>

                  {message && (
                    <div
                      className={`px-3 py-2 rounded-lg text-xs border ${
                        message.kind === "ok"
                          ? "bg-green-500/10 border-green-500/30 text-green-600"
                          : "bg-destructive/10 border-destructive/30 text-destructive"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" disabled={saving || members.length === 0} onClick={() => save(false)} className="text-xs space-x-1.5">
                      <Save className="w-3.5 h-3.5" />
                      <span>រក្សាទុក (Save)</span>
                    </Button>
                    <Button size="sm" disabled={saving || members.length === 0} onClick={() => save(true)} className="text-xs space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>រក្សាទុក និងបញ្ចប់មេរៀន (Save &amp; complete)</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PortalLayout>
  );
}

export function AttendanceMarker(props: Props) {
  return (
    <Suspense fallback={null}>
      <MarkerInner {...props} />
    </Suspense>
  );
}