"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Shield,
  KeyRound,
  UserCheck,
  Ban,
  CheckCircle2,
  Mail,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

interface UserItem {
  id: string;
  memberId: string;
  studentId?: string | null;
  fullNameKh: string;
  fullNameEn: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  notes?: string | null;
  department: { code: string; nameKh: string };
  academicYear: { code: string };
  enrollments?: Array<{ course: { code: string } }>;
}

export default function SystemPortalUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/system/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setUsersList(data.members);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = usersList.filter((u) => {
    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("áž”áŸ’ážšáž’áž¶áž“") || u.notes?.includes("ážŸáž˜áž¶áž‚áž˜");
    const matchesSearch =
      u.fullNameKh.includes(searchTerm) ||
      u.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.department.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || (roleFilter === "LEADER" ? isLeader : !isLeader);
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (memberId: string) => {
    alert(`ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž‚ážŽáž“áž¸ážšáž”ážŸáŸ‹ážŸáž˜áž¶áž‡áž·áž€ ${memberId} ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážš`);
  };

  const handleResetPassword = (email: string) => {
    alert(`ážáŸ†ážŽáž—áŸ’áž‡áž¶áž”áŸ‹áž€áŸ†ážŽážáŸ‹áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹áž¡áž¾áž„ážœáž·áž‰ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž‰áž¾áž‘áŸ…áž€áž¶áž“áŸ‹ ${email}`);
  };

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>STJ Portal Accounts Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‚ážŽáž“áž¸ážŸáž˜áž¶áž‡áž·áž€ STJ (Portal User Accounts)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              áž‘áž·áž“áŸ’áž“áž“áŸáž™áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž–áž¸ Backend API â€¢ áž‚ážŽáž“áž¸áž•áŸ’áž›áž¼ážœáž€áž¶ážšážšáž”ážŸáŸ‹áž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž STJ ážŸážšáž»áž” {usersList.length} áž“áž¶áž€áŸ‹
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading} className="text-xs">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              áž‘áž¶áž‰áž¡áž¾áž„ážœáž·áž‰
            </Button>
            <Link href="/system/members">
              <Button size="sm" className="space-x-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>áž”áž“áŸ’ážáŸ‚áž˜ážŸáž˜áž¶áž‡áž·áž€ážáŸ’áž˜áž¸</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ážŸáŸ’ážœáŸ‚áž„ážšáž€ážáž¶áž˜ážˆáŸ’áž˜áŸ„áŸ‡ áž¢áŸŠáž¸áž˜áŸ‚áž› áž¢ážáŸ’ážáž›áŸáž..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
            >
              <option value="ALL">áž‚áŸ’ážšáž”áŸ‹ážáž½áž“áž¶áž‘áž¸ (All Roles)</option>
              <option value="LEADER">ážáŸ’áž“áž¶áž€áŸ‹ážŠáž¹áž€áž“áž¶áŸ† & áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜ (Leaders)</option>
              <option value="MEMBER">ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ (Tutors)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">áž›.ážš</th>
                  <th className="py-3 px-4 font-semibold">áž€áž¼ážŠ STJ</th>
                  <th className="py-3 px-4 font-semibold">ážˆáŸ’áž˜áŸ„áŸ‡áž–áŸáž‰ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">áž¢áŸŠáž¸áž˜áŸ‚áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš (ITC)</th>
                  <th className="py-3 px-4 font-semibold">áž‡áŸ†áž“áž¶áž‰ & áž€áž˜áŸ’ážšáž·áž</th>
                  <th className="py-3 px-4 font-semibold">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž‘áž½áž›ážáž»ážŸážáŸ’ážšáž¼ážœ</th>
                  <th className="py-3 px-4 font-semibold text-center">ážŸáŸ’ážáž¶áž“áž—áž¶áž–</th>
                  <th className="py-3 px-4 font-semibold text-right">ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–</th>
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
                      ážšáž€áž˜áž·áž“ážƒáž¾áž‰áž‚ážŽáž“áž¸áž¡áž¾áž™áŸ”
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, idx) => {
                    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("áž”áŸ’ážšáž’áž¶áž“") || u.notes?.includes("ážŸáž˜áž¶áž‚áž˜");
                    return (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary">{u.memberId}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground flex items-center space-x-1.5">
                            <span>{u.fullNameKh}</span>
                            {isLeader && (
                              <Badge variant="info" className="text-[9px] px-1 py-0 h-4">
                                Leader
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{u.fullNameEn}</div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                          {u.email || `${u.fullNameEn.toLowerCase().replace(/\s+/g, ".")}@itc.edu.kh`}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-foreground">{u.department.code}</span>
                          <span className="text-muted-foreground ml-1">({u.academicYear.code})</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-[11px]">
                          {u.enrollments && u.enrollments.length > 0
                            ? u.enrollments.map((e) => e.course.code).join(", ")
                            : u.notes || "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="success" className="text-[10px]">
                            ACTIVE
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(u.email || "")}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-primary"
                            title="áž€áŸ†ážŽážáŸ‹áž›áŸážážŸáž˜áŸ’áž„áž¶ážáŸ‹áž¡áž¾áž„ážœáž·áž‰"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(u.memberId)}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-amber-600"
                            title="áž•áŸ’áž¢áž¶áž€áž‚ážŽáž“áž¸áž”ážŽáŸ’ážáŸ„áŸ‡áž¢áž¶ážŸáž“áŸ’áž“"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
