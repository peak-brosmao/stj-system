"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileBarChart, Download, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import * as XLSX from "xlsx";

interface ReportRecord {
  no: number;
  memberId: string;
  studentId: string;
  nameKh: string;
  nameEn: string;
  dept: string;
  yr: string;
  status: string;
  remarks: string;
  present?: number;
  late?: number;
  absent?: number;
  excused?: number;
  total?: number;
  rate?: number;
}

interface SessionOption {
  id: string;
  courseCode: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAttendance?: number;
}

export default function LeaderReportsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");
  const [selectedCourse, setSelectedCourse] = useState("PROG101");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("LATEST");
  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setUserInfo({
            name: d.user.fullNameKh || d.user.fullNameEn || "",
            email: d.user.email || "",
          });
        }
        const firstCourseCode = d?.leader?.courses?.[0]?.code || d?.member?.courses?.[0]?.code;
        if (firstCourseCode) {
          setSelectedCourse(firstCourseCode);
        }
      })
      .catch(() => {});
  }, []);

  const loadReportData = useCallback(
    async (courseCode: string, sessionIdChoice: string) => {
      setLoading(true);
      try {
        const [reportsRes, sessionsRes, membersRes] = await Promise.all([
          fetch(`/api/system/reports?academicYear=${selectedAcademicYear}`),
          fetch(`/api/system/sessions`),
          fetch(`/api/system/members?course=${courseCode}`),
        ]);

        const [reportsData, sessionsData, membersData] = await Promise.all([
          reportsRes.ok ? reportsRes.json().catch(() => null) : null,
          sessionsRes.ok ? sessionsRes.json().catch(() => null) : null,
          membersRes.ok ? membersRes.json().catch(() => null) : null,
        ]);

        const allReportMembers: any[] = Array.isArray(reportsData?.members)
          ? reportsData.members
          : [];

        // Compute dynamic course tutor counts
        const counts: Record<string, number> = {
          PROG101: 0,
          MATH101: 0,
          PHYS101: 0,
          CHEM101: 0,
        };
        for (const rm of allReportMembers) {
          if (rm.isExecutive) continue;
          const mCourses: string[] = Array.isArray(rm.courses)
            ? rm.courses
            : rm.course
            ? [rm.course]
            : [];
          for (const c of mCourses) {
            if (counts[c] !== undefined) counts[c]++;
          }
        }
        setCourseCounts(counts);

        const allSessions: SessionOption[] = Array.isArray(sessionsData?.sessions)
          ? sessionsData.sessions.filter(
              (s: any) =>
                (s.courseCode === courseCode || s.course?.code === courseCode) &&
                s.status !== "CANCELLED"
            )
          : [];
        setSessions(allSessions);

        // Determine active session to inspect if LATEST is chosen
        let activeSessionId = sessionIdChoice;
        if (sessionIdChoice === "LATEST") {
          const completedOrMarked =
            allSessions.find(
              (s) => s.status === "COMPLETED" || Number(s.totalAttendance || 0) > 0
            ) || allSessions[0];
          activeSessionId = completedOrMarked ? completedOrMarked.id : "ALL";
        }

        // If a specific session is available, try fetching per-session attendance records
        if (activeSessionId && activeSessionId !== "ALL") {
          const attRes = await fetch(
            `/api/system/attendance?sessionId=${encodeURIComponent(activeSessionId)}`
          ).catch(() => null);

          if (attRes && attRes.ok) {
            const attData = await attRes.json().catch(() => null);
            const enrolled = Array.isArray(attData?.enrolledMembers)
              ? attData.enrolledMembers
              : [];
            const attRecords = Array.isArray(attData?.attendanceRecords)
              ? attData.attendanceRecords
              : [];

            if (enrolled.length > 0) {
              const attByMember = new Map<string, { status: string; remarks?: string }>();
              for (const ar of attRecords) {
                if (ar?.memberId) {
                  attByMember.set(String(ar.memberId), {
                    status: String(ar.status || "PRESENT"),
                    remarks: ar.remarks || "",
                  });
                }
              }

              const sessionRecs: ReportRecord[] = enrolled.map((m: any, idx: number) => {
                const rec = attByMember.get(String(m.id)) || attByMember.get(String(m.memberId));
                const st = rec?.status || (attRecords.length > 0 ? "ABSENT" : "UNMARKED");
                const defaultRemark =
                  st === "PRESENT"
                    ? "មានវត្តមាន"
                    : st === "LATE"
                    ? "មកយឺត"
                    : st === "EXCUSED"
                    ? "មានច្បាប់អនុញ្ញាត"
                    : st === "ABSENT"
                    ? "អវត្តមាន"
                    : "មិនទាន់ស្រង់វត្តមាន";

                return {
                  no: idx + 1,
                  memberId: m.memberId || "-",
                  studentId: m.studentId || "-",
                  nameKh: m.fullNameKh || "-",
                  nameEn: m.fullNameEn || "-",
                  dept: m.department?.code || "-",
                  yr: m.academicYear?.code || "-",
                  status: st,
                  remarks: rec?.remarks ? rec.remarks : defaultRemark,
                };
              });

              setRecords(sessionRecs);
              return;
            }
          }
        }

        // Otherwise build from system reports + course members
        const courseMembers: any[] = Array.isArray(membersData?.members)
          ? membersData.members
          : [];
        const reportMap = new Map<string, any>();
        for (const rm of allReportMembers) {
          if (rm.memberId) reportMap.set(String(rm.memberId), rm);
          if (rm.id) reportMap.set(String(rm.id), rm);
        }

        const fallbackList =
          courseMembers.length > 0
            ? courseMembers
            : allReportMembers.filter(
                (rm) =>
                  !rm.isExecutive &&
                  ((Array.isArray(rm.courses) && rm.courses.includes(courseCode)) ||
                    rm.course === courseCode)
              );

        const recs: ReportRecord[] = fallbackList.map((m: any, idx: number) => {
          const rep = reportMap.get(String(m.memberId)) || reportMap.get(String(m.id)) || m;
          const present = Number(rep?.present ?? 0);
          const late = Number(rep?.late ?? 0);
          const absent = Number(rep?.absent ?? 0);
          const excused = Number(rep?.excused ?? 0);
          const total = Number(rep?.total ?? 0);
          const rate = Number(rep?.rate ?? 0);

          let status = "UNMARKED";
          let remarks = "មិនទាន់មានកំណត់ត្រាវត្តមាន";

          if (total > 0) {
            if (absent > 0 && present === 0 && late === 0) {
              status = "ABSENT";
            } else if (excused > 0 && present === 0 && late === 0) {
              status = "EXCUSED";
            } else if (late > 0 && present === 0) {
              status = "LATE";
            } else {
              status = "PRESENT";
            }
            remarks = `វត្តមាន ${present}/${total} មេរៀន${
              late > 0 ? ` • យឺត ${late}` : ""
            }${excused > 0 ? ` • ច្បាប់ ${excused}` : ""}${
              absent > 0 ? ` • អវត្តមាន ${absent}` : ""
            } (${rate}%)`;
          }

          return {
            no: idx + 1,
            memberId: m.memberId || rep?.memberId || "-",
            studentId: m.studentId || rep?.studentId || "-",
            nameKh: m.fullNameKh || rep?.nameKh || "-",
            nameEn: m.fullNameEn || rep?.nameEn || "-",
            dept: m.department?.code || rep?.dept || "-",
            yr: m.academicYear?.code || rep?.yr || "-",
            status,
            remarks,
            present,
            late,
            absent,
            excused,
            total,
            rate,
          };
        });

        setRecords(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [selectedAcademicYear]
  );

  useEffect(() => {
    loadReportData(selectedCourse, selectedSessionId);
  }, [selectedCourse, selectedSessionId, loadReportData]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${selectedCourse} Attendance`);
    XLSX.writeFile(wb, `STJ_${selectedCourse}_Attendance_Report_${selectedAcademicYear}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ["No.,Member ID,Student ID,Name Kh,Name En,Dept,Year,Status,Remarks\n"];
    const rows = records.map(
      (r) =>
        `${r.no},"${r.memberId}","${r.studentId}","${r.nameKh}","${r.nameEn}","${r.dept}","${r.yr}","${r.status}","${r.remarks}"\n`
    );
    const blob = new Blob(["\uFEFF" + headers + rows.join("")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STJ_${selectedCourse}_Attendance_Report_${selectedAcademicYear}.csv`;
    a.click();
  };

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const excusedCount = records.filter((r) => r.status === "EXCUSED").length;
  const markedRecords = records.filter((r) => r.status !== "UNMARKED");
  const eligibleCount = Math.max(0, markedRecords.length - excusedCount);
  const attendanceRate =
    markedRecords.length > 0
      ? eligibleCount > 0
        ? Math.round(((presentCount + lateCount * 0.5) / eligibleCount) * 100)
        : 100
      : 100;

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName={userInfo.name}
      userEmail={userInfo.email}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileBarChart className="w-4 h-4" />
              <span>Official Attendance Analytics &amp; Export</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              របាយការណ៍ និងស្ថិតិវត្តមាន (Leader Reports)
            </h1>
            <p className="text-xs text-muted-foreground">
              ទិន្នន័យជាក់ស្តែងពី Backend API • ស្រង់តាមវត្តមានពិតប្រាកដក្នុងប្រព័ន្ធ Database
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={loading || records.length === 0}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={exportExcel}
              disabled={loading || records.length === 0}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Excel (.xlsx)
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">មុខវិជ្ជា៖</span>
            {[
              { code: "PROG101", name: "Programming" },
              { code: "MATH101", name: "Mathematics" },
              { code: "PHYS101", name: "Physics" },
              { code: "CHEM101", name: "Chemistry" },
            ].map((c) => {
              const count = courseCounts[c.code];
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCourse(c.code);
                    setSelectedSessionId("LATEST");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCourse === c.code
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {c.name} {typeof count === "number" && count > 0 ? `(${count} នាក់)` : ""}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sessions.length > 0 && (
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
              >
                <option value="LATEST">មេរៀនចុងក្រោយដែលបានស្រង់វត្តមាន (Latest Lesson)</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sessionDate} {s.startTime} - {s.title} ({s.status === "COMPLETED" ? "បានបញ្ចប់" : "តាមកាលវិភាគ"})
                  </option>
                ))}
                <option value="ALL">សរុបគ្រប់មេរៀនទាំងអស់ (All Lessons Summary)</option>
              </select>
            )}

            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            >
              <option value="2026-2027">ឆ្នាំសិក្សា ២០២៦~២០២៧ (Academic Year)</option>
              <option value="2025-2026">ឆ្នាំសិក្សា ២០២៥~២០២៦</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadReportData(selectedCourse, selectedSessionId)}
              disabled={loading}
              className="text-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-muted-foreground">សមាជិកបង្រៀន (Tutors)</div>
              <div className="text-xl font-bold text-foreground mt-1">{records.length} នាក់</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">វត្តមាន (Present)</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {presentCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-amber-600 dark:text-amber-400">យឺត (Late)</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {lateCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-blue-600 dark:text-blue-400">ច្បាប់ (Excused)</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {excusedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-primary">អត្រាវត្តមានមធ្យម</div>
              <div className="text-xl font-bold text-primary mt-1">{attendanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ល.រ</th>
                  <th className="py-3 px-4 font-semibold">កូដ STJ</th>
                  <th className="py-3 px-4 font-semibold">អត្តលេខនិស្សិត</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះពេញ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់ &amp; កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">ស្ថានភាពវត្តមាន</th>
                  <th className="py-3 px-4 font-semibold">សម្គាល់</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                      កំពុងទាញយករបាយការណ៍ពី Backend API...
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.memberId} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground">{r.no}</td>
                      <td className="py-3 px-4 font-mono font-bold text-primary">{r.memberId}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{r.studentId}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{r.nameKh}</div>
                        <div className="text-[10px] text-muted-foreground">{r.nameEn}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground">{r.dept}</span>
                        <span className="text-muted-foreground ml-1">({r.yr})</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            r.status === "PRESENT"
                              ? "success"
                              : r.status === "LATE"
                              ? "warning"
                              : r.status === "EXCUSED"
                              ? "secondary"
                              : r.status === "UNMARKED"
                              ? "outline"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {r.status === "UNMARKED" ? "មិនទាន់ស្រង់" : r.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[11px]">{r.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
