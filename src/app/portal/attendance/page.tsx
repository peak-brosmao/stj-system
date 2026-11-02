"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Download,
  Printer,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import * as XLSX from "xlsx";

export default function MyAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    rate: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/portal/attendance?course=${courseFilter}&status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
        if (data.records) setRecords(data.records);
        if (data.stats) setStats(data.stats);
        if (data.monthlyStats) setMonthlyStats(data.monthlyStats);
        setUpcoming(data.upcoming || []);
        setPending(data.pending || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseFilter, statusFilter]);

  const exportCSV = () => {
    const rows = [
      ["No.", "Course Code", "Course Title", "Session Title", "Date", "Time", "Room", "Status", "Remarks"],
      ...records.map((r, i) => [
        i + 1,
        r.session?.course?.code || "",
        r.session?.course?.titleKh || "",
        r.session?.title || "",
        new Date(r.session?.sessionDate).toLocaleDateString(),
        `${r.session?.startTime} - ${r.session?.endTime}`,
        r.session?.room || "",
        r.status,
        r.remarks || "",
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `STJ_My_Attendance_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge variant="success">វត្តមាន (Present)</Badge>;
      case "LATE":
        return <Badge variant="warning">មកយឺត (Late)</Badge>;
      case "EXCUSED":
        return <Badge variant="purple">ច្បាប់ (Excused)</Badge>;
      case "ABSENT":
      default:
        return <Badge variant="destructive">អវត្តមាន (Absent)</Badge>;
    }
  };

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName={currentUser?.fullNameKh || ""}
      userMemberId={currentUser?.memberId || undefined}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Official Student Attendance Record</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              កំណត់ត្រាវត្តមានរបស់ខ្ញុំ (My Attendance Ledger)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              សមាជិក៖ <strong>{currentUser ? `${currentUser.fullNameKh} (${currentUser.fullNameEn})` : "ពៀក ប្រុសម៉ៅ (PEAK BROSMAO)"}</strong> • {currentUser?.memberId || "STJ033"} • {currentUser?.departmentCode || "I2-GIC"} ({currentUser?.studentId || "e20251455"})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/portal/correction-requests">
              <Button variant="outline" size="sm" className="space-x-1.5 text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                <FileText className="w-3.5 h-3.5" />
                <span>ស្នើសុំកែវត្តមាន</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={exportCSV} className="space-x-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="space-x-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </Button>
          </div>
        </div>

        {/* Attendance KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">វគ្គបង្រៀនសរុប</span>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
              <span className="text-[10px] text-muted-foreground">Sessions Tracked</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">វត្តមាន (Present)</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.present}</p>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">ទាន់ពេលវេលា</span>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">មកយឺត (Late)</span>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.late}</p>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">រាប់ជាវត្តមាន</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">អវត្តមាន (Absent)</span>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.absent}</p>
              <span className="text-[10px] text-muted-foreground">គ្មានការអនុញ្ញាត</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">ច្បាប់ (Excused)</span>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.excused}</p>
              <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80">មិនកាត់ពិន្ទុ</span>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/10">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមាន</span>
              <p className="text-2xl font-extrabold text-primary mt-1">{stats.rate}%</p>
              <span className="text-[10px] text-primary font-medium">Attendance Rate</span>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">មុខវិជ្ជា៖</span>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs"
                >
                  <option value="ALL">គ្រប់មុខវិជ្ជាទាំងអស់ (All Courses)</option>
                  <option value="c-prog">PROG101 - Programming</option>
                  <option value="c-math">MATH101 - Mathematics</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">ស្ថានភាព៖</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs"
                >
                  <option value="ALL">គ្រប់ស្ថានភាពទាំងអស់ (All Status)</option>
                  <option value="PRESENT">វត្តមាន (Present)</option>
                  <option value="LATE">មកយឺត (Late)</option>
                  <option value="EXCUSED">ច្បាប់ (Excused)</option>
                  <option value="ABSENT">អវត្តមាន (Absent)</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-muted-foreground">
              រូបមន្តគណនាផ្លូវការ៖ <code className="font-mono bg-muted px-1.5 py-0.5 rounded">(Present + Late) / (Total - Excused) × 100%</code>
            </span>
          </CardContent>
        </Card>

        {/* Lessons created by the Leader Team (read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              មេរៀនដែលបានរៀបចំដោយប្រធានក្រុម (Lessons set by your Leader Team)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.length === 0 && pending.length === 0 && (
              <p className="text-xs text-muted-foreground">
                ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ។ មេរៀននឹងបង្ហាញនៅទីនេះភ្លាមៗនៅពេល Leader បានបង្កើតវា។ (No lessons have been
                created yet. They appear here as soon as your Leader creates them.)
              </p>
            )}
            {upcoming.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">មេរៀនខាងមុខ (Upcoming)</p>
                {upcoming.map((l: any) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{l.title}</p>
                      <p className="text-muted-foreground">
                        {l.course?.code} • {new Date(l.sessionDate).toISOString().split("T")[0]} • {l.startTime} - {l.endTime} • {l.room}
                      </p>
                    </div>
                    <Badge variant="info">មិនទាន់បង្រៀន (Not taught yet)</Badge>
                  </div>
                ))}
              </div>
            )}
            {pending.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">មេរៀនរង់ចាំការស្រង់វត្តមាន (Awaiting attendance)</p>
                {pending.map((l: any) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{l.title}</p>
                      <p className="text-muted-foreground">
                        {l.course?.code} • {new Date(l.sessionDate).toISOString().split("T")[0]} • {l.startTime} - {l.endTime} • {l.room}
                      </p>
                    </div>
                    <Badge variant="warning">មិនទាន់ស្រង់វត្តមាន (Not marked yet)</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">ប្រវត្តិនៃការចូលរួមវគ្គសិក្សា (Attendance History)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">ល.រ</th>
                    <th className="py-2.5 px-3">មុខវិជ្ជា</th>
                    <th className="py-2.5 px-3">ចំណងជើងវគ្គបង្រៀន</th>
                    <th className="py-2.5 px-3">កាលបរិច្ឆេទ</th>
                    <th className="py-2.5 px-3">ម៉ោងសិក្សា</th>
                    <th className="py-2.5 px-3">បន្ទប់រៀន</th>
                    <th className="py-2.5 px-3">ស្ថានភាព</th>
                    <th className="py-2.5 px-3">កំណត់សម្គាល់</th>
                    <th className="py-2.5 px-3 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 text-muted-foreground">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-primary font-mono">
                        {r.session?.course?.code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">
                        {r.session?.title}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">
                        {new Date(r.session?.sessionDate).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">
                        {r.session?.startTime} - {r.session?.endTime}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">{r.session?.room}</td>
                      <td className="py-2.5 px-3">{getStatusBadge(r.status)}</td>
                      <td className="py-2.5 px-3 text-muted-foreground italic text-[11px] max-w-xs truncate">
                        {r.remarks || "-"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href={`/portal/correction-requests?recordId=${r.id}&status=${r.status}`}
                          className="text-primary hover:underline font-medium text-[11px]"
                        >
                          ស្នើសុំកែ
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 px-3 text-center text-muted-foreground">
                        ពុំទាន់មានកំណត់ត្រាវត្តមានដែលបានកត់ត្រានៅឡើយទេ (No attendance recorded yet)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

