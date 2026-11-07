"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";

export default function LeaderProfilePage() {
  const [profile, setProfile] = useState({
    fullNameKh: "áž›áž¶áž„ áž‡áž¸áž„áž áŸáž„",
    fullNameEn: "LEANG JINGHENG",
    email: "leang.jingheng@itc.edu.kh",
    phone: "0976355500",
    studentId: "e20240704",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PortalLayout portalType="leader">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <User className="w-4 h-4" />
            <span>Leader Identity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            áž‚ážŽáž“áž¸áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ (Leader Profile)
          </h1>
          <p className="text-xs text-muted-foreground">
            áž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ áž“áž·áž„áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–
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
              <form onSubmit={handleSave} className="space-y-3 text-xs">
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
                  <label className="block font-medium mb-1">áž¢ážáŸ’ážáž›áŸážáž“áž·ážŸáŸ’ážŸáž·áž ITC</label>
                  <input
                    type="text"
                    disabled
                    value={profile.studentId}
                    className="w-full p-2 rounded-lg border border-input bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž¢áŸŠáž¸áž˜áŸ‚áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2 rounded-lg border border-input bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž›áŸážáž‘áž¼ážšážŸáŸáž–áŸ’áž‘</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" size="sm" className="w-full">
                    ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž–áŸážáŸŒáž˜áž¶áž“
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-foreground">áž”áŸ’ážáž¼ážšáž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹</h3>
              <form className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“</label>
                  <input
                    type="password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸</label>
                  <input
                    type="password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹ážáŸ’áž˜áž¸</label>
                  <input
                    type="password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="pt-2">
                  <Button type="button" variant="outline" size="sm" className="w-full">
                    áž’áŸ’ážœáž¾áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“áž—áž¶áž–áž–áž¶áž€áŸ’áž™ážŸáž˜áŸ’áž„áž¶ážáŸ‹
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

