"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Calendar, Globe, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-4 h-4" />
              <span>សេចក្តីជូនដំណឹងមុខវិជ្ជា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សេចក្តីជូនដំណឹង (Course Announcements)
            </h1>
            <p className="text-xs text-muted-foreground">
              សេចក្តីប្រកាសព័ត៌មានពីគណៈគ្រប់គ្រង STJ ជូនដល់ប្រធានមុខវិជ្ជា
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
            ផ្ទុកឡើងវិញ
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            កំពុងទាញយកសេចក្តីជូនដំណឹងពី Database...
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-xs">
              ពុំទាន់មានសេចក្តីជូនដំណឹងថ្មីនៅក្នុងប្រព័ន្ធនៅឡើយទេ។
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
