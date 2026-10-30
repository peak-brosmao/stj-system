"use client";

import React, { useState } from "react";
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
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

export default function SystemPortalUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [usersList, setUsersList] = useState(OFFICIAL_STJ_ROSTER);

  const filtered = usersList.filter((u) => {
    const matchesSearch =
      u.nameKh.includes(searchTerm) ||
      u.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || (roleFilter === "LEADER" ? u.isLeader : !u.isLeader);
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (memberId: string) => {
    alert(`ស្ថានភាពគណនីរបស់សមាជិក ${memberId} ត្រូវបានផ្លាស់ប្តូរ`);
  };

  const handleResetPassword = (email: string) => {
    alert(`តំណភ្ជាប់កំណត់លេខកូដសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅកាន់ ${email}`);
  };

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
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
              គ្រប់គ្រងគណនីចូលប្រើប្រាស់របស់សមាជិករៀមច្បងស្ម័គ្រចិត្តទាំង {OFFICIAL_STJ_ROSTER.length} នាក់
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" className="space-x-1.5 text-xs">
              <UserPlus className="w-3.5 h-3.5" />
              <span>បង្កើតគណនីថ្មី</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ស្វែងរកឈ្មោះ អ៊ីមែល ឬអត្តសញ្ញាណ..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">តួនាទី៖</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs"
                >
                  <option value="ALL">ទាំងអស់ (All Roles)</option>
                  <option value="LEADER">រៀមច្បងប្រធានក្រុម (Course Leaders)</option>
                  <option value="MEMBER">សមាជិករៀមច្បង (Senior Volunteers)</option>
                </select>
              </div>
            </div>

            <span className="text-muted-foreground">
              បង្ហាញសរុប៖ <strong>{filtered.length} គណនី</strong>
            </span>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">បញ្ជីគណនីសមាជិកស្ម័គ្រចិត្ត STJ ២០២៦~២០២៧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">ល.រ</th>
                    <th className="py-2.5 px-3">លេខកូដ STJ</th>
                    <th className="py-2.5 px-3">ឈ្មោះខ្មែរ</th>
                    <th className="py-2.5 px-3">FullName En</th>
                    <th className="py-2.5 px-3">អត្តសញ្ញាណ</th>
                    <th className="py-2.5 px-3">ដេប៉ាតឺម៉ង់</th>
                    <th className="py-2.5 px-3">អ៊ីមែល</th>
                    <th className="py-2.5 px-3">តួនាទី</th>
                    <th className="py-2.5 px-3">ស្ថានភាព</th>
                    <th className="py-2.5 px-3 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u, idx) => (
                    <tr key={u.memberId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-primary">{u.memberId}</td>
                      <td className="py-2 px-3 font-medium text-foreground">{u.nameKh}</td>
                      <td className="py-2 px-3 text-muted-foreground">{u.nameEn}</td>
                      <td className="py-2 px-3 font-mono">{u.studentId}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-muted">
                          {u.dept} ({u.year})
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground font-mono">{u.email}</td>
                      <td className="py-2 px-3">
                        {u.isLeader ? (
                          <Badge variant="default" className="text-[10px]">Leader</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Member</Badge>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="success" className="text-[10px]">សកម្ម</Badge>
                      </td>
                      <td className="py-2 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u.email)}
                          className="text-primary hover:underline font-medium text-[11px]"
                          title="Reset Password"
                        >
                          កំណត់កូដឡើងវិញ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
