"use client";

import React, { useState } from "react";
import { History, Shield, Search, Filter } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SystemAuditLogsPage() {
  const [logs] = useState([
    {
      id: "log-1",
      action: "ATTENDANCE_SAVED",
      entityType: "ATTENDANCE",
      user: "coordinator@itc.edu.kh",
      details: "Marked attendance for 8 members in Session 1 (Programming)",
      ipAddress: "127.0.0.1",
      timestamp: "2026-10-30 16:15:20",
    },
    {
      id: "log-2",
      action: "SHARE_LINK_CREATED",
      entityType: "SHARE_LINK",
      user: "leang.jingheng@itc.edu.kh",
      details: "Created read-only share link for Week 1 Programming attendance",
      ipAddress: "127.0.0.1",
      timestamp: "2026-10-30 15:40:12",
    },
    {
      id: "log-3",
      action: "LOGIN_SUCCESS",
      entityType: "USER",
      user: "admin@itc.edu.kh",
      details: "Successful authenticated login into System Administration Portal",
      ipAddress: "127.0.0.1",
      timestamp: "2026-10-30 14:02:18",
    },
    {
      id: "log-4",
      action: "MEMBER_CREATED",
      entityType: "MEMBER",
      user: "coordinator@itc.edu.kh",
      details: "Created member record STJ008 (Oum Sovann, AMS, I2)",
      ipAddress: "127.0.0.1",
      timestamp: "2026-10-29 11:24:05",
    },
  ]);

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <History className="w-4 h-4" />
              <span>Tamper-Evident Security Log</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              កំណត់ហេតុសុវត្ថិភាព (Audit Logs)
            </h1>
            <p className="text-xs text-muted-foreground">
              កត់ត្រារាល់សកម្មភាពរដ្ឋបាល ការកែប្រែវត្តមាន និងការចូលប្រើប្រព័ន្ធ
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">កាលបរិច្ឆេទ</th>
                  <th className="py-3 px-4 font-semibold">សកម្មភាព (Action)</th>
                  <th className="py-3 px-4 font-semibold">អ្នកប្រតិបត្តិ (Actor)</th>
                  <th className="py-3 px-4 font-semibold">ព័ត៌មានលម្អិត (Details)</th>
                  <th className="py-3 px-4 font-semibold">អាសយដ្ឋាន IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground font-mono">{log.timestamp}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{log.user}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{log.ipAddress}</td>
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

