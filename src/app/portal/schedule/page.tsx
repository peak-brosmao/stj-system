"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Badge } from "@/ui/ui/Badge";

interface Lesson {
  id: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  course: { code: string; titleKh: string };
}

function LessonRow({ l, tag, variant }: { l: Lesson; tag: string; variant: "info" | "warning" }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{l.title}</span>
        <Badge variant={variant}>{tag}</Badge>
      </div>
      <p className="text-muted-foreground">{l.course.code} - {l.course.titleKh}</p>
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(l.sessionDate).toISOString().split("T")[0]} {l.startTime}-{l.endTime}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {l.room}
        </span>
      </div>
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">áž€áž¶áž›ážœáž·áž—áž¶áž‚áž˜áŸážšáŸ€áž“ (Lesson Schedule)</h1>
          <p className="text-xs text-muted-foreground">
            áž”áž„áŸ’áž áž¶áž‰ážáŸ‚áž˜áŸážšáŸ€áž“ážŠáŸ‚áž›áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜áž”áž¶áž“ážšáŸ€áž”áž…áŸ† (Shows only lessons created by your Leader Team.)
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">áž˜áŸážšáŸ€áž“ážáž¶áž„áž˜áž»áž (Upcoming)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {loading ? "áž€áŸ†áž–áž»áž„ážŠáŸ†ážŽáž¾ážšáž€áž¶ážš..." : "áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“áž˜áŸážšáŸ€áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’áž€áž¾ážáž“áŸ…áž¡áž¾áž™áž‘áŸ (No lessons created yet.)"}
              </p>
            )}
            {upcoming.map((l) => (
              <LessonRow key={l.id} l={l} tag="áž˜áž·áž“áž‘áž¶áž“áŸ‹áž”áž„áŸ’ážšáŸ€áž“ (Not taught yet)" variant="info" />
            ))}
          </CardContent>
        </Card>

        {pending.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">áž˜áŸážšáŸ€áž“ážšáž„áŸ‹áž…áž¶áŸ†áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ (Awaiting attendance)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending.map((l) => (
                <LessonRow key={l.id} l={l} tag="áž˜áž·áž“áž‘áž¶áž“áŸ‹ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ (Not marked yet)" variant="warning" />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
