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
  userName = "STJ Academic Staff",
  userRole = "Administrator",
  userMemberId,
}: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const [currentUser, setCurrentUser] = useState({
    name: userName,
    role: userRole,
    email: userEmail,
    memberId: userMemberId,
    avatar: "" as string | undefined,
  });

  React.useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          const resolvedRole =
            portalType === "system"
              ? "ប្រធាន STJ (President)"
              : portalType === "leader"
              ? "ប្រធានក្រុម (Course Leader)"
              : data.member?.role || "សមាជិក STJ (Member)";
          setCurrentUser({
            name: data.user.fullNameKh || userName,
            role: resolvedRole,
            email: data.user.email || userEmail,
            memberId: data.member?.memberId || userMemberId,
            avatar: data.user.profileImage,
          });
        }
      })
      .catch(() => {});
  }, [portalType, userEmail, userName, userRole, userMemberId]);

  const systemNavItems = [
    { href: "/system/dashboard", label: "ផ្ទាំងគ្រប់គ្រង (Dashboard)", icon: LayoutDashboard },
    { href: "/system/attendance", label: "ស្រង់វត្តមាន (Attendance)", icon: CalendarCheck },
    { href: "/system/sessions", label: "វគ្គបង្រៀន (Sessions)", icon: CalendarDays },
    { href: "/system/members", label: "សមាជិក (Members)", icon: Users },
    { href: "/structure", label: "មែកធាងរចនាសម្ព័ន្ធ (Hierarchy Tree)", icon: Layers },
    { href: "/system/leaders", label: "ប្រធានមុខវិជ្ជា (Leaders)", icon: UserCheck },
    { href: "/system/courses", label: "មុខវិជ្ជា (Courses)", icon: BookOpen },
    { href: "/system/departments", label: "ដេប៉ាតឺម៉ង់ (Departments)", icon: Building2 },
    { href: "/system/academic-years", label: "កម្រិតសិក្សា (Academic Years)", icon: GraduationCap },
    { href: "/system/reports", label: "របាយការណ៍ (Reports)", icon: FileBarChart },
    { href: "/system/share-links", label: "តំណភ្ជាប់ចែករំលែក (Share Links)", icon: Share2 },
    { href: "/system/announcements", label: "សេចក្តីជូនដំណឹង (Notices)", icon: Megaphone },
    { href: "/system/profile-requests", label: "សំណើកែព័ត៌មាន (Profile Requests)", icon: FileText },
    { href: "/system/roles", label: "តួនាទី & សិទ្ធិ (RBAC Roles)", icon: Shield },
    { href: "/system/audit-logs", label: "កំណត់ហេតុសុវត្ថិភាព (Audit Logs)", icon: History },
    { href: "/system/settings", label: "ការកំណត់ប្រព័ន្ធ (Settings)", icon: Settings },
    { href: "/system/profile", label: "គណនីផ្ទាល់ខ្លួន (Profile)", icon: User },
  ];

  const leaderNavItems = [
    { href: "/leader/dashboard", label: "ផ្ទាំងគ្រប់គ្រង (Dashboard)", icon: LayoutDashboard },
    { href: "/leader/members", label: "សមាជិកក្នុងបន្ទុក (Assigned Members)", icon: Users },
    { href: "/structure", label: "មែកធាងរចនាសម្ព័ន្ធ (Hierarchy Tree)", icon: Layers },
    { href: "/leader/attendance", label: "មើលវត្តមាន (View Attendance)", icon: CalendarCheck },
    { href: "/leader/sessions", label: "កាលវិភាគបង្រៀន (Teaching Schedule)", icon: CalendarDays },
    { href: "/leader/reports", label: "របាយការណ៍មុខវិជ្ជា (Course Reports)", icon: FileBarChart },
    { href: "/leader/share-links", label: "ចែករំលែកវត្តមាន (Share Links)", icon: Share2 },
    { href: "/leader/announcements", label: "សេចក្តីជូនដំណឹង (Announcements)", icon: Megaphone },
    { href: "/portal/profile", label: "គណនីផ្ទាល់ខ្លួន (My Profile)", icon: User },
  ];

  const portalNavItems = [
    { href: "/portal/dashboard", label: "ផ្ទាំងគ្រប់គ្រង (Dashboard)", icon: LayoutDashboard },
    { href: "/portal/profile", label: "គណនីផ្ទាល់ខ្លួន (My Profile)", icon: User },
    { href: "/structure", label: "មែកធាងរចនាសម្ព័ន្ធ (Hierarchy Tree)", icon: Layers },
    { href: "/portal/attendance", label: "វត្តមានរបស់ខ្ញុំ (My Attendance)", icon: CalendarCheck },
    { href: "/portal/courses", label: "មុខវិជ្ជារបស់ខ្ញុំ (My Courses)", icon: BookOpen },
    { href: "/portal/schedule", label: "កាលវិភាគសិក្សា (My Schedule)", icon: CalendarDays },
    { href: "/portal/announcements", label: "សេចក្តីជូនដំណឹង (Announcements)", icon: Megaphone },
    { href: "/portal/notifications", label: "ការជូនដំណឹង (Notifications)", icon: Bell },
    { href: "/portal/correction-requests", label: "សំណើកែតម្រូវ (Correction Requests)", icon: FileText },
    { href: "/portal/security", label: "សុវត្ថិភាពគណនី (Security)", icon: Lock },
    { href: "/portal/settings", label: "ការកំណត់ (Settings)", icon: Sliders },
  ];

  const items =
    portalType === "system"
      ? systemNavItems
      : portalType === "leader"
      ? leaderNavItems
      : portalNavItems;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push(
      portalType === "system"
        ? "/system/login"
        : portalType === "leader"
        ? "/leader/login"
        : "/portal/login"
    );
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || (href !== `/${portalType}/dashboard` && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Logo
          href="/"
          size="sm"
          subtitle={
            portalType === "system"
              ? "STJ System Portal"
              : portalType === "leader"
              ? "STJ Leader Portal"
              : "STJ Member Portal"
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
                ? "Administration"
                : portalType === "leader"
                ? "Leader Desk"
                : "Member Portal"
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
          <Link href="/portal/profile" className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30 shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-semibold truncate text-foreground">{currentUser.name}</p>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                {currentUser.memberId && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                    {currentUser.memberId}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground truncate">{currentUser.role}</span>
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
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb & Quick Bar */}
        <header className="hidden md:flex h-14 border-b border-border bg-card/60 backdrop-blur items-center justify-between px-6">
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

