"use client";

import React, { useState } from "react";
import { Sliders, Bell, Globe, Moon, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { LanguageSelector } from "@/ui/i18n/LanguageSelector";

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
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences & Notification Policies</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            áž€áž¶ážšáž€áŸ†ážŽážáŸ‹áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ (Settings)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            áž€áŸ†ážŽážáŸ‹áž‡áž˜áŸ’ážšáž¾ážŸáž“áŸƒáž€áž¶ážšáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ áž“áž·áž„áž€áž¶ážšáž”áž„áŸ’áž áž¶áž‰áž‘áž·áž“áŸ’áž“áž“áŸáž™áž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ STJ
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáž€áŸ’ážŸáž¶áž‘áž»áž€ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™</span>
          </div>
        )}

        {/* Notification preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>áž€áž¶ážšáž€áŸ†ážŽážáŸ‹áž€áž¶ážšáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Notification Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "stjAnnouncements", label: "ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž‘áž¼áž‘áŸ… STJ (STJ Global Announcements)", desc: "áž‘áž‘áž½áž›áž”áž¶áž“áž€áž¶ážšáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž–áŸáž›áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážšáž€áž¶ážŸáž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážšáž–áž¸áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„" },
                { key: "courseAnnouncements", label: "ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ (Course Notices)", desc: "áž‘áž‘áž½áž›áž”áž¶áž“ážŠáŸ†ážŽáž¹áž„áž–áž¸áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜áž›áž¾áž€áž·áž…áŸ’áž…áž€áž¶ážš áž“áž·áž„áž¯áž€ážŸáž¶ážšážšáŸ€áž“ážŸáž¼ážáŸ’ážš" },
                { key: "newSessions", label: "ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ážáŸ’áž˜áž¸ (New Session Scheduling)", desc: "ážšáŸ†áž›áž¹áž€áž–áŸáž›áž˜áž¶áž“áž€áž¶ážšáž”áž„áŸ’áž€áž¾ážážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“ážáŸ’áž˜áž¸áž€áŸ’áž“áž»áž„áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž€áŸ†áž–áž»áž„ážšáŸ€áž“" },
                { key: "scheduleChanges", label: "áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž€áž¶áž›ážœáž·áž—áž¶áž‚ (Schedule & Room Changes)", desc: "áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž”áž“áŸ’áž‘áž¶áž“áŸ‹áž–áŸáž›áž˜áž¶áž“áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž˜áŸ‰áŸ„áž„ áž¬áž”áž“áŸ’áž‘áž”áŸ‹ážšáŸ€áž“" },
                { key: "attendanceCorrections", label: "áž›áž‘áŸ’áž’áž•áž›áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ (Attendance Correction Updates)", desc: "áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž—áŸ’áž›áž¶áž˜áŸ—áž“áŸ…áž–áŸáž›áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž“áž»áž˜áŸážážŸáŸ†ážŽáž¾áž€áŸ‚áž”áŸ’ážšáŸ‚" },
                { key: "profileCorrections", label: "áž›áž‘áŸ’áž’áž•áž›áž€áŸ‚áž‘áž·áž“áŸ’áž“áž“áŸáž™áž•áŸ’áž›áž¼ážœáž€áž¶ážš (Profile Correction Approvals)", desc: "áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž–áŸáž›áž€áž¶ážšáž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›ážˆáŸ’áž˜áŸ„áŸ‡ áž¬áž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽážáŸ’ážšáž¼ážœáž”áž¶áž“áž¢áž“áž»áž˜áŸáž" },
                { key: "emailNotifications", label: "áž•áŸ’áž‰áž¾áž¢áŸŠáž¸áž˜áŸ‚áž›ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Email Delivery)", desc: "áž•áŸ’áž‰áž¾ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ážŸáŸ†ážáž¶áž“áŸ‹áŸ—áž‘áŸ…áž€áž¶áž“áŸ‹áž¢áŸŠáž¸áž˜áŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€" },
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
                <span>ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž‡áž˜áŸ’ážšáž¾ážŸáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interface Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>áž€áž¶ážšáž€áŸ†ážŽážáŸ‹áž€áž¶ážšáž”áž„áŸ’áž áž¶áž‰ (Interface Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">áž—áž¶ážŸáž¶ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹ (System Language)</p>
                <p className="text-[11px] text-muted-foreground">áž”áŸ’ážáž¼ážšážšážœáž¶áž„áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš (Default) áž¢áž„áŸ‹áž‚áŸ’áž›áŸážŸ áž“áž·áž„áž”áž¶ážšáž¶áŸ†áž„</p>
              </div>
              <LanguageSelector />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">ážšáž¼áž”ážšáž¶áž„áž–áž“áŸ’áž›ážº / áž„áž„áž¹áž (Theme)</p>
                <p className="text-[11px] text-muted-foreground">áž”áŸ’ážáž¼ážšážšážœáž¶áž„ Dark Mode áž“áž·áž„ Light Mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

