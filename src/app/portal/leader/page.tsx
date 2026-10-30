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
  RefreshCw,
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

interface MemberItem {
  id: string;
  memberId: string;
  studentId?: string | null;
  fullNameKh: string;
  fullNameEn: string;
  phone?: string | null;
  notes?: string | null;
  department: { code: string; nameKh: string };
  academicYear: { code: string };
}

export default function LeaderDashboardPage() {
  const leaderNameKh = "លាង ជីងហេង";
  const leaderNameEn = "LEANG JINGHENG";
  const leaderEmail = "leang.jingheng@itc.edu.kh";
  const assignedCourse = "PROG101 - Programming & Algorithmic Thinking";
  const courseCode = "PROG101";

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTutors = () => {
    setLoading(true);
    fetch(`/api/system/members?course=${courseCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const leaderSummary = {
    course: assignedCourse,
    assignedMembersCount: members.length > 0 ? members.length : 9,
    totalSessions: 12,
    completedSessions: 1,
    averageAttendanceRate: 90.0,
    presentCount: 8,
    lateCount: 1,
    absentCount: 0,
    excusedCount: 0,
  };

  const chartData = [
    { name: "វគ្គទី១ (15 តុលា)", present: 8, late: 1, absent: 0 },
    { name: "វគ្គទី២ (22 តុលា)", present: 9, late: 0, absent: 0 },
    { name: "វគ្គទី៣ (29 តុលា)", present: 8, late: 1, absent: 0 },
  ];

  const filteredMembers = members.filter(
    (m) =>
      m.fullNameKh.includes(searchTerm) ||
      m.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.department?.code.toLowerCase().includes(searchTerm.toLowerCase())
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
                {leaderNameKh} ({leaderNameEn}) • ITC I3-GTI • សមាជិកបង្រៀនស្ម័គ្រចិត្តក្នុងបន្ទុកសរុប {leaderSummary.assignedMembersCount} នាក់
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

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">មុខវិជ្ជាទទួលខុសត្រូវ</p>
                <h3 className="text-xl font-bold text-foreground mt-1">PROG101</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Programming</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">សមាជិករៀមច្បងបង្រៀន</p>
                <h3 className="text-xl font-bold text-foreground mt-1">{leaderSummary.assignedMembersCount} នាក់</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">GIC & GTI Engineering</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">វគ្គបង្រៀនសរុប</p>
                <h3 className="text-xl font-bold text-foreground mt-1">{leaderSummary.totalSessions} វគ្គ</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  បានបញ្ចប់ {leaderSummary.completedSessions} វគ្គ
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CalendarDays className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">អត្រាវត្តមានមធ្យម</p>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {leaderSummary.averageAttendanceRate}%
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">វត្តមានល្អប្រសើរ</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>និន្នាការវត្តមានតាមវគ្គសិក្សា (Attendance Trend)</span>
                <span className="text-xs font-normal text-muted-foreground">PROG101</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="present" fill="#10b981" name="វត្តមាន (Present)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" fill="#f59e0b" name="យឺត (Late)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" name="អវត្តមាន (Absent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Sharing */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">តំណភ្ជាប់ចែករំលែកសកម្ម (Active Share Link)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">PROG101 របាយការណ៍ផ្លូវការ</span>
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    បង្កើតដោយ លាង ជីងហេង សម្រាប់ចែករំលែកទៅកាន់គណៈគ្រប់គ្រងដេប៉ាតឺម៉ង់
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <Link
                      href="/share/stj-official-2027"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center space-x-1"
                    >
                      <span>បើកមើលទំព័រចែករំលែក</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <Link href="/leader/share-links">
                  <Button variant="outline" size="sm" className="w-full text-xs space-x-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>គ្រប់គ្រង Share Links ទាំងអស់</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">កាលវិភាគវគ្គបន្ទាប់</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="font-semibold text-foreground">វគ្គទី៤៖ Dynamic Trees & Graphs</div>
                  <div className="text-muted-foreground text-[11px] mt-1">
                    សៅរ៍ ០៧ វិច្ឆិកា ២០២៦ • 08:00 - 10:00 ព្រឹក
                  </div>
                  <div className="text-muted-foreground text-[11px]">ITC Campus 1, Building A, Room 204</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Assigned Members Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                បញ្ជីរៀមច្បងបង្រៀន Programming ក្នុងបន្ទុក ({leaderSummary.assignedMembersCount} នាក់)
              </h2>
              <p className="text-xs text-muted-foreground">
                ទិន្នន័យពី SQLite Database (stj.db) • និស្សិតរៀមច្បងមកពីដេប៉ាតឺម៉ង់ GIC & GTI
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
                />
              </div>
              <Button variant="outline" size="sm" onClick={loadTutors} disabled={loading} className="text-xs shrink-0">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">ល.រ</th>
                    <th className="py-3 px-4 font-semibold">កូដ STJ</th>
                    <th className="py-3 px-4 font-semibold">អត្តលេខនិស្សិត</th>
                    <th className="py-3 px-4 font-semibold">ឈ្មោះពេញ (Kh / En)</th>
                    <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់ & កម្រិត</th>
                    <th className="py-3 px-4 font-semibold">លេខទូរស័ព្ទ</th>
                    <th className="py-3 px-4 font-semibold text-center">អត្រាវត្តមាន</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                        កំពុងទាញយកទិន្នន័យពី SQLite Database (stj.db)...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                        រកមិនឃើញទិន្នន័យសមាជិកឡើយ។
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m, idx) => (
                      <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary">{m.memberId}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">{m.studentId || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                          <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-foreground">{m.department?.code}</span>
                          <span className="text-muted-foreground ml-1">({m.academicYear?.code})</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono">{m.phone || "-"}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="success" className="text-[10px]">
                            100%
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
