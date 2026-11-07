"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

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
    <PortalLayout portalType="system" userRole="Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ (President)" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¸â€¦ (System Settings)
          </h1>
          <p className="text-xs text-muted-foreground">
            Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸ÂÃ¡Å¾â€œ Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¸â€</span>
          </div>
        )}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1.5 text-foreground">
                    Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Â¢Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“ / Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€™Ã¡Å¾Â¸
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
                    Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¾ËœÃ¡Å¸Â
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
                    Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ
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
                    Ã¡Å¾â€ Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ
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
                  Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¾Â¶ (%) Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ
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
                  Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾ËœÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å¡ (Fixed Institutional Formula)
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.formula}
                  className="w-full p-2.5 rounded-lg border border-input bg-muted text-muted-foreground font-mono"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾ËœÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å¡ Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€ºÃ¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾â€ºÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€žÃ¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹ (Excused) Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¸â€šÃ¡Å¾â€žÃ¡Å¸â€
                </p>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <Button type="submit" size="sm" className="space-x-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

