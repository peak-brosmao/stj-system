"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, BookOpen, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { useI18n } from "@/ui/i18n/I18nProvider";

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

function normalizeLeader(value: unknown): LeaderItem | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const fullNameKh = typeof record.fullNameKh === "string"
    ? record.fullNameKh
    : typeof record.nameKh === "string"
      ? record.nameKh
      : "";
  const fullNameEn = typeof record.fullNameEn === "string"
    ? record.fullNameEn
    : typeof record.nameEn === "string"
      ? record.nameEn
      : "";
  const courses = Array.isArray(record.courses)
    ? record.courses.filter((course): course is string => typeof course === "string")
    : typeof record.course === "string"
      ? [record.course]
      : [];

  if (typeof record.id !== "string" && typeof record.id !== "number") return null;

  return {
    id: String(record.id),
    userId: String(record.userId ?? record.id),
    fullNameKh: fullNameKh || fullNameEn || "",
    fullNameEn,
    email: typeof record.email === "string" ? record.email : "",
    phone: typeof record.phone === "string" ? record.phone : null,
    studentId: typeof record.studentId === "string" ? record.studentId : null,
    status: typeof record.status === "string" ? record.status : "ACTIVE",
    courses,
    department: typeof record.department === "string" ? record.department : "",
    academicYear: typeof record.academicYear === "string"
      ? record.academicYear
      : typeof record.year === "string"
        ? record.year
        : "",
  };
}

export default function SystemLeadersPage() {
  const { t } = useI18n();
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/system/leaders")
      .then((res) => {
        if (!res.ok) throw new Error(t("system.loadingDatabase"));
        return res.json();
      })
      .then((data) => {
        const rawLeaders: unknown = data?.leaders;
        const normalizedLeaders = Array.isArray(rawLeaders)
          ? rawLeaders.map(normalizeLeader).filter((leader): leader is LeaderItem => leader !== null)
          : [];
        setLeaders(normalizedLeaders);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout portalType="system" userRole={t("system.president")} userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <UserCheck className="w-4 h-4" />
              <span>{t("system.leaderManagement")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("system.leaderList")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("system.leaderDescription")}
            </p>
          </div>
        </div>

        {loading && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            {t("system.loadingDatabase")}
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
            {t("system.noLeaders")}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaders.map((leader) => (
            <Card key={leader.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {(leader.fullNameKh || leader.fullNameEn || "?").charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{leader.fullNameKh}</div>
                      <div className="text-xs text-muted-foreground font-mono">{leader.fullNameEn}</div>
                    </div>
                  </div>
                  <Badge variant={leader.status === "ACTIVE" ? "success" : "secondary"}>
                    {leader.status === "ACTIVE" ? t("system.active") : t("system.inactive")}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-primary font-semibold">{t("system.studentIdPrefix")} {leader.studentId || t("system.notAvailable")}</span>
                    <span>Ã¢â‚¬Â¢</span>
                    <span>{leader.academicYear}-{leader.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{leader.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{leader.phone || t("system.notAvailable")}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("system.assignedCourses")}
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
