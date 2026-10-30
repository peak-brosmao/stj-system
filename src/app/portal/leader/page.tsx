"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Share2,
  FileBarChart,
  Megaphone,
  User,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
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
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export default function LeaderDashboardPage() {
  const leaderNameKh = "លាង ជីងហេង";
  const leaderNameEn = "LEANG JINGHENG";
  const leaderEmail = "leang.jingheng@itc.edu.kh";
  const assignedCourse = "PROG101 - Programming & Algorithmic Thinking";
  const courseCode = "PROG101";

  const leaderSummary = {
    course: assignedCourse,
    assignedMembersCount: OFFICIAL_STJ_ROSTER.length, // 39
    totalSessions: 12,
    completedSessions: 3,
    averageAttendanceRate: 88.5,
    presentCount: 34,
    lateCount: 3,
    absentCount: 1,
    excusedCount: 1,
  };

  const chartData = [
    { name: "វគ្គទី១ (10 តុលា)", present: 36, late: 2, absent: 1 },
    { name: "វគ្គទី២ (17 តុលា)", present: 35, late: 3, absent: 1 },
    { name: "វគ្គទី៣ (24 តុលា)", present: 34, late: 3, absent: 2 },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const filteredMembers = OFFICIAL_STJ_ROSTER.filter(
    (m) =>
      m.nameKh.includes(searchTerm) ||
      m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName={leaderNameKh}
      userMemberId="STJ025"
      userEmail={leaderEmail}
    >
      <div className="space-y-6">
        {/* Banner with Strict RBAC Reminder */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Course Leader Desk • {assignedCourse}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                ផ្ទាំងគ្រប់គ្រងរៀមច្បងទទួលបន្ទុកមុខវិជ្ជា
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {leaderNameKh} ({leaderNameEn}) • ITC I3-GTI • សមាជិកក្នុងបន្ទុកសរុប {leaderSummary.assignedMembersCount} នាក់
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/leader/share-links">
                <Button size="sm" className="space-x-1.5 text-xs">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>បង្កើតតំណភ្ជាប់ចែករំលែកវត្តមាន (Share Link)</span>
                </Button>
              </Link>
              <Link href="/leader/attendance">
                <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>មើលបញ្ជីវត្តមានផ្លូវការ</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">កំណត់សម្គាល់អំពីសិទ្ធិអនុញ្ញាត (Strict RBAC):</strong> ប្រធានក្រុមមានសិទ្ធិត្រឹមតែមើលវត្តមាន និងបង្កើតតំណភ្ជាប់ចែករំលែកប៉ុណ្ណោះ។ ការកត់ត្រា និងកែប្រែវត្តមានជាសិទ្ធិផ្តាច់មុខរបស់គណៈគ្រប់គ្រង STJ។ ប្រសិនបើសមាជិកមានការខុសឆ្គង សូមណែនាំឱ្យពួកគេដាក់ពាក្យស្នើសុំកែតម្រូវ។
            </div>
          </div>
        </div>

        {/* Leader Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">សមាជិកក្នុងបន្ទុក</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{leaderSummary.assignedMembersCount}</p>
              <span className="text-[11px] text-primary">និស្សិតផ្លូវការ ២០២៦~២០២៧</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">វគ្គបង្រៀនបានបញ្ចប់</span>
                <CalendarDays className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{leaderSummary.completedSessions} / {leaderSummary.totalSessions}</p>
              <span className="text-[11px] text-muted-foreground">3 Sessions Completed</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">អត្រាវត្តមានមធ្យម</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{leaderSummary.averageAttendanceRate}%</p>
              <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Excellent Attendance</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">តំណភ្ជាប់ចែករំលែកសកម្ម</span>
                <Share2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">2</p>
              <span className="text-[11px] text-muted-foreground">Active Public Links</span>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend Chart & Quick Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                ស្ថិតិវត្តមានតាមវគ្គនីមួយៗ (Session Attendance Breakdown)
              </CardTitle>
              <Badge variant="outline">ឆមាសទី១ ឆ្នាំ២០២៦-២០២៧</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="វត្តមាន (Present)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" fill="#f59e0b" name="មកយឺត (Late)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" name="អវត្តមាន (Absent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Leader Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">ឧបករណ៍គ្រប់គ្រងរៀមច្បង</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/leader/share-links" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span>បង្កើតតំណ QR Code ចែករំលែក</span>
                </Button>
              </Link>
              <Link href="/leader/attendance" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>មើលកំណត់ត្រាវត្តមានសមាជិក</span>
                </Button>
              </Link>
              <Link href="/leader/reports" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                  <FileBarChart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>ទាញយករបាយការណ៍ Excel / PDF</span>
                </Button>
              </Link>
              <Link href="/portal/profile" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>កែសម្រួលគណនីផ្ទាល់ខ្លួន</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Course Members Roster */}
        <Card>
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span>បញ្ជីរាយនាមសមាជិកក្នុងមុខវិជ្ជា {courseCode} (Official 2026-2027 Roster)</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                បង្ហាញសមាជិកផ្លូវការទាំង {OFFICIAL_STJ_ROSTER.length} នាក់ ពីវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះ ឬ អត្តសញ្ញាណ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">ល.រ</th>
                    <th className="py-2.5 px-3">លេខកូដ STJ</th>
                    <th className="py-2.5 px-3">គោត្តនាម-នាម (ខ្មែរ)</th>
                    <th className="py-2.5 px-3">FullName (English)</th>
                    <th className="py-2.5 px-3">អត្តសញ្ញាណ</th>
                    <th className="py-2.5 px-3">ដេប៉ាតឺម៉ង់</th>
                    <th className="py-2.5 px-3">ឆ្នាំសិក្សា</th>
                    <th className="py-2.5 px-3">លេខទូរស័ព្ទ</th>
                    <th className="py-2.5 px-3">តួនាទី</th>
                    <th className="py-2.5 px-3 text-right">វត្តមាន</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.map((m, idx) => (
                    <tr key={m.memberId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-primary">{m.memberId}</td>
                      <td className="py-2 px-3 font-medium text-foreground">{m.nameKh}</td>
                      <td className="py-2 px-3 text-muted-foreground">{m.nameEn}</td>
                      <td className="py-2 px-3 font-mono">{m.studentId}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-muted">
                          {m.dept}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{m.year}</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">{m.phone}</td>
                      <td className="py-2 px-3">
                        <span className="text-[11px] text-muted-foreground">{m.role}</span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <Badge variant="success">100%</Badge>
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
