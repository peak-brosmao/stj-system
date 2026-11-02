"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LeaderPortalRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/portal/overview")
      .then((r) => {
        if (!r.ok) {
          router.replace("/portal/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        const roles = d?.user?.roles || [];
        if (roles.includes("COURSE_LEADER") || roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT")) {
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
