"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function MySchedulePage() {
  const [viewMode, setViewMode] = useState<"upcoming" | "weekly" | "monthly">("upcoming");

  const scheduleEvents = [
    {
      id: "ev-1",
      course: "PROG101",
      courseName: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      title: "វគ្គទី៤៖ Binary Search Trees & Recursion Mechanics",
      date: "សៅរ៍ ០៧ វិច្ឆិកា ២០២៦",
      time: "08:00 - 10:00 (Asia/Phnom_Penh)",
      room: "បន្ទប់ A-204, ITC Campus 1",
      leader: "លាង ជីងហេង (LEANG JINGHENG)",
      type: "CLASS",
    },
    {
      id: "ev-2",
      course: "MATH101",
      courseName: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      title: "វគ្គទី៣៖ Eigenvalues & Matrix Diagonalization",
      date: "ចន្ទ ០៩ វិច្ឆិកា ២០២៦",
      time: "14:00 - 16:00 (Asia/Phnom_Penh)",
      room: "បន្ទប់ B-108, ITC Campus 1",
      leader: "គឹម រតនៈ (KIM Ratanak)",
      type: "CLASS",
    },
    {
      id: "ev-3",
      course: "STJ General",
      courseName: "សិក្ខាសាលាស្ម័គ្រចិត្ត STJ",
      title: "សិក្ខាសាលាចែករំលែកតិចនិកស្រាវជ្រាវ និងការត្រៀមប្រឡងឆមាសទី១",
      date: "ពុធ ១១ វិច្ឆិកា ២០២៦",
      time: "15:00 - 17:00 (Asia/Phnom_Penh)",
      room: "សាលសន្និសីទ ITC Conference Hall",
      leader: "ផល ដាវីត & គណៈដឹកនាំ",
      type: "WORKSHOP",
    },
    {
      id: "ev-4",
      course: "PROG101",
      courseName: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      title: "វគ្គទី៥៖ Hash Tables & Collision Resolution",
      date: "សៅរ៍ ១៤ វិច្ឆិកា ២០២៦",
      time: "08:00 - 10:00 (Asia/Phnom_Penh)",
      room: "បន្ទប់ A-204, ITC Campus 1",
      leader: "លាង ជីងហេង",
      type: "CLASS",
    },
  ];

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពាក់ ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Academic Timetable • Timezone: Asia/Phnom_Penh (UTC+7)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              កាលវិភាគសិក្សា (Academic Schedule)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              កាលវិភាគវគ្គបង្រៀនមុខវិជ្ជាស្នូល និងសកម្មភាពសិក្សារបស់ STJ សម្រាប់ឆ្នាំសិក្សា ២០២៦~២០២៧
            </p>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-muted rounded-xl text-xs">
            <button
              onClick={() => setViewMode("upcoming")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === "upcoming" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              វគ្គខាងមុខ
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === "weekly" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ប្រចាំសប្តាហ៍
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === "monthly" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ប្រចាំខែ
            </button>
          </div>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-4">
          {scheduleEvents.map((ev) => (
            <Card key={ev.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {ev.course}
                    </span>
                    <Badge variant={ev.type === "WORKSHOP" ? "purple" : "secondary"}>
                      {ev.type === "WORKSHOP" ? "សិក្ខាសាលា (Workshop)" : "ថ្នាក់បង្រៀន (Tutoring)"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{ev.courseName}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground">{ev.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center space-x-1.5 text-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{ev.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{ev.time}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{ev.room}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-border sm:pl-6 shrink-0 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">រៀមច្បងទទួលបន្ទុក៖</span>
                  <p className="font-semibold text-xs text-foreground">{ev.leader}</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    ស្ថានភាព៖ គ្រោងទុកជាផ្លូវការ
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
