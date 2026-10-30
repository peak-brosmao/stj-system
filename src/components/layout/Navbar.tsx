"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, UserCheck } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = [
    { href: "/", label: t("nav.home") },
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Logo href="/" size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls & Portals */}
        <div className="hidden lg:flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
          <div className="h-5 w-px bg-border mx-1" />
          <Link href="/portal/login">
            <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-primary" />
              <span>ច្រកចូលសមាជិក & រៀមច្បង</span>
            </Button>
          </Link>
          <Link href="/system/login">
            <Button variant="default" size="sm" className="space-x-1.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("nav.systemPortal")}</span>
            </Button>
          </Link>
        </div>

        {/* Mobile controls & hamburger */}
        <div className="flex items-center space-x-2 lg:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-border flex flex-col space-y-2">
            <Link href="/portal/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-start space-x-2">
                <UserCheck className="w-4 h-4 text-primary" />
                <span>ច្រកចូលសមាជិក & រៀមច្បង (Portal)</span>
              </Button>
            </Link>
            <Link href="/system/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" size="sm" className="w-full justify-start space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("nav.systemPortal")}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

