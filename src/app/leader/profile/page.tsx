"use client";

import React, { useEffect, useState } from "react";
import { User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

export default function LeaderProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "",
    fullNameEn: "",
    email: "",
    phone: "",
    studentId: "",
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const p = data?.profile || data?.user;
        if (p) {
          setProfile({
            fullNameKh: p.fullNameKh || "",
            fullNameEn: p.fullNameEn || p.displayName || "",
            email: p.email || "",
            phone: p.phone || "",
            studentId: p.studentId || p.member?.studentId || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullNameKh: profile.fullNameKh,
          displayName: profile.fullNameEn,
          phone: profile.phone,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);

    if (passwordState.newPassword.length < 8) {
      setPasswordErr("ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៨ តួអក្សរ");
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordErr("ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់មិនដូចគ្នាឡើយ");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/portal/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordState),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "ការផ្លាស់ប្តូរពាក្យសម្ងាត់មិនជោគជ័យ");
      }

      setPasswordMsg("ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password changed)");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setPasswordErr(err instanceof Error ? err.message : "កំហុសក្នុងការប្តូរពាក្យសម្ងាត់");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <PortalLayout portalType="leader" userName={profile.fullNameKh}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <User className="w-4 h-4" />
            <span>Leader Identity &amp; Security</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            គណនីប្រធានមុខវិជ្ជា (Leader Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            ព័ត៌មានផ្ទាល់ខ្លួន និងការផ្លាស់ប្តូរលេខកូដសម្ងាត់គណនី
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
              <form onSubmit={handleSave} className="space-y-3 text-xs">
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
                  <label className="block font-medium mb-1">អត្តលេខនិស្សិត ITC</label>
                  <input
                    type="text"
                    disabled
                    value={profile.studentId}
                    className="w-full p-2 rounded-lg border border-input bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">អ៊ីមែលផ្លូវការ</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2 rounded-lg border border-input bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">លេខទូរស័ព្ទ</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" size="sm" disabled={savingProfile} className="w-full">
                    {savingProfile ? "កំពុងរក្សាទុក..." : "រក្សាទុកព័ត៌មាន"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary" />
                <span>ប្តូរពាក្យសម្ងាត់ (Change Password)</span>
              </h3>

              {passwordMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordMsg}</span>
                </div>
              )}
              {passwordErr && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordErr}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                  <input
                    type="password"
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, currentPassword: e.target.value })
                    }
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៨ តួ)</label>
                  <input
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, newPassword: e.target.value })
                    }
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={changingPassword}
                    className="w-full"
                  >
                    {changingPassword ? "កំពុងរក្សាទុក..." : "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
