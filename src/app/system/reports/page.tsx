"use client";

import React, { useState, useEffect } from "react";
import { FileBarChart, Download, RefreshCw, BookOpen } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
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
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileBarChart className="w-4 h-4" />
              <span>Official Institutional Reports &amp; Export</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸Â Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸ Backend API Ã¢â‚¬Â¢ Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶
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
              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground font-medium"
              >
                <option value="ALL">Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž Ã¡Å¸Â¤ (All Courses)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    [{c.code}] {c.titleKh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
              >
                <option value="ALL">Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹ Ã¡Å¸Â© Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ (All Departments)</option>
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
              <option value="2026-2027">Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦~Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â§ (Academic Year)</option>
              <option value="2025-2026">Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¥~Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦</option>
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
              <div className="text-[11px] text-muted-foreground">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€</div>
              <div className="text-2xl font-bold text-foreground mt-1">{summary.totalMembers} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â {summary.totalMembers > 2 ? summary.totalMembers - 2 : summary.totalMembers} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹ Ã¢â‚¬Â¢ Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€  Ã¡Å¸Â¢ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-primary font-medium">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾â€™Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾ËœÃ¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€ž</div>
              <div className="text-2xl font-bold text-primary mt-1">{summary.averageRate}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Ã¡Å¾â€šÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¾Â¾ {summary.membersWithSessionsCount} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸â€™Ã¡Å¾Â¢ (90%+)</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {summary.highPerformers} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€ž
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-amber-600 dark:text-amber-400">Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {summary.totalSessions} Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢ SQLite
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
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â€º.Ã¡Å¾Å¡</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  STJ</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€° (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Å¡Ã¡Å¾â„¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸ Database...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢
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
                            Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ 
                          </Badge>
                        ) : r.total === 0 ? (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                            Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ
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
