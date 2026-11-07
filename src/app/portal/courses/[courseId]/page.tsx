"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, FileText, MapPin, UserCheck, Users } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { RichContentViewer } from "@/ui/RichTextEditor";
import type { CourseAttachment } from "@/lib/richContent";

interface CourseDetail {
  code: string;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  academicTerm: string;
  leaders: Array<{
    fullNameKh?: string;
    full_name_kh?: string;
    fullNameEn?: string;
    full_name_en?: string;
    email: string;
    phone?: string;
    studentId?: string;
    department?: string;
    year?: string;
  }>;
  syllabus?: {
    notes?: string;
    richContent?: string;
    attachments?: CourseAttachment[];
  };
  sessions: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    room: string;
    status: string;
    notes?: string;
    richContent?: string;
    attachments?: CourseAttachment[];
  }>;
  enrolledMembers: Array<{
    memberId?: string;
    member_id?: string;
    studentId?: string;
    fullNameKh?: string;
    full_name_kh?: string;
    fullNameEn?: string;
    full_name_en?: string;
    department?: string;
    year?: string;
  }>;
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
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setSelectedLessonId(sp.get("lesson") || "");
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/portal/courses?id=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => d.course && setCourse(d.course))
      .finally(() => setLoading(false));
  }, [slug]);

  const hasSyllabus = Boolean(
    course?.syllabus &&
      (course.syllabus.richContent ||
        course.syllabus.notes ||
        (course.syllabus.attachments && course.syllabus.attachments.length > 0))
  );

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          href="/portal/courses"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
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
              <CardContent className="space-y-2 text-xs">
                {course.leaders.length === 0 && (
                  <p className="text-muted-foreground">ពុំទាន់បានចាត់តាំង (Not assigned yet.)</p>
                )}
                {course.leaders.map((l, idx) => {
                  const nameKh = l.fullNameKh || l.full_name_kh || "ប្រធានក្រុម";
                  const nameEn = l.fullNameEn || l.full_name_en || "";
                  const meta = [l.phone, l.email].filter(Boolean).join(" • ");
                  return (
                    <div
                      key={l.email || idx}
                      className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/60"
                    >
                      <div className="font-semibold text-foreground">
                        {nameKh}{" "}
                        {nameEn ? (
                          <span className="text-muted-foreground font-normal">({nameEn})</span>
                        ) : null}
                      </div>
                      {meta && (
                        <span className="text-muted-foreground font-mono text-[11px]">{meta}</span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Course Overview, Syllabus & Cloudflare R2 Materials */}
            {hasSyllabus && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    មាតិកាមុខវិជ្ជា និងឯកសារមេរៀនរួម (Course Overview &amp; PDF/Video Materials)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentViewer
                    richContent={course.syllabus?.richContent}
                    notes={course.syllabus?.notes}
                    attachments={course.syllabus?.attachments}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  មេរៀន និងឯកសារបង្រៀន (Lessons &amp; Study Materials)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.sessions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)
                  </p>
                )}
                {course.sessions.map((s) => {
                  const isHighlighted = selectedLessonId && String(s.id) === String(selectedLessonId);
                  return (
                    <div
                      key={s.id}
                      id={`lesson-${s.id}`}
                      className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                        isHighlighted
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-foreground">{s.title}</span>
                        <Badge variant={STATUS[s.status]?.v || "info"}>
                          {STATUS[s.status]?.t || s.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {s.date} {s.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {s.room}
                        </span>
                      </div>

                      <RichContentViewer
                        richContent={s.richContent}
                        notes={s.notes}
                        attachments={s.attachments}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  ក្រុមគ្រូបង្រៀន (Team) - {course.enrolledMembers.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {course.enrolledMembers.map((m, idx) => {
                  const memberId = m.memberId || m.member_id || `STJ-${idx + 1}`;
                  const nameKh = m.fullNameKh || m.full_name_kh || "សមាជិក STJ";
                  const nameEn = m.fullNameEn || m.full_name_en || "";
                  const deptBadge = [m.year, m.department].filter(Boolean).join("-");
                  return (
                    <div
                      key={`${memberId}-${idx}`}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20"
                    >
                      <div className="min-w-0 truncate">
                        <span className="font-mono text-[11px] font-bold text-primary mr-2">
                          {memberId}
                        </span>
                        <span className="font-semibold text-foreground">{nameKh}</span>
                        {nameEn && (
                          <span className="text-muted-foreground ml-1">({nameEn})</span>
                        )}
                      </div>
                      {deptBadge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                          {deptBadge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
