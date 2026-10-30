"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Share2,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { calculateAttendanceRate } from "@/lib/utils";

interface AttendanceItem {
  id: string;
  memberId: string;
  fullNameKh: string;
  fullNameEn: string;
  department: string;
  academicYear: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
  remarks?: string | null;
}

export default function LeaderAttendancePage() {
  const [sessionTitle] = useState("សប្តាហ៍ទី១៖ សេចក្តីផ្តើមអំពី C++ និង Pointer Mechanics");
  const [sessionDate] = useState("2026-10-15");
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceItem | null>(null);
  const [requestedStatus, setRequestedStatus] = useState("PRESENT");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  const [records] = useState<AttendanceItem[]>([
    { id: "att-33", memberId: "STJ033", fullNameKh: "ពាក់ ប្រុសម៉ៅ", fullNameEn: "PEAK BROSMAO", department: "GIC", academicYear: "I2", status: "PRESENT" },
    { id: "att-1", memberId: "STJ001", fullNameKh: "អ៊ុន សំណាង", fullNameEn: "OUN Samnang", department: "GIC", academicYear: "I2", status: "PRESENT" },
    { id: "att-2", memberId: "STJ002", fullNameKh: "អៀ ភក្ត្រា", fullNameEn: "EA Pheaktra", department: "GIC", academicYear: "I2", status: "PRESENT" },
    { id: "att-3", memberId: "STJ003", fullNameKh: "កែវ គន្ធា", fullNameEn: "KEO Kunthea", department: "AMS", academicYear: "I2", status: "LATE" },
    { id: "att-4", memberId: "STJ004", fullNameKh: "កុយ សុខហេង", fullNameEn: "KOY Sokheng", department: "GIC", academicYear: "I2", status: "PRESENT" },
    { id: "att-5", memberId: "STJ005", fullNameKh: "ខេន ផល្លី", fullNameEn: "KHEN Phally", department: "GTI", academicYear: "I2", status: "EXCUSED", remarks: "សុំច្បាប់បំពេញកិច្ចការដេប៉ាតឺម៉ង់" },
    { id: "att-6", memberId: "STJ006", fullNameKh: "ខែម ប៊ុនរ៉ុង", fullNameEn: "KHEM Bunrong", department: "GIM", academicYear: "I2", status: "PRESENT" },
    { id: "att-7", memberId: "STJ007", fullNameKh: "គឹម ហ៊ាង", fullNameEn: "KIM Heang", department: "GCI", academicYear: "I2", status: "ABSENT" },
    { id: "att-8", memberId: "STJ008", fullNameKh: "ចាន់ សុភ័ក្ត្រ", fullNameEn: "CHAN Sopheaktra", department: "AMS", academicYear: "I2", status: "PRESENT" },
  ]);

  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;

  records.forEach((r) => {
    if (r.status === "PRESENT") present++;
    else if (r.status === "LATE") late++;
    else if (r.status === "ABSENT") absent++;
    else if (r.status === "EXCUSED") excused++;
  });

  const rate = calculateAttendanceRate(present, late, records.length, excused);

  const handleOpenCorrection = (item: AttendanceItem) => {
    setCorrectionTarget(item);
    setRequestedStatus(item.status === "ABSENT" ? "PRESENT" : "EXCUSED");
    setCorrectionReason("");
    setCorrectionSubmitted(false);
    setIsCorrectionModalOpen(true);
  };

  const handleSendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSubmitted(true);
    setTimeout(() => {
      setIsCorrectionModalOpen(false);
      setCorrectionSubmitted(false);
    }, 2000);
  };

  return (
    <PortalLayout portalType="leader" userRole="Course Leader" userName="លាង ជីងហេង" userEmail="leang.jingheng@itc.edu.kh">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <CalendarCheck className="w-4 h-4" />
              <span>Read-Only Course Attendance Ledger</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              មើលវត្តមានផ្លូវការ (Course Attendance Records)
            </h1>
            <p className="text-xs text-muted-foreground">
              ទិន្នន័យវត្តមានផ្លូវការដែលបានកត់ត្រា និងបញ្ជាក់ដោយគណៈគ្រប់គ្រង STJ
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/leader/share-links">
              <Button size="sm" className="space-x-1.5 text-xs">
                <Share2 className="w-3.5 h-3.5" />
                <span>បង្កើតតំណភ្ជាប់ចែករំលែក</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Read-Only Notice Alert */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="leading-relaxed">
            <strong className="block font-semibold">កំណត់សម្គាល់សិទ្ធិអំណាច (Strict Non-Mutation Policy):</strong>
            ប្រធានមុខវិជ្ជាពុំមានសិទ្ធិកែប្រែវត្តមានដោយផ្ទាល់ឡើយ។ ប្រសិនបើមានកំហុសឆ្គង ឬនិស្សិតបានដាក់ពាក្យសុំច្បាប់ សូមចុចប៊ូតុង <strong>&ldquo;ស្នើសុំកែតម្រូវ&rdquo;</strong> ដើម្បីផ្ញើសំណើជាផ្លូវការទៅកាន់គណៈគ្រប់គ្រង STJ។
          </div>
        </div>

        {/* Live Attendance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-muted-foreground">សរុប</span>
              <p className="text-lg font-bold text-foreground">{records.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">វត្តមាន</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{present}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-amber-600 dark:text-amber-400">មកយឺត</span>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{late}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-destructive">អវត្តមាន</span>
              <p className="text-lg font-bold text-destructive">{absent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-purple-600 dark:text-purple-400">ច្បាប់</span>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{excused}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-3 text-center">
              <span className="text-[11px] text-primary font-bold">អត្រាវត្តមាន</span>
              <p className="text-lg font-extrabold text-primary">{rate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Read-Only Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-foreground">PROG101 • {sessionTitle}</span>
              <span className="text-xs text-muted-foreground ml-2">({sessionDate})</span>
            </div>
            <Badge variant="outline">Verified Record</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">អត្តលេខ</th>
                  <th className="py-3 px-4 font-semibold">គោត្តនាម-នាម</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-4 font-semibold">ឆ្នាំ</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាពវត្តមាន</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{r.memberId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{r.fullNameKh}</div>
                      <div className="text-[10px] text-muted-foreground">{r.fullNameEn}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{r.department}</td>
                    <td className="py-3 px-4 font-medium">{r.academicYear}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          r.status === "PRESENT"
                            ? "success"
                            : r.status === "LATE"
                            ? "warning"
                            : r.status === "EXCUSED"
                            ? "purple"
                            : "destructive"
                        }
                      >
                        {r.status === "PRESENT"
                          ? "មានវត្តមាន"
                          : r.status === "LATE"
                          ? "មកយឺត"
                          : r.status === "EXCUSED"
                          ? "ច្បាប់"
                          : "អវត្តមាន"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCorrection(r)}
                        className="h-7 text-xs text-primary hover:underline"
                      >
                        ស្នើសុំកែតម្រូវ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correction Request Modal */}
        {isCorrectionModalOpen && correctionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">ស្នើសុំកែតម្រូវវត្តមាន (Correction Request)</h3>
                  <button onClick={() => setIsCorrectionModalOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {correctionSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs text-center space-y-1">
                    <CheckCircle className="w-6 h-6 mx-auto" />
                    <p className="font-bold">សំណើកែតម្រូវត្រូវបានបញ្ជូនរួចរាល់</p>
                    <p className="text-[11px] text-muted-foreground">
                      គណៈគ្រប់គ្រង STJ នឹងពិនិត្យ និងអនុម័តក្នុងពេលឆាប់ៗ
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendCorrectionRequest} className="space-y-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">សមាជិក៖</p>
                      <p className="font-bold text-foreground">
                        [{correctionTarget.memberId}] {correctionTarget.fullNameKh} ({correctionTarget.fullNameEn})
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">ស្ថានភាពបច្ចុប្បន្ន៖</p>
                      <Badge variant="outline">{correctionTarget.status}</Badge>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">ស្ថានភាពស្នើសុំប្តូរទៅជា *</label>
                      <select
                        value={requestedStatus}
                        onChange={(e) => setRequestedStatus(e.target.value)}
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      >
                        <option value="PRESENT">មានវត្តមាន (Present)</option>
                        <option value="LATE">មកយឺត (Late)</option>
                        <option value="EXCUSED">ច្បាប់ (Excused)</option>
                        <option value="ABSENT">អវត្តមាន (Absent)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">មូលហេតុនៃការកែតម្រូវ *</label>
                      <textarea
                        required
                        rows={3}
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        placeholder="ឧ. និស្សិតបានមកទាន់ម៉ោង តែខកខានកត់ឈ្មោះ ឬមានលិខិតសុំច្បាប់ផ្លូវការ..."
                        className="w-full p-2 rounded-lg border border-input bg-background"
                      />
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCorrectionModalOpen(false)}
                      >
                        បោះបង់
                      </Button>
                      <Button type="submit" size="sm" className="space-x-1.5">
                        <Send className="w-3.5 h-3.5" />
                        <span>បញ្ជូនសំណើ</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

