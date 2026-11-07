"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, CalendarDays, CheckCircle2, Clock, FileText, MapPin, Percent, UserCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { extractPlainTextSnippet, type CourseAttachment } from "@/lib/richContent";

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
      leaders: Array<{ nameKh?: string; nameEn?: string; fullNameKh?: string; fullNameEn?: string }>;
      totalLessons: number;
      rate: number;
      syllabus?: {
        notes?: string;
        richContent?: string;
        attachments?: CourseAttachment[];
      };
    }>;
    stats: { present: number; late: number; absent: number; excused: number; total: number; rate: number };
    totalLessons: number;
    monthly: Array<{ month: string; present: number; late: number; absent: number }>;
    upcoming: Array<{
      id: string;
      title: string;
      courseCode: string;
      courseSlug?: string;
      date: string;
      startTime: string;
      endTime: string;
      room: string;
      notes?: string;
      richContent?: string;
      attachments?: CourseAttachment[];
    }>;
    recent: Array<{ id: string; title: string; courseCode: string; date: string; status: string }>;
  } | null;
  announcements: Array<{ id: string; titleKh: string; titleEn: string; publishedAt: string }>;
}

const STATUS_BADGE: Record<string, { v: "success" | "warning" | "destructive" | "purple"; t: string }> = {
  PRESENT: { v: "success", t: "មានវត្តមាន" },
  LATE: { v: "warning", t: "យឺត" },
  ABSENT: { v: "destructive", t: "អវត្តមាន" },
  EXCUSED: { v: "purple", t: "ច្បាប់" },
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
      userRole={u?.memberId === "STJ002" ? "ប្រធាន STJ" : undefined}
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
            សូមស្វាគមន៍ត្រឡប់មកវិញ (Welcome back){name ? `, ${name}` : ""}
          </h1>
          {u && (
            <p className="text-xs text-muted-foreground mt-1">
              {u.memberId} · {u.studentId} · {u.academicYear?.code}-{u.department?.code}
            </p>
          )}
        </div>

        {!loading && !m && (
          <Card>
            <CardContent className="p-6 text-xs text-muted-foreground">
              គណនីនេះមិនទាន់ភ្ជាប់ជាមួយសមាជិកក្រុមបង្រៀនទេ។ (This account is not linked to a team member record.)
            </CardContent>
          </Card>
        )}

        {m && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { label: "មុខវិជ្ជា (Courses)", value: m.courses.length, icon: BookOpen },
                { label: "មេរៀនសរុប (Lessons)", value: m.totalLessons, icon: CalendarDays },
                { label: "មានវត្តមាន (Present)", value: stats.present, icon: CheckCircle2 },
                { label: "យឺត (Late)", value: stats.late, icon: Clock },
                { label: "អវត្តមាន (Absent)", value: stats.absent, icon: CalendarCheck },
                { label: "អត្រាវត្តមាន (Rate)", value: stats.total > 0 ? `${stats.rate}%` : "-", icon: Percent },
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
                  <CardTitle className="text-sm font-semibold">វត្តមានតាមខែ (Monthly attendance)</CardTitle>
                </CardHeader>
                <CardContent className="h-56">
                  {m.monthly.length === 0 ? (
                    <p className="text-xs text-muted-foreground">មិនទាន់មានវត្តមានត្រូវបានកត់ត្រាទេ។ (No attendance recorded yet.)</p>
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
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">មេរៀនត្រូវបង្រៀន (Upcoming lessons)</CardTitle>
                  <Link href="/portal/schedule" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    <span>មើលទាំងអស់</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {m.upcoming.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      ប្រធានក្រុមមិនទាន់បង្កើតមេរៀនថ្មីទេ។ (Your Leader has not created upcoming lessons yet.)
                    </p>
                  )}
                  {m.upcoming.map((l: any) => {
                    const snippet = extractPlainTextSnippet(l.richContent, l.notes, 120);
                    const attCount = Array.isArray(l.attachments) ? l.attachments.length : 0;
                    const courseSlug = l.courseSlug || String(l.courseCode || "stj").toLowerCase();
                    const isCompleted = l.status === "COMPLETED";
                    return (
                      <Link
                        key={l.id}
                        href={`/portal/courses/${courseSlug}?lesson=${encodeURIComponent(l.id)}`}
                        className="block p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/50 transition-colors text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground">{l.title}</span>
                          <div className="flex items-center gap-1.5">
                            <Badge variant={isCompleted ? "success" : "info"}>
                              {isCompleted ? "បានបង្រៀនរួច" : "បានកំណត់ពេល"}
                            </Badge>
                            <Badge variant="outline">{l.courseCode}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-primary" />{l.date} {l.startTime}-{l.endTime}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" />{l.room}</span>
                          {attCount > 0 && (
                            <span className="text-emerald-500 font-medium">• {attCount} PDF/Video</span>
                          )}
                        </div>
                        {snippet && (
                          <p className="text-muted-foreground line-clamp-2 pt-1 border-t border-border/50">
                            {snippet}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">មុខវិជ្ជារបស់ខ្ញុំ (My Enrolled Courses)</CardTitle>
                <Link href="/portal/courses" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  <span>ចូលមើលមុខវិជ្ជាទាំងអស់</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {m.courses.map((c) => {
                  const hasCourseContent = Boolean(
                    c.syllabus &&
                      (c.syllabus.richContent ||
                        c.syllabus.notes ||
                        (Array.isArray(c.syllabus.attachments) && c.syllabus.attachments.length > 0))
                  );
                  return (
                    <Link
                      key={c.id}
                      href={`/portal/courses/${c.slug || String(c.code || "stj").toLowerCase()}`}
                      className="p-3.5 rounded-xl border border-border hover:border-primary/50 transition-colors text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{c.code}</span>
                        <div className="flex items-center gap-2">
                          {hasCourseContent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                              <FileText className="w-3 h-3" />
                              មានមាតិកា &amp; PDF/Video
                            </span>
                          )}
                          <span className="text-muted-foreground">{c.totalLessons} មេរៀន</span>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">{c.titleKh}</p>
                      <p className="text-muted-foreground">
                        ប្រធានក្រុម៖{" "}
                        {c.leaders.map((l) => l.fullNameKh || l.nameKh || l.fullNameEn || l.nameEn).filter(Boolean).join(", ") || "-"}
                      </p>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">វត្តមានថ្មីៗ (Recent attendance)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.recent.length === 0 && <p className="text-xs text-muted-foreground">មិនទាន់មាន។ (None yet.)</p>}
                  {m.recent.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{r.title}</p>
                        <p className="text-muted-foreground">{r.courseCode} · {r.date}</p>
                      </div>
                      <Badge variant={STATUS_BADGE[r.status]?.v || "info"}>{STATUS_BADGE[r.status]?.t || r.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">សេចក្តីជូនដំណឹង (Announcements)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(data?.announcements || []).length === 0 && <p className="text-xs text-muted-foreground">មិនទាន់មាន។ (None yet.)</p>}
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
              <Link href="/portal/attendance"><Button size="sm" variant="outline" className="text-xs">មើលវត្តមាន (View attendance)</Button></Link>
              <Link href="/portal/correction-requests"><Button size="sm" variant="outline" className="text-xs">ស្នើកែវត្តមាន (Correction request)</Button></Link>
              <Link href="/portal/profile/edit"><Button size="sm" variant="outline" className="text-xs">កែប្រែប្រវត្តិរូប (Edit profile)</Button></Link>
              <Link href="/portal/security"><Button size="sm" variant="outline" className="text-xs">ប្តូរពាក្យសម្ងាត់ (Password)</Button></Link>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}