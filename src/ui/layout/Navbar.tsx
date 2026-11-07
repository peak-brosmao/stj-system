"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { useI18n } from "@/ui/i18n/I18nProvider";
import { LanguageSelector } from "@/ui/i18n/LanguageSelector";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { Button } from "@/ui/ui/Button";
import { Logo } from "@/ui/ui/Logo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useState<{
    authenticated: boolean;
    user: {
      name: string;
      fullNameKh: string;
      memberId?: string;
      roleLabel?: string;
      dashboardUrl: string;
      profileImage?: string;
    } | null;
  } | null>(null);

  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated) {
          setAuth(data);
        } else {
          setAuth({ authenticated: false, user: null });
        }
      })
      .catch(() => setAuth({ authenticated: false, user: null }));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuth({ authenticated: false, user: null });
      window.location.href = "/portal/login";
    } catch {
      window.location.href = "/portal/login";
    }
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/structure", label: t("nav.structure") },
    { href: "/about", label: t("nav.about") },
    { href: "/programs", label: t("nav.programs") },
    { href: "/activities", label: t("nav.activities") },
    { href: "/news", label: t("nav.news") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Logo href="/" size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls & Unified Sign In / Profile Desk */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-1" />
          {auth?.authenticated && auth.user ? (
            <div className="flex items-center space-x-2">
              <Link href={auth.user.dashboardUrl}>
                <Button size="sm" className="space-x-2 font-bold shadow-sm px-3.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {auth.user.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[130px]">{auth.user.name}</span>
                  {auth.user.memberId && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono hidden lg:inline-block">
                      {auth.user.memberId}
                    </span>
                  )}
                  <LayoutDashboard className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="áž…áž¶áž€áž…áŸáž‰ (Sign Out)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Link href="/portal/login">
              <Button size="sm" className="space-x-1.5 font-bold shadow-sm px-4 h-9">
                <LogIn className="w-4 h-4" />
                <span>{t("nav.login")}</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile controls & hamburger */}
        <div className="flex items-center space-x-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-border text-foreground hover:bg-muted focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border">
            {auth?.authenticated && auth.user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {auth.user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-foreground">{auth.user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{auth.user.roleLabel}</p>
                    </div>
                  </div>
                  {auth.user.memberId && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20 shrink-0">
                      {auth.user.memberId}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={auth.user.dashboardUrl} onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-center space-x-1.5 font-bold h-9">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>áž•áŸ’áž‘áž¶áŸ†áž„áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-center space-x-1.5 font-bold h-9 text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>áž…áž¶áž€áž…áŸáž‰</span>
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/portal/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full justify-center space-x-2 font-bold h-10">
                  <LogIn className="w-4 h-4" />
                  <span>{t("nav.login")}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

