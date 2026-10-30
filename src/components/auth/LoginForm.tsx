"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface LoginFormProps {
  portalType: "system" | "leader";
}

export function LoginForm({ portalType }: LoginFormProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState(
    portalType === "system" ? "admin@itc.edu.kh" : "leang.jingheng@itc.edu.kh"
  );
  const [password, setPassword] = useState("ITC@STJ2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedPortal: portalType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push(data.redirectUrl || (portalType === "system" ? "/system/dashboard" : "/leader/dashboard"));
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication error.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isSystem = portalType === "system";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300">
      {/* Top Bar with Language and Theme */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="2xl" showText={false} href="/" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-2">
            {isSystem ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>{isSystem ? "System Administration" : "Course Leader Portal"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isSystem ? t("auth.systemLoginTitle") : t("auth.leaderLoginTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("common.institution")}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="user@itc.edu.kh"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 space-x-2 font-semibold"
            >
              <span>{loading ? t("common.loading") : t("auth.signIn")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Seed accounts helper banner */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] font-medium text-muted-foreground mb-2">
              Default Credentials (Seeded for ITC Evaluation):
            </p>
            <div className="p-2.5 rounded-lg bg-muted/50 text-[11px] text-muted-foreground space-y-1 font-mono">
              <p>Email: <span className="text-foreground">{isSystem ? "admin@itc.edu.kh" : "leang.jingheng@itc.edu.kh"}</span></p>
              <p>Password: <span className="text-foreground">ITC@STJ2026!</span></p>
            </div>
          </div>
        </div>

        {/* Portal switch link */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          {isSystem ? (
            <Link href="/leader/login" className="text-primary hover:underline font-medium">
              Switch to Course Leader Portal
            </Link>
          ) : (
            <Link href="/system/login" className="text-primary hover:underline font-medium">
              Switch to System Administration Portal
            </Link>
          )}
          <span className="mx-2">•</span>
          <Link href="/" className="hover:underline">
            {t("common.back")} {t("nav.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

