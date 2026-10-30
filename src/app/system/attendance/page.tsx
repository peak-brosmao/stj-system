"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Save,
  Search,
  Filter,
  AlertCircle,
  Check,
  ShieldAlert,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { calculateAttendanceRate } from "@/lib/utils";
import { AttendanceStatus } from "@/types";

interface EnrolledMember {
  id: string;
  memberId: string;
  fullNameKh: string;
  fullNameEn: string;
  department: { code: string };
  academicYear: { code: string };
}

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
  sessions: Array<{ id: string; title: string; sessionDate: string; status: string }>;
}

function AttendanceContent() {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get("sessionId");

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<string>(initialSessionId || "");
  const [members, setMembers] = useState<EnrolledMember[]>([]);
  const [records, setRecords] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [initialRecords, setInitialRecords] = useState<Record<string, AttendanceStatus>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load courses and initial session
  useEffect(() => {
    fetch("/api/system/attendance")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
          const firstCourse = data.courses[0];
          setSelectedCourseId(firstCourse.id);

          if (!selectedSessionId && firstCourse.sessions && firstCourse.sessions.length > 0) {
            setSelectedSessionId(firstCourse.sessions[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  // When selectedSessionId changes, load enrolled members and current records
  useEffect(() => {
    if (!selectedSessionId) return;

    fetch(`/api/system/attendance?sessionId=${selectedSessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.enrolledMembers) {
          setMembers(data.enrolledMembers);

          const recMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
          const initMap: Record<string, AttendanceStatus> = {};

          data.enrolledMembers.forEach((m: EnrolledMember) => {
            const existing = data.attendanceRecords?.find((r: { memberId: string }) => r.memberId === m.id);
            const status: AttendanceStatus = existing ? existing.status : "ABSENT";
            recMap[m.id] = { status, remarks: existing?.remarks || "" };
            initMap[m.id] = status;
          });

          setRecords(recMap);
          setInitialRecords(initMap);
          setHasUnsavedChanges(false);
        }
      })
      .catch(() => {});
  }, [selectedSessionId]);

  const handleStatusChange = (memberId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], status },
    }));
    setHasUnsavedChanges(true);
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status: "PRESENT" };
      });
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async (finalize: boolean = false) => {
    if (!selectedSessionId) return;
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formattedRecords = Object.entries(records).map(([memberId, val]) => ({
        memberId,
        status: val.status,
        remarks: val.remarks,
      }));

      const res = await fetch("/api/system/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          records: formattedRecords,
          finalize,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save attendance.");
      }

      setSuccessMessage(data.message || "Attendance saved successfully.");
      setHasUnsavedChanges(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving attendance.";
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "ALL" || m.department.code === deptFilter;
    const matchesYear = yearFilter === "ALL" || m.academicYear.code === yearFilter;
    return matchesSearch && matchesDept && matchesYear;
  });

  // Calculate live statistics
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let excusedCount = 0;

  Object.values(records).forEach((r) => {
    if (r.status === "PRESENT") presentCount++;
    else if (r.status === "LATE") lateCount++;
    else if (r.status === "ABSENT") absentCount++;
    else if (r.status === "EXCUSED") excusedCount++;
  });

  const totalMembers = members.length;
  const liveRate = calculateAttendanceRate(presentCount, lateCount, totalMembers, excusedCount);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const currentSessions = selectedCourse?.sessions || [];

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarCheck className="w-4 h-4" />
              <span>STJ Member Teaching Attendance Terminal • វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការស្រង់វត្តមានការចុះបង្រៀនរបស់សមាជិក (STJ Member Teaching Attendance)
            </h1>
            <p className="text-xs text-muted-foreground">
              ស្រង់វត្តមានការចុះបង្រៀនរបស់សមាជិករៀមច្បងស្ម័គ្រចិត្ត STJ (សម្រាប់សមាជិក STJ តែប៉ុណ្ណោះ មិនសម្រាប់សិស្សប្អូនឡើយ)
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              disabled={members.length === 0}
              className="text-xs space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>វត្តមានទាំងអស់ (All Present)</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={saving || members.length === 0}
              className="text-xs space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកបណ្តោះអាសន្ន"}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(true)}
              disabled={saving || members.length === 0}
              className="text-xs space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>បញ្ចប់ការស្រង់វត្តមាន (Finalize)</span>
            </Button>
          </div>
        </div>

        {/* Notices */}
        {hasUnsavedChanges && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>អ្នកមានការផ្លាស់ប្តូរវត្តមានដែលមិនទាន់បានរក្សាទុក (Unsaved Changes)</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSave(false)}
              className="h-7 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300"
            >
              រក្សាទុកឥឡូវនេះ
            </Button>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Course & Session Selector Bar */}
        <Card>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                ជ្រើសរើសមុខវិជ្ជា (Select Course)
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  const c = courses.find((x) => x.id === e.target.value);
                  if (c?.sessions?.[0]) {
                    setSelectedSessionId(c.sessions[0].id);
                  } else {
                    setSelectedSessionId("");
                  }
                }}
                className="w-full text-xs rounded-lg border border-input bg-background p-2 text-foreground focus:ring-2 focus:ring-primary"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.titleKh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                ជ្រើសរើសវគ្គបង្រៀន (Select Session)
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full text-xs rounded-lg border border-input bg-background p-2 text-foreground focus:ring-2 focus:ring-primary"
              >
                {currentSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.status})
                  </option>
                ))}
                {currentSessions.length === 0 && (
                  <option value="">គ្មានវគ្គបង្រៀនទេ</option>
                )}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Live Attendance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-muted-foreground">សរុបក្នុងបញ្ជី</span>
              <p className="text-xl font-bold text-foreground mt-0.5">{totalMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">វត្តមាន (Present)</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{presentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">មកយឺត (Late)</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{lateCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-destructive font-medium">អវត្តមាន (Absent)</span>
              <p className="text-xl font-bold text-destructive mt-0.5">{absentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">ច្បាប់ (Excused)</span>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{excusedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមានផ្ទាល់</span>
              <p className="text-xl font-extrabold text-primary mt-0.5">{liveRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">ដេប៉ាតឺម៉ង់ទាំងអស់</option>
              <option value="GIC">GIC</option>
              <option value="AMS">AMS</option>
              <option value="GIM">GIM</option>
              <option value="GCA">GCA</option>
              <option value="GEE">GEE</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">កម្រិតសិក្សាទាំងអស់</option>
              <option value="I1">I1</option>
              <option value="I2">I2</option>
              <option value="I3">I3</option>
              <option value="I4">I4</option>
              <option value="I5">I5</option>
            </select>
          </div>
        </div>

        {/* Fast Attendance Marking Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">អត្តលេខ</th>
                  <th className="py-3 px-4 font-semibold">គោត្តនាម-នាម (ខ្មែរ / ឡាតាំង)</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-4 font-semibold">ឆ្នាំ</th>
                  <th className="py-3 px-4 font-semibold text-center w-72">ការកំណត់វត្តមាន (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((m) => {
                  const currentStatus = records[m.id]?.status || "ABSENT";
                  return (
                    <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-primary">
                        {m.memberId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                        <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">{m.department.code}</td>
                      <td className="py-3 px-4 font-medium">{m.academicYear.code}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, "PRESENT")}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                              currentStatus === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                          >
                            មានវត្តមាន
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, "LATE")}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                              currentStatus === "LATE"
                                ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                            }`}
                          >
                            មកយឺត
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, "ABSENT")}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                              currentStatus === "ABSENT"
                                ? "bg-red-600 text-white shadow-sm ring-2 ring-red-600/30"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            }`}
                          >
                            អវត្តមាន
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, "EXCUSED")}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                              currentStatus === "EXCUSED"
                                ? "bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30"
                                : "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
                            }`}
                          >
                            ច្បាប់
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                      ពុំមានសមាជិកត្រូវបង្ហាញឡើយ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default function SystemAttendancePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">កំពុងដំណើរការ...</div>}>
      <AttendanceContent />
    </React.Suspense>
  );
}
