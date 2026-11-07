"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";

export default function SystemProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "áž•áž› ážŠáž¶ážœáž¸áž",
    fullNameEn: "PHAL David",
    email: "e20221334@itc.edu.kh",
    phone: "086439191",
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile({
            fullNameKh: data.user.fullNameKh || "áž•áž› ážŠáž¶ážœáž¸áž",
            fullNameEn: data.user.fullNameEn || "PHAL David",
            email: data.user.email || "e20221334@itc.edu.kh",
            phone: data.user.phone || "086439191",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordErr("áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸ áž“áž·áž„áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹áž˜áž·áž“ážŠáž¼áž…áž‚áŸ’áž“áž¶áž¡áž¾áž™ (Passwords do not match)");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/portal/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setPasswordMsg("áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™ (Password changed)");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setPasswordErr(err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áŸ’ážáž¼ážšáž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <PortalLayout portalType="system" userRole="STJ President" userName={profile.fullNameKh}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <User className="w-4 h-4" />
            <span>Administrative Security</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            áž‚ážŽáž“áž¸áž”áŸ’ážšáž’áž¶áž“ STJ (President Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž–áŸážáŸŒáž˜áž¶áž“áž”áŸ’ážšáž’áž¶áž“ STJ áž“áž·áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áž‚ážŽáž“áž¸ážŠáž¹áž€áž“áž¶áŸ†
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>áž‘áž·áž“áŸ’áž“áž“áŸáž™ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áŸ‚áž”áŸ’ážšáŸ‚ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™áŸ”</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">áž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">áž‚áŸ„ážáŸ’ážáž“áž¶áž˜-áž“áž¶áž˜ (ážáŸ’áž˜áŸ‚ážš)</label>
                  <input
                    type="text"
                    value={profile.fullNameKh}
                    onChange={(e) => setProfile({ ...profile, fullNameKh: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ážˆáŸ’áž˜áŸ„áŸ‡áž¡áž¶ážáž¶áŸ†áž„</label>
                  <input
                    type="text"
                    value={profile.fullNameEn}
                    onChange={(e) => setProfile({ ...profile, fullNameEn: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž¢áŸŠáž¸áž˜áŸ‚áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2 rounded-lg border border-input bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž›áŸážáž‘áž¼ážšážŸáŸáž–áŸ’áž‘</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" className="w-full mt-2">
                  ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž–áŸážáŸŒáž˜áž¶áž“
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹</h3>
              {passwordMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs">
                  {passwordMsg}
                </div>
              )}
              {passwordErr && (
                <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                  {passwordErr}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“</label>
                  <input
                    type="password"
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸ (áž™áŸ‰áž¶áž„ážáž·áž… áŸ¨ ážáž½)</label>
                  <input
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸</label>
                  <input
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" disabled={changingPassword} className="w-full mt-2">
                  {changingPassword ? "áž€áŸ†áž–áž»áž„áž”áŸ’ážáž¼ážš..." : "áž”áŸ’ážáž¼ážšáž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
