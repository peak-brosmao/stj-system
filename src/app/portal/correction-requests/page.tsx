"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

function CorrectionRequestsContent() {
  const searchParams = useSearchParams();
  const prefilledRecordId = searchParams.get("recordId") || "";
  const prefilledStatus = searchParams.get("status") || "";

  const [corrections, setCorrections] = useState<any[]>([]);
  const [myRecords, setMyRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [recordId, setRecordId] = useState(prefilledRecordId);
  const [previousStatus, setPreviousStatus] = useState(prefilledStatus);
  const [requestedStatus, setRequestedStatus] = useState("PRESENT");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadCorrections = () => {
    fetch("/api/portal/attendance/corrections")
      .then((res) => res.json())
      .then((data) => {
        if (data.corrections) setCorrections(data.corrections);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCorrections();
    // Real attendance records recorded by my Course Leader
    fetch("/api/portal/attendance")
      .then((res) => res.json())
      .then((data) => {
        const list = data.records || [];
        setMyRecords(list);
        if (!prefilledRecordId && list[0]) {
          setRecordId(list[0].id);
          setPreviousStatus(list[0].status);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const rec = myRecords.find((r) => r.id === recordId);
    if (rec) setPreviousStatus(rec.status);
  }, [recordId, myRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) {
      alert("áž˜áž·áž“áž‘áž¶áž“áŸ‹áž˜áž¶áž“áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœáž¡áž¾áž™ (No attendance record to correct yet)");
      return;
    }
    setSubmitting(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/portal/attendance/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          previousStatus,
          requestedStatus,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setSuccessMsg("ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž‰áŸ’áž‡áž¼áž“ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™áž‘áŸ…áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ");
      setReason("");
      setIsModalOpen(false);
      loadCorrections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾");
    } finally {
      setSubmitting(false);
    }
  };

  const getReviewBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">áž”áž¶áž“áž¢áž“áž»áž˜áŸáž (Approved)</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">áž˜áž·áž“áž¢áž“áž»áž˜áŸáž (Rejected)</Badge>;
      case "PENDING":
      default:
        return <Badge variant="warning">ážšáž„áŸ‹áž…áž¶áŸ†ážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™ (Pending)</Badge>;
    }
  };

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Attendance Correction Request Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ (Attendance Correction Requests)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ážáž¶áž˜ážŠáž¶áž“ážŸáŸ’ážáž¶áž“áž—áž¶áž–ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ áž“áž·áž„áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶áž–áž·áž“áž·ážáŸ’áž™ážšáž”ážŸáŸ‹áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="space-x-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ážŠáž¶áž€áŸ‹ážŸáŸ†ážŽáž¾ážáŸ’áž˜áž¸</span>
          </Button>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          {corrections.map((c) => (
            <Card key={c.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                      {c.record?.session?.course?.code || "PROG101"}
                    </span>
                    <h3 className="font-bold text-sm text-foreground mt-1">
                      {c.record?.session?.title || "ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“"}
                    </h3>
                  </div>
                  <div>{getReviewBadge(c.reviewStatus)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž…áž¶ážŸáŸ‹ (Previous):</span>
                    <p className="font-semibold text-destructive mt-0.5">{c.previousStatus}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">ážŸáŸ’ážáž¶áž“áž—áž¶áž–ážŸáŸ’áž“áž¾ážŸáž»áŸ† (Requested):</span>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{c.requestedStatus}</p>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px]">áž˜áž¼áž›áž áŸážáž»ážŸáŸ’áž“áž¾ážŸáž»áŸ† (Reason):</span>
                  <p className="text-foreground text-xs mt-0.5 p-2 rounded-lg bg-muted/40">
                    {c.reason}
                  </p>
                </div>

                {c.reviewNotes && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-primary">
                      áž€áŸ†ážŽážáŸ‹ážŸáž˜áŸ’áž‚áž¶áž›áŸ‹áž–áž¸áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ ({c.reviewedBy?.fullNameKh || "áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ"}):
                    </span>
                    <p className="text-muted-foreground">{c.reviewNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submission Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-base text-foreground">
                  ážŠáž¶áž€áŸ‹áž–áž¶áž€áŸ’áž™ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  áž”áž·áž‘
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-foreground mb-1.5">
                    áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ážŠáŸ‚áž›áž˜áž¶áž“áž€áž¶ážšážáž»ážŸáž†áŸ’áž‚áž„:
                  </label>
                  <select
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    disabled={myRecords.length === 0}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    {myRecords.length === 0 ? (
                      <option value="">áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážŠáŸ‚áž›áž”áž¶áž“áž€ážáŸ‹ážáŸ’ážšáž¶áž“áŸ…áž¡áž¾áž™áž‘áŸ (No attendance records yet)</option>
                    ) : (
                      myRecords.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.session?.title} - {r.session?.course?.code} (áž€ážáŸ‹ážáŸ’ážšáž¶áŸ– {r.status})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1.5">
                      ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž…áž¶ážŸáŸ‹:
                    </label>
                    <select
                      value={previousStatus}
                      onChange={(e) => setPreviousStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    >
                      <option value="LATE">áž˜áž€áž™ážºáž (Late)</option>
                      <option value="ABSENT">áž¢ážœážáŸ’ážáž˜áž¶áž“ (Absent)</option>
                      <option value="EXCUSED">áž…áŸ’áž”áž¶áž”áŸ‹ (Excused)</option>
                      <option value="PRESENT">ážœážáŸ’ážáž˜áž¶áž“ (Present)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1.5">
                      ážŸáŸ’ážáž¶áž“áž—áž¶áž–ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚áž”áŸ’ážšáŸ‚:
                    </label>
                    <select
                      value={requestedStatus}
                      onChange={(e) => setRequestedStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    >
                      <option value="PRESENT">ážœážáŸ’ážáž˜áž¶áž“ (Present)</option>
                      <option value="EXCUSED">áž…áŸ’áž”áž¶áž”áŸ‹ (Excused)</option>
                      <option value="LATE">áž˜áž€áž™ážºáž (Late)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-foreground mb-1.5">
                    áž˜áž¼áž›áž áŸážáž» áž“áž·áž„áž—ážŸáŸ’ážáž»ážáž¶áž„áž”áž‰áŸ’áž‡áž¶áž€áŸ‹ (Reason & Evidence):
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž–áž¸áž˜áž¼áž›áž áŸážáž» áž“áž·áž„áž–áŸáž›ážœáŸáž›áž¶áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸƒáž€áž¶ážšáž…áž¼áž›ážšáž½áž˜..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    áž”áŸ„áŸ‡áž”áž„áŸ‹
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "áž€áŸ†áž–áž»áž„áž”áž‰áŸ’áž‡áž¼áž“..." : "áž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾"}
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

export default function CorrectionRequestsPage() {
  return (
    <React.Suspense fallback={<div className="p-8">Loading correction requests...</div>}>
      <CorrectionRequestsContent />
    </React.Suspense>
  );
}

