"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, CalendarCheck, CalendarDays, Clock, MapPin, Percent, Users, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface Overview {
  user: { fullNameKh: string; fullNameEn: string; displayName: string | null; email: string; memberId: string | null; roles?: string[] };
  leader: {
    courses: Array<{
      id: string;
      code: string;
      titleKh: string;
      memberCount: number;
      lessonCount: number;
      completedCount: number;
      rate: number;
    }>;
    totalMembers: number;
    totalLessons: number;
    completedLessons: number;
    stats: { total: number; rate: number };
    monthly: Array<{ month: string; present: number; late: number; absent: number }>;
    upcoming: Array<{
      id: string;
      title: string;
      courseCode: string;
      date: string;
      startTime: string;
      endTime: string;
      room: string;
      marked: number;
    }>;
    recentAttendance: Array<{
      id: string;
      memberName: string;
      courseCode: string;
      lesson: string;
      date: string;
      status: string;
    }>;
  } | null;
}

const STATUS_BADGE: Record<string, { v: "success" | "warning" | "destructive" | "purple"; t: string }> = {
  PRESENT: { v: "success", t: "Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ" },
  LATE: { v: "warning", t: "Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â" },
  ABSENT: { v: "destructive", t: "Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ" },
  EXCUSED: { v: "purple", t: "Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹" },
};

export default function LeaderDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => {
        if (!r.ok) {
          router.replace("/portal/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.success) {
          const roles = d.user?.roles || [];
          const isAllowed = roles.includes("COURSE_LEADER") || roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT");
          if (!isAllowed) {
            // Strictly block regular members from Leader Desk
            router.replace("/portal/member");
            return;
          }
          setData(d);
        }
      })
      .catch(() => {
        router.replace("/portal/member");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const l = data?.leader;

  return (
    <PortalLayout
      portalType="leader"
      userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Ëœ (Course Leader)"
      userName={data?.user.fullNameKh || ""}
      userMemberId={data?.user.memberId || undefined}
      userEmail={data?.user.email}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
              <BookOpen className="w-4 h-4" />
              <span>STJ Leader Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Course Leader Dashboard)
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.user.displayName || data?.user.fullNameEn}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/leader/sessions">
              <Button size="sm" className="text-xs space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ</span>
              </Button>
            </Link>
            <Link href="/leader/attendance">
              <Button size="sm" variant="outline" className="text-xs space-x-1.5">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</span>
              </Button>
            </Link>
          </div>
        </div>

        {l && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ (Courses)", value: l.courses.length, icon: BookOpen },
                { label: "Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Ëœ (Team members)", value: l.totalMembers, icon: Users },
                { label: "Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€ (Lessons)", value: `${l.completedLessons}/${l.totalLessons}`, icon: CalendarDays },
                { label: "Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾â€™Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Ëœ (Avg rate)", value: l.stats.total > 0 ? `${l.stats.rate}%` : "-", icon: Percent },
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
                  {l.monthly.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¸â€ (No attendance recorded yet.)</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={l.monthly}>
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
                  {l.upcoming.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¾Â¾Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¸Ã¡Å¾Â±Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾Æ’Ã¡Å¾Â¾Ã¡Å¾â€°Ã¡Å¸â€ (No upcoming lessons. Create one so your team can see it.)
                    </p>
                  )}
                  {l.upcoming.map((s) => (
                    <div key={s.id} className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">{s.title}</span>
                        <Badge variant="info">{s.courseCode}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{s.date} {s.startTime}-{s.endTime}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{s.room}</span>
                      </div>
                      <Link href={`/leader/attendance?sessionId=${s.id}`} className="text-primary hover:underline font-medium">
                        Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Mark attendance){s.marked > 0 ? ` - ${s.marked}` : ""}
                      </Link>
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
                {l.courses.map((c) => (
                  <Link key={c.id} href="/leader/members" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                      <span className="text-muted-foreground">{c.memberCount} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹</span>
                    </div>
                    <p className="font-semibold text-foreground mt-1">{c.titleKh}</p>
                    <p className="text-muted-foreground mt-0.5">
                      Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ {c.completedCount}/{c.lessonCount} Ã‚Â· Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ {c.rate}%
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¸â€” (Recent attendance records)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {l.recentAttendance.length === 0 && <p className="text-xs text-muted-foreground">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€ (None yet.)</p>}
                {l.recentAttendance.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{r.memberName}</p>
                      <p className="text-muted-foreground">{r.courseCode} Ã‚Â· {r.lesson} Ã‚Â· {r.date}</p>
                    </div>
                    <Badge variant={STATUS_BADGE[r.status]?.v || "info"}>{STATUS_BADGE[r.status]?.t || r.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
