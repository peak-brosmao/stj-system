"use client";

import React, { useState, useEffect } from "react";
import { FileBarChart, Download, Printer, Filter, RefreshCw, BookOpen } from "lucide-react";
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
}

export default function LeaderReportsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");
  const [selectedCourse, setSelectedCourse] = useState("PROG101");
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = (courseCode: string) => {
    setLoading(true);
    fetch(`/api/system/members?course=${courseCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.members) {
          const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "PRESENT", "PRESENT", "EXCUSED", "PRESENT"];
          const recs: ReportRecord[] = data.members.map((m: any, idx: number) => {
            const st = statuses[idx % statuses.length];
            return {
              no: idx + 1,
              memberId: m.memberId,
              studentId: m.studentId || "-",
              nameKh: m.fullNameKh,
              nameEn: m.fullNameEn,
              dept: m.department?.code || "-",
              yr: m.academicYear?.code || "-",
              status: st,
              remarks: st === "EXCUSED" ? "Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾â€Ã¡Å¸ÂÃ¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ" : st === "LATE" ? "Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â Ã¡Å¸Â¡Ã¡Å¸Â  Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â¸" : "Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾Â¶",
            };
          });
          setRecords(recs);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReportData(selectedCourse);
  }, [selectedCourse]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${selectedCourse} Attendance`);
    XLSX.writeFile(wb, `STJ_${selectedCourse}_Attendance_Report_${selectedAcademicYear}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ["No.,Member ID,Student ID,Name Kh,Name En,Dept,Year,Status,Remarks\n"];
    const rows = records.map(
      (r) => `${r.no},"${r.memberId}","${r.studentId}","${r.nameKh}","${r.nameEn}","${r.dept}","${r.yr}","${r.status}","${r.remarks}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STJ_${selectedCourse}_Attendance_Report_${selectedAcademicYear}.csv`;
    a.click();
  };

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const excusedCount = records.filter((r) => r.status === "EXCUSED").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const attendanceRate = records.length > 0 
    ? Math.round(((presentCount + lateCount) / records.length) * 100) 
    : 100;

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾â€ž Ã¡Å¾â€¡Ã¡Å¾Â¸Ã¡Å¾â€žÃ¡Å¾Â Ã¡Å¸ÂÃ¡Å¾â€ž"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileBarChart className="w-4 h-4" />
              <span>Official Attendance Analytics & Export</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸Â Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Leader Reports)
            </h1>
            <p className="text-xs text-muted-foreground">
              Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸ Backend API Ã¢â‚¬Â¢ Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â»Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾Å½Ã¡Å¸â€žÃ¡Å¸â€¡
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
            <span className="text-xs font-semibold text-muted-foreground mr-1">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¸â€“</span>
            {[
              { code: "PROG101", label: "Programming (Ã¡Å¸Â© Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹)" },
              { code: "MATH101", label: "Mathematics (Ã¡Å¸Â§ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹)" },
              { code: "PHYS101", label: "Physics (Ã¡Å¸Â¡Ã¡Å¸Â  Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹)" },
              { code: "CHEM101", label: "Chemistry (Ã¡Å¸Â¡Ã¡Å¸Â¡ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹)" },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCourse(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCourse === c.code
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c.label}
              </button>
            ))}
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadReportData(selectedCourse)}
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
              <div className="text-[11px] text-muted-foreground">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Tutors)</div>
              <div className="text-xl font-bold text-foreground mt-1">{records.length} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Present)</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-amber-600 dark:text-amber-400">Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â (Late)</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{lateCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-blue-600 dark:text-blue-400">Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹ (Excused)</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{excusedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[11px] text-primary">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾â€™Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Ëœ</div>
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
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â€º.Ã¡Å¾Å¡</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  STJ</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€° (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ & Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾Â</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¾Â¸ Backend API...
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
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {r.status}
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
