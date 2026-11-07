"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarCheck, CalendarDays, CheckCircle2, Clock, MapPin, Percent, UserCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface Overview {
  user: {
    fullNameKh: string;
    fullNameEn: string;
    displayName: string | null;
    email: string;
    studentId: string | null;
    memberId: string | null;
    department: { code: string; nameKh: string } | null;
    academicYear: { code: string } | null;
    status: string;
  };
  member: {
    courses: Array<{
      id: string;
      code: string;
      slug: string;
      titleKh: string;
      titleEn: string;
      leaders: Array<{ nameKh: string; nameEn: string }>;
      totalLessons: number;
      rate: number;
    }>;
    stats: { present: number; late: number; absent: number; excused: number; total: number; rate: number };
    totalLessons: number;
    monthly: Array<{ month: string; present: number; late: number; absent: number }>;
    upcoming: Array<{ id: string; title: string; courseCode: string; date: string; startTime: string; endTime: string; room: string }>;
    recent: Array<{ id: string; title: string; courseCode: string; date: string; status: string }>;
  } | null;
  announcements: Array<{ id: string; titleKh: string; titleEn: string; publishedAt: string }>;
}

const STATUS_BADGE: Record<string, { v: "success" | "warning" | "destructive" | "purple"; t: string }> = {
  PRESENT: { v: "success", t: "Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ" },
  LATE: { v: "warning", t: "Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â" },
  ABSENT: { v: "destructive", t: "Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ" },
  EXCUSED: { v: "purple", t: "Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹" },
};

export default function MemberDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => r.json())
      .then((d) => d.success && setData(d))
      .finally(() => setLoading(false));
  }, []);

  const u = data?.user;
  const m = data?.member;
  const stats = m?.stats || { present: 0, late: 0, absent: 0, excused: 0, total: 0, rate: 0 };
  const name = u?.displayName || u?.fullNameEn || "";

  return (
    <PortalLayout
      portalType="portal"
      userRole={u?.memberId === "STJ002" ? "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ" : undefined}
      userName={u?.fullNameKh || ""}
      userMemberId={u?.memberId || undefined}
      userEmail={u?.email}
    >
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
            <UserCircle className="w-4 h-4" />
            <span>STJ Member Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾ËœÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€° (Welcome back){name ? `, ${name}` : ""}
          </h1>
          {u && (
            <p className="text-xs text-muted-foreground mt-1">
              {u.memberId} Ã‚Â· {u.studentId} Ã‚Â· {u.academicYear?.code}-{u.department?.code}
            </p>
          )}
        </div>

        {!loading && !m && (
          <Card>
            <CardContent className="p-6 text-xs text-muted-foreground">
              Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Â½Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¸â€ (This account is not linked to a team member record.)
            </CardContent>
          </Card>
        )}

        {m && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { label: "Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ (Courses)", value: m.courses.length, icon: BookOpen },
                { label: "Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€ (Lessons)", value: m.totalLessons, icon: CalendarDays },
                { label: "Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Present)", value: stats.present, icon: CheckCircle2 },
                { label: "Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â (Late)", value: stats.late, icon: Clock },
                { label: "Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Absent)", value: stats.absent, icon: CalendarCheck },
                { label: "Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Rate)", value: stats.total > 0 ? `${stats.rate}%` : "-", icon: Percent },
              ].map((c) => (
                <Card key={c.label}>
                  <CardContent className="p-4">
                    <c.icon className="w-4 h-4 text-primary mb-2" />
                    <p className="text-2xl font-extrabold text-foreground">{c.value}</p>
                    <span className="text-[10px] text-muted-foreground">{c.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾ÂÃ¡Å¸â€š (Monthly attendance)</CardTitle>
                </CardHeader>
                <CardContent className="h-56">
                  {m.monthly.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¸â€ (No attendance recorded yet.)</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={m.monthly}>
                        <XAxis dataKey="month" fontSize={10} />
                        <YAxis allowDecimals={false} fontSize={10} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" name="Present" fill="#16a34a" />
                        <Bar dataKey="late" name="Late" fill="#f59e0b" />
                        <Bar dataKey="absent" name="Absent" fill="#dc2626" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Upcoming lessons)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.upcoming.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¸â€ (Your Leader has not created upcoming lessons yet.)
                    </p>
                  )}
                  {m.upcoming.map((l) => (
                    <div key={l.id} className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">{l.title}</span>
                        <Badge variant="info">{l.courseCode}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{l.date} {l.startTime}-{l.endTime}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{l.room}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â»Ã¡Å¸â€  (My courses)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {m.courses.map((c) => (
                  <Link key={c.id} href={`/portal/courses/${c.slug}`} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                      <span className="text-muted-foreground">{c.totalLessons} Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ</span>
                    </div>
                    <p className="font-semibold text-foreground mt-1">{c.titleKh}</p>
                    <p className="text-muted-foreground mt-0.5">
                      Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸â€“ {c.leaders.map((l) => l.nameKh).join(", ") || "-"}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¸â€” (Recent attendance)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.recent.length === 0 && <p className="text-xs text-muted-foreground">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€ (None yet.)</p>}
                  {m.recent.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{r.title}</p>
                        <p className="text-muted-foreground">{r.courseCode} Ã‚Â· {r.date}</p>
                      </div>
                      <Badge variant={STATUS_BADGE[r.status]?.v || "info"}>{STATUS_BADGE[r.status]?.t || r.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž (Announcements)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.announcements || []).length === 0 && <p className="text-xs text-muted-foreground">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€ (None yet.)</p>}
                  {(data?.announcements || []).map((a) => (
                    <div key={a.id} className="text-xs p-2 rounded-lg border border-border">
                      <p className="font-medium text-foreground">{a.titleKh}</p>
                      <p className="text-muted-foreground">{new Date(a.publishedAt).toISOString().split("T")[0]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/portal/attendance"><Button size="sm" variant="outline" className="text-xs">Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (View attendance)</Button></Link>
              <Link href="/portal/correction-requests"><Button size="sm" variant="outline" className="text-xs">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Correction request)</Button></Link>
              <Link href="/portal/profile/edit"><Button size="sm" variant="outline" className="text-xs">Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€ (Edit profile)</Button></Link>
              <Link href="/portal/security"><Button size="sm" variant="outline" className="text-xs">Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹ (Password)</Button></Link>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
