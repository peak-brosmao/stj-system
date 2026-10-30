"use client";

import React, { useState } from "react";
import { FileBarChart, Download, Printer, Filter, Calendar, Award, ShieldCheck } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import * as XLSX from "xlsx";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export default function SystemReportsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "PRESENT", "PRESENT", "EXCUSED", "PRESENT"];
  const reportData = OFFICIAL_STJ_ROSTER.map((m, idx) => {
    const isExcused = idx % 7 === 6;
    const isLate = idx % 5 === 3;
    const present = isExcused ? 4 : isLate ? 4 : 5;
    const late = isLate ? 1 : 0;
    const excused = isExcused ? 1 : 0;
    const absent = 0;
    const total = 5;
    const rate = Math.round(((present + late * 0.5) / (total - excused)) * 100);

    return {
      no: m.num,
      memberId: m.memberId,
      studentId: m.studentId,
      nameKh: m.nameKh,
      nameEn: m.nameEn,
      dept: m.dept,
      yr: m.year,
      course: m.assignedCourse || (idx % 2 === 0 ? "PROG101" : "MATH101"),
      present,
      late,
      absent,
      excused,
      total,
      rate,
    };
  });

  const filteredData = reportData.filter((r) => {
    const matchesCourse = courseFilter === "ALL" || r.course === courseFilter;
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
      "Course": r.course,
      "Present Sessions": r.present,
      "Late Sessions": r.late,
      "Absent Sessions": r.absent,
      "Excused Sessions": r.excused,
      "Total Teaching Sessions": r.total,
      "Attendance Rate (%)": `${r.rate}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "STJ Attendance Report");
    XLSX.writeFile(workbook, `STJ_Attendance_Report_${selectedAcademicYear}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ["No.,Member ID,Student ID,Name Kh,Name En,Dept,Year,Course,Present,Late,Absent,Excused,Total,Rate\n"];
    const rows = filteredData.map(
      (r) => `${r.no},"${r.memberId}","${r.studentId}","${r.nameKh}","${r.nameEn}","${r.dept}","${r.yr}","${r.course}",${r.present},${r.late},${r.absent},${r.excused},${r.total},${r.rate}%\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STJ_Attendance_Report_${selectedAcademicYear}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Academic Reports • វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              របាយការណ៍វត្តមាន និងស្ថិតិ STJ (Attendance & Analytics)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              របាយការណ៍ផ្លូវការនៃការចុះបង្រៀនរបស់សមាជិករៀមច្បងស្ម័គ្រចិត្ត STJ (សរុប ៣៩ នាក់ - មិនសម្រាប់សិស្សប្អូនឡើយ)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-input bg-card text-foreground"
            >
              <option value="2026-2027">ឆ្នាំសិក្សា ២០២៦~២០២៧ (បច្ចុប្បន្ន)</option>
              <option value="2027-2028">ឆ្នាំសិក្សា ២០២៧~២០២៨</option>
              <option value="2025-2026">ឆ្នាំសិក្សា ២០២៥~២០២៦ (បណ្ណសារ)</option>
            </select>
            <Button variant="outline" size="sm" onClick={exportCSV} className="space-x-1 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button size="sm" onClick={exportExcel} className="space-x-1 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">មុខវិជ្ជា៖</span>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-input bg-background text-foreground"
              >
                <option value="ALL">គ្រប់មុខវិជ្ជា (All Courses)</option>
                <option value="PROG101">Programming (PROG101)</option>
                <option value="MATH101">Mathematics (MATH101)</option>
                <option value="PHYS101">Physics (PHYS101)</option>
                <option value="CHEM101">Chemistry (CHEM101)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">ដេប៉ាតឺម៉ង់៖</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-input bg-background text-foreground"
              >
                <option value="ALL">គ្រប់ ៩ ដេប៉ាតឺម៉ង់</option>
                <option value="GIC">GIC (8 នាក់)</option>
                <option value="GIM">GIM (8 នាក់)</option>
                <option value="GCI">GCI (6 នាក់)</option>
                <option value="GEE">GEE (5 នាក់)</option>
                <option value="AMS">AMS (4 នាក់)</option>
                <option value="GAR">GAR (4 នាក់)</option>
                <option value="GCA">GCA (2 នាក់)</option>
                <option value="GTI">GTI (1 នាក់)</option>
                <option value="GTR">GTR (1 នាក់)</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            បង្ហាញ {filteredData.length} លើ ៣៩ នាក់
          </span>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ល.រ</th>
                  <th className="py-3 px-4 font-semibold">កូដ STJ</th>
                  <th className="py-3 px-4 font-semibold">អត្តលេខ</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះពេញ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់ & កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជា</th>
                  <th className="py-3 px-4 text-center font-semibold">វត្តមាន</th>
                  <th className="py-3 px-4 text-center font-semibold">យឺត</th>
                  <th className="py-3 px-4 text-center font-semibold">ច្បាប់</th>
                  <th className="py-3 px-4 text-center font-semibold">អវត្តមាន</th>
                  <th className="py-3 px-4 text-center font-semibold">អត្រាវត្តមាន</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((r) => (
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
                    <td className="py-3 px-4 font-mono font-semibold text-foreground">{r.course}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-600">{r.present}</td>
                    <td className="py-3 px-4 text-center font-semibold text-amber-600">{r.late}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{r.excused}</td>
                    <td className="py-3 px-4 text-center text-destructive">{r.absent}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={r.rate >= 80 ? "success" : r.rate >= 70 ? "warning" : "destructive"}
                        className="text-[10px]"
                      >
                        {r.rate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
