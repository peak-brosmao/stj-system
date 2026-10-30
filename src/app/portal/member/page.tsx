"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Bell,
  Sparkles,
  ChevronRight,
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

export default function MemberDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const studentNameKh = profile?.fullNameKh || "ពាក់ ប្រុសម៉ៅ";
  const studentNameEn = profile?.fullNameEn || "PEAK BROSMAO";
  const memberId = profile?.member?.memberId || "STJ033";
  const studentId = profile?.member?.studentId || "e20251455";
  const department = profile?.member?.department?.code || "GIC";
  const year = profile?.member?.academicYear?.code || "I2";

  const attendanceSummary = {
    totalSessions: 5,
    present: 4,
    late: 1,
    absent: 0,
    excused: 0,
    rate: 100, // (4 + 1) / (5 - 0) * 100%
  };

  const chartData = [
    { week: "សប្តាហ៍ទី១", present: 2, late: 0, absent: 0 },
    { week: "សប្តាហ៍ទី២", present: 1, late: 1, absent: 0 },
    { week: "សប្តាហ៍ទី៣", present: 1, late: 0, absent: 0 },
  ];

  const myCourses = [
    {
      code: "PROG101",
      titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
      leader: "លាង ជីងហេង (LEANG JINGHENG - I3 GTI)",
      schedule: "រៀងរាល់ថ្ងៃសៅរ៍ ម៉ោង 08:00 - 10:00",
      room: "បន្ទប់ A-204, ITC Campus 1",
      role: "គ្រូបង្រៀនស្ម័គ្រចិត្ត (Assigned Tutor)",
      status: "សកម្ម (Active)",
    },
  ];

  const upcomingSessions = [
    {
      id: "us-1",
      course: "PROG101 - Programming",
      title: "វគ្គទី៤៖ Binary Search Trees & Recursion Mechanics",
      date: "សៅរ៍ ០៧ វិច្ឆិកា ២០២៦",
      time: "08:00 - 10:00",
      room: "Campus 1, Building A, Room 204",
      leader: "លាង ជីងហេង",
    },
  ];

  const recentAnnouncements = [
    {
      id: "ann-1",
      title: "កាលវិភាគពិនិត្យកូដ C++ និងអនុវត្តជាក់ស្តែងក្នុងបន្ទប់កុំព្យូទ័រ",
      date: "២០ តុលា ២០២៦",
      category: "PROG101",
    },
    {
      id: "ann-2",
      title: "ការចែករំលែកវិញ្ញាសាប្រឡងឆមាសឆ្នាំមុនសម្រាប់និស្សិត I2",
      date: "១៨ តុលា ២០២៦",
      category: "STJ General",
    },
  ];

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName={studentNameKh}
      userMemberId={memberId}
      userEmail={profile?.email || "peak.brosmao@itc.edu.kh"}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student & Member Dashboard • STJ 2026-2027</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              សូមស្វាគមន៍ការវិលត្រឡប់មកវិញ, {studentNameKh}
            </h1>
            <p className="text-xs text-muted-foreground">
              {studentNameEn} • អត្តសញ្ញាណ: {studentId} • {department} ({year}) • សមាជិកលេខ: {memberId}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/portal/attendance">
              <Button size="sm" className="space-x-1.5 text-xs">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>ពិនិត្យវត្តមានរបស់ខ្ញុំ</span>
              </Button>
            </Link>
            <Link href="/portal/profile">
              <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                <User className="w-3.5 h-3.5" />
                <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Academic Card & KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">មុខវិជ្ជាកំពុងរៀន</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">2</p>
              <span className="text-[10px] text-primary">Enrolled Courses</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">វគ្គបង្រៀនសរុប</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">{attendanceSummary.totalSessions}</p>
              <span className="text-[10px] text-muted-foreground">Total Sessions</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">វត្តមាន (Present)</span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{attendanceSummary.present}</p>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">ចូលរួមពេញលេញ</span>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">មកយឺត (Late)</span>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{attendanceSummary.late}</p>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">រាប់ជាវត្តមាន</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-muted-foreground font-medium">អវត្តមាន (Absent)</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">{attendanceSummary.absent}</p>
              <span className="text-[10px] text-muted-foreground">គ្មានការអនុញ្ញាត</span>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/10">
            <CardContent className="p-4 text-center">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមាន</span>
              <p className="text-2xl font-extrabold text-primary mt-1">{attendanceSummary.rate}%</p>
              <span className="text-[10px] text-primary font-medium">Attendance Rate</span>
            </CardContent>
          </Card>
        </div>

        {/* Grid: Attendance Chart & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                និន្នាការវត្តមានតាមសប្តាហ៍ (Weekly Attendance Trend)
              </CardTitle>
              <Badge variant="success">អត្រាវត្តមានល្អប្រសើរ 100%</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
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

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>កាលវិភាគវគ្គបង្រៀនបន្ទាប់ (Upcoming Sessions)</span>
              </CardTitle>
              <Link href="/portal/schedule" className="text-xs text-primary hover:underline flex items-center space-x-1">
                <span>កាលវិភាគពេញលេញ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl border border-border bg-card/50 hover:border-primary/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {session.course}
                      </span>
                      <h4 className="font-bold text-xs text-foreground mt-1">{session.title}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {session.date}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>{session.time}</span>
                    </span>
                    <span>•</span>
                    <span>{session.room}</span>
                    <span>•</span>
                    <span>បង្រៀនដោយ៖ <strong className="text-foreground">{session.leader}</strong></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* My Enrolled Courses & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>មុខវិជ្ជាកំពុងសិក្សា (My Courses)</span>
              </h3>
              <Link href="/portal/courses" className="text-xs text-primary hover:underline">
                មើលមុខវិជ្ជាទាំងអស់
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myCourses.map((c) => (
                <Card key={c.code} className="hover:border-primary/40 transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {c.code}
                      </span>
                      <Badge variant="success">{c.status}</Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{c.titleKh}</h4>
                      <p className="text-xs text-muted-foreground mt-1">រៀមច្បង៖ {c.leader}</p>
                    </div>
                    <div className="text-[11px] text-muted-foreground pt-2 border-t border-border flex items-center justify-between">
                      <span>{c.room}</span>
                      <Link href={`/portal/courses/${c.code.toLowerCase()}`} className="text-primary hover:underline font-medium">
                        ចូលមើលមេរៀន
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions & Recent Notices */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">សកម្មភាពរហ័ស (Quick Actions)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/portal/profile/edit" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>កែសម្រួលព័ត៌មានផ្ទាល់ខ្លួន</span>
                  </Button>
                </Link>
                <Link href="/portal/attendance" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>មើលកំណត់ត្រាវត្តមាន</span>
                  </Button>
                </Link>
                <Link href="/portal/correction-requests" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                    <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>ដាក់ពាក្យស្នើសុំកែវត្តមាន</span>
                  </Button>
                </Link>
                <Link href="/portal/security" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-xs">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>ប្តូរលេខកូដសម្ងាត់គណនី</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>សេចក្តីជូនដំណឹងថ្មីៗ</span>
                </CardTitle>
                <Link href="/portal/announcements" className="text-xs text-primary hover:underline">
                  ទាំងអស់
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {recentAnnouncements.map((ann) => (
                  <div key={ann.id} className="text-xs space-y-1 pb-2 border-b border-border last:border-0 last:pb-0">
                    <span className="text-[10px] font-semibold text-primary">{ann.category} • {ann.date}</span>
                    <p className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                      {ann.title}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

