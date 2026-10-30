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
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SystemProfileRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      memberName: "ពាក់ ប្រុសម៉ៅ (PEAK BROSMAO)",
      memberId: "STJ033",
      field: "studentId",
      fieldLabel: "លេខអត្តសញ្ញាណនិស្សិត (Student ID)",
      oldValue: "e20251455",
      requestedValue: "e20251455",
      reason: "ផ្ទៀងផ្ទាត់ និងបញ្ជាក់លេខអត្តសញ្ញាណនិស្សិតផ្លូវការសម្រាប់ឆ្នាំសិក្សា ២០២៦~២០២៧ ដេប៉ាតឺម៉ង់ GIC",
      submittedDate: "៣០ តុលា ២០២៦",
      status: "PENDING",
    },
    {
      id: "req-2",
      memberName: "គឹម ហ៊ាង (KIM Heang)",
      memberId: "STJ007",
      field: "phone",
      fieldLabel: "លេខទូរស័ព្ទផ្លូវការ",
      oldValue: "012000000",
      requestedValue: "012734562",
      reason: "ប្តូរលេខទូរស័ព្ទថ្មីសម្រាប់ទាក់ទងការបង្រៀនស្ម័គ្រចិត្ត",
      submittedDate: "២៨ តុលា ២០២៦",
      status: "APPROVED",
    },
  ]);

  const [filter, setFilter] = useState("ALL");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    alert("សំណើត្រូវបានអនុម័តដោយជោគជ័យ។ កំណត់ត្រាផ្លូវការត្រូវបានធ្វើបច្ចុប្បន្នភាព។");
  };

  const handleReject = (id: string) => {
    const reason = prompt("សូមបញ្ជាក់មូលហេតុនៃការបដិសេធសំណើ៖");
    if (!reason) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
    alert("សំណើត្រូវបានបដិសេធ។");
  };

  const filtered = requests.filter(
    (r) => filter === "ALL" || r.status === filter
  );

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Academic Records Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការពិនិត្យសំណើកែទិន្នន័យផ្លូវការ (Profile Requests)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ត្រួតពិនិត្យ និងអនុម័តសំណើកែសម្រួលឈ្មោះ អត្តសញ្ញាណនិស្សិត និងដេប៉ាតឺម៉ង់របស់សមាជិក STJ
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              ទាំងអស់ ({requests.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "PENDING" ? "bg-amber-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              រង់ចាំពិនិត្យ ({requests.filter((r) => r.status === "PENDING").length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "APPROVED" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              បានអនុម័ត ({requests.filter((r) => r.status === "APPROVED").length})
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
                      <Badge variant="success">បានអនុម័ត (Approved)</Badge>
                    ) : req.status === "REJECTED" ? (
                      <Badge variant="destructive">បានបដិសេធ (Rejected)</Badge>
                    ) : (
                      <Badge variant="warning">រង់ចាំការពិនិត្យ (Pending)</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">ទិន្នន័យស្នើសុំ៖</span>
                    <p className="font-semibold text-foreground mt-0.5">{req.fieldLabel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">តម្លៃចាស់ក្នុងប្រព័ន្ធ៖</span>
                    <p className="font-mono text-muted-foreground mt-0.5">{req.oldValue || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">តម្លៃត្រឹមត្រូវថ្មី៖</span>
                    <p className="font-mono font-bold text-primary mt-0.5">{req.requestedValue}</p>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px]">មូលហេតុ និងការពន្យល់របស់សមាជិក៖</span>
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
                      <span>បដិសេធ</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req.id)}
                      className="text-xs space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>អនុម័តសំណើ</span>
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

