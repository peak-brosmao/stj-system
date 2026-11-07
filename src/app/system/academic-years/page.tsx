"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  AlertCircle,
  X,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface OperationalYear {
  id: string;
  yearCode: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: "ACTIVE" | "ARCHIVED" | "UPCOMING";
  membersCount: number;
  sessionsCount: number;
  attendanceRate: number;
}

interface EngineeringLevel {
  code: string;
  label: string;
  order: number;
  membersCount: number;
}

export default function SystemAcademicYearsPage() {
  const [operationalYears, setOperationalYears] = useState<OperationalYear[]>([]);
  const [engineeringLevels, setEngineeringLevels] = useState<EngineeringLevel[]>([]);
  const [currentYearCode, setCurrentYearCode] = useState("2026-2027");
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newYear, setNewYear] = useState({
    yearCode: "",
    label: "",
    startDate: "",
    endDate: "",
  });

  const loadData = () => {
    setLoading(true);
    fetch("/api/system/academic-years")
      .then((res) => res.json())
      .then((data) => {
        if (data.operationalYears) setOperationalYears(data.operationalYears);
        if (data.engineeringLevels) setEngineeringLevels(data.engineeringLevels);
        if (data.currentYearCode) setCurrentYearCode(data.currentYearCode);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetCurrent = async (yearCode: string) => {
    try {
      const res = await fetch("/api/system/academic-years", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearCode, action: "SET_CURRENT" }),
      });
      if (res.ok) {
        setCurrentYearCode(yearCode);
        setSuccessMessage(`Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ ${yearCode} Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢`);
        loadData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch {
      // fallback
    }
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/academic-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newYear),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewYear({ yearCode: "", label: "", startDate: "", endDate: "" });
        setSuccessMessage("Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢");
        loadData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        {/* Banner with scope explanation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>STJ Institutional Governance Ã¢â‚¬Â¢ Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ (Academic Cycles & Levels)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€  Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ STJ Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€  Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢)
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="space-x-1.5 text-xs self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸</span>
          </Button>
        </div>

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* SECTION 1: Operational Academic Years */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ STJ (Operational Academic Cycles)</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¾Â½Ã¡Å¾â„¢Ã¡Å¸â€”Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€ž Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾Â¡Ã¡Å¸â€šÃ¡Å¾â‚¬
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operationalYears.map((yr) => (
              <Card
                key={yr.id}
                className={`transition-all ${
                  yr.isCurrent
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        yr.isCurrent ? "success" : yr.status === "UPCOMING" ? "secondary" : "outline"
                      }
                      className="text-[10px]"
                    >
                      {yr.isCurrent
                        ? "Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ (Active)"
                        : yr.status === "UPCOMING"
                        ? "Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€žÃ¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬ (Upcoming)"
                        : "Ã¡Å¾â€Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾Å½Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡ (Archived)"}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-muted-foreground">{yr.yearCode}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">{yr.label}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {yr.startDate} Ã¡Å¾Å Ã¡Å¾â€ºÃ¡Å¸â€¹ {yr.endDate}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                    <div>
                      <span className="text-xs font-bold text-foreground">{yr.membersCount}</span>
                      <p className="text-[10px] text-muted-foreground">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">{yr.sessionsCount}</span>
                      <p className="text-[10px] text-muted-foreground">Ã¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary">
                        {yr.attendanceRate > 0 ? `${yr.attendanceRate}%` : "N/A"}
                      </span>
                      <p className="text-[10px] text-muted-foreground">Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {yr.isCurrent ? (
                      <Button variant="outline" size="sm" disabled className="w-full text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        <span>Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ</span>
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSetCurrent(yr.yearCode)}
                        className="w-full text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        <span>Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 2: Engineering Level Distribution (Real 39 Members) */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Å¡ Ã¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€ž (Engineering Levels I1 - I5)</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â€¦Ã¡Å¸â€šÃ¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â STJ Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ {currentYearCode}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€ Ã¡Å¸Â£Ã¡Å¸Â© Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹ (Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡)
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾Â</th>
                    <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Å¡ (ITC Engineering Level)</th>
                    <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â€ºÃ¡Å¸â€ Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹</th>
                    <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â</th>
                    <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Å¡Ã¡Å¾â„¢</th>
                    <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {engineeringLevels.map((lvl) => {
                    const percent = lvl.membersCount > 0 ? ((lvl.membersCount / 39) * 100).toFixed(1) : "0";
                    return (
                      <tr key={lvl.code} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">{lvl.code}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{lvl.label}</td>
                        <td className="py-3 px-4 text-center">{lvl.order}</td>
                        <td className="py-3 px-4 text-center font-bold text-foreground">
                          {lvl.membersCount} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-muted-foreground">
                          {percent}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          {lvl.membersCount > 0 ? (
                            <Badge variant="success" className="text-[10px]">
                              Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Create New Academic Year */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}>
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <span>Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateYear} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ (Year Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ã¡Å¾Â§. 2027-2028"
                    value={newYear.yearCode}
                    onChange={(e) => setNewYear({ ...newYear, yearCode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ã¡Å¾â€˜Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹ YYYY-YYYY</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡ (Label) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ã¡Å¾Â§. Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â§~Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¨"
                    value={newYear.label}
                    onChange={(e) => setNewYear({ ...newYear, label: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¸ÂÃ¡Å¾â€˜Ã¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾Ëœ</label>
                    <input
                      type="date"
                      value={newYear.startDate}
                      onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¸ÂÃ¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾â€Ã¡Å¸â€¹</label>
                    <input
                      type="date"
                      value={newYear.endDate}
                      onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Ã¡Å¾â€Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€¹
                  </Button>
                  <Button type="submit" size="sm">
                    Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
