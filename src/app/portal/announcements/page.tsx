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

export default function PortalAnnouncementsPage() {
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
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-3.5 h-3.5" />
              <span>ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ážŸáž·áž€áŸ’ážŸáž¶</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž•áŸ’áž›áž¼ážœáž€áž¶ážš (Official Announcements)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ážŸáŸáž…áž€áŸ’ážáž¸áž”áŸ’ážšáž€áž¶ážŸáž–áŸážáŸŒáž˜áž¶áž“áž–áž¸áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ áž“áž·áž„áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž‘áž½áž›áž”áž“áŸ’áž‘áž»áž€
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
            {announcements.map((a) => (
              <Card key={a.id} className="hover:border-primary/40 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {a.scope}
                      </span>
                      {a.course && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {a.course}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {a.date}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-foreground">{a.titleKh}</h3>

                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {a.contentKh}
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
