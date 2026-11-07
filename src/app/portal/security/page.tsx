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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess-curr",
      device: "Windows PC (Google Chrome)",
      ipAddress: "119.82.253.14 (Phnom Penh, Cambodia)",
      lastActive: "áž–áŸáž›áž“áŸáŸ‡ (Current Session)",
      isCurrent: true,
    },
    {
      id: "sess-mob",
      device: "Apple iPhone 14 Pro (Safari)",
      ipAddress: "119.82.253.88",
      lastActive: "áž˜áŸ’ážŸáž·áž›áž˜áž·áž‰ áž˜áŸ‰áŸ„áž„ áŸ áŸ¨:áŸ¡áŸ¢ PM",
      isCurrent: false,
    },
  ]);

  const loginHistory = [
    { id: "lh-1", date: "áŸ£áŸ  ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦, áŸ áŸ¦:áŸ¡áŸ¢ PM", ip: "119.82.253.14", device: "Chrome / Windows", status: "SUCCESS" },
    { id: "lh-2", date: "áŸ¢áŸ© ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦, áŸ áŸ¨:áŸ¡áŸ¢ PM", ip: "119.82.253.88", device: "Safari / iOS", status: "SUCCESS" },
    { id: "lh-3", date: "áŸ¢áŸ¥ ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦, áŸ áŸ©:áŸ áŸ  AM", ip: "119.82.253.14", device: "Chrome / Windows", status: "SUCCESS" },
  ];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸ážáŸ’ážšáž¼ážœáž˜áž¶áž“áž™áŸ‰áž¶áž„ážáž·áž… áŸ¨ ážáž½áž¢áž€áŸ’ážŸážš");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("áž€áž¶ážšáž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹áž˜áž·áž“ážáŸ’ážšáž¼ážœáž‚áŸ’áž“áž¶áž¡áž¾áž™");
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
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setSuccessMsg("áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™ (Password changed)");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áŸ’ážáž¼ážšáž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeOtherSessions = () => {
    if (!confirm("ážáž¾áž¢áŸ’áž“áž€áž–áž·ážáž‡áž¶áž…áž„áŸ‹áž…áž¶áž€áž…áŸáž‰áž–áž¸áž§áž”áž€ážšážŽáŸáž•áŸ’ážŸáŸáž„áŸ—áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž˜áŸ‚áž“áž‘áŸ?")) return;
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    alert("áž”áž¶áž“áž…áž¶áž€áž…áŸáž‰áž–áž¸áž§áž”áž€ážšážŽáŸáž•áŸ’ážŸáŸáž„áž‘áŸ€ážáž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™");
  };

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Account Security & Session Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áž‚ážŽáž“áž¸ (Security Settings)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ áž€áž¶ážšáž…áž¼áž›áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹ áž“áž·áž„ážŸáž˜áŸáž™áž€áž¶áž›ážŸáž€áž˜áŸ’áž˜áž“áŸ…áž›áž¾áž§áž”áž€ážšážŽáŸáž•áŸ’ážŸáŸáž„áŸ—
          </p>
        </div>

        {/* Change Password Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <span>áž”áŸ’ážáž¼ážšáž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ (Change Password)</span>
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
                  áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“ (Current Password)
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸ (New Password - Min 8 characters)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸ (Confirm New Password)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
                  áž”áž„áŸ’áž áž¶áž‰áž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹
                </label>
              </div>

              <Button type="submit" disabled={submitting} size="sm" className="space-x-1.5 text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>{submitting ? "áž€áŸ†áž–áž»áž„ážšáž€áŸ’ážŸáž¶áž‘áž»áž€..." : "áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž›áŸážáž€áž¼ážŠážŸáž˜áŸ’áž„áž¶ážáŸ‹"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-primary" />
              <span>ážŸáž˜áŸáž™áž€áž¶áž›ážŸáž€áž˜áŸ’áž˜áž›áž¾áž§áž”áž€ážšážŽáŸ (Active Sessions)</span>
            </CardTitle>
            {activeSessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeOtherSessions}
                className="text-xs text-destructive hover:bg-destructive/10 space-x-1"
              >
                <LogOut className="w-3 h-3" />
                <span>áž…áž¶áž€áž…áŸáž‰áž–áž¸áž§áž”áž€ážšážŽáŸáž•áŸ’ážŸáŸáž„áž‘áŸ€áž</span>
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
                        <Badge variant="success" className="text-[10px]">áž§áž”áž€ážšážŽáŸáž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“</Badge>
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
              <span>áž”áŸ’ážšážœážáŸ’ážáž·áž…áž¼áž›áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž…áž»áž„áž€áŸ’ážšáŸ„áž™ (Recent Login History)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2 px-3">áž€áž¶áž›áž”ážšáž·áž…áŸ’áž†áŸáž‘ & áž˜áŸ‰áŸ„áž„</th>
                    <th className="py-2 px-3">áž¢áž¶ážŸáž™ážŠáŸ’áž‹áž¶áž“ IP</th>
                    <th className="py-2 px-3">áž§áž”áž€ážšážŽáŸ & Browser</th>
                    <th className="py-2 px-3 text-right">ážŸáŸ’ážáž¶áž“áž—áž¶áž–</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loginHistory.map((lh) => (
                    <tr key={lh.id}>
                      <td className="py-2 px-3 text-foreground">{lh.date}</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">{lh.ip}</td>
                      <td className="py-2 px-3 text-muted-foreground">{lh.device}</td>
                      <td className="py-2 px-3 text-right">
                        <Badge variant="success" className="text-[10px]">áž‡áŸ„áž‚áž‡áŸáž™ (Success)</Badge>
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

