"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            ការកំណត់ប្រព័ន្ធទូទៅ (System Settings)
          </h1>
          <p className="text-xs text-muted-foreground">
            កំណត់ឈ្មោះស្ថាប័ន ឆ្នាំសិក្សា និងក្បួនគណនាវត្តមាន
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ។</span>
          </div>
        )}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    ឈ្មោះអង្គភាព / កម្មវិធី
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
                    ស្ថាប័នមេ
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
                    ឆ្នាំសិក្សាបច្ចុប្បន្ន
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
                    ឆមាសបច្ចុប្បន្ន
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
                  កម្រិតអត្រាវត្តមានអប្បបរមា (%) សម្រាប់ការព្រមាន
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
                  រូបមន្តគណនាអត្រាវត្តមានស្តង់ដារ (Fixed Institutional Formula)
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.formula}
                  className="w-full p-2.5 rounded-lg border border-input bg-muted text-muted-foreground font-mono"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  រូបមន្តគណនាត្រូវបានកំណត់ជាលក្ខណៈស្តង់ដារ ដោយលើកលែងម៉ោងសុំច្បាប់ (Excused) ចេញពីភាគបែង។
                </p>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <Button type="submit" size="sm" className="space-x-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>រក្សាទុកការកំណត់</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

