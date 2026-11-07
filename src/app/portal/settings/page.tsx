"use client";

import React, { useState } from "react";
import { Sliders, Bell, Globe, Moon, Save, CheckCircle2 } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
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
            Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â½Ã¡Å¾â€œ (Settings)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™ STJ
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢</span>
          </div>
        )}

        {/* Notification preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž (Notification Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "stjAnnouncements", label: "Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¸â€¦ STJ (STJ Global Announcements)", desc: "Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€ž" },
                { key: "courseAnnouncements", label: "Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ (Course Notices)", desc: "Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾ËœÃ¡Å¾â€ºÃ¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Â¯Ã¡Å¾â‚¬Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡" },
                { key: "newSessions", label: "Ã¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸ (New Session Scheduling)", desc: "Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€ºÃ¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ" },
                { key: "scheduleChanges", label: "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€š (Schedule & Room Changes)", desc: "Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€žÃ¡Å¾â€ž Ã¡Å¾Â¬Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ" },
                { key: "attendanceCorrections", label: "Ã¡Å¾â€ºÃ¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€¢Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Attendance Correction Updates)", desc: "Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¸â€”Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€š" },
                { key: "profileCorrections", label: "Ã¡Å¾â€ºÃ¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€¢Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ (Profile Correction Approvals)", desc: "Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡ Ã¡Å¾Â¬Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Â" },
                { key: "emailNotifications", label: "Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¾Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž (Email Delivery)", desc: "Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¸â€”Ã¡Å¾â€˜Ã¡Å¸â€¦Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬" },
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
                <span>Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾â€¡Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interface Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€° (Interface Preferences)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹ (System Language)</p>
                <p className="text-[11px] text-muted-foreground">Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾Â¶Ã¡Å¾â€žÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡ (Default) Ã¡Å¾Â¢Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾Å¸ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž</p>
              </div>
              <LanguageSelector />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Âº / Ã¡Å¾â€žÃ¡Å¾â€žÃ¡Å¾Â¹Ã¡Å¾Â (Theme)</p>
                <p className="text-[11px] text-muted-foreground">Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾Â¶Ã¡Å¾â€ž Dark Mode Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€ž Light Mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

