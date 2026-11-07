"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Calendar, Globe, RefreshCw } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

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
              <span>Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ (Official Announcements)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€ž STJ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬
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
            Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€°
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¾Â¸ Database...
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-xs">
              Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¸â€
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
