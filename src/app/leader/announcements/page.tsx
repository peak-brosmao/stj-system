"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Calendar, Globe, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";

interface AnnouncementItem {
  id: string;
  titleKh: string;
  contentKh: string;
  scope: string;
  date: string;
  course?: string | null;
}

export default function LeaderAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = () => {
    setLoading(true);
    fetch("/api/system/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) {
          setAnnouncements(data.announcements);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="áž›áž¶áž„ áž‡áž¸áž„áž áŸáž„"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-4 h-4" />
              <span>ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Course Announcements)
            </h1>
            <p className="text-xs text-muted-foreground">
              ážŸáŸáž…áž€áŸ’ážáž¸áž”áŸ’ážšáž€áž¶ážŸáž–áŸážáŸŒáž˜áž¶áž“áž–áž¸áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ áž‡áž¼áž“ážŠáž›áŸ‹áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnnouncements}
            disabled={loading}
            className="text-xs self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            áž•áŸ’áž‘áž»áž€áž¡áž¾áž„ážœáž·áž‰
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            áž€áŸ†áž–áž»áž„áž‘áž¶áž‰áž™áž€ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž–áž¸ Database...
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-xs">
              áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ážáŸ’áž˜áž¸áž“áŸ…áž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž“áŸ…áž¡áž¾áž™áž‘áŸáŸ”
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((n) => (
              <Card key={n.id} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="font-mono">{n.date}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {n.scope}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{n.titleKh}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {n.contentKh}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
