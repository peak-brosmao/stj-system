"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  CalendarCheck,
  Printer,
  QrCode,
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/Card";
import { LanguageSelector } from "@/ui/i18n/LanguageSelector";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { Logo } from "@/ui/Logo";

interface ShareData {
  title: string;
  courseName: string;
  courseCode: string;
  sessionTitle?: string;
  sessionDate?: string;
  showStats: boolean;
  stats: {
    total: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    rate: number;
  };
  members: Array<{
    no: number;
    memberId: string;
    fullNameKh: string;
    fullNameEn: string;
    department: string;
    year: string;
    status: string;
  }>;
}

export default function SharedAttendancePage() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);

  const loadData = async (pwd?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/share/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      const resData = await res.json();

      if (res.status === 401 && resData.requiresPassword) {
        setRequiresPassword(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(resData.error || "Failed to load attendance report.");
      }

      setData(resData);
      setRequiresPassword(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading report.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(password);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge variant="success" className="space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Present)</span>
          </Badge>
        );
      case "LATE":
        return (
          <Badge variant="warning" className="space-x-1">
            <Clock className="w-3 h-3" />
            <span>Ã¡Å¾ËœÃ¡Å¾â‚¬Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â (Late)</span>
          </Badge>
        );
      case "EXCUSED":
        return (
          <Badge variant="purple" className="space-x-1">
            <FileText className="w-3 h-3" />
            <span>Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹ (Excused)</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="space-x-1 border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            <span>Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹ (Pending)</span>
          </Badge>
        );
      case "ABSENT":
      default:
        return (
          <Badge variant="destructive" className="space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Absent)</span>
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4 print:border-b-2">
          <div className="flex items-center space-x-3">
            <Logo size="md" subtitle="Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶ Ã¢â‚¬Â¢ Senior Teaching Junior" href="/" />
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider print:hidden">
              Official Record
            </span>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto print:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQrModal(true)}
              className="space-x-1.5 text-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.print()}
              className="space-x-1.5 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ã¡Å¾â€Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“ (Print)</span>
            </Button>
          </div>
        </div>
        {/* Password Screen */}
        {requiresPassword && (
          <Card className="max-w-md mx-auto my-12">
            <CardContent className="p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶
                </p>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹..."
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹..." : "Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸Â"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && !requiresPassword && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ...
          </div>
        )}

        {/* Error state */}
        {error && !requiresPassword && (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center max-w-md mx-auto my-12 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <h3 className="font-bold text-base">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¸Â</h3>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loaded Report Content */}
        {data && !loading && (
          <div className="space-y-6">
            {/* Title & Metadata */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {data.courseCode}
                </span>
                {data.sessionDate && (
                  <span className="text-xs text-muted-foreground">
                    Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¸ÂÃ¡Å¾â€˜Ã¡Å¸â€“ {data.sessionDate}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {data.title || data.courseName}
              </h1>
              {data.sessionTitle && (
                <p className="text-xs text-muted-foreground font-medium">
                  {data.sessionTitle}
                </p>
              )}
            </div>

            {/* Statistics Banner */}
            {data.showStats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card>
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{data.stats.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {data.stats.present}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">Ã¡Å¾ËœÃ¡Å¾â‚¬Ã¡Å¾â„¢Ã¡Å¾ÂºÃ¡Å¾Â</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {data.stats.late}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-destructive">Ã¡Å¾Â¢Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</p>
                    <p className="text-lg font-bold text-destructive mt-0.5">{data.stats.absent}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-purple-600 dark:text-purple-400">Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                      {data.stats.excused}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/40 bg-primary/5">
                  <CardContent className="p-3.5 text-center">
                    <p className="text-[11px] text-primary font-medium">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</p>
                    <p className="text-lg font-extrabold text-primary mt-0.5">{data.stats.rate}%</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Attendance Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Ã¡Å¾â€º.Ã¡Å¾Å¡</th>
                      <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾Â</th>
                      <th className="py-3 px-4 font-semibold">Ã¡Å¾â€šÃ¡Å¸â€žÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ-Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ</th>
                      <th className="py-3 px-4 font-semibold">Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹</th>
                      <th className="py-3 px-4 font-semibold">Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ </th>
                      <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.members.map((m) => (
                      <tr key={m.memberId} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-center text-muted-foreground font-mono">
                          {m.no}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-primary">
                          {m.memberId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                          <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                        </td>
                        <td className="py-3 px-4 font-medium">{m.department}</td>
                        <td className="py-3 px-4 font-medium">{m.year}</td>
                        <td className="py-3 px-4 text-center">{getStatusBadge(m.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Footer */}
            <div className="text-center pt-4 text-[11px] text-muted-foreground space-y-1">
              <p>Ã‚Â© {new Date().getFullYear()} Senior Teaching Junior (STJ) - Institute of Technology of Cambodia.</p>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-sm w-full">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="font-bold text-sm">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  QR Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€ºÃ¡Å¸â€šÃ¡Å¾â‚¬</h3>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    Ã¢Å“â€¢
                  </button>
                </div>
                <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    alt="QR Code"
                    className="w-44 h-44"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¾Å Ã¡Å¾Â¾Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¸Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â€ºÃ¡Å¾Â¾Ã¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Å Ã¡Å¸Æ’
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQrModal(false)}
                  className="w-full"
                >
                  Ã¡Å¾â€Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

