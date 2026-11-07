"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  Share2,
  FileBarChart,
  Megaphone,
  Settings,
  Shield,
  History,
  Building2,
  BookOpen,
  UserCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  FileText,
  Lock,
  Sliders,
  CheckCircle2,
  Layers,
  PenTool,
} from "lucide-react";
import { useI18n } from "@/ui/i18n/I18nProvider";
import { LanguageSelector } from "@/ui/i18n/LanguageSelector";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { Button } from "@/ui/Button";
import { Logo } from "@/ui/Logo";

interface PortalLayoutProps {
  children: React.ReactNode;
  portalType: "system" | "leader" | "portal" | "member";
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userMemberId?: string;
}

export function PortalLayout({
  children,
  portalType,
  userEmail = "user@itc.edu.kh",
  userName = "",
  userRole = "",
  userMemberId,
}: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const translateRole = (role: string) => {
    if (role.includes("STJ") && (role.includes("President") || role.includes("ប្រធាន"))) return t("system.president");
    if (role.includes("Association") || role.includes("សមាគម")) return t("system.association");
    if (role.includes("Leader") || role.includes("ក្រុម") || role.includes("មុខវិជ្ជា")) return t("system.leader");
    if (role.includes("Admin") || role.includes("គ្រប់គ្រង")) return t("system.admin");
    return t("system.member");
  };

  const initialName =
    userName && userName !== "STJ Academic Staff" && userName !== "សមាជិក STJ" && !userName.includes("?")
      ? userName
      : "";

  const initialMemberId = userMemberId;
  const initialRole = (userRole && userRole !== "STJ Member" ? userRole : "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  const [currentUser, setCurrentUser] = useState(() => {
    return {
      name: initialName || t("system.member"),
      role: initialRole || (portalType === "system" ? t("system.president") : t("system.member")),
      email: userEmail,
      memberId: initialMemberId,
      avatar: "" as string | undefined,
    };
  });

  React.useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        const u = data?.profile || data?.user;
        if (u) {
          const userRoles: string[] = u.roles || u.userRoles?.map((r: any) => r.role?.name || r) || [];
          let resolvedRole = t("system.member");
          if (userRoles.includes("SUPER_ADMIN") || userRoles.includes("STJ_PRESIDENT")) {
            resolvedRole = t("system.president");
          } else if (userRoles.includes("COURSE_LEADER")) {
            resolvedRole = t("system.leader");
          } else if (userRoles.includes("STJ_ADMIN") || userRoles.includes("STUDENT_ASSOCIATION")) {
            resolvedRole = userRoles.includes("STUDENT_ASSOCIATION") ? t("system.association") : t("system.admin");
          } else if (u.member?.role) {
            resolvedRole = u.member.role.replace(/\s*\([^)]*\)/g, "").trim();
          }

          const resolvedUser = {
            name: u.fullNameKh || u.fullNameEn || initialName || t("system.member"),
            role: resolvedRole,
            email: u.email || userEmail,
            memberId: u.member?.memberId || u.studentId || initialMemberId,
            avatar: u.profileImage || "",
          };

          setCurrentUser(resolvedUser);
        }
      })
      .catch(() => {});
  }, [userEmail, initialName, initialMemberId, portalType, t]);

  const systemNavItems = [
    { href: "/system/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
    { href: "/system/attendance", label: "nav.attendance", icon: CalendarCheck },
    { href: "/system/sessions", label: "nav.sessions", icon: CalendarDays },
    { href: "/portal/blog", label: "អត្ថបទ & មេរៀន (Blog)", icon: PenTool },
    { href: "/system/members", label: "nav.members", icon: Users },
    { href: "/system/leaders", label: "nav.leaders", icon: UserCheck },
    { href: "/system/courses", label: "nav.courses", icon: BookOpen },
    { href: "/system/departments", label: "nav.departments", icon: Building2 },
    { href: "/system/academic-years", label: "nav.academicYears", icon: GraduationCap },
    { href: "/system/reports", label: "nav.reports", icon: FileBarChart },
    { href: "/system/share-links", label: "nav.shareLinks", icon: Share2 },
    { href: "/system/announcements", label: "nav.announcements", icon: Megaphone },
    { href: "/system/profile-requests", label: "nav.profileRequests", icon: FileText },
    { href: "/system/audit-logs", label: "nav.auditLogs", icon: History },
    { href: "/system/settings", label: "nav.settings", icon: Settings },
    { href: "/system/profile", label: "nav.profile", icon: User },
  ];

  const leaderNavItems = [
    { href: "/leader/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
    { href: "/leader/members", label: "nav.myMembers", icon: Users },
    { href: "/leader/attendance", label: "nav.myAttendance", icon: CalendarCheck },
    { href: "/leader/sessions", label: "nav.sessions", icon: CalendarDays },
    { href: "/portal/blog", label: "អត្ថបទ & មេរៀន (Blog)", icon: PenTool },
    { href: "/leader/reports", label: "nav.reports", icon: FileBarChart },
    { href: "/leader/share-links", label: "nav.shareLinks", icon: Share2 },
    { href: "/leader/announcements", label: "nav.announcements", icon: Megaphone },
    { href: "/leader/profile", label: "nav.profile", icon: User },
    { href: "/portal/security", label: "nav.security", icon: Lock },
  ];

  const portalNavItems = [
    { href: "/portal/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
    { href: "/portal/profile", label: "nav.profile", icon: User },
    { href: "/portal/attendance", label: "nav.myAttendance", icon: CalendarCheck },
    { href: "/portal/courses", label: "nav.myCourses", icon: BookOpen },
    { href: "/portal/schedule", label: "nav.schedule", icon: CalendarDays },
    { href: "/portal/blog", label: "អត្ថបទ & មេរៀន (Blog)", icon: PenTool },
    { href: "/portal/announcements", label: "nav.announcements", icon: Megaphone },
    { href: "/portal/notifications", label: "nav.notifications", icon: Bell },
    { href: "/portal/correction-requests", label: "nav.correctionRequests", icon: FileText },
    { href: "/portal/security", label: "nav.security", icon: Lock },
    { href: "/portal/settings", label: "nav.settings", icon: Sliders },
  ];

  const items =
    portalType === "system"
      ? systemNavItems
      : portalType === "leader"
      ? leaderNavItems
      : portalNavItems;

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("stj_user_profile");
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/portal/login");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || (href !== `/${portalType}/dashboard` && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300 relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Logo
          href="/"
          size="sm"
          subtitle={
            portalType === "system"
              ? t("system.portal")
              : portalType === "leader"
              ? t("nav.leaderPortal")
              : t("system.member")
          }
        />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Logo
            href="/"
            size="sm"
            subtitle={
              portalType === "system"
                ? t("system.portal")
                : portalType === "leader"
                  ? t("nav.leaderPortal")
                  : t("system.member")
            }
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className="truncate">
                  {item.label.startsWith("nav.") ? t(item.label) : item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-border bg-muted/30">
          <Link href="/portal/profile" className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl hover:bg-muted/60 transition-colors">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name || "User"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/40 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/30 shrink-0">
                {currentUser.name ? currentUser.name.charAt(0) : "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-bold truncate text-foreground">{currentUser.name || t("system.member")}</p>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                {currentUser.memberId && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                    {currentUser.memberId}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground truncate font-medium">{translateRole(currentUser.role)}</span>
              </div>
            </div>
          </Link>
          <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-destructive hover:bg-destructive/10 px-2"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Breadcrumb & Quick Bar */}
        <header className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>STJ</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="capitalize">{portalType === "system" ? t("system.portal") : portalType === "leader" ? t("nav.leaderPortal") : t("system.member")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">
              {(() => {
                const seg = pathname.split("/").filter(Boolean).pop() || "dashboard";
                if (seg === "dashboard") return t("system.dashboardLabel");
                if (seg === "editor") return "Rich Text & R2 Studio";
                const translated = t(`nav.${seg}`);
                if (translated.startsWith("nav.")) return seg.toUpperCase();
                return translated;
              })()}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {portalType !== "system" && (
              <Link
                href="/portal/notifications"
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={t("nav.notifications")}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Link>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
              {translateRole(currentUser.role)}
            </span>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-xs text-muted-foreground hover:text-destructive space-x-1.5"
            >
              <LogOut className="w-3 h-3" />
              <span>{t("nav.logout")}</span>
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}