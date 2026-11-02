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
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពៀក ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
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
          {courses.map((c) => (
            <Card key={c.code} className="hover:border-primary/50 transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {c.code} • {c.academicTerm}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">
                      {c.titleKh}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans">{c.titleEn}</p>
                  </div>
                  <Badge variant="success">កំពុងសិក្សា</Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.description}
                </p>

                <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">ប្រធានក្រុមទទួលបន្ទុក:</span>
                    <p className="font-semibold text-foreground mt-0.5">{c.leaderName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">វត្តមានផ្ទាល់ខ្លួន:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{c.myAttendanceRate}%</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">សមាជិកសិក្សា៖ <strong>{c.enrolledMembersCount} នាក់</strong></span>
                  <Link href={`/portal/courses/${c.slug}`}>
                    <Button size="sm" variant="outline" className="space-x-1.5 text-xs">
                      <span>ព័ត៌មានលម្អិតមុខវិជ្ជា</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

