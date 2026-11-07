"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { RichContentViewer } from "@/ui/RichTextEditor";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Course Catalog & Enrolled Units</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            មុខវិជ្ជារបស់ខ្ញុំ (My Enrolled Courses)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            បញ្ជីមុខវិជ្ជាស្នូលទាំង ៤ នៃកម្មវិធី STJ ឆ្នាំសិក្សា ២០២៦~២០២៧ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => {
            const hasSyllabus = Boolean(
              c.syllabus &&
                (c.syllabus.richContent ||
                  c.syllabus.notes ||
                  (Array.isArray(c.syllabus.attachments) && c.syllabus.attachments.length > 0))
            );
            const lessonList = Array.isArray(c.sessions) ? c.sessions : [];
            const totalAttachments =
              (Array.isArray(c.syllabus?.attachments) ? c.syllabus.attachments.length : 0) +
              lessonList.reduce(
                (acc: number, s: any) =>
                  acc + (Array.isArray(s.attachments) ? s.attachments.length : 0),
                0
              );

            return (
              <Card
                key={c.code}
                className="hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {c.code} • {c.academicTerm}
                      </span>
                      <h3 className="font-bold text-base text-foreground mt-1">{c.titleKh}</h3>
                      <p className="text-xs text-muted-foreground font-sans">{c.titleEn}</p>
                    </div>
                    <Badge variant="success">កំពុងសិក្សា</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.description || c.descriptionKh}
                  </p>

                  {hasSyllabus && (
                    <div className="p-3.5 rounded-xl border border-primary/25 bg-primary/5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <FileText className="w-3.5 h-3.5" />
                        <span>មាតិកាមុខវិជ្ជា និងឯកសារពីប្រធានក្រុម (Course Content &amp; R2 PDF/Video)</span>
                      </div>
                      <RichContentViewer
                        richContent={c.syllabus?.richContent}
                        notes={c.syllabus?.notes}
                        attachments={c.syllabus?.attachments}
                      />
                    </div>
                  )}

                  <div className="pt-3 border-t border-border grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground">ប្រធានក្រុមទទួលបន្ទុក:</span>
                      <p className="font-semibold text-foreground mt-0.5">{c.leaderName}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">មេរៀន &amp; ឯកសារ:</span>
                      <p className="font-semibold text-foreground mt-0.5">
                        {lessonList.length} មេរៀន
                        {totalAttachments > 0 ? ` • ${totalAttachments} PDF/Video` : ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">វត្តមានផ្ទាល់ខ្លួន:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {c.myAttendanceRate}%
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      សមាជិកសិក្សា៖ <strong>{c.enrolledMembersCount} នាក់</strong>
                    </span>
                    <Link href={`/portal/courses/${c.slug || String(c.code || "").toLowerCase()}`}>
                      <Button size="sm" variant="outline" className="space-x-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10">
                        <span>មើលមាតិកាមុខវិជ្ជា &amp; មេរៀនត្រូវបង្រៀន</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
