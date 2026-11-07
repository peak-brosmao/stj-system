"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

export default function SystemProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "ផល ដាវីត",
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
            fullNameKh: data.user.fullNameKh || "ផល ដាវីត",
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
      setPasswordErr("ពាក្យសម្ងាត់ថ្មី និងផ្ទៀងផ្ទាត់មិនដូចគ្នាឡើយ (Passwords do not match)");
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
      if (!res.ok) throw new Error(data.error || "ការផ្លាស់ប្តូរមិនជោគជ័យ");

      setPasswordMsg("ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setPasswordErr(err instanceof Error ? err.message : "កំហុសក្នុងការប្តូរពាក្យសម្ងាត់");
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
            គណនីប្រធាន STJ (President Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            គ្រប់គ្រងព័ត៌មានប្រធាន STJ និងសុវត្ថិភាពគណនីដឹកនាំ
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>ទិន្នន័យត្រូវបានកែប្រែដោយជោគជ័យ។</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">គោត្តនាម-នាម (ខ្មែរ)</label>
                  <input
                    type="text"
                    value={profile.fullNameKh}
                    onChange={(e) => setProfile({ ...profile, fullNameKh: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ឈ្មោះឡាតាំង</label>
                  <input
                    type="text"
                    value={profile.fullNameEn}
                    onChange={(e) => setProfile({ ...profile, fullNameEn: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">អ៊ីមែលផ្លូវការ</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2 rounded-lg border border-input bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">លេខទូរស័ព្ទ</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" className="w-full mt-2">
                  រក្សាទុកព័ត៌មាន
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h3>
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
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                  <input
                    type="password"
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៨ តួ)</label>
                  <input
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <Button size="sm" type="submit" disabled={changingPassword} className="w-full mt-2">
                  {changingPassword ? "កំពុងប្តូរ..." : "ប្តូរពាក្យសម្ងាត់"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}