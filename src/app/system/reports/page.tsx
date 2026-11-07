"use client";

import React, { useState, useEffect } from "react";
import { FileBarChart, Download, RefreshCw, BookOpen } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";
import * as XLSX from "xlsx";

interface ReportItem {
  no: number;
  id: string;
  memberId: string;
  studentId: string;
  nameKh: string;
  nameEn: string;
  dept: string;
  yr: string;
  course: string;
  courses?: string[];
  isExecutive?: boolean;
  executiveRoleTitle?: string | null;
  present: number;
  late: number;
  absent: number;
  excused: number;
  total: number;
  rate: number;
  hasSessions: boolean;
}

interface SummaryData {
  totalMembers: number;
  totalTutors?: number;
  totalSessions: number;
  averageRate: number;
  highPerformers: number;
  membersWithSessionsCount: number;
}

export default function SystemReportsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; code: string; titleKh: string }>>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalMembers: 0,
    totalSessions: 0,
    averageRate: 0,
    highPerformers: 0,
    membersWithSessionsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetch(`/api/system/reports?academicYear=${selectedAcademicYear}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setReportData(data.members);
        if (data.summary) setSummary(data.summary);
        if (data.courses) setCourses(data.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedAcademicYear]);

  const filteredData = reportData.filter((r) => {
    const matchesCourse =
      courseFilter === "ALL" ||
      (r.courses && r.courses.includes(courseFilter)) ||
      r.course === courseFilter;
    const matchesDept = deptFilter === "ALL" || r.dept === deptFilter;
    return matchesCourse && matchesDept;
  });

  const exportExcel = () => {
    const worksheetData = filteredData.map((r) => ({
      "No.": r.no,
      "Member ID": r.memberId,
      "Student ID": r.studentId,
      "Full Name (Khmer)": r.nameKh,
      "Full Name (English)": r.nameEn,
      "Department": r.dept,
      "Year Level": r.yr,
      "Assigned Course": r.course,
      "Present Sessions": r.present,
      "Late Sessions": r.late,
      "Absent Sessions": r.absent,
      "Excused Sessions": r.excused,
      "Total Sessions": r.total,
      "Attendance Rate (%)": r.total > 0 ? `${r.rate}%` : "No Sessions",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "STJ Attendance Report");
    XLSX.writeFile(wb, `STJ_Official_Attendance_Report_${selectedAcademicYear}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ["No.,Member ID,Student ID,Name Kh,Name En,Dept,Year,Course,Present,Late,Absent,Excused,Total,Rate%\n"];
    const rows = filteredData.map(
      (r) =>
        `${r.no},"${r.memberId}","${r.studentId}","${r.nameKh}","${r.nameEn}","${r.dept}","${r.yr}","${r.course}",${r.present},${r.late},${r.absent},${r.excused},${r.total},${r.total > 0 ? `${r.rate}%` : "0%"}\n`
    );
    const blob = new Blob(["\uFEFF" + headers + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STJ_Official_Attendance_Report_${selectedAcademicYear}.csv`;
    a.click();
  };

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileBarChart className="w-4 h-4" />
              <span>Official Institutional Reports &amp; Export</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážšáž”áž¶áž™áž€áž¶ážšážŽáŸ áž“áž·áž„ážŸáŸ’ážáž·ážáž·ážœážáŸ’ážáž˜áž¶áž“áž‘áž¼áž‘áž¶áŸ†áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              áž‘áž·áž“áŸ’áž“áž“áŸáž™áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž–áž¸ Backend API â€¢ ážŸáŸ’ážšáž„áŸ‹ážáž¶áž˜ážœážáŸ’ážáž˜áž¶áž“áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážŠáŸ‚áž›áž”áž¶áž“áž€ážáŸ‹ážáŸ’ážšáž¶
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={loading || filteredData.length === 0}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={exportExcel}
              disabled={loading || filteredData.length === 0}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Excel (.xlsx)
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground font-medium"
              >
                <option value="ALL">áž‚áŸ’ážšáž”áŸ‹áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž¶áŸ†áž„ áŸ¤ (All Courses)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    [{c.code}] {c.titleKh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
              >
                <option value="ALL">áž‚áŸ’ážšáž”áŸ‹ áŸ© ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (All Departments)</option>
                <option value="GIC">GIC (Computer Engineering)</option>
                <option value="GTI">GTI (Information Technology)</option>
                <option value="AMS">AMS (Applied Mathematics)</option>
                <option value="GIM">GIM (Industrial &amp; Mechanical)</option>
                <option value="GCI">GCI (Civil Engineering)</option>
                <option value="GTR">GTR (Telecomm &amp; Network)</option>
                <option value="GEE">GEE (Electrical &amp; Energy)</option>
                <option value="GAR">GAR (Rural Engineering)</option>
                <option value="GCA">GCA (Civil &amp; Agronomy)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            >
              <option value="2026-2027">áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¦~áŸ¢áŸ áŸ¢áŸ§ (Academic Year)</option>
              <option value="2025-2026">áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¥~áŸ¢áŸ áŸ¢áŸ¦</option>
            </select>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-muted-foreground">ážŸáž˜áž¶áž‡áž·áž€áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’ážážŸážšáž»áž”</div>
              <div className="text-2xl font-bold text-foreground mt-1">{summary.totalMembers} áž“áž¶áž€áŸ‹</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                áž‚áŸ’ážšáž¼áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž {summary.totalMembers > 2 ? summary.totalMembers - 2 : summary.totalMembers} áž“áž¶áž€áŸ‹ â€¢ ážáŸ’áž“áž¶áž€áŸ‹ážŠáž¹áž€áž“áž¶áŸ† áŸ¢ áž“áž¶áž€áŸ‹
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-primary font-medium">áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“áž˜áž’áŸ’áž™áž˜áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„</div>
              <div className="text-2xl font-bold text-primary mt-1">{summary.averageRate}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                áž‚áž·ážáž›áž¾ {summary.membersWithSessionsCount} áž“áž¶áž€áŸ‹ážŠáŸ‚áž›áž˜áž¶áž“ážœážáŸ’ážáž˜áž¶áž“áž€ážáŸ‹ážáŸ’ážšáž¶
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">áž¢ážáŸ’ážšáž¶áž¢áž“áž»ážœážáŸ’ážáž›áŸ’áž¢ (90%+)</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {summary.highPerformers} áž“áž¶áž€áŸ‹
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                áž‚ážŽáž“áž¶áž–áž¸áž‘áž·áž“áŸ’áž“áž“áŸáž™ážŸáŸ’ážšáž„áŸ‹áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-amber-600 dark:text-amber-400">áž…áŸ†áž“áž½áž“áž˜áŸážšáŸ€áž“ážŸážšáž»áž”áž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {summary.totalSessions} áž˜áŸážšáŸ€áž“
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‘áž·áž“áŸ’áž“áž“áŸáž™ SQLite
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">áž›.ážš</th>
                  <th className="py-3 px-4 font-semibold">áž€áž¼ážŠ STJ</th>
                  <th className="py-3 px-4 font-semibold">áž¢ážáŸ’ážáž›áŸážáž“áž·ážŸáŸ’ážŸáž·áž</th>
                  <th className="py-3 px-4 font-semibold">ážˆáŸ’áž˜áŸ„áŸ‡áž–áŸáž‰ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹</th>
                  <th className="py-3 px-4 font-semibold">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž‘áž½áž›ážáž»ážŸážáŸ’ážšáž¼ážœ</th>
                  <th className="py-3 px-4 font-semibold text-center">ážœážáŸ’ážáž˜áž¶áž“</th>
                  <th className="py-3 px-4 font-semibold text-center">áž™ážºáž</th>
                  <th className="py-3 px-4 font-semibold text-center">áž¢ážœážáŸ’ážáž˜áž¶áž“</th>
                  <th className="py-3 px-4 font-semibold text-center">áž…áŸ’áž”áž¶áž”áŸ‹</th>
                  <th className="py-3 px-4 font-semibold text-center">ážŸážšáž»áž”áž˜áŸážšáŸ€áž“</th>
                  <th className="py-3 px-4 font-semibold text-center">áž—áž¶áž‚ážšáž™ážœážáŸ’ážáž˜áž¶áž“</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-muted-foreground text-xs">
                      áž€áŸ†áž–áž»áž„áž‘áž¶áž‰áž™áž€áž‘áž·áž“áŸ’áž“áž“áŸáž™ážšáž”áž¶áž™áž€áž¶ážšážŽáŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž–áž¸ Database...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-muted-foreground text-xs">
                      áž–áž»áŸ†áž˜áž¶áž“áž‘áž·áž“áŸ’áž“áž“áŸáž™ážáŸ’ážšáž¼ážœáž”áž„áŸ’áž áž¶áž‰áž¡áž¾áž™
                    </td>
                  </tr>
                ) : (
                  filteredData.map((r) => (
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
                        {r.isExecutive ? (
                          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {r.course}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {(r.courses && r.courses.length > 0 ? r.courses : [r.course]).map((c) => (
                              <span
                                key={c}
                                className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">
                        {r.isExecutive ? <span className="text-muted-foreground font-normal">-</span> : r.present}
                      </td>
                      <td className="py-3 px-4 text-center text-amber-600 font-semibold">
                        {r.isExecutive ? <span className="text-muted-foreground font-normal">-</span> : r.late}
                      </td>
                      <td className="py-3 px-4 text-center text-rose-600 font-semibold">
                        {r.isExecutive ? <span className="text-muted-foreground font-normal">-</span> : r.absent}
                      </td>
                      <td className="py-3 px-4 text-center text-blue-600 font-semibold">
                        {r.isExecutive ? <span className="text-muted-foreground font-normal">-</span> : r.excused}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {r.isExecutive ? <span className="text-muted-foreground font-normal">-</span> : r.total}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {r.isExecutive ? (
                          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium">
                            ážáŸ’áž“áž¶áž€áŸ‹ážŠáž¹áž€áž“áž¶áŸ†
                          </Badge>
                        ) : r.total === 0 ? (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                            áž˜áž·áž“áž‘áž¶áž“áŸ‹áž”áž„áŸ’ážšáŸ€áž“
                          </Badge>
                        ) : (
                          <Badge
                            variant={r.rate >= 90 ? "success" : r.rate >= 75 ? "warning" : "destructive"}
                            className="text-[10px]"
                          >
                            {r.rate}%
                          </Badge>
                        )}
                      </td>
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
