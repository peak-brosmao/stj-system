"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    orgName: "Senior Teaching Junior (STJ)",
    institution: "Institute of Technology of Cambodia (ITC)",
    academicYear: "2026-2027",
    currentSemester: "Semester 1",
    warningThreshold: "75",
    formula: "(Present + Late) / (Total - Excused) * 100%",
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            áž€áž¶ážšáž€áŸ†ážŽážáŸ‹áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‘áž¼áž‘áŸ… (System Settings)
          </h1>
          <p className="text-xs text-muted-foreground">
            áž€áŸ†ážŽážáŸ‹ážˆáŸ’áž˜áŸ„áŸ‡ážŸáŸ’ážáž¶áž”áŸáž“ áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áž“áž·áž„áž€áŸ’áž”áž½áž“áž‚ážŽáž“áž¶ážœážáŸ’ážáž˜áž¶áž“
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáž€áŸ’ážŸáž¶áž‘áž»áž€ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™áŸ”</span>
          </div>
        )}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    ážˆáŸ’áž˜áŸ„áŸ‡áž¢áž„áŸ’áž‚áž—áž¶áž– / áž€áž˜áŸ’áž˜ážœáž·áž’áž¸
                  </label>
                  <input
                    type="text"
                    value={settings.orgName}
                    onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    ážŸáŸ’ážáž¶áž”áŸáž“áž˜áŸ
                  </label>
                  <input
                    type="text"
                    value={settings.institution}
                    onChange={(e) => setSettings({ ...settings, institution: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    áž†áž˜áž¶ážŸáž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“
                  </label>
                  <input
                    type="text"
                    value={settings.currentSemester}
                    onChange={(e) => setSettings({ ...settings, currentSemester: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-foreground">
                  áž€áž˜áŸ’ážšáž·ážáž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“áž¢áž”áŸ’áž”áž”ážšáž˜áž¶ (%) ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž€áž¶ážšáž–áŸ’ážšáž˜áž¶áž“
                </label>
                <input
                  type="number"
                  value={settings.warningThreshold}
                  onChange={(e) => setSettings({ ...settings, warningThreshold: e.target.value })}
                  className="w-full sm:w-48 p-2.5 rounded-lg border border-input bg-background"
                />
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-foreground">
                  ážšáž¼áž”áž˜áž“áŸ’ážáž‚ážŽáž“áž¶áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš (Fixed Institutional Formula)
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.formula}
                  className="w-full p-2.5 rounded-lg border border-input bg-muted text-muted-foreground font-mono"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  ážšáž¼áž”áž˜áž“áŸ’ážáž‚ážŽáž“áž¶ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áŸ†ážŽážáŸ‹áž‡áž¶áž›áž€áŸ’ážážŽáŸˆážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš ážŠáŸ„áž™áž›áž¾áž€áž›áŸ‚áž„áž˜áŸ‰áŸ„áž„ážŸáž»áŸ†áž…áŸ’áž”áž¶áž”áŸ‹ (Excused) áž…áŸáž‰áž–áž¸áž—áž¶áž‚áž”áŸ‚áž„áŸ”
                </p>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <Button type="submit" size="sm" className="space-x-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž€áž¶ážšáž€áŸ†ážŽážáŸ‹</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

