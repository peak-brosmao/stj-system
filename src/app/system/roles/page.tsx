"use client";

import React from "react";
import { Shield, Check, X, Lock } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Badge } from "@/ui/ui/Badge";

export default function SystemRolesPage() {
  const matrix = [
    { module: "áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ & Settings", code: "system:settings", super: true, admin: false, leader: false, member: false },
    { module: "áž€áŸ†ážŽážáŸ‹áž áŸážáž»ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž– Audit Logs", code: "audit:view", super: true, admin: false, leader: false, member: false },
    { module: "áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážáž½áž“áž¶áž‘áž¸ & ážŸáž·áž‘áŸ’áž’áž· RBAC", code: "rbac:manage", super: true, admin: false, leader: false, member: false },
    { module: "áž”áž„áŸ’áž€áž¾áž & áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‚ážŽáž“áž¸áž”áž»áž‚áŸ’áž‚áž›áž·áž€", code: "users:manage", super: true, admin: true, leader: false, member: false },
    { module: "ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážš (Mark Attendance)", code: "attendance:mark", super: true, admin: true, leader: false, member: false },
    { module: "áž€áŸ‚áž”áŸ’ážšáŸ‚áž‘áž·áž“áŸ’áž“áž“áŸáž™ážœážáŸ’ážáž˜áž¶áž“ (Edit Attendance)", code: "attendance:edit", super: true, admin: true, leader: false, member: false },
    { module: "áž¢áž“áž»áž˜áŸážážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“", code: "attendance:correct", super: true, admin: true, leader: false, member: false },
    { module: "áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŸáž˜áž¶áž‡áž·áž€ (Members CRUD)", code: "members:manage", super: true, admin: true, leader: false, member: false },
    { module: "áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ & áž…áž¶ážáŸ‹ážáž¶áŸ†áž„ Leader", code: "courses:manage", super: true, admin: true, leader: false, member: false },
    { module: "áž”áž„áŸ’áž€áž¾ážážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ (Teaching Sessions)", code: "sessions:manage", super: true, admin: true, leader: false, member: false },
    { module: "áž˜áž¾áž›ážœážáŸ’ážáž˜áž¶áž“ážŸáž˜áž¶áž‡áž·áž€ (Read Attendance)", code: "attendance:read", super: true, admin: true, leader: true, member: true },
    { module: "áž”áž„áŸ’áž€áž¾ážážáŸ†ážŽáž—áŸ’áž‡áž¶áž”áŸ‹áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ (Share Links)", code: "share:create", super: true, admin: true, leader: true, member: false },
    { module: "áž‘áž¶áž‰áž™áž€ážšáž”áž¶áž™áž€áž¶ážšážŽáŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš (Export Reports)", code: "reports:view", super: true, admin: true, leader: true, member: false },
  ];

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Shield className="w-4 h-4" />
              <span>Role-Based Access Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážáž¶ážšáž¶áž„ážŸáž·áž‘áŸ’áž’áž· áž“áž·áž„ážáž½áž“áž¶áž‘áž¸ (Permission Matrix)
            </h1>
            <p className="text-xs text-muted-foreground">
              áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážŸáž·áž‘áŸ’áž’áž·áž¢áž“áž»áž‰áŸ’áž‰áž¶ážáž™áŸ‰áž¶áž„áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹ážáž¶áž˜áž€áž˜áŸ’ážšáž·ážážáž½áž“áž¶áž‘áž¸áž“áž¸áž˜áž½áž™áŸ—
            </p>
          </div>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-3">
          <Lock className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <strong className="block font-semibold">áž‚áŸ„áž›áž€áž¶ážšážŽáŸážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážœážáŸ’ážáž˜áž¶áž“ážŠáŸážáž¹áž„ážšáŸ‰áž¹áž„ (Zero Mutation for Leaders):</strong>
            áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ (Course Leaders) áž‚áŸ’áž˜áž¶áž“ážŸáž·áž‘áŸ’áž’áž·áž€áŸ’áž“áž»áž„áž€áž¶ážšáž€ážáŸ‹ážáŸ’ážšáž¶ áž€áŸ‚áž”áŸ’ážšáŸ‚ áž¬áž›áž»áž”ážœážáŸ’ážáž˜áž¶áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážšáž¡áž¾áž™áŸ” áž˜áž¶áž“ážáŸ‚áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€ážŽáŸ’ážáž¶áž› (Super Admin) áž“áž·áž„áž¢áŸ’áž“áž€áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž•áŸ’áž›áž¼ážœáž€áž¶ážš (STJ Admin) áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡ážŠáŸ‚áž›áž¢áž¶áž…ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“áž”áž¶áž“áŸ”
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">áž˜áž»ážáž„áž¶ážš / ážŸáž·áž‘áŸ’áž’áž·áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš</th>
                  <th className="py-3 px-4 font-semibold">áž€áž¼ážŠážŸáž·áž‘áŸ’áž’áž·</th>
                  <th className="py-3 px-4 text-center font-semibold">Super Admin</th>
                  <th className="py-3 px-4 text-center font-semibold">STJ Admin</th>
                  <th className="py-3 px-4 text-center font-semibold text-primary">Course Leader</th>
                  <th className="py-3 px-4 text-center font-semibold">Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {matrix.map((row) => (
                  <tr key={row.code} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{row.module}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{row.code}</td>
                    <td className="py-3 px-4 text-center">
                      {row.super ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      {row.leader ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-destructive mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.member ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
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

