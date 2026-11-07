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
    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ") || u.notes?.includes("Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Ëœ");
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
    alert(`Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ ${memberId} Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡`);
  };

  const handleResetPassword = (email: string) => {
    alert(`Ã¡Å¾ÂÃ¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€°Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¾Ã¡Å¾â€˜Ã¡Å¸â€¦Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹ ${email}`);
  };

  return (
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>STJ Portal Accounts Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ STJ (Portal User Accounts)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸ Backend API Ã¢â‚¬Â¢ Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â STJ Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â€ {usersList.length} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading} className="text-xs">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€°
            </Button>
            <Link href="/system/members">
              <Button size="sm" className="space-x-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾ËœÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸</span>
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
              placeholder="Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡ Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€º Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾Â..."
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
              <option value="ALL">Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â¸ (All Roles)</option>
              <option value="LEADER">Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€  & Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Ëœ (Leaders)</option>
              <option value="MEMBER">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Tutors)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â€º.Ã¡Å¾Å¡</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  STJ</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€° (Kh / En)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ (ITC)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â€¡Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€° & Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾Â</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</th>
                  <th className="py-3 px-4 font-semibold text-right">Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€“Ã¡Å¾Â¸ Backend API...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Æ’Ã¡Å¾Â¾Ã¡Å¾â€°Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢Ã¡Å¸â€
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, idx) => {
                    const isLeader = u.notes?.includes("Leader") || u.notes?.includes("Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ") || u.notes?.includes("Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Ëœ");
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
                            title="Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€°"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(u.memberId)}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-amber-600"
                            title="Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ"
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
