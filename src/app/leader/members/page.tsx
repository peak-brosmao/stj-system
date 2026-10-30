"use client";

import React, { useState } from "react";
import { Users, Search, Filter, History, CalendarCheck, ShieldAlert } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export default function LeaderMembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const members = OFFICIAL_STJ_ROSTER.map((m) => ({
    id: `m-${m.memberId.toLowerCase()}`,
    memberId: m.memberId,
    studentId: m.studentId,
    nameKh: m.nameKh,
    nameEn: m.nameEn,
    dept: m.dept,
    yr: m.year,
    phone: m.phone,
    role: m.role,
    attended: 1,
    total: 1,
    rate: 100,
  }));

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === "ALL" || m.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-4 h-4" />
              <span>PROG101 Enrolled Roster • ឆ្នាំសិក្សា ២០២៦~២០២៧</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សមាជិករៀមច្បងក្នុងបន្ទុក (Assigned STJ Members)
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ ផ្លូវការ (សរុប ៣៩ នាក់ - មិនសម្រាប់សិស្សប្អូនឡើយ)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>សិទ្ធិមើលតែប៉ុណ្ណោះ (Read-Only) • គ្មានសិទ្ធិកែប្រែវត្តមាន</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-card border border-border p-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ជំនាញ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            >
              <option value="ALL">គ្រប់ដេប៉ាតឺម៉ង់ (All 9 Depts)</option>
              <option value="GIC">GIC</option>
              <option value="GIM">GIM</option>
              <option value="GCI">GCI</option>
              <option value="GEE">GEE</option>
              <option value="AMS">AMS</option>
              <option value="GAR">GAR</option>
              <option value="GCA">GCA</option>
              <option value="GTI">GTI</option>
              <option value="GTR">GTR</option>
            </select>
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
                  <th className="py-3 px-4 font-semibold">ជំនាញ & កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">តួនាទី</th>
                  <th className="py-3 px-4 font-semibold text-center">អត្រាវត្តមាន</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">{m.memberId}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{m.studentId || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{m.nameKh}</div>
                      <div className="text-[10px] text-muted-foreground">{m.nameEn}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{m.dept}</span>
                      <span className="text-muted-foreground ml-1">({m.yr})</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">{m.role}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="success" className="text-[10px]">
                        100%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
