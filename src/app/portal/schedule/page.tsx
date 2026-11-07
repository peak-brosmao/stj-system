"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock, FileText, MapPin } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { extractPlainTextSnippet, type CourseAttachment } from "@/lib/richContent";

interface Lesson {
  id: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  notes?: string;
  richContent?: string;
  attachments?: CourseAttachment[];
  course: { code: string; titleKh: string; slug?: string };
}

function getLessonStatusBadge(status: string) {
  if (status === "COMPLETED") {
    return { label: "បានបង្រៀនរួច (Completed)", variant: "success" as const };
  }
  if (status === "IN_PROGRESS") {
    return { label: "កំពុងបង្រៀន (In progress)", variant: "warning" as const };
  }
  return { label: "បានកំណត់ពេល (Scheduled)", variant: "info" as const };
}

function LessonRow({ l }: { l: Lesson }) {
  const courseSlug = l.course?.slug || String(l.course?.code || "stj").toLowerCase();
  const snippet = extractPlainTextSnippet(l.richContent, l.notes, 160);
  const attachmentCount = Array.isArray(l.attachments) ? l.attachments.length : 0;
  const statusBadge = getLessonStatusBadge(l.status);
  const detailHref = `/portal/courses/${courseSlug}?lesson=${encodeURIComponent(l.id)}`;

  return (
    <div className="p-4 rounded-xl border border-border bg-muted/25 hover:border-primary/40 transition-colors text-xs space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link href={detailHref} className="font-bold text-sm text-foreground hover:text-primary transition-colors">
            {l.title}
          </Link>
          <p className="text-muted-foreground mt-0.5">
            <span className="font-mono font-semibold text-primary">{l.course.code}</span> -{" "}
            {l.course.titleKh}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <Link href={detailHref}>
            <Button size="sm" variant="outline" className="h-7 text-[11px] space-x-1 border-primary/30 text-primary hover:bg-primary/10">
              <span>ចូលមើលមេរៀនពេញលេញ</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3 text-primary" />
          {new Date(l.sessionDate).toISOString().split("T")[0]} ({l.startTime}-{l.endTime})
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          {l.room}
        </span>
        {snippet && (
          <span className="inline-flex items-center gap-1 text-primary font-medium">
            <FileText className="w-3 h-3" />
            មានអត្ថបទមេរៀន (Rich Text)
          </span>
        )}
        {attachmentCount > 0 && (
          <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
            <BookOpen className="w-3 h-3" />
            {attachmentCount} ឯកសារ PDF/Video (R2)
          </span>
        )}
      </div>

      {snippet && (
        <div className="p-2.5 rounded-lg bg-background/70 border border-border/60 text-muted-foreground">
          <p className="line-clamp-2 leading-relaxed">{snippet}</p>
        </div>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const [upcoming, setUpcoming] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<Lesson[]>([]);
  const [pending, setPending] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/attendance")
      .then((r) => r.json())
      .then((d) => {
        setUpcoming(d.upcoming || []);
        setCompleted(d.completed || []);
        setPending(d.pending || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>STJ Schedule &amp; Lessons</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            កាលវិភាគមេរៀន និងមេរៀនត្រូវបង្រៀន (Lesson Schedule)
          </h1>
          <p className="text-xs text-muted-foreground">
            បង្ហាញមេរៀនដែលប្រធានក្រុមបានរៀបចំ។ ចុច &ldquo;ចូលមើលមេរៀនពេញលេញ&rdquo; ដើម្បីអានអត្ថបទមេរៀន Rich Text និងទាញយកឯកសារ PDF/Video ពី Cloudflare R2។
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              មេរៀនត្រូវបង្រៀនខាងមុខ (Upcoming / Scheduled Lessons)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcoming.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {loading
                  ? "កំពុងដំណើរការ..."
                  : "ពុំមានមេរៀនកំពុងរង់ចាំបង្រៀនខាងមុខទេ (No upcoming scheduled lessons.)"}
              </p>
            )}
            {upcoming.map((l) => (
              <LessonRow key={l.id} l={l} />
            ))}
          </CardContent>
        </Card>

        {completed.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                មេរៀនដែលបានបង្រៀនរួច &amp; ឯកសារមេរៀន (Completed Lessons &amp; Study Materials)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {completed.map((l) => (
                <LessonRow key={l.id} l={l} />
              ))}
            </CardContent>
          </Card>
        )}

        {pending.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                មេរៀនរង់ចាំការស្រង់វត្តមាន (Awaiting attendance)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {pending.map((l) => (
                <LessonRow key={l.id} l={l} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
