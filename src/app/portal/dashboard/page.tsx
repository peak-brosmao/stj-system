"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => {
        if (!res.ok) {
          router.replace("/portal/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const roles = data?.profile?.roles || data?.profile?.userRoles?.map((r: any) => r.role?.name || r) || [];
        if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT") || roles.includes("STJ_ADMIN") || roles.includes("STUDENT_ASSOCIATION")) {
          router.replace("/system/dashboard");
        } else if (roles.includes("COURSE_LEADER")) {
          router.replace("/leader/dashboard");
        } else {
          router.replace("/portal/member");
        }
      })
      .catch(() => {
        router.replace("/portal/member");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
