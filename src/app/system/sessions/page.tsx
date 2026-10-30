"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  CalendarCheck,
  CheckCircle,
  X,
  BookOpen,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface SessionItem {
  id: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  course: { code: string; titleKh: string };
  _count?: { attendance: number };
}

export default function SystemSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; code: string; titleKh: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newSession, setNewSession] = useState({
    courseId: "",
    title: "",
    sessionDate: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "10:30",
    room: "បន្ទប់ A-204, ITC Campus 1",
    notes: "",
  });

  const loadData = () => {
    setLoading(true);
    fetch("/api/system/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (data.sessions) setSessions(data.sessions);
      })
      .finally(() => setLoading(false));

    fetch("/api/system/attendance")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
          if (data.courses[0]) {
            setNewSession((prev) => ({ ...prev, courseId: data.courses[0].id }));
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      }
    } catch {
      // ignore
    }
  };

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>Teaching Sessions Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងវគ្គបង្រៀន (Teaching Sessions)
            </h1>
            <p className="text-xs text-muted-foreground">
              កាលវិភាគ ទីតាំងបន្ទប់ និងស្ថានភាពវគ្គសិក្សាទាំងអស់
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បង្កើតវគ្គបង្រៀនថ្មី</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <Card key={s.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {s.course.code}
                  </span>
                  <Badge variant={s.status === "COMPLETED" ? "success" : "info"}>
                    {s.status === "COMPLETED" ? "បានបញ្ចប់ (Completed)" : "រៀបចំទុក (Scheduled)"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.course.titleKh}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {new Date(s.sessionDate).toISOString().split("T")[0]} ({s.startTime} - {s.endTime})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{s.room}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    វត្តមានកត់ត្រារួច៖ <strong className="text-foreground">{s._count?.attendance || 0} នាក់</strong>
                  </span>
                  <Link href={`/system/attendance?sessionId=${s.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs space-x-1">
                      <CalendarCheck className="w-3 h-3 text-primary" />
                      <span>ស្រង់វត្តមាន</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {sessions.length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground text-xs">
              {loading ? "កំពុងទាញយកទិន្នន័យ..." : "ពុំទាន់មានវគ្គបង្រៀនត្រូវបានបង្កើតនៅឡើយ"}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">បង្កើតវគ្គបង្រៀនថ្មី</h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">មុខវិជ្ជា</label>
                    <select
                      value={newSession.courseId}
                      onChange={(e) => setNewSession({ ...newSession, courseId: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">ចំណងជើងវគ្គបង្រៀន</label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. សប្តាហ៍ទី២៖ Pointer & Memory"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">កាលបរិច្ឆេទ</label>
                    <input
                      type="date"
                      required
                      value={newSession.sessionDate}
                      onChange={(e) => setNewSession({ ...newSession, sessionDate: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">ម៉ោងចាប់ផ្តើម</label>
                      <input
                        type="time"
                        value={newSession.startTime}
                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ម៉ោងបញ្ចប់</label>
                      <input
                        type="time"
                        value={newSession.endTime}
                        onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">បន្ទប់សិក្សា</label>
                    <input
                      type="text"
                      required
                      placeholder="បន្ទប់ A-204, ITC Campus 1"
                      value={newSession.room}
                      onChange={(e) => setNewSession({ ...newSession, room: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm">
                      បង្កើតវគ្គសិក្សា
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

