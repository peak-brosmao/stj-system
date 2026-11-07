"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { RichContentViewer } from "@/ui/RichTextEditor";
import type { CourseAttachment } from "@/lib/richContent";

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

function LessonRow({ l, tag, variant }: { l: Lesson; tag: string; variant: "info" | "warning" }) {
  const courseSlug = l.course?.slug || String(l.course?.code || "stj").toLowerCase();
  return (
    <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-bold text-sm text-foreground">{l.title}</span>
          <p className="text-muted-foreground mt-0.5">
            <span className="font-mono font-semibold text-primary">{l.course.code}</span> -{" "}
            {l.course.titleKh}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{tag}</Badge>
          <Link href={`/portal/courses/${courseSlug}`}>
            <Button size="sm" variant="outline" className="h-7 text-[11px] space-x-1">
              <span>មើលមុខវិជ្ជា &amp; មេរៀន</span>
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
      </div>

      <RichContentViewer
        richContent={l.richContent}
        notes={l.notes}
        attachments={l.attachments}
      />
    </div>
  );
}

export default function SchedulePage() {
  const [upcoming, setUpcoming] = useState<Lesson[]>([]);
  const [pending, setPending] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/attendance")
      .then((r) => r.json())
      .then((d) => {
        setUpcoming(d.upcoming || []);
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
            <span>STJ Schedule</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">កាលវិភាគមេរៀន (Lesson Schedule)</h1>
          <p className="text-xs text-muted-foreground">
            បង្ហាញតែមេរៀនដែលប្រធានក្រុមបានរៀបចំ (Shows only lessons created by your Leader Team.)
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">មេរៀនខាងមុខ (Upcoming)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {loading ? "កំពុងដំណើរការ..." : "ពុំទាន់មានមេរៀនត្រូវបានបង្កើតនៅឡើយទេ (No lessons created yet.)"}
              </p>
            )}
            {upcoming.map((l) => (
              <LessonRow key={l.id} l={l} tag="មិនទាន់បង្រៀន (Not taught yet)" variant="info" />
            ))}
          </CardContent>
        </Card>

        {pending.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">មេរៀនរង់ចាំការស្រង់វត្តមាន (Awaiting attendance)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending.map((l) => (
                <LessonRow key={l.id} l={l} tag="មិនទាន់ស្រង់វត្តមាន (Not marked yet)" variant="warning" />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}