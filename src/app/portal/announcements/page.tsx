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
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពៀក ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-3.5 h-3.5" />
              <span>សេចក្តីជូនដំណឹងសិក្សា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សេចក្តីជូនដំណឹងផ្លូវការ (Official Announcements)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              សេចក្តីប្រកាសព័ត៌មានពីគណៈគ្រប់គ្រង STJ និងប្រធានមុខវិជ្ជាទទួលបន្ទុក
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
