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
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

export default function PortalNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      category: "CORRECTION",
      title: "ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž¢áž“áž»áž˜áŸáž",
      message: "ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážœáž‚áŸ’áž‚áž‘áž¸áŸ¡ áž“áŸƒáž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ MATH101 ážáŸ’ážšáž¼ážœáž”áž¶áž“áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž“áž»áž˜áŸážážšáž½áž…ážšáž¶áž›áŸ‹áŸ” áž¢ážáŸ’ážšáž¶ážœážáŸ’ážáž˜áž¶áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž¡áž¾áž„ážŠáž›áŸ‹ 100%áŸ”",
      date: "áŸ¡áŸ¤ ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦ â€¢ 10:30 AM",
      link: "/portal/attendance",
      isRead: false,
    },
    {
      id: "n-2",
      category: "SESSION",
      title: "áž€áž¶áž›ážœáž·áž—áž¶áž‚ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“áž”áž“áŸ’áž‘áž¶áž”áŸ‹ (PROG101)",
      message: "ážœáž‚áŸ’áž‚áž‘áž¸áŸ¤ ážŸáŸ’ážáž¸áž–áž¸ Binary Search Trees & Recursion áž“áž¹áž„áž”áŸ’ážšáž–áŸ’ážšáž¹ážáŸ’ážáž‘áŸ…áž“áŸ…ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ áŸ áŸ§ ážœáž·áž…áŸ’áž†áž·áž€áž¶ ážœáŸáž›áž¶áž˜áŸ‰áŸ„áž„ áŸ áŸ¨:áŸ áŸ  áž–áŸ’ážšáž¹áž€ áž“áŸ…áž”áž“áŸ’áž‘áž”áŸ‹ SF1áŸ”",
      date: "áŸ¢áŸ¨ ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦ â€¢ 09:15 AM",
      link: "/portal/schedule",
      isRead: false,
    },
    {
      id: "n-3",
      category: "SECURITY",
      title: "áž€áž¶ážšáž…áž¼áž›áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž‚ážŽáž“áž¸áž–áž¸áž§áž”áž€ážšážŽáŸážáŸ’áž˜áž¸",
      message: "áž‚ážŽáž“áž¸ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážáŸ’ážšáž¼ážœáž”áž¶áž“áž…áž¼áž›áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™ážáž¶áž˜ážšáž™áŸˆ Google Chrome áž›áž¾áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš WindowsáŸ”",
      date: "áŸ£áŸ  ážáž»áž›áž¶ áŸ¢áŸ áŸ¢áŸ¦ â€¢ 06:12 PM",
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
                áž€áž¶ážšáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Notifications)
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {unreadCount} ážáŸ’áž˜áž¸
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
                <span>ážŸáž˜áŸ’áž‚áž¶áž›áŸ‹áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážáž¶áž”áž¶áž“áž¢áž¶áž“</span>
              </Button>
            )}
            <Link href="/portal/settings">
              <Button variant="ghost" size="sm" className="text-xs">
                áž€áŸ†ážŽážáŸ‹áž€áž¶ážšáž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„
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
            áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "UNREAD" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            áž˜áž·áž“áž‘áž¶áž“áŸ‹áž¢áž¶áž“ ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("CORRECTION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "CORRECTION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            áž›áž‘áŸ’áž’áž•áž›áž€áŸ‚ážœážáŸ’ážáž˜áž¶áž“
          </button>
          <button
            onClick={() => setFilter("SESSION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SESSION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“
          </button>
          <button
            onClick={() => setFilter("SECURITY")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SECURITY" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–
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
                      <span>áž–áž·áž“áž·ážáŸ’áž™áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·áž</span>
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
                    áž¢áž¶áž“ážšáž½áž…
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

