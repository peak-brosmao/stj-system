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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

export default function SystemProfileRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      memberName: "áž–áŸ€áž€ áž”áŸ’ážšáž»ážŸáž˜áŸ‰áŸ… (PEAK BROSMAO)",
      memberId: "STJ033",
      field: "studentId",
      fieldLabel: "áž›áŸážáž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽáž“áž·ážŸáŸ’ážŸáž·áž (Student ID)",
      oldValue: "e20251455",
      requestedValue: "e20251455",
      reason: "áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹ áž“áž·áž„áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž›áŸážáž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽáž“áž·ážŸáŸ’ážŸáž·ážáž•áŸ’áž›áž¼ážœáž€áž¶ážšážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¦~áŸ¢áŸ áŸ¢áŸ§ ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ GIC",
      submittedDate: "áŸ£áŸ  ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦",
      status: "PENDING",
    },
    {
      id: "req-2",
      memberName: "áž‚áž¹áž˜ áž áŸŠáž¶áž„ (KIM Heang)",
      memberId: "STJ007",
      field: "phone",
      fieldLabel: "áž›áŸážáž‘áž¼ážšážŸáŸáž–áŸ’áž‘áž•áŸ’áž›áž¼ážœáž€áž¶ážš",
      oldValue: "012000000",
      requestedValue: "012734562",
      reason: "áž”áŸ’ážáž¼ážšáž›áŸážáž‘áž¼ážšážŸáŸáž–áŸ’áž‘ážáŸ’áž˜áž¸ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‘áž¶áž€áŸ‹áž‘áž„áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž",
      submittedDate: "áŸ¢áŸ¨ ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦",
      status: "APPROVED",
    },
  ]);

  const [filter, setFilter] = useState("ALL");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    alert("ážŸáŸ†ážŽáž¾ážáŸ’ážšáž¼ážœáž”áž¶áž“áž¢áž“áž»áž˜áŸážážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™áŸ” áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážšážáŸ’ážšáž¼ážœáž”áž¶áž“áž’áŸ’ážœáž¾áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“áž—áž¶áž–áŸ”");
  };

  const handleReject = (id: string) => {
    const reason = prompt("ážŸáž¼áž˜áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž˜áž¼áž›áž áŸážáž»áž“áŸƒáž€áž¶ážšáž”ážŠáž·ážŸáŸáž’ážŸáŸ†ážŽáž¾áŸ–");
    if (!reason) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
    alert("ážŸáŸ†ážŽáž¾ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”ážŠáž·ážŸáŸáž’áŸ”");
  };

  const filtered = requests.filter(
    (r) => filter === "ALL" || r.status === filter
  );

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Academic Records Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              áž€áž¶ážšáž–áž·áž“áž·ážáŸ’áž™ážŸáŸ†ážŽáž¾áž€áŸ‚áž‘áž·áž“áŸ’áž“áž“áŸáž™áž•áŸ’áž›áž¼ážœáž€áž¶ážš (Profile Requests)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™ áž“áž·áž„áž¢áž“áž»áž˜áŸážážŸáŸ†ážŽáž¾áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›ážˆáŸ’áž˜áŸ„áŸ‡ áž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽáž“áž·ážŸáŸ’ážŸáž·áž áž“áž·áž„ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ážšáž”ážŸáŸ‹ážŸáž˜áž¶áž‡áž·áž€ STJ
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ ({requests.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "PENDING" ? "bg-amber-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              ážšáž„áŸ‹áž…áž¶áŸ†áž–áž·áž“áž·ážáŸ’áž™ ({requests.filter((r) => r.status === "PENDING").length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "APPROVED" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              áž”áž¶áž“áž¢áž“áž»áž˜áŸáž ({requests.filter((r) => r.status === "APPROVED").length})
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
                      <Badge variant="success">áž”áž¶áž“áž¢áž“áž»áž˜áŸáž (Approved)</Badge>
                    ) : req.status === "REJECTED" ? (
                      <Badge variant="destructive">áž”áž¶áž“áž”ážŠáž·ážŸáŸáž’ (Rejected)</Badge>
                    ) : (
                      <Badge variant="warning">ážšáž„áŸ‹áž…áž¶áŸ†áž€áž¶ážšáž–áž·áž“áž·ážáŸ’áž™ (Pending)</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">áž‘áž·áž“áŸ’áž“áž“áŸáž™ážŸáŸ’áž“áž¾ážŸáž»áŸ†áŸ–</span>
                    <p className="font-semibold text-foreground mt-0.5">{req.fieldLabel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">ážáž˜áŸ’áž›áŸƒáž…áž¶ážŸáŸ‹áž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’áŸ–</span>
                    <p className="font-mono text-muted-foreground mt-0.5">{req.oldValue || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">ážáž˜áŸ’áž›áŸƒážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœážáŸ’áž˜áž¸áŸ–</span>
                    <p className="font-mono font-bold text-primary mt-0.5">{req.requestedValue}</p>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px]">áž˜áž¼áž›áž áŸážáž» áž“áž·áž„áž€áž¶ážšáž–áž“áŸ’áž™áž›áŸ‹ážšáž”ážŸáŸ‹ážŸáž˜áž¶áž‡áž·áž€áŸ–</span>
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
                      <span>áž”ážŠáž·ážŸáŸáž’</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req.id)}
                      className="text-xs space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>áž¢áž“áž»áž˜áŸážážŸáŸ†ážŽáž¾</span>
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

