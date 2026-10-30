"use client";

import React, { useState } from "react";
import { Sliders, Bell, Globe, Moon, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";

export default function PortalSettingsPage() {
  const [preferences, setPreferences] = useState({
    stjAnnouncements: true,
    courseAnnouncements: true,
    newSessions: true,
    scheduleChanges: true,
    attendanceCorrections: true,
    profileCorrections: true,
    emailNotifications: false,
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពាក់ ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences & Notification Policies</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            ការកំណត់ផ្ទាល់ខ្លួន (Settings)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            កំណត់ជម្រើសនៃការជូនដំណឹង និងការបង្ហាញទិន្នន័យក្នុងប្រព័ន្ធ STJ
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ</span>
          </div>
        )}

        {/* Notification preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>ការកំណត់ការជូនដំណឹង (Notification Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "stjAnnouncements", label: "សេចក្តីជូនដំណឹងទូទៅ STJ (STJ Global Announcements)", desc: "ទទួលបានការជូនដំណឹងពេលមានការប្រកាសព័ត៌មានផ្លូវការពីគណៈគ្រប់គ្រង" },
                { key: "courseAnnouncements", label: "សេចក្តីជូនដំណឹងមុខវិជ្ជា (Course Notices)", desc: "ទទួលបានដំណឹងពីប្រធានក្រុមលើកិច្ចការ និងឯកសាររៀនសូត្រ" },
                { key: "newSessions", label: "វគ្គបង្រៀនថ្មី (New Session Scheduling)", desc: "រំលឹកពេលមានការបង្កើតវគ្គបង្រៀនថ្មីក្នុងមុខវិជ្ជាកំពុងរៀន" },
                { key: "scheduleChanges", label: "ការផ្លាស់ប្តូរកាលវិភាគ (Schedule & Room Changes)", desc: "ជូនដំណឹងបន្ទាន់ពេលមានការផ្លាស់ប្តូរម៉ោង ឬបន្ទប់រៀន" },
                { key: "attendanceCorrections", label: "លទ្ធផលកែតម្រូវវត្តមាន (Attendance Correction Updates)", desc: "ជូនដំណឹងភ្លាមៗនៅពេលគណៈគ្រប់គ្រងអនុម័តសំណើកែប្រែ" },
                { key: "profileCorrections", label: "លទ្ធផលកែទិន្នន័យផ្លូវការ (Profile Correction Approvals)", desc: "ជូនដំណឹងពេលការកែសម្រួលឈ្មោះ ឬអត្តសញ្ញាណត្រូវបានអនុម័ត" },
                { key: "emailNotifications", label: "ផ្ញើអ៊ីមែលសេចក្តីជូនដំណឹង (Email Delivery)", desc: "ផ្ញើសេចក្តីជូនដំណឹងសំខាន់ៗទៅកាន់អ៊ីមែលស្ថាប័នរបស់អ្នក" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[item.key as keyof typeof preferences]}
                    onChange={() => toggle(item.key as keyof typeof preferences)}
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={handleSave} className="space-x-1.5 text-xs">
                <Save className="w-3.5 h-3.5" />
                <span>រក្សាទុកជម្រើសជូនដំណឹង</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interface Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>ការកំណត់ការបង្ហាញ (Interface Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">ភាសាដែលត្រូវប្រើប្រាស់ (System Language)</p>
                <p className="text-[11px] text-muted-foreground">ប្តូររវាងភាសាខ្មែរ (Default) អង់គ្លេស និងបារាំង</p>
              </div>
              <LanguageSelector />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">រូបរាងពន្លឺ / ងងឹត (Theme)</p>
                <p className="text-[11px] text-muted-foreground">ប្តូររវាង Dark Mode និង Light Mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
