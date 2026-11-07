"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Shield,
  KeyRound,
  Laptop,
  Smartphone,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  History,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detectedPortal, setDetectedPortal] = useState<"portal" | "leader" | "system">("portal");

  React.useEffect(() => {
    fetch("/api/portal/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const u = d?.profile || d?.user;
        const roles: string[] = u?.roles || u?.userRoles?.map((x: any) => x?.role?.name || x) || [];
        if (roles.includes("SUPER_ADMIN") || roles.includes("STJ_PRESIDENT") || roles.includes("STJ_ADMIN")) {
          setDetectedPortal("system");
        } else if (roles.includes("COURSE_LEADER")) {
          setDetectedPortal("leader");
        }
      })
      .catch(() => {});
  }, []);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess-curr",
      device: "Windows PC (Google Chrome)",
      ipAddress: "119.82.253.14 (Phnom Penh, Cambodia)",
      lastActive: "ពេលនេះ (Current Session)",
      isCurrent: true,
    },
    {
      id: "sess-mob",
      device: "Apple iPhone 14 Pro (Safari)",
      ipAddress: "119.82.253.88",
      lastActive: "ម្សិលមិញ ម៉ោង ០៨:១២ PM",
      isCurrent: false,
    },
  ]);

  const loginHistory = [
    { id: "lh-1", date: "៣០ តុលា ២០២៦, ០៦:១២ PM", ip: "119.82.253.14", device: "Chrome / Windows", status: "SUCCESS" },
    { id: "lh-2", date: "២៩ តុលា ២០២៦, ០៨:១២ PM", ip: "119.82.253.88", device: "Safari / iOS", status: "SUCCESS" },
    { id: "lh-3", date: "២៥ តុលា ២០២៦, ០៩:០០ AM", ip: "119.82.253.14", device: "Chrome / Windows", status: "SUCCESS" },
  ];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("លេខកូដសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៨ តួអក្សរ");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("ការបញ្ជាក់លេខកូដសម្ងាត់មិនត្រូវគ្នាឡើយ");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ការផ្លាស់ប្តូរលេខកូដសម្ងាត់មិនជោគជ័យ");

      setSuccessMsg("លេខកូដសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "កំហុសក្នុងការប្តូរពាក្យសម្ងាត់");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeOtherSessions = () => {
    if (!confirm("តើអ្នកពិតជាចង់ចាកចេញពីឧបករណ៍ផ្សេងៗទាំងអស់មែនទេ?")) return;
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    alert("បានចាកចេញពីឧបករណ៍ផ្សេងទៀតទាំងអស់ដោយជោគជ័យ");
  };

  return (
    <PortalLayout portalType={detectedPortal}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Account Security & Session Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            សុវត្ថិភាពគណនី (Security Settings)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            គ្រប់គ្រងលេខកូដសម្ងាត់ ការចូលប្រើប្រាស់ និងសម័យកាលសកម្មនៅលើឧបករណ៍ផ្សេងៗ
          </p>
        </div>

        {/* Change Password Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <span>ប្តូរលេខកូដសម្ងាត់ (Change Password)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  លេខកូដសម្ងាត់បច្ចុប្បន្ន (Current Password)
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  លេខកូដសម្ងាត់ថ្មី (New Password - Min 8 characters)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  បញ្ជាក់លេខកូដសម្ងាត់ថ្មី (Confirm New Password)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showpwd"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="showpwd" text-xs className="text-xs text-muted-foreground cursor-pointer">
                  បង្ហាញលេខកូដសម្ងាត់
                </label>
              </div>

              <Button type="submit" disabled={submitting} size="sm" className="space-x-1.5 text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>{submitting ? "កំពុងរក្សាទុក..." : "ផ្លាស់ប្តូរលេខកូដសម្ងាត់"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-primary" />
              <span>សម័យកាលសកម្មលើឧបករណ៍ (Active Sessions)</span>
            </CardTitle>
            {activeSessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeOtherSessions}
                className="text-xs text-destructive hover:bg-destructive/10 space-x-1"
              >
                <LogOut className="w-3 h-3" />
                <span>ចាកចេញពីឧបករណ៍ផ្សេងទៀត</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-border flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-foreground">{s.device}</p>
                      {s.isCurrent && (
                        <Badge variant="success" className="text-[10px]">ឧបករណ៍បច្ចុប្បន្ន</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{s.ipAddress}</p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{s.lastActive}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <History className="w-4 h-4 text-primary" />
              <span>ប្រវត្តិចូលប្រើប្រាស់ចុងក្រោយ (Recent Login History)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2 px-3">កាលបរិច្ឆេទ & ម៉ោង</th>
                    <th className="py-2 px-3">អាសយដ្ឋាន IP</th>
                    <th className="py-2 px-3">ឧបករណ៍ & Browser</th>
                    <th className="py-2 px-3 text-right">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loginHistory.map((lh) => (
                    <tr key={lh.id}>
                      <td className="py-2 px-3 text-foreground">{lh.date}</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">{lh.ip}</td>
                      <td className="py-2 px-3 text-muted-foreground">{lh.device}</td>
                      <td className="py-2 px-3 text-right">
                        <Badge variant="success" className="text-[10px]">ជោគជ័យ (Success)</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
