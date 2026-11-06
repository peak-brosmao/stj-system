"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Users, Calendar, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface CourseItem {
  id: string;
  code: string;
  slug: string;
  titleKh: string;
  titleEn: string;
  category: string;
  term: string;
  status: string;
  leaders: string;
  enrolled: number;
  sessionsCount: number;
}

export default function SystemCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system/courses")
      .then((res) => {
        if (!res.ok) throw new Error("មិនអាចទាញយកទិន្នន័យមុខវិជ្ជាពី Database បានឡើយ");
        return res.json();
      })
      .then((data) => {
        setCourses(data.courses || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <BookOpen className="w-4 h-4" />
              <span>កម្មវិធីសិក្សាផ្លូវការ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងមុខវិជ្ជាសិក្សា
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីមុខវិជ្ជាស្នូល និងចំនួនសមាជិកដែលបានទាញយកដោយផ្ទាល់ពី Database
            </p>
          </div>
        </div>

        {loading && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            កំពុងទាញយកទិន្នន័យពី Database...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl">
            ពុំមានមុខវិជ្ជានៅក្នុងប្រព័ន្ធឡើយ
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {c.code}
                  </span>
                  <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>
                    {c.status === "ACTIVE" ? "សកម្ម" : "អសកម្ម"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{c.titleKh}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.category}</p>
                </div>

                <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-1.5 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>សិស្សចុះឈ្មោះ៖ <strong className="text-foreground">{c.enrolled} នាក់</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.term}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  ប្រធានមុខវិជ្ជា៖ <strong className="text-foreground">{c.leaders}</strong>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
