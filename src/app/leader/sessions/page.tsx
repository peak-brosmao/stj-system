"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, CalendarCheck, Share2 } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LeaderSessionsPage() {
  const [sessions] = useState([
    {
      id: "session-1",
      title: "សប្តាហ៍ទី១៖ សេចក្តីផ្តើមអំពី C++ និង Pointer Mechanics",
      sessionDate: "2026-10-15",
      startTime: "08:00",
      endTime: "10:30",
      room: "បន្ទប់ A-204, ITC Campus 1",
      status: "COMPLETED",
      attendanceCount: 8,
    },
    {
      id: "session-2",
      title: "សប្តាហ៍ទី២៖ Dynamic Memory Allocation (malloc, free) & Arrays",
      sessionDate: "2026-11-07",
      startTime: "08:00",
      endTime: "10:30",
      room: "បន្ទប់ A-204, ITC Campus 1",
      status: "SCHEDULED",
      attendanceCount: 0,
    },
  ]);

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>Teaching Timetable</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              កាលវិភាគបង្រៀន (Teaching Schedule)
            </h1>
            <p className="text-xs text-muted-foreground">
              កាលបរិច្ឆេទ ម៉ោងសិក្សា និងបន្ទប់បង្រៀនសម្រាប់មុខវិជ្ជា Programming
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <Card key={s.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    PROG101
                  </span>
                  <Badge variant={s.status === "COMPLETED" ? "success" : "info"}>
                    {s.status === "COMPLETED" ? "បានបញ្ចប់" : "ខាងមុខនេះ"}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-foreground">{s.title}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {s.sessionDate} ({s.startTime} - {s.endTime})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{s.room}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link href={`/leader/attendance`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs space-x-1">
                      <CalendarCheck className="w-3 h-3 text-primary" />
                      <span>មើលវត្តមាន</span>
                    </Button>
                  </Link>
                  <Link href="/leader/share-links">
                    <Button variant="ghost" size="sm" className="h-7 text-xs space-x-1">
                      <Share2 className="w-3 h-3 text-primary" />
                      <span>ចែករំលែក</span>
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

