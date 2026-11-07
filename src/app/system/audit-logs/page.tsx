"use client";

import React, { useState } from "react";
import { History, Shield, Search, Filter } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Badge } from "@/ui/Badge";

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
      user: "e20221334@itc.edu.kh",
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
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <History className="w-4 h-4" />
              <span>Tamper-Evident Security Log</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Â Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“ (Audit Logs)
            </h1>
            <p className="text-xs text-muted-foreground">
              Ã¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾Å¡Ã¡Å¾Å Ã¡Å¸â€™Ã¡Å¾â€¹Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€º Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¸ÂÃ¡Å¾â€˜</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“ (Action)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â· (Actor)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â·Ã¡Å¾Â (Details)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â„¢Ã¡Å¾Å Ã¡Å¸â€™Ã¡Å¾â€¹Ã¡Å¾Â¶Ã¡Å¾â€œ IP</th>
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

