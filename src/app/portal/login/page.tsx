"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { useI18n } from "@/ui/i18n/I18nProvider";
import { LanguageSelector } from "@/ui/i18n/LanguageSelector";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { Button } from "@/ui/Button";
import { Logo } from "@/ui/Logo";

function LoginContent() {
  const router = useRouter();
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [supportTelegram, setSupportTelegram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/support-contact")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setSupportTelegram(data?.telegram || null))
      .catch(() => setSupportTelegram(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("auth.errorInvalid"));
      }

      if (data.user) {
        router.refresh();
      }

      // Dynamic automatic redirect based on verified server-side role
      const redirectTarget = data.redirectUrl || "/portal/member";
      router.push(redirectTarget);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("auth.errorInvalid");
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
            {t("auth.portalLoginTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Student & Member Information System (ITC)
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. e20251455 ឬ e20251455@itc.edu.kh"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">
                  {t("auth.password")}
                </label>
                <a
                  href={supportTelegram ? `https://t.me/${supportTelegram.replace(/^@/, "")}` : "/contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline"
                >
                  {t("auth.forgotPassword")}
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full space-x-2 mt-2">
              <span>{loading ? t("auth.signingIn") : t("auth.signIn")}</span>
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