"use client";

import React from "react";
import { Shield, Check, X, Lock } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SystemRolesPage() {
  const matrix = [
    { module: "ការគ្រប់គ្រងប្រព័ន្ធ & Settings", code: "system:settings", super: true, admin: false, leader: false, member: false },
    { module: "កំណត់ហេតុសុវត្ថិភាព Audit Logs", code: "audit:view", super: true, admin: false, leader: false, member: false },
    { module: "គ្រប់គ្រងតួនាទី & សិទ្ធិ RBAC", code: "rbac:manage", super: true, admin: false, leader: false, member: false },
    { module: "បង្កើត & គ្រប់គ្រងគណនីបុគ្គលិក", code: "users:manage", super: true, admin: true, leader: false, member: false },
    { module: "ស្រង់វត្តមានផ្លូវការ (Mark Attendance)", code: "attendance:mark", super: true, admin: true, leader: false, member: false },
    { module: "កែប្រែទិន្នន័យវត្តមាន (Edit Attendance)", code: "attendance:edit", super: true, admin: true, leader: false, member: false },
    { module: "អនុម័តសំណើកែតម្រូវវត្តមាន", code: "attendance:correct", super: true, admin: true, leader: false, member: false },
    { module: "គ្រប់គ្រងសមាជិក (Members CRUD)", code: "members:manage", super: true, admin: true, leader: false, member: false },
    { module: "គ្រប់គ្រងមុខវិជ្ជា & ចាត់តាំង Leader", code: "courses:manage", super: true, admin: true, leader: false, member: false },
    { module: "បង្កើតវគ្គបង្រៀន (Teaching Sessions)", code: "sessions:manage", super: true, admin: true, leader: false, member: false },
    { module: "មើលវត្តមានសមាជិក (Read Attendance)", code: "attendance:read", super: true, admin: true, leader: true, member: true },
    { module: "បង្កើតតំណភ្ជាប់ចែករំលែក (Share Links)", code: "share:create", super: true, admin: true, leader: true, member: false },
    { module: "ទាញយករបាយការណ៍ផ្លូវការ (Export Reports)", code: "reports:view", super: true, admin: true, leader: true, member: false },
  ];

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Shield className="w-4 h-4" />
              <span>Role-Based Access Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              តារាងសិទ្ធិ និងតួនាទី (Permission Matrix)
            </h1>
            <p className="text-xs text-muted-foreground">
              ការកំណត់សិទ្ធិអនុញ្ញាតយ៉ាងម៉ឺងម៉ាត់តាមកម្រិតតួនាទីនីមួយៗ
            </p>
          </div>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-3">
          <Lock className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <strong className="block font-semibold">គោលការណ៍សុវត្ថិភាពវត្តមានដ៏តឹងរ៉ឹង (Zero Mutation for Leaders):</strong>
            ប្រធានមុខវិជ្ជា (Course Leaders) គ្មានសិទ្ធិក្នុងការកត់ត្រា កែប្រែ ឬលុបវត្តមានផ្លូវការឡើយ។ មានតែគណៈគ្រប់គ្រងកណ្តាល (Super Admin) និងអ្នកគ្រប់គ្រងផ្លូវការ (STJ Admin) ប៉ុណ្ណោះដែលអាចស្រង់វត្តមានបាន។
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">មុខងារ / សិទ្ធិប្រតិបត្តិការ</th>
                  <th className="py-3 px-4 font-semibold">កូដសិទ្ធិ</th>
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

