"use client";

import React, { useState } from "react";
import { Megaphone, Plus, Calendar, Globe, X } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SystemAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: "a1",
      titleKh: "ការដាក់ឱ្យដំណើរការជាផ្លូវការនូវប្រព័ន្ធគ្រប់គ្រងវត្តមាន STJ ឌីជីថល",
      contentKh: "ប្រព័ន្ធឌីជីថលថ្មីជំនួសឱ្យការស្រង់វត្តមានលើក្រដាស និងផ្តល់នូវតំណភ្ជាប់ចែករំលែករបាយការណ៍វត្តមានប្រកបដោយសុវត្ថិភាព។",
      scope: "GLOBAL",
      date: "2026-10-30",
      published: true,
    },
    {
      id: "a2",
      titleKh: "កាលវិភាគបង្រៀនមុខវិជ្ជាស្នូល ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      contentKh: "សេចក្តីជូនដំណឹងស្តីពីកាលវិភាគថ្នាក់រៀនមុខវិជ្ជា Programming, Mathematics, Physics និង Chemistry នៅ ITC Campus 1។",
      scope: "GLOBAL",
      date: "2026-10-14",
      published: true,
    },
  ]);

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Bulletin</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សេចក្តីជូនដំណឹងទូទៅ (Announcements)
            </h1>
            <p className="text-xs text-muted-foreground">
              ផ្សព្វផ្សាយដំណឹងផ្លូវការទៅកាន់សមាជិក និងប្រធានមុខវិជ្ជាទាំងអស់
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold uppercase text-primary">
                      {a.scope}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="text-base font-bold text-foreground">{a.titleKh}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.contentKh}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

