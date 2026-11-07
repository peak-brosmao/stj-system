"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

export default function SystemProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â",
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
            fullNameKh: data.user.fullNameKh || "Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â",
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
      setPasswordErr("Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¾Â¼Ã¡Å¾â€¦Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢ (Passwords do not match)");
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
      if (!res.ok) throw new Error(data.error || "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢");

      setPasswordMsg("Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢ (Password changed)");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setPasswordErr(err instanceof Error ? err.message : "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Â Ã¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹");
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
            Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ 
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¸â€</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â½Ã¡Å¾â€œ</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾â€šÃ¡Å¸â€žÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ-Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ (Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡)</label>
                  <input
                    type="text"
                    value={profile.fullNameKh}
                    onChange={(e) => setProfile({ ...profile, fullNameKh: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Â¡Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž</label>
                  <input
                    type="text"
                    value={profile.fullNameEn}
                    onChange={(e) => setProfile({ ...profile, fullNameEn: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2 rounded-lg border border-input bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â€˜</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" className="w-full mt-2">
                  Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹</h3>
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
                  <label className="block font-medium mb-1">Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ</label>
                  <input
                    type="password"
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸ (Ã¡Å¾â„¢Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾â€žÃ¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€¦ Ã¡Å¸Â¨ Ã¡Å¾ÂÃ¡Å¾Â½)</label>
                  <input
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸</label>
                  <input
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" disabled={changingPassword} className="w-full mt-2">
                  {changingPassword ? "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡..." : "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
