"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, BookOpen, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LeaderItem {
  id: string;
  userId: string;
  fullNameKh: string;
  fullNameEn: string;
  email: string;
  phone?: string | null;
  studentId?: string | null;
  status: string;
  courses: string[];
  department?: string;
  academicYear?: string;
}

export default function SystemLeadersPage() {
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system/leaders")
      .then((res) => {
        if (!res.ok) throw new Error("មិនអាចទាញយកទិន្នន័យប្រធានមុខវិជ្ជាពី Database បានឡើយ");
        return res.json();
      })
      .then((data) => {
        setLeaders(data.leaders || []);
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
              <UserCheck className="w-4 h-4" />
              <span>ការគ្រប់គ្រងថ្នាក់ដឹកនាំក្រុម</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              បញ្ជីប្រធានមុខវិជ្ជា
            </h1>
            <p className="text-xs text-muted-foreground">
              ប្រធានទទួលបន្ទុកមុខវិជ្ជានីមួយៗ ដែលបានទាញយកដោយផ្ទាល់ពី Database
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

        {!loading && !error && leaders.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl">
            ពុំទាន់មានប្រធានមុខវិជ្ជាត្រូវបានចាត់តាំងនៅក្នុង Database ឡើយ
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaders.map((leader) => (
            <Card key={leader.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {leader.fullNameKh.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{leader.fullNameKh}</div>
                      <div className="text-xs text-muted-foreground font-mono">{leader.fullNameEn}</div>
                    </div>
                  </div>
                  <Badge variant={leader.status === "ACTIVE" ? "success" : "secondary"}>
                    {leader.status === "ACTIVE" ? "សកម្ម" : "អសកម្ម"}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-primary font-semibold">អត្តលេខ៖ {leader.studentId}</span>
                    <span>•</span>
                    <span>{leader.academicYear}-{leader.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{leader.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{leader.phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    មុខវិជ្ជាទទួលបន្ទុក៖
                  </div>
                  {leader.courses.map((course, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs p-2 rounded-lg bg-muted/60 text-foreground font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{course}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
