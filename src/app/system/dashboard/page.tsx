"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  BookOpen,
  CalendarDays,
  Percent,
  CalendarCheck,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { useI18n } from "@/ui/i18n/I18nProvider";

interface DashboardData {
  summary: {
    totalMembers: number;
    activeMembers: number;
    totalLeaders: number;
    totalCourses: number;
    totalSessions: number;
    attendanceRate: number;
  };
  charts: {
    deptDistribution: Array<{ name: string; count: number }>;
    yearDistribution: Array<{ name: string; count: number }>;
  };
  recentSessions: Array<{
    id: string;
    title: string;
    course: string;
    date: string;
    status: string;
  }>;
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

export default function SystemDashboardPage() {
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026-2027");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    fetch("/api/system/stats")
      .then(async (res) => {
        const responseData = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(responseData?.error || t("system.databaseError"));
        }
        return responseData;
      })
      .then((resData) => {
        if (!resData || resData.success === false || !resData.summary || !resData.charts) {
          throw new Error(t("system.databaseError"));
        }
        setData(resData);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setData(null);
        setError(err instanceof Error ? err.message : t("system.databaseError"));
        setLoading(false);
      });
  }, [selectedAcademicYear]);

  const summary = data?.summary;
  const deptData = data?.charts.deptDistribution || [];
  const yearData = data?.charts.yearDistribution || [];

  if (error || loading || !data || !summary) {
    return (
      <PortalLayout portalType="system" userRole={t("system.president")} userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error || t("common.loading")}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout portalType="system" userRole={t("system.president")} userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        {/* Banner with Academic Year Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("system.centralCommand")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("system.dashboardTitle")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("system.dashboardDescription")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="2026-2027">{t("system.academicYearCurrent")}</option>
              <option value="2027-2028">{t("system.academicYearNext")}</option>
              <option value="2025-2026">{t("system.academicYearArchive")}</option>
            </select>
            <Link href="/system/attendance">
              <Button size="sm" className="space-x-1.5 text-xs">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{t("system.takeAttendanceNow")}</span>
              </Button>
            </Link>
            <Link href="/system/members">
              <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t("system.addMemberAction")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium">{t("system.membersMetric")}</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{summary.totalMembers}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {summary.activeMembers} {t("system.people")} ({t("system.officialActive")})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium">{t("system.leadersMetric")}</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{summary.totalLeaders}</p>
              <p className="text-[10px] text-muted-foreground">{t("system.responsibleMembers")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium">{t("system.activeCourses")}</span>
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{summary.totalCourses}</p>
              <p className="text-[10px] text-muted-foreground">{t("system.programmingMath")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium">{t("system.teachingSessions")}</span>
                <CalendarDays className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{summary.totalSessions}</p>
              <p className="text-[10px] text-muted-foreground">{t("system.semesterOne")}</p>
            </CardContent>
          </Card>

          <Card className="col-span-2 border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-primary">
                <span className="text-[11px] font-bold">{t("system.overallAttendance")}</span>
                <Percent className="w-4 h-4" />
              </div>
              <p className="text-2xl font-extrabold text-primary">{summary.attendanceRate}%</p>
              <p className="text-[10px] text-muted-foreground">
                {t("system.attendanceFormula")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {t("system.membersByDepartment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData}>
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
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Academic Year Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {t("system.membersByYear")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col sm:flex-row items-center justify-around">
              <div className="h-60 w-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={yearData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {yearData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {yearData.map((item, idx) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">{item.name}:</span>
                    <span className="text-muted-foreground">{item.count} {t("system.people")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Teaching Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">
                {t("system.recentSessions")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {t("system.recentSessionsDescription")}
              </p>
            </div>
            <Link href="/system/sessions">
              <Button variant="ghost" size="sm" className="text-xs space-x-1">
                <span>{t("system.viewAll")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-y border-border">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">{t("system.sessionTitle")}</th>
                    <th className="py-2.5 px-4 font-semibold">{t("system.course")}</th>
                    <th className="py-2.5 px-4 font-semibold">{t("system.sessionDate")}</th>
                    <th className="py-2.5 px-4 font-semibold">{t("system.sessionStatus")}</th>
                    <th className="py-2.5 px-4 font-semibold text-right">{t("system.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(data?.recentSessions || []).map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{s.title}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-primary">{s.course}</td>
                      <td className="py-3 px-4 text-muted-foreground">{s.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={s.status === "COMPLETED" ? "success" : "info"}>
                          {s.status === "COMPLETED" ? t("system.completed") : t("system.scheduled")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/system/attendance?sessionId=${s.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            {t("system.reviewAttendance")}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(data?.recentSessions || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-center text-muted-foreground">
                        {t("system.noLessons")}
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
