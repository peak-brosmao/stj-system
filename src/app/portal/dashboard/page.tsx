"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MemberDashboardPage from "../member/page";
import LeaderDashboardPage from "../leader/page";
import { UserCheck, GraduationCap } from "lucide-react";

export default function PortalDashboardPage() {
  const [activeRoleView, setActiveRoleView] = useState<"member" | "leader">("member");
  const [hasMultipleRoles, setHasMultipleRoles] = useState(true);

  return (
    <div className="relative">
      {/* Role Switching Bar for Multi-Role users */}
      {hasMultipleRoles && (
        <div className="fixed bottom-4 right-4 z-50 p-1.5 rounded-2xl bg-card/90 backdrop-blur border border-border shadow-lg flex items-center space-x-1 text-xs">
          <span className="text-[10px] text-muted-foreground px-2 font-medium">ប្តូរទិដ្ឋភាព:</span>
          <button
            type="button"
            onClick={() => setActiveRoleView("member")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeRoleView === "member"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            សមាជិក (Member)
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleView("leader")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeRoleView === "leader"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            រៀមច្បង (Leader)
          </button>
        </div>
      )}

      {activeRoleView === "member" ? <MemberDashboardPage /> : <LeaderDashboardPage />}
    </div>
  );
}

