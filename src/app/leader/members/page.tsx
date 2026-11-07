"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Filter, ShieldAlert, BookOpen, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Badge } from "@/ui/ui/Badge";
import { Button } from "@/ui/ui/Button";

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
}

export default function LeaderMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("PROG101");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const loadMembers = (courseCode: string) => {
    setLoading(true);
    const url = courseCode === "ALL" 
      ? "/api/system/members" 
      : `/api/system/members?course=${courseCode}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.members) {
          setMembers(data.members);
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
        return "áž€áž¶ážšážŸážšážŸáŸážšáž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž€áž»áŸ†áž–áŸ’áž™áž¼áž‘áŸážš (Programming - 9 Tutors)";
      case "MATH101":
        return "áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Mathematics - 7 Tutors)";
      case "PHYS101":
        return "ážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Physics - 10 Tutors)";
      case "CHEM101":
        return "áž‚áž¸áž˜áž¸ážœáž·áž‘áŸ’áž™áž¶áž‘áž¼áž‘áŸ… (Chemistry - 11 Tutors)";
      default:
        return "ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’ážáž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ (All 39 Members)";
    }
  };

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="áž›áž¶áž„ áž‡áž¸áž„áž áŸáž„"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-4 h-4" />
              <span>{selectedCourse} Enrolled Tutors â€¢ STJ Academic Year 2026-2027</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž€áŸ’áž“áž»áž„áž”áž“áŸ’áž‘áž»áž€ (Assigned STJ Tutors)
            </h1>
            <p className="text-xs text-muted-foreground">
              áž‘áž·áž“áŸ’áž“áž“áŸáž™áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž–áž¸ Backend API â€¢ ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’ážážáŸ‚áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡ áž˜áž·áž“áž˜áŸ‚áž“ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŸáž·ážŸáŸ’ážŸáž”áŸ’áž¢áž¼áž“áž¡áž¾áž™
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>ážŸáž·áž‘áŸ’áž’áž·áž˜áž¾áž›ážáŸ‚áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡ (Read-Only) â€¢ áž‚áŸ’áž˜áž¶áž“ážŸáž·áž‘áŸ’áž’áž·áž€áŸ‚áž”áŸ’ážšáŸ‚ážœážáŸ’ážáž˜áž¶áž“</span>
          </div>
        </div>

        {/* Course and Department Filter Bar */}
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áŸ–</span>
            {[
              { code: "PROG101", label: "Programming (áŸ© áž“áž¶áž€áŸ‹)" },
              { code: "MATH101", label: "Mathematics (áŸ§ áž“áž¶áž€áŸ‹)" },
              { code: "PHYS101", label: "Physics (áŸ¡áŸ  áž“áž¶áž€áŸ‹)" },
              { code: "CHEM101", label: "Chemistry (áŸ¡áŸ¡ áž“áž¶áž€áŸ‹)" },
              { code: "ALL", label: "áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ (áŸ£áŸ© áž“áž¶áž€áŸ‹)" },
            ].map((c) => (
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
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ážŸáŸ’ážœáŸ‚áž„ážšáž€ážáž¶áž˜ážˆáŸ’áž˜áŸ„áŸ‡, áž¢ážáŸ’ážáž›áŸáž..."
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
              áž‘áž¶áž‰áž¡áž¾áž„ážœáž·áž‰
            </Button>
          </div>
        </div>

        {/* Active Selection Summary */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-medium text-foreground">
            {getCourseTitle(selectedCourse)} â€” áž”áž„áŸ’áž áž¶áž‰ <span className="font-bold text-primary">{filtered.length}</span> áž“áž¶áž€áŸ‹
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">áž›.ážš</th>
                  <th className="py-3 px-4 font-semibold">áž€áž¼ážŠ STJ</th>
                  <th className="py-3 px-4 font-semibold">áž¢ážáŸ’ážáž›áŸážáž“áž·ážŸáŸ’ážŸáž·áž</th>
                  <th className="py-3 px-4 font-semibold">ážˆáŸ’áž˜áŸ„áŸ‡áž–áŸáž‰ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ & áž€áž˜áŸ’ážšáž·áž</th>
                  <th className="py-3 px-4 font-semibold">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž‘áž½áž›ážáž»ážŸážáŸ’ážšáž¼ážœ</th>
                  <th className="py-3 px-4 font-semibold text-center">áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“</th>
                  <th className="py-3 px-4 font-semibold text-right">áž€áŸ†ážŽážáŸ‹áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      áž€áŸ†áž–áž»áž„áž‘áž¶áž‰áž™áž€áž‘áž·áž“áŸ’áž“áž“áŸáž™áž–áž¸ Backend API...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      ážšáž€áž˜áž·áž“ážƒáž¾áž‰áž‘áž·áž“áŸ’áž“áž“áŸáž™ážŸáž˜áž¶áž‡áž·áž€áž¡áž¾áž™áŸ”
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
                        {m.notes || (m.enrollments && m.enrollments.map((e) => e.course.code).join(", ")) || selectedCourse}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="success" className="text-[10px]">
                          100%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!confirm(`ážáž¾áž¢áŸ’áž“áž€áž–áž·ážáž‡áž¶áž…áž„áŸ‹áž€áŸ†ážŽážáŸ‹áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹áž¡áž¾áž„ážœáž·áž‰ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŸáž˜áž¶áž‡áž·áž€ ${m.fullNameKh} áž˜áŸ‚áž“áž‘áŸ?`)) return;
                            try {
                              const res = await fetch("/api/system/members/reset-password", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ memberId: m.id }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || "Reset failed");
                              alert(`áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážšáž”ážŸáŸ‹ ${m.fullNameKh} ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áŸ†ážŽážáŸ‹áž¡áž¾áž„ážœáž·áž‰áž‡áŸ„áž‚áž‡áŸáž™: ${data.defaultPassword}`);
                            } catch (err: unknown) {
                              alert(err instanceof Error ? err.message : "Error resetting password");
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
