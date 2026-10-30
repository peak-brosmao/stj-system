"use client";

import React, { useState } from "react";
import { BookOpen, Plus, Code, Calculator, Atom, FlaskConical, Users, Calendar } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SystemCoursesPage() {
  const [courses] = useState([
    {
      id: "c1",
      code: "PROG101",
      slug: "programming",
      titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      category: "Engineering Foundation",
      term: "2026-2027 Semester 1",
      status: "ACTIVE",
      leaders: "លាង ជីងហេង (I3-GTI)",
      enrolled: 39,
    },
    {
      id: "c2",
      code: "MATH101",
      slug: "mathematics",
      titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      category: "Engineering Foundation",
      term: "2026-2027 Semester 1",
      status: "ACTIVE",
      leaders: "គឹម រតនៈ (I5-GIM)",
      enrolled: 39,
    },
    {
      id: "c3",
      code: "PHYS101",
      slug: "physics",
      titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      category: "Natural Sciences",
      term: "2026-2027 Semester 1",
      status: "ACTIVE",
      leaders: "គ្រុយ អីុខាង (I3-GIM)",
      enrolled: 39,
    },
    {
      id: "c4",
      code: "CHEM101",
      slug: "chemistry",
      titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)",
      category: "Natural Sciences",
      term: "2026-2027 Semester 1",
      status: "ACTIVE",
      leaders: "ខេង លីឧស្សាហ៍ (I3-GCI)",
      enrolled: 39,
    },
  ]);

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Academic Curriculum</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងមុខវិជ្ជាសិក្សា (Courses & Programs)
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីមុខវិជ្ជាស្នូល កូដមុខវិជ្ជា និងប្រធានទទួលបន្ទុក
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {c.code}
                  </span>
                  <Badge variant="success">សកម្ម (Active)</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">{c.titleKh}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>សិស្សចុះឈ្មោះ៖ <strong className="text-foreground">{c.enrolled} នាក់</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{c.term}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
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

