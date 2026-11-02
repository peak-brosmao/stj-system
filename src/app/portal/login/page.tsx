"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "member";

  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<"member" | "leader" | "system">(
    initialRole === "leader" ? "leader" : initialRole === "system" ? "system" : "member"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: "member" | "leader" | "system") => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          expectedPortal: activeTab === "system" ? "system" : activeTab === "leader" ? "leader" : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ការចូលប្រើប្រាស់មិនជោគជ័យ។ សូមពិនិត្យអ៊ីមែល និងលេខកូដសម្ងាត់។");
      }

      // Role-based redirection
      const roles = data.user?.roles || [];
      if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_ADMIN")) {
        router.push("/system/dashboard");
      } else if (roles.includes("COURSE_LEADER") && !roles.includes("MEMBER")) {
        router.push("/portal/leader");
      } else {
        router.push("/portal/member");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "កំហុសប្រព័ន្ធក្នុងការផ្ទៀងផ្ទាត់";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="2xl" showText={false} href="/" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • STJ Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            ច្រកចូលរួម STJ និស្សិត & រៀមច្បង
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Student & Member Information System (ITC)
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-xl mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleTabChange("member")}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === "member"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            សមាជិក (Member)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("leader")}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === "leader"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            រៀមច្បង (Leader)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("system")}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === "system"
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            គណៈគ្រប់គ្រង (Admin)
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {t("auth.emailLabel")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. peak.brosmao@itc.edu.kh"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">
                  {t("auth.passwordLabel")}
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] text-primary hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full space-x-2 mt-2">
              <span>{loading ? t("auth.signingIn") : t("auth.loginButton")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Home link */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            {t("common.back")} {t("nav.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}

