"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  MapPin,
  Megaphone,
  CheckCircle2,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = (params?.courseId as string) || "programming";

  const isMath = slug.includes("math");
  const isPhys = slug.includes("phys");
  const isChem = slug.includes("chem");

  const courseInfo = {
    code: isMath ? "MATH101" : isPhys ? "PHYS101" : isChem ? "CHEM101" : "PROG101",
    titleKh: isMath
      ? "គណិតវិទ្យាវិស្វកម្ម (Engineering Mathematics)"
      : isPhys
      ? "រូបវិទ្យាវិស្វកម្ម (Engineering Physics)"
      : isChem
      ? "គីមីវិទ្យាទូទៅ (General Chemistry)"
      : "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)",
    titleEn: isMath
      ? "Engineering Mathematics & Calculus"
      : isPhys
      ? "Engineering Physics: Mechanics & Waves"
      : isChem
      ? "General & Engineering Chemistry"
      : "Programming & Algorithmic Thinking",
    term: "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦~២០២៧",
    leader: isMath
      ? "គឹម រតនៈ (KIM Ratanak) - I5 GIM (010650202)"
      : isPhys
      ? "គ្រុយ អីុខាង (KRUY Ykhang) - I3 GIM (0968925682)"
      : isChem
      ? "ខេង លីឧស្សាហ៍ (KHENG Lyussa) - I3 GCI (0974253117)"
      : "លាង ជីងហេង (LEANG JINGHENG) - I3 GTI (0976355500)",
    schedule: isMath
      ? "រៀងរាល់ថ្ងៃចន្ទ ម៉ោង 14:00 - 16:00"
      : isPhys
      ? "រៀងរាល់ថ្ងៃពុធ ម៉ោង 14:00 - 16:00"
      : isChem
      ? "រៀងរាល់ថ្ងៃព្រហស្បតិ៍ ម៉ោង 14:00 - 16:00"
      : "រៀងរាល់ថ្ងៃសៅរ៍ ម៉ោង 08:00 - 10:00",
    room: isMath ? "បន្ទប់ B-108, ITC Campus 1" : "បន្ទប់ A-204, ITC Campus 1",
    description: isMath
      ? "សិក្សាស៊ីជម្រៅអំពី Calculus, Linear Algebra, Matrix Diagonalization, Differential Equations សម្រាប់ការដោះស្រាយបញ្ហាជាក់ស្តែងក្នុងវិស្វកម្ម។"
      : "ពង្រឹងមូលដ្ឋានគ្រឹះភាសា C, C++, Pointer Memory Architecture, Structs, Dynamic Memory, Linked Lists, Stack, Queue និងក្បួនដោះស្រាយ (Algorithms)។",
  };

  const sessions = [
    { num: 1, title: "Pointers & Memory Architecture", date: "10 តុលា ២០២៦", status: "COMPLETED" },
    { num: 2, title: "Structs & Dynamic Memory Allocation", date: "17 តុលា ២០២៦", status: "COMPLETED" },
    { num: 3, title: "Linked List Implementation", date: "24 តុលា ២០២៦", status: "COMPLETED" },
    { num: 4, title: "Stack & Queue Data Structures", date: "07 វិច្ឆិកា ២០២៦", status: "UPCOMING" },
    { num: 5, title: "Recursion & Trees", date: "14 វិច្ឆិកា ២០២៦", status: "UPCOMING" },
  ];

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពាក់ ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <Link
            href="/portal/courses"
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ត្រឡប់ទៅកាន់មុខវិជ្ជារបស់ខ្ញុំ</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {courseInfo.code} • {courseInfo.term}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1.5">
                {courseInfo.titleKh}
              </h1>
              <p className="text-xs text-muted-foreground font-sans">{courseInfo.titleEn}</p>
            </div>
            <Badge variant="success">សកម្មភាពសិក្សាកំពុងដំណើរការ</Badge>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                <span>ប្រធានក្រុមទទួលបន្ទុក:</span>
              </span>
              <p className="font-bold text-xs text-foreground mt-1">{courseInfo.leader}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>កាលវិភាគសិក្សា:</span>
              </span>
              <p className="font-bold text-xs text-foreground mt-1">{courseInfo.schedule}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>បន្ទប់រៀនផ្លូវការ:</span>
              </span>
              <p className="font-bold text-xs text-foreground mt-1">{courseInfo.room}</p>
            </CardContent>
          </Card>
        </div>

        {/* Description & Curriculum */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">ពិពណ៌នាសង្ខេបមុខវិជ្ជា (Course Syllabus)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {courseInfo.description}
            </p>

            <div className="pt-3 border-t border-border">
              <h4 className="font-bold text-xs text-foreground mb-3">កាលវិភាគវគ្គបង្រៀន (Teaching Sessions):</h4>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div
                    key={s.num}
                    className="p-3 rounded-xl border border-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
                        {s.num}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{s.title}</p>
                        <span className="text-[11px] text-muted-foreground">{s.date}</span>
                      </div>
                    </div>
                    <Badge variant={s.status === "COMPLETED" ? "secondary" : "default"}>
                      {s.status === "COMPLETED" ? "បានបញ្ចប់" : "ខាងមុខ"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

