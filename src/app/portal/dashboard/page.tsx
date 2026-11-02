"use client";

import React, { useState, useEffect } from "react";
import MemberDashboardPage from "../member/page";
import LeaderDashboardPage from "../leader/page";

export default function PortalDashboardPage() {
  const [role, setRole] = useState<"member" | "leader">("member");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        const roles = data?.profile?.roles || data?.profile?.userRoles?.map((r: any) => r.role?.name) || [];
        if (roles.includes("COURSE_LEADER") && !roles.includes("MEMBER")) {
          setRole("leader");
        } else {
          setRole("member");
        }
      })
      .catch(() => {
        setRole("member");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return role === "leader" ? <LeaderDashboardPage /> : <MemberDashboardPage />;
}
