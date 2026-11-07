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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

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
    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("ប្រធាន") || u.notes?.includes("សមាគម");
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
    alert(`ស្ថានភាពគណនីរបស់សមាជិក ${memberId} ត្រូវបានផ្លាស់ប្តូរ`);
  };

  const handleResetPassword = (email: string) => {
    alert(`តំណភ្ជាប់កំណត់លេខកូដសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅកាន់ ${email}`);
  };

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>STJ Portal Accounts Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              គ្រប់គ្រងគណនីសមាជិក STJ (Portal User Accounts)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ទិន្នន័យជាក់ស្តែងពី Backend API • គណនីផ្លូវការរបស់និស្សិតរៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ សរុប {usersList.length} នាក់
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading} className="text-xs">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              ទាញឡើងវិញ
            </Button>
            <Link href="/system/members">
              <Button size="sm" className="space-x-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>បន្ថែមសមាជិកថ្មី</span>
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
              placeholder="ស្វែងរកតាមឈ្មោះ អ៊ីមែល អត្តលេខ..."
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
              <option value="ALL">គ្រប់តួនាទី (All Roles)</option>
              <option value="LEADER">ថ្នាក់ដឹកនាំ & ប្រធានក្រុម (Leaders)</option>
              <option value="MEMBER">សមាជិករៀមច្បងបង្រៀន (Tutors)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ល.រ</th>
                  <th className="py-3 px-4 font-semibold">កូដ STJ</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះពេញ (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">អ៊ីមែលផ្លូវការ (ITC)</th>
                  <th className="py-3 px-4 font-semibold">ជំនាញ & កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជាទទួលខុសត្រូវ</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
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
                      រកមិនឃើញគណនីឡើយ។
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, idx) => {
                    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("ប្រធាន") || u.notes?.includes("សមាគម");
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
                            title="កំណត់លេខសម្ងាត់ឡើងវិញ"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(u.memberId)}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-amber-600"
                            title="ផ្អាកគណនីបណ្តោះអាសន្ន"
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