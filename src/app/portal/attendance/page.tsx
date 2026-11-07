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
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";
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
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  const [isExecutive, setIsExecutive] = useState(false);
  const [executiveCourses, setExecutiveCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalSessions: 0,
    totalAttendance: 0,
    totalMembers: 0,
    averageRate: 0,
  });

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        const profile = data.profile;
        if (!profile) return;
        const user = {
          ...profile,
          memberId: profile.member?.memberId,
          studentId: profile.member?.studentId || profile.studentId,
          fullNameKh: profile.fullNameKh,
          fullNameEn: profile.fullNameEn,
          departmentCode: profile.member?.department?.code,
          role: profile.userRoles?.[0]?.role?.name,
        };
        setCurrentUser(user);
        setIsExecutive(["STJ001", "STJ002"].includes(user.memberId) || ["STJ_PRESIDENT", "STUDENT_ASSOCIATION", "STJ_ADMIN"].includes(user.role));
      })
      .catch(() => {});

    fetch(`/api/portal/attendance?course=${courseFilter}&status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
        if (data.isExecutive) {
          setIsExecutive(true);
          setExecutiveCourses(data.executiveCourses || []);
          setSessions(data.sessions || []);
          if (data.overallStats) setOverallStats(data.overallStats);
        }
        if (data.courses) setEnrolledCourses(data.courses);
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
        return <Badge variant="success">ážœážáŸ’ážáž˜áž¶áž“ (Present)</Badge>;
      case "LATE":
        return <Badge variant="warning">áž˜áž€áž™ážºáž (Late)</Badge>;
      case "EXCUSED":
        return <Badge variant="purple">áž…áŸ’áž”áž¶áž”áŸ‹ (Excused)</Badge>;
      case "ABSENT":
      default:
        return <Badge variant="destructive">áž¢ážœážáŸ’ážáž˜áž¶áž“ (Absent)</Badge>;
    }
  };

  if (isExecutive) {
    return (
      <PortalLayout
        portalType="portal"
        userRole={currentUser?.memberId === "STJ002" ? "áž”áŸ’ážšáž’áž¶áž“ STJ" : "áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„"}
        userName={currentUser?.fullNameKh || ""}
        userMemberId={currentUser?.memberId || undefined}
      >
        <div className="space-y-6">
          {/* Executive Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Executive STJ Attendance Oversight</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                áž€áž¶ážšážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™ áž“áž·áž„ážáž¶áž˜ážŠáž¶áž“ážœážáŸ’ážáž˜áž¶áž“áž‘áž¼áž‘áŸ… (Attendance Oversight)
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž”áŸ’ážšáž’áž¶áž“ STJ áž“áž·áž„áž‚ážŽáŸˆáž€áž˜áŸ’áž˜áž¶áž’áž·áž€áž¶ážšážŸáž˜áž¶áž‚áž˜áž“áž·ážŸáŸ’ážŸáž·áž â€¢ áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ áž“áž·áž„ážáž¶áž˜ážŠáž¶áž“ážœážáŸ’ážáž˜áž¶áž“áž‚áŸ’ážšáž”áŸ‹áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/system/attendance">
                <Button size="sm" className="space-x-1.5 text-xs">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“áž”áŸ’ážšáž–áŸáž“áŸ’áž’</span>
                </Button>
              </Link>
              <Link href="/system/sessions">
                <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <span className="text-[11px] text-muted-foreground font-medium">ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ážŸážšáž»áž” (STJ)</span>
                <p className="text-2xl font-bold text-foreground mt-1">{overallStats.totalSessions}</p>
                <span className="text-[10px] text-muted-foreground">Across All Subjects</span>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 text-center">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">ážœážáŸ’ážáž˜áž¶áž“áž€ážáŸ‹ážáŸ’ážšáž¶ážšáž½áž…</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{overallStats.totalAttendance}</p>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Total Attended</span>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 text-center">
                <span className="text-[11px] text-primary font-medium">áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážšáž½áž˜</span>
                <p className="text-2xl font-bold text-primary mt-1">{overallStats.averageRate}%</p>
                <span className="text-[10px] text-muted-foreground">High Participation</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <span className="text-[11px] text-muted-foreground font-medium">áž‚áŸ’ážšáž¼áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž</span>
                <p className="text-2xl font-bold text-foreground mt-1">{overallStats.totalMembers}</p>
                <span className="text-[10px] text-muted-foreground">Active Tutors</span>
              </CardContent>
            </Card>
          </div>

          {/* Courses Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              ážŸáž„áŸ’ážáŸáž”ážáž¶áž˜áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ (Courses Overview)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {executiveCourses.map((c) => (
                <Card key={c.id} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {c.code}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.sessionCount} ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground truncate">{c.titleKh}</h4>
                    <div className="pt-1 text-[11px] text-muted-foreground border-t border-border space-y-0.5">
                      <div>áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜áŸ– <span className="font-medium text-foreground">{c.leaderName}</span></div>
                      <div>ážŸáž˜áž¶áž‡áž·áž€áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áŸ– <span className="font-semibold text-primary">{c.memberCount} áž“áž¶áž€áŸ‹</span></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sessions Overview Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ áž“áž·áž„áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážáŸ’áž˜áž¸áŸ— (Recent Lessons & Attendance)</span>
                <Link href="/system/sessions" className="text-xs text-primary hover:underline font-normal">
                  áž˜áž¾áž›áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ â†’
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-y border-border">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</th>
                      <th className="py-2.5 px-4 font-semibold">áž…áŸ†ážŽáž„áž‡áž¾áž„áž˜áŸážšáŸ€áž“</th>
                      <th className="py-2.5 px-4 font-semibold">áž€áž¶áž›áž”ážšáž·áž…áŸ’áž†áŸáž‘</th>
                      <th className="py-2.5 px-4 font-semibold">áž”áž“áŸ’áž‘áž”áŸ‹</th>
                      <th className="py-2.5 px-4 font-semibold text-center">ážœážáŸ’ážáž˜áž¶áž“</th>
                      <th className="py-2.5 px-4 font-semibold text-right">ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sessions.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          {s.courseCode}
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">
                          {s.title}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {s.sessionDate} ({s.startTime} - {s.endTime})
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {s.room}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {s.markedCount} áž“áž¶áž€áŸ‹
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/system/attendance?sessionId=${s.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5">
                              ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“
                            </Button>
                          </Link>
                          {s.shareToken && (
                            <Link href={`/share/${s.shareToken}`} target="_blank">
                              <Button size="sm" variant="ghost" className="h-7 text-[11px] px-2 text-primary">
                                ážáŸ†ážŽáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ â†—
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      portalType="portal"
      userRole={currentUser?.role || undefined}
      userName={currentUser?.fullNameKh || currentUser?.name || ""}
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
              áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ† (My Attendance Ledger)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ážŸáž˜áž¶áž‡áž·áž€áŸ– <strong>{currentUser ? `${currentUser.fullNameKh} (${currentUser.fullNameEn})` : "áž–áŸ€áž€ áž”áŸ’ážšáž»ážŸáž˜áŸ‰áŸ… (PEAK BROSMAO)"}</strong> â€¢ {currentUser?.memberId || "STJ033"} â€¢ {currentUser?.departmentCode || "I2-GIC"} ({currentUser?.studentId || "e20251455"})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/portal/correction-requests">
              <Button variant="outline" size="sm" className="space-x-1.5 text-xs border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                <FileText className="w-3.5 h-3.5" />
                <span>ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚ážœážáŸ’ážáž˜áž¶áž“</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={exportCSV} className="space-x-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>áž‘áž¶áž‰áž™áž€ CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="space-x-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>áž”áŸ„áŸ‡áž–áž»áž˜áŸ’áž–</span>
            </Button>
          </div>
        </div>

        {/* Attendance KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ážŸážšáž»áž”</span>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
              <span className="text-[10px] text-muted-foreground">Sessions Tracked</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">ážœážáŸ’ážáž˜áž¶áž“ (Present)</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.present}</p>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">áž‘áž¶áž“áŸ‹áž–áŸáž›ážœáŸáž›áž¶</span>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">áž˜áž€áž™ážºáž (Late)</span>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.late}</p>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">ážšáž¶áž”áŸ‹áž‡áž¶ážœážáŸ’ážáž˜áž¶áž“</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">áž¢ážœážáŸ’ážáž˜áž¶áž“ (Absent)</span>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.absent}</p>
              <span className="text-[10px] text-muted-foreground">áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž¢áž“áž»áž‰áŸ’áž‰áž¶áž</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">áž…áŸ’áž”áž¶áž”áŸ‹ (Excused)</span>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.excused}</p>
              <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80">áž˜áž·áž“áž€áž¶ážáŸ‹áž–áž·áž“áŸ’áž‘áž»</span>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/10">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-primary font-bold">áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“</span>
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
                <span className="font-semibold text-foreground">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áŸ–</span>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs font-medium"
                >
                  {enrolledCourses.length > 1 && (
                    <option value="ALL">áž‚áŸ’ážšáž”áŸ‹áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ ({enrolledCourses.length} áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶)</option>
                  )}
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((c: any) => (
                      <option key={c.id || c.code} value={c.id || c.code}>
                        {c.code} - {c.titleKh || c.titleEn}
                      </option>
                    ))
                  ) : (
                    <option value="c-prog">PROG101 - Programming</option>
                  )}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">ážŸáŸ’ážáž¶áž“áž—áž¶áž–áŸ–</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs"
                >
                  <option value="ALL">áž‚áŸ’ážšáž”áŸ‹ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ (All Status)</option>
                  <option value="PRESENT">ážœážáŸ’ážáž˜áž¶áž“ (Present)</option>
                  <option value="LATE">áž˜áž€áž™ážºáž (Late)</option>
                  <option value="EXCUSED">áž…áŸ’áž”áž¶áž”áŸ‹ (Excused)</option>
                  <option value="ABSENT">áž¢ážœážáŸ’ážáž˜áž¶áž“ (Absent)</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-muted-foreground">
              ážšáž¼áž”áž˜áž“áŸ’ážáž‚ážŽáž“áž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážšáŸ– <code className="font-mono bg-muted px-1.5 py-0.5 rounded">(Present + Late) / (Total - Excused) Ã— 100%</code>
            </span>
          </CardContent>
        </Card>

        {/* Lessons created by the Leader Team (read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              áž˜áŸážšáŸ€áž“ážŠáŸ‚áž›áž”áž¶áž“ážšáŸ€áž”áž…áŸ†ážŠáŸ„áž™áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜ (Lessons set by your Leader Team)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.length === 0 && pending.length === 0 && (
              <p className="text-xs text-muted-foreground">
                áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“áž˜áŸážšáŸ€áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’áž€áž¾ážáž“áŸ…áž¡áž¾áž™áž‘áŸáŸ” áž˜áŸážšáŸ€áž“áž“áž¹áž„áž”áž„áŸ’áž áž¶áž‰áž“áŸ…áž‘áž¸áž“áŸáŸ‡áž—áŸ’áž›áž¶áž˜áŸ—áž“áŸ…áž–áŸáž› Leader áž”áž¶áž“áž”áž„áŸ’áž€áž¾ážážœáž¶áŸ” (No lessons have been
                created yet. They appear here as soon as your Leader creates them.)
              </p>
            )}
            {upcoming.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">áž˜áŸážšáŸ€áž“ážáž¶áž„áž˜áž»áž (Upcoming)</p>
                {upcoming.map((l: any) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{l.title}</p>
                      <p className="text-muted-foreground">
                        {l.course?.code} â€¢ {new Date(l.sessionDate).toISOString().split("T")[0]} â€¢ {l.startTime} - {l.endTime} â€¢ {l.room}
                      </p>
                    </div>
                    <Badge variant="info">áž˜áž·áž“áž‘áž¶áž“áŸ‹áž”áž„áŸ’ážšáŸ€áž“ (Not taught yet)</Badge>
                  </div>
                ))}
              </div>
            )}
            {pending.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">áž˜áŸážšáŸ€áž“ážšáž„áŸ‹áž…áž¶áŸ†áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ (Awaiting attendance)</p>
                {pending.map((l: any) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{l.title}</p>
                      <p className="text-muted-foreground">
                        {l.course?.code} â€¢ {new Date(l.sessionDate).toISOString().split("T")[0]} â€¢ {l.startTime} - {l.endTime} â€¢ {l.room}
                      </p>
                    </div>
                    <Badge variant="warning">áž˜áž·áž“áž‘áž¶áž“áŸ‹ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ (Not marked yet)</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">áž”áŸ’ážšážœážáŸ’ážáž·áž“áŸƒáž€áž¶ážšáž…áž¼áž›ážšáž½áž˜ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ (Attendance History)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">áž›.ážš</th>
                    <th className="py-2.5 px-3">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</th>
                    <th className="py-2.5 px-3">áž…áŸ†ážŽáž„áž‡áž¾áž„ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“</th>
                    <th className="py-2.5 px-3">áž€áž¶áž›áž”ážšáž·áž…áŸ’áž†áŸáž‘</th>
                    <th className="py-2.5 px-3">áž˜áŸ‰áŸ„áž„ážŸáž·áž€áŸ’ážŸáž¶</th>
                    <th className="py-2.5 px-3">áž”áž“áŸ’áž‘áž”áŸ‹ážšáŸ€áž“</th>
                    <th className="py-2.5 px-3">ážŸáŸ’ážáž¶áž“áž—áž¶áž–</th>
                    <th className="py-2.5 px-3">áž€áŸ†ážŽážáŸ‹ážŸáž˜áŸ’áž‚áž¶áž›áŸ‹</th>
                    <th className="py-2.5 px-3 text-right">ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–</th>
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
                          ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 px-3 text-center text-muted-foreground">
                        áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážŠáŸ‚áž›áž”áž¶áž“áž€ážáŸ‹ážáŸ’ážšáž¶áž“áŸ…áž¡áž¾áž™áž‘áŸ (No attendance recorded yet)
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
