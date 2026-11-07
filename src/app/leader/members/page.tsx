"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, ShieldAlert, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

interface MemberItem {
  id: string;
  memberId: string;
  studentId?: string | null;
  fullNameKh: string;
  fullNameEn: string;
  phone?: string | null;
  notes?: string | null;
  department: { code: string; nameKh: string };
  academicYear: { code: string };
  enrollments?: Array<{ course: { code: string; titleKh: string } }>;
  rate?: number;
  totalSessions?: number;
}

export default function LeaderMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("PROG101");
  const [deptFilter] = useState("ALL");
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setUserInfo({
            name: d.user.fullNameKh || d.user.fullNameEn || "",
            email: d.user.email || "",
          });
        }
        const firstCourseCode = d?.leader?.courses?.[0]?.code || d?.member?.courses?.[0]?.code;
        if (firstCourseCode) {
          setSelectedCourse(firstCourseCode);
        }
      })
      .catch(() => {});
  }, []);

  const loadMembers = (courseCode: string) => {
    setLoading(true);
    const url =
      courseCode === "ALL"
        ? "/api/system/members"
        : `/api/system/members?course=${courseCode}`;

    Promise.all([
      fetch(url).then((res) => (res.ok ? res.json() : null)),
      fetch("/api/system/reports").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([data, reportsData]) => {
        const reportMembers: any[] = Array.isArray(reportsData?.members)
          ? reportsData.members
          : [];
        const reportMap = new Map<string, any>();
        const counts: Record<string, number> = {
          PROG101: 0,
          MATH101: 0,
          PHYS101: 0,
          CHEM101: 0,
          ALL: reportMembers.length,
        };

        for (const rm of reportMembers) {
          if (rm.memberId) reportMap.set(String(rm.memberId), rm);
          if (rm.id) reportMap.set(String(rm.id), rm);
          if (!rm.isExecutive) {
            const mCourses: string[] = Array.isArray(rm.courses)
              ? rm.courses
              : rm.course
              ? [rm.course]
              : [];
            for (const c of mCourses) {
              if (counts[c] !== undefined) counts[c]++;
            }
          }
        }
        setCourseCounts(counts);

        if (data?.members) {
          const merged = data.members.map((m: MemberItem) => {
            const rep = reportMap.get(String(m.memberId)) || reportMap.get(String(m.id));
            return {
              ...m,
              rate: rep ? Number(rep.rate ?? 100) : 100,
              totalSessions: rep ? Number(rep.total ?? 0) : 0,
            };
          });
          setMembers(merged);
        }
      })
      .catch((err) => console.error("Error loading members:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers(selectedCourse);
  }, [selectedCourse]);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === "ALL" || m.department?.code === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getCourseTitle = (code: string) => {
    switch (code) {
      case "PROG101":
        return "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)";
      case "MATH101":
        return "គណិតវិទ្យាវិស្វកម្ម (Mathematics)";
      case "PHYS101":
        return "រូបវិទ្យាវិស្វកម្ម (Physics)";
      case "CHEM101":
        return "គីមីវិទ្យាទូទៅ (Chemistry)";
      default:
        return "សមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្តទាំងអស់ (All Members)";
    }
  };

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName={userInfo.name}
      userEmail={userInfo.email}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-4 h-4" />
              <span>{selectedCourse} Enrolled Tutors • STJ Academic Year 2026-2027</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សមាជិករៀមច្បងក្នុងបន្ទុក (Assigned STJ Tutors)
            </h1>
            <p className="text-xs text-muted-foreground">
              ទិន្នន័យជាក់ស្តែងពី Backend API • សម្រាប់សមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្តតែប៉ុណ្ណោះ មិនមែនសម្រាប់សិស្សប្អូនឡើយ
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>សិទ្ធិមើលតែប៉ុណ្ណោះ (Read-Only) • គ្មានសិទ្ធិកែប្រែវត្តមាន</span>
          </div>
        </div>

        {/* Course and Department Filter Bar */}
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">មុខវិជ្ជា៖</span>
            {[
              { code: "PROG101", name: "Programming" },
              { code: "MATH101", name: "Mathematics" },
              { code: "PHYS101", name: "Physics" },
              { code: "CHEM101", name: "Chemistry" },
              { code: "ALL", name: "ទាំងអស់" },
            ].map((c) => {
              const count = courseCounts[c.code];
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCourse(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCourse === c.code
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {c.name} {typeof count === "number" && count > 0 ? `(${count} នាក់)` : ""}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMembers(selectedCourse)}
              disabled={loading}
              className="text-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              ទាញឡើងវិញ
            </Button>
          </div>
        </div>

        {/* Active Selection Summary */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-medium text-foreground">
            {getCourseTitle(selectedCourse)} — បង្ហាញ <span className="font-bold text-primary">{filtered.length}</span> នាក់
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ល.រ</th>
                  <th className="py-3 px-4 font-semibold">កូដ STJ</th>
                  <th className="py-3 px-4 font-semibold">អត្តលេខនិស្សិត</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះពេញ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់ &amp; កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជាទទួលខុសត្រូវ</th>
                  <th className="py-3 px-4 font-semibold text-center">អត្រាវត្តមាន</th>
                  <th className="py-3 px-4 font-semibold text-right">កំណត់ពាក្យសម្ងាត់</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      កំពុងទាញយកទិន្នន័យពី Backend API...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      រកមិនឃើញទិន្នន័យសមាជិកឡើយ។
                    </td>
                  </tr>
                ) : (
                  filtered.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-primary">{m.memberId}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{m.studentId || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                        <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground">{m.department?.code}</span>
                        <span className="text-muted-foreground ml-1">({m.academicYear?.code})</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[11px]">
                        {m.notes ||
                          (m.enrollments && m.enrollments.map((e) => e.course.code).join(", ")) ||
                          selectedCourse}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {m.totalSessions && m.totalSessions > 0 ? (
                          <Badge
                            variant={
                              (m.rate ?? 100) >= 90
                                ? "success"
                                : (m.rate ?? 100) >= 75
                                ? "warning"
                                : "destructive"
                            }
                            className="text-[10px]"
                          >
                            {m.rate ?? 100}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            មិនទាន់បង្រៀន
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (
                              !confirm(
                                `តើអ្នកពិតជាចង់កំណត់ពាក្យសម្ងាត់ឡើងវិញសម្រាប់សមាជិក ${m.fullNameKh} មែនទេ?`
                              )
                            )
                              return;
                            try {
                              const res = await fetch("/api/system/members/reset-password", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ memberId: m.id }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || "Reset failed");
                              alert(
                                `ពាក្យសម្ងាត់របស់ ${m.fullNameKh} ត្រូវបានកំណត់ឡើងវិញជោគជ័យ: ${data.defaultPassword}`
                              );
                            } catch (err: unknown) {
                              alert(
                                err instanceof Error ? err.message : "Error resetting password"
                              );
                            }
                          }}
                          className="h-7 text-[11px] px-2 text-primary hover:bg-primary/10"
                        >
                          Reset Pass
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
