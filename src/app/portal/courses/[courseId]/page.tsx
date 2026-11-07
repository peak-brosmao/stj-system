"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, MapPin, UserCheck, Users } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";

interface CourseDetail {
  code: string;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  academicTerm: string;
  leaders: Array<{ fullNameKh: string; fullNameEn: string; email: string; phone: string }>;
  sessions: Array<{ id: string; title: string; date: string; time: string; room: string; status: string }>;
  enrolledMembers: Array<{ memberId: string; fullNameKh: string; fullNameEn: string }>;
}

const STATUS: Record<string, { v: "info" | "warning" | "success" | "destructive"; t: string }> = {
  SCHEDULED: { v: "info", t: "តាមកាលវិភាគ (Scheduled)" },
  IN_PROGRESS: { v: "warning", t: "កំពុងបង្រៀន (In progress)" },
  COMPLETED: { v: "success", t: "បានបញ្ចប់ (Completed)" },
  CANCELLED: { v: "destructive", t: "បានលុបចោល (Cancelled)" },
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = (params?.courseId as string) || "";
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/portal/courses?id=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => d.course && setCourse(d.course))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link href="/portal/courses" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ថយក្រោយ (Back)</span>
        </Link>

        {!course && (
          <p className="text-xs text-muted-foreground">
            {loading ? "កំពុងដំណើរការ..." : "រកមិនឃើញមុខវិជ្ជាឡើយ (Course not found.)"}
          </p>
        )}

        {course && (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="font-mono">{course.code}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{course.titleKh}</h1>
              <p className="text-xs text-muted-foreground mt-1">{course.descriptionKh}</p>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-primary" />
                  ប្រធានក្រុមបង្រៀន (Course Leaders)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                {course.leaders.length === 0 && <p className="text-muted-foreground">ពុំទាន់បានចាត់តាំង (Not assigned yet.)</p>}
                {course.leaders.map((l) => (
                  <p key={l.email} className="text-foreground">
                    {l.fullNameKh} ({l.fullNameEn}) • {l.phone}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">មេរៀន (Lessons)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.sessions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)
                  </p>
                )}
                {course.sessions.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">{s.title}</span>
                      <Badge variant={STATUS[s.status]?.v || "info"}>{STATUS[s.status]?.t || s.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{s.date} {s.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{s.room}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  ក្រុមគ្រូបង្រៀន (Team) - {course.enrolledMembers.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                {course.enrolledMembers.map((m) => (
                  <p key={m.memberId} className="text-foreground">
                    <span className="font-mono text-muted-foreground">{m.memberId}</span> {m.fullNameKh} ({m.fullNameEn})
                  </p>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}