"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  CalendarCheck,
  Megaphone,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PortalNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      category: "CORRECTION",
      title: "សំណើកែតម្រូវវត្តមានត្រូវបានអនុម័ត",
      message: "សំណើកែតម្រូវវត្តមានសម្រាប់វគ្គទី១ នៃមុខវិជ្ជា MATH101 ត្រូវបានគណៈគ្រប់គ្រងអនុម័តរួចរាល់។ អត្រាវត្តមានរបស់អ្នកឡើងដល់ 100%។",
      date: "១៤ តុលា ២០២៦ • 10:30 AM",
      link: "/portal/attendance",
      isRead: false,
    },
    {
      id: "n-2",
      category: "SESSION",
      title: "កាលវិភាគវគ្គបង្រៀនបន្ទាប់ (PROG101)",
      message: "វគ្គទី៤ ស្តីពី Binary Search Trees & Recursion នឹងប្រព្រឹត្តទៅនៅថ្ងៃសៅរ៍ ០៧ វិច្ឆិកា វេលាម៉ោង ០៨:០០ ព្រឹក នៅបន្ទប់ SF1។",
      date: "២៨ តុលា ២០២៦ • 09:15 AM",
      link: "/portal/schedule",
      isRead: false,
    },
    {
      id: "n-3",
      category: "SECURITY",
      title: "ការចូលប្រើប្រាស់គណនីពីឧបករណ៍ថ្មី",
      message: "គណនីរបស់អ្នកត្រូវបានចូលប្រើប្រាស់ដោយជោគជ័យតាមរយៈ Google Chrome លើប្រព័ន្ធប្រតិបត្តិការ Windows។",
      date: "៣០ តុលា ២០២៦ • 06:12 PM",
      link: "/portal/security",
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.isRead;
    return n.category === filter;
  });

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Personalized Notification Center</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                ការជូនដំណឹង (Notifications)
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {unreadCount} ថ្មី
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="space-x-1.5 text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>សម្គាល់ទាំងអស់ថាបានអាន</span>
              </Button>
            )}
            <Link href="/portal/settings">
              <Button variant="ghost" size="sm" className="text-xs">
                កំណត់ការជូនដំណឹង
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ទាំងអស់ ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "UNREAD" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            មិនទាន់អាន ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("CORRECTION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "CORRECTION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            លទ្ធផលកែវត្តមាន
          </button>
          <button
            onClick={() => setFilter("SESSION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SESSION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            វគ្គបង្រៀន
          </button>
          <button
            onClick={() => setFilter("SECURITY")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SECURITY" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            សុវត្ថិភាព
          </button>
        </div>

        {/* Notification Cards */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className={`transition-all ${
                !item.isRead ? "border-primary/50 bg-primary/[0.02]" : "border-border"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{item.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                    {item.message}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={item.link}
                      onClick={() => markAsRead(item.id)}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>ពិនិត្យព័ត៌មានលម្អិត</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {!item.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(item.id)}
                    className="text-[11px] text-muted-foreground hover:text-foreground shrink-0"
                  >
                    អានរួច
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

