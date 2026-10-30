"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  CalendarDays,
  Percent,
  CheckCircle,
  Clock,
  XCircle,
  Share2,
  CalendarCheck,
  ArrowRight,
  ShieldAlert,
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

export default function LeaderDashboardPage() {
  const leaderSummary = {
    course: "PROG101 - Programming",
    assignedMembers: 8,
    totalSessions: 1,
    attendanceRate: 85.7,
    present: 5,
    late: 1,
    absent: 1,
    excused: 1,
  };

  const chartData = [
    { name: "សប្តាហ៍ទី១", present: 5, late: 1, absent: 1 },
  ];

  const assignedMembers = [
    { id: "m1", memberId: "STJ033", name: "ពាក់ ប្រុសម៉ៅ (PEAK BROSMAO)", dept: "GIC", yr: "I2", status: "PRESENT", rate: "100%" },
    { id: "m2", memberId: "STJ001", name: "អ៊ុន សំណាង (OUN Samnang)", dept: "GIC", yr: "I2", status: "PRESENT", rate: "100%" },
    { id: "m3", memberId: "STJ002", name: "អៀ ភក្ត្រា (EA Pheaktra)", dept: "GIC", yr: "I2", status: "PRESENT", rate: "100%" },
    { id: "m4", memberId: "STJ003", name: "កែវ គន្ធា (KEO Kunthea)", dept: "AMS", yr: "I2", status: "LATE", rate: "100%" },
    { id: "m5", memberId: "STJ004", name: "កុយ សុខហេង (KOY Sokheng)", dept: "GIC", yr: "I2", status: "PRESENT", rate: "100%" },
  ];

  return (
    <PortalLayout portalType="leader" userRole="Course Leader" userName="លាង ជីងហេង" userEmail="leang.jingheng@itc.edu.kh">
      <div className="space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
              <BookOpen className="w-4 h-4" />
              <span>{leaderSummary.course} • Leader Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ផ្ទាំងគ្រប់គ្រងប្រធានមុខវិជ្ជា (Leader Desk)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              តាមដានវត្តមានសមាជិកក្នុងបន្ទុក កាលវិភាគបង្រៀន និងបង្កើតតំណភ្ជាប់ចែករំលែក
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/leader/share-links">
              <Button size="sm" className="space-x-1.5 text-xs">
                <Share2 className="w-3.5 h-3.5" />
                <span>បង្កើតតំណភ្ជាប់ចែករំលែក (Share Link)</span>
              </Button>
            </Link>
            <Link href="/leader/attendance">
              <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>មើលវត្តមានផ្លូវការ</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Attendance Read-Only Policy Pill */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>គោលការណ៍កត់ត្រាវត្តមាន៖</strong> ប្រធានមុខវិជ្ជាមានសិទ្ធិត្រឹមតែ <strong>មើល</strong> វត្តមានប៉ុណ្ណោះ។ ការស្រង់វត្តមានផ្លូវការត្រូវធ្វើឡើងដោយគណៈគ្រប់គ្រង STJ។
            </span>
          </div>
        </div>

        {/* 6 Key Leader Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-muted-foreground">សមាជិកក្នុងបន្ទុក</span>
              <p className="text-xl font-bold text-foreground mt-0.5">{leaderSummary.assignedMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">វត្តមាន (Present)</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{leaderSummary.present}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">មកយឺត (Late)</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{leaderSummary.late}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-destructive font-medium">អវត្តមាន (Absent)</span>
              <p className="text-xl font-bold text-destructive mt-0.5">{leaderSummary.absent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">ច្បាប់ (Excused)</span>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{leaderSummary.excused}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-3.5 text-center">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមាន</span>
              <p className="text-xl font-extrabold text-primary mt-0.5">{leaderSummary.attendanceRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid: Chart & Members with Absences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                និន្នាការវត្តមានតាមសប្តាហ៍ (Weekly Attendance Trend)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="វត្តមាន" />
                    <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="មកយឺត" />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="អវត្តមាន" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Members Table Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">
                សមាជិកក្នុងបន្ទុក (Assigned Members)
              </CardTitle>
              <Link href="/leader/members">
                <Button variant="ghost" size="sm" className="text-xs space-x-1">
                  <span>មើលទាំងអស់</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-y border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">អត្តលេខ</th>
                    <th className="py-2.5 px-3 font-semibold">ឈ្មោះ</th>
                    <th className="py-2.5 px-3 font-semibold">ដេប៉ាតឺម៉ង់</th>
                    <th className="py-2.5 px-3 text-right font-semibold">អត្រាវត្តមាន</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignedMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">{m.memberId}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground">{m.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{m.dept} - {m.yr}</td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge variant={m.rate === "100%" ? "success" : "destructive"}>
                          {m.rate}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

