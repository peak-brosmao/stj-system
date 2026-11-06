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
} from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

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

  const rosterMatch = React.useMemo(() => {
    return OFFICIAL_STJ_ROSTER.find(
      (m) =>
        (userEmail && userEmail !== "user@itc.edu.kh" && m.email.toLowerCase() === userEmail.toLowerCase()) ||
        (userMemberId && m.memberId.toLowerCase() === userMemberId.toLowerCase()) ||
        (userName && userName !== "STJ Academic Staff" && userName !== "សមាជិក STJ" && (m.nameKh === userName || m.nameEn.toLowerCase() === userName.toLowerCase()))
    );
  }, [userEmail, userMemberId, userName]);

  const initialName = userName && userName !== "STJ Academic Staff" && userName !== "សមាជិក STJ"
    ? userName
    : rosterMatch?.nameKh || "";

  const initialMemberId = userMemberId || rosterMatch?.memberId;
  const initialRole = rosterMatch?.isLeader
    ? "ប្រធានក្រុម"
    : rosterMatch?.studentId === "e20221334"
    ? "ប្រធាន STJ"
    : (rosterMatch?.role || (userRole && userRole !== "STJ Member" ? userRole : "")).replace(/\s*\([^)]*\)/g, "").trim();

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("stj_user_profile");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.name || parsed.fullNameKh)) {
            return {
              name: parsed.name || parsed.fullNameKh,
              role: parsed.role || (portalType === "system" ? "ប្រធាន STJ" : "សមាជិក STJ"),
              email: parsed.email || userEmail,
              memberId: parsed.memberId || initialMemberId || (portalType === "system" ? "STJ002" : undefined),
              avatar: parsed.avatar || parsed.profileImage || "",
            };
          }
        }
      } catch {}
    }
    return {
      name: initialName || (portalType === "system" ? "ផល ដាវីត" : "សមាជិក STJ"),
      role: initialRole || (portalType === "system" ? "ប្រធាន STJ" : "សមាជិក STJ"),
      email: userEmail,
      memberId: initialMemberId || (portalType === "system" ? "STJ002" : undefined),
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
          let resolvedRole = "សមាជិក STJ";
          if (userRoles.includes("SUPER_ADMIN") || userRoles.includes("STJ_PRESIDENT") || u.member?.memberId === "STJ002" || u.studentId === "e20221334") {
            resolvedRole = "ប្រធាន STJ";
          } else if (userRoles.includes("COURSE_LEADER")) {
            resolvedRole = "ប្រធានក្រុម";
          } else if (userRoles.includes("STJ_ADMIN") || userRoles.includes("STUDENT_ASSOCIATION") || u.member?.memberId === "STJ001") {
            resolvedRole = "គណៈគ្រប់គ្រង";
          } else if (u.member?.role) {
            resolvedRole = u.member.role.replace(/\s*\([^)]*\)/g, "").trim();
          }

          const resolvedUser = {
            name: u.fullNameKh || u.fullNameEn || initialName || (portalType === "system" ? "ផល ដាវីត" : "សមាជិក STJ"),
            role: resolvedRole,
            email: u.email || userEmail,
            memberId: u.member?.memberId || u.studentId || initialMemberId || (portalType === "system" ? "STJ002" : undefined),
            avatar: u.profileImage || "",
          };

          setCurrentUser(resolvedUser);
          try {
            localStorage.setItem("stj_user_profile", JSON.stringify(resolvedUser));
          } catch {}
        }
      })
      .catch(() => {});
  }, [userEmail, initialName, initialMemberId, portalType]);

  const systemNavItems = [
    { href: "/system/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard },
    { href: "/system/attendance", label: "ស្រង់វត្តមាន", icon: CalendarCheck },
    { href: "/system/sessions", label: "វគ្គបង្រៀន", icon: CalendarDays },
    { href: "/system/members", label: "សមាជិក", icon: Users },
    { href: "/system/leaders", label: "ប្រធានមុខវិជ្ជា", icon: UserCheck },
    { href: "/system/courses", label: "មុខវិជ្ជា", icon: BookOpen },
    { href: "/system/departments", label: "ដេប៉ាតឺម៉ង់", icon: Building2 },
    { href: "/system/academic-years", label: "កម្រិតសិក្សា", icon: GraduationCap },
    { href: "/system/reports", label: "របាយការណ៍", icon: FileBarChart },
    { href: "/system/share-links", label: "តំណភ្ជាប់ចែករំលែក", icon: Share2 },
    { href: "/system/announcements", label: "សេចក្តីជូនដំណឹង", icon: Megaphone },
    { href: "/system/profile-requests", label: "សំណើកែព័ត៌មាន", icon: FileText },
    { href: "/system/audit-logs", label: "កំណត់ហេតុសុវត្ថិភាព", icon: History },
    { href: "/system/settings", label: "ការកំណត់ប្រព័ន្ធ", icon: Settings },
    { href: "/system/profile", label: "គណនីផ្ទាល់ខ្លួន", icon: User },
  ];

  const leaderNavItems = [
    { href: "/leader/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard },
    { href: "/leader/members", label: "សមាជិកក្នុងបន្ទុក", icon: Users },
    { href: "/leader/attendance", label: "មើលវត្តមាន", icon: CalendarCheck },
    { href: "/leader/sessions", label: "កាលវិភាគបង្រៀន", icon: CalendarDays },
    { href: "/leader/reports", label: "របាយការណ៍មុខវិជ្ជា", icon: FileBarChart },
    { href: "/leader/share-links", label: "ចែករំលែកវត្តមាន", icon: Share2 },
    { href: "/leader/announcements", label: "សេចក្តីជូនដំណឹង", icon: Megaphone },
    { href: "/portal/profile", label: "គណនីផ្ទាល់ខ្លួន", icon: User },
  ];

  const portalNavItems = [
    { href: "/portal/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard },
    { href: "/portal/profile", label: "គណនីផ្ទាល់ខ្លួន", icon: User },
    { href: "/portal/attendance", label: "វត្តមានរបស់ខ្ញុំ", icon: CalendarCheck },
    { href: "/portal/courses", label: "មុខវិជ្ជារបស់ខ្ញុំ", icon: BookOpen },
    { href: "/portal/schedule", label: "កាលវិភាគសិក្សា", icon: CalendarDays },
    { href: "/portal/announcements", label: "សេចក្តីជូនដំណឹង", icon: Megaphone },
    { href: "/portal/notifications", label: "ការជូនដំណឹង", icon: Bell },
    { href: "/portal/correction-requests", label: "សំណើកែតម្រូវ", icon: FileText },
    { href: "/portal/security", label: "សុវត្ថិភាពគណនី", icon: Lock },
    { href: "/portal/settings", label: "ការកំណត់", icon: Sliders },
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
              ? "ច្រកគ្រប់គ្រងប្រព័ន្ធ"
              : portalType === "leader"
              ? "ច្រកប្រធានមុខវិជ្ជា"
              : "ច្រកសមាជិក"
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
                ? "ច្រកគ្រប់គ្រងប្រព័ន្ធ"
                : portalType === "leader"
                ? "ច្រកប្រធានមុខវិជ្ជា"
                : "ច្រកសមាជិក"
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
                <span className="truncate">{item.label}</span>
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
                <p className="text-xs font-bold truncate text-foreground">{currentUser.name || "សមាជិក STJ"}</p>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                {currentUser.memberId && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                    {currentUser.memberId}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground truncate font-medium">{currentUser.role}</span>
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
            <span className="capitalize">{portalType}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">
              {pathname.split("/").pop() || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {portalType !== "system" && (
              <Link
                href="/portal/notifications"
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Link>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
              {currentUser.role}
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

