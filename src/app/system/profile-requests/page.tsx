"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export default function SystemProfileRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      memberName: "Ã¡Å¾â€“Ã¡Å¸â‚¬Ã¡Å¾â‚¬ Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€¦ (PEAK BROSMAO)",
      memberId: "STJ033",
      field: "studentId",
      fieldLabel: "Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â (Student ID)",
      oldValue: "e20251455",
      requestedValue: "e20251455",
      reason: "Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦~Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â§ Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ GIC",
      submittedDate: "Ã¡Å¸Â£Ã¡Å¸Â  Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦",
      status: "PENDING",
    },
    {
      id: "req-2",
      memberName: "Ã¡Å¾â€šÃ¡Å¾Â¹Ã¡Å¾Ëœ Ã¡Å¾Â Ã¡Å¸Å Ã¡Å¾Â¶Ã¡Å¾â€ž (KIM Heang)",
      memberId: "STJ007",
      field: "phone",
      fieldLabel: "Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡",
      oldValue: "012000000",
      requestedValue: "012734562",
      reason: "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â",
      submittedDate: "Ã¡Å¸Â¢Ã¡Å¸Â¨ Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦",
      status: "APPROVED",
    },
  ]);

  const [filter, setFilter] = useState("ALL");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    alert("Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¸â€ Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€™Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾Â¾Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¸â€");
  };

  const handleReject = (id: string) => {
    const reason = prompt("Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾Â Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€™Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¸â€“");
    if (!reason) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
    alert("Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾Å Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€™Ã¡Å¸â€");
  };

  const filtered = requests.filter(
    (r) => filter === "ALL" || r.status === filter
  );

  return (
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Academic Records Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ (Profile Requests)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾ÂÃ¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡ Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ STJ
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾Å¸Ã¡Å¸â€¹ ({requests.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "PENDING" ? "bg-amber-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢ ({requests.filter((r) => r.status === "PENDING").length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "APPROVED" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Â ({requests.filter((r) => r.status === "APPROVED").length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((req) => (
            <Card key={req.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {req.memberId}
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{req.memberName}</h3>
                  </div>
                  <div>
                    {req.status === "APPROVED" ? (
                      <Badge variant="success">Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Â (Approved)</Badge>
                    ) : req.status === "REJECTED" ? (
                      <Badge variant="destructive">Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾Å Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€™ (Rejected)</Badge>
                    ) : (
                      <Badge variant="warning">Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢ (Pending)</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¸â€“</span>
                    <p className="font-semibold text-foreground mt-0.5">{req.fieldLabel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¸Æ’Ã¡Å¾â€¦Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¸â€“</span>
                    <p className="font-mono text-muted-foreground mt-0.5">{req.oldValue || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¸Æ’Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾ËœÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¸â€“</span>
                    <p className="font-mono font-bold text-primary mt-0.5">{req.requestedValue}</p>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px]">Ã¡Å¾ËœÃ¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾Â Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Â» Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€“</span>
                  <p className="text-xs text-foreground mt-1 p-2.5 rounded-lg bg-muted/40">
                    {req.reason}
                  </p>
                </div>

                {req.status === "PENDING" && (
                  <div className="pt-2 border-t border-border flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(req.id)}
                      className="text-xs text-destructive hover:bg-destructive/10 space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Ã¡Å¾â€Ã¡Å¾Å Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€™</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req.id)}
                      className="text-xs space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Ã¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

