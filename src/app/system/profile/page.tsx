"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SystemProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "គណៈគ្រប់គ្រង STJ កណ្តាល",
    fullNameEn: "Central STJ Administrator",
    email: "admin@itc.edu.kh",
    phone: "+855 23 880 370",
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <User className="w-4 h-4" />
            <span>Administrative Security</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            គណនីផ្ទាល់ខ្លួន (Administrator Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            គ្រប់គ្រងព័ត៌មានបុគ្គលិក និងសុវត្ថិភាពពាក្យសម្ងាត់
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
                  <Button type="submit" size="sm" className="w-full">
                    រក្សាទុកព័ត៌មាន
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">ប្តូរពាក្យសម្ងាត់ (Change Password)</h3>
              <form className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៨តួ)</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="pt-2">
                  <Button type="button" variant="outline" size="sm" className="w-full">
                    ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់
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

