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
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

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
            áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ† (My Enrolled Courses)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            áž”áž‰áŸ’áž‡áž¸áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’áž“áž¼áž›áž‘áž¶áŸ†áž„ áŸ¤ áž“áŸƒáž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¦~áŸ¢áŸ áŸ¢áŸ§ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <Card key={c.code} className="hover:border-primary/50 transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {c.code} â€¢ {c.academicTerm}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">
                      {c.titleKh}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans">{c.titleEn}</p>
                  </div>
                  <Badge variant="success">áž€áŸ†áž–áž»áž„ážŸáž·áž€áŸ’ážŸáž¶</Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.description}
                </p>

                <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜áž‘áž‘áž½áž›áž”áž“áŸ’áž‘áž»áž€:</span>
                    <p className="font-semibold text-foreground mt-0.5">{c.leaderName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">ážœážáŸ’ážáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{c.myAttendanceRate}%</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">ážŸáž˜áž¶áž‡áž·áž€ážŸáž·áž€áŸ’ážŸáž¶áŸ– <strong>{c.enrolledMembersCount} áž“áž¶áž€áŸ‹</strong></span>
                  <Link href={`/portal/courses/${c.slug}`}>
                    <Button size="sm" variant="outline" className="space-x-1.5 text-xs">
                      <span>áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·ážáž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</span>
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

