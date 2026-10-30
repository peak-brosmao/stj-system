"use client";

import React, { useState } from "react";
import { FileBarChart, Download, Printer, Filter } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import * as XLSX from "xlsx";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export default function LeaderReportsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");

  const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "PRESENT", "PRESENT", "EXCUSED", "PRESENT"];
  const records = OFFICIAL_STJ_ROSTER.map((m, idx) => {
    const st = statuses[idx % statuses.length];
    return {
      no: m.num,
      memberId: m.memberId,
      nameKh: m.nameKh,
      nameEn: m.nameEn,
      studentId: m.studentId,
      dept: m.dept,
      yr: m.year,
      status: st,
      remarks: st === "EXCUSED" ? "សុំច្បាប់ប្រឡងពាក់កណ្តាលឆមាស" : st === "LATE" ? "យឺត ១០ នាទី" : "-",
    };
  });

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PROG101 Attendance");
    XLSX.writeFile(wb, `PROG101_Attendance_Report_${selectedAcademicYear}.xlsx`);
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
    a.download = `PROG101_Attendance_Report_${selectedAcademicYear}.csv`;
    a.click();
  };

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileBarChart className="w-4 h-4" />
              <span>PROG101 Academic Report • វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              របាយការណ៍មុខវិជ្ជា (Course Attendance Report)
            </h1>
            <p className="text-xs text-muted-foreground">
              របាយការណ៍វត្តមានសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ (សរុប ៣៩ នាក់ - មិនសម្រាប់សិស្សប្អូនឡើយ)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-input bg-card text-foreground"
            >
              <option value="2026-2027">ឆ្នាំសិក្សា ២០២៦~២០២៧</option>
              <option value="2027-2028">ឆ្នាំសិក្សា ២០២៧~២០២៨</option>
              <option value="2025-2026">ឆ្នាំសិក្សា ២០២៥~២០២៦</option>
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

        {/* Attendance Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium">សមាជិករៀមច្បងសរុប</span>
              <p className="text-2xl font-bold text-foreground">39</p>
              <p className="text-[10px] text-emerald-600">សកម្មផ្លូវការ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium">វត្តមាន (Present)</span>
              <p className="text-2xl font-bold text-emerald-600">30</p>
              <p className="text-[10px] text-muted-foreground">76.9%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium">យឺត & ច្បាប់</span>
              <p className="text-2xl font-bold text-amber-600">9</p>
              <p className="text-[10px] text-muted-foreground">23.1%</p>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមានទូទៅ</span>
              <p className="text-2xl font-bold text-primary">91.4%</p>
              <p className="text-[10px] text-muted-foreground">រូបមន្តស្ដង់ដារ ITC</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Table */}
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
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold">សម្គាល់</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((r, idx) => (
                  <tr key={r.memberId} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-muted-foreground">{idx + 1}</td>
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
                    <td className="py-3 px-4 text-center">
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
                        {r.status === "PRESENT"
                          ? "វត្តមាន"
                          : r.status === "LATE"
                          ? "យឺត"
                          : r.status === "EXCUSED"
                          ? "ច្បាប់"
                          : "អវត្តមាន"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">{r.remarks}</td>
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
