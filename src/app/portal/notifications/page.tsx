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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export default function PortalNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      category: "CORRECTION",
      title: "Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾Â",
      message: "Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¸Â¡ Ã¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ MATH101 Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€¦Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¸â€ Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å Ã¡Å¾â€ºÃ¡Å¸â€¹ 100%Ã¡Å¸â€",
      date: "Ã¡Å¸Â¡Ã¡Å¸Â¤ Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦ Ã¢â‚¬Â¢ 10:30 AM",
      link: "/portal/attendance",
      isRead: false,
    },
    {
      id: "n-2",
      category: "SESSION",
      title: "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹ (PROG101)",
      message: "Ã¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¸Â¤ Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€“Ã¡Å¾Â¸ Binary Search Trees & Recursion Ã¡Å¾â€œÃ¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€˜Ã¡Å¸â€¦Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¸Æ’Ã¡Å¾Å¸Ã¡Å¸â€¦Ã¡Å¾Å¡Ã¡Å¸Â Ã¡Å¸Â Ã¡Å¸Â§ Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€ Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Â¶ Ã¡Å¾Å“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¸â€žÃ¡Å¾â€ž Ã¡Å¸Â Ã¡Å¸Â¨:Ã¡Å¸Â Ã¡Å¸Â  Ã¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾â‚¬ Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾â€Ã¡Å¸â€¹ SF1Ã¡Å¸â€",
      date: "Ã¡Å¸Â¢Ã¡Å¸Â¨ Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦ Ã¢â‚¬Â¢ 09:15 AM",
      link: "/portal/schedule",
      isRead: false,
    },
    {
      id: "n-3",
      category: "SECURITY",
      title: "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾Â§Ã¡Å¾â€Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸",
      message: "Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Å¡Ã¡Å¾â„¢Ã¡Å¸Ë† Google Chrome Ã¡Å¾â€ºÃ¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ WindowsÃ¡Å¸â€",
      date: "Ã¡Å¸Â£Ã¡Å¸Â  Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦ Ã¢â‚¬Â¢ 06:12 PM",
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
                Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž (Notifications)
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {unreadCount} Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸
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
                <span>Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€œ</span>
              </Button>
            )}
            <Link href="/portal/settings">
              <Button variant="ghost" size="sm" className="text-xs">
                Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€ž
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
            Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾Â¢Ã¡Å¾Å¸Ã¡Å¸â€¹ ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "UNREAD" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€œ ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("CORRECTION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "CORRECTION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ã¡Å¾â€ºÃ¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€¢Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ
          </button>
          <button
            onClick={() => setFilter("SESSION")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SESSION" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ã¡Å¾Å“Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€šÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ
          </button>
          <button
            onClick={() => setFilter("SECURITY")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "SECURITY" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“
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
                      <span>Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â·Ã¡Å¾Â</span>
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
                    Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€¦
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

