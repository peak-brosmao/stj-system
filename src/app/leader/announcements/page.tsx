"use client";

import React from "react";
import { Megaphone, Calendar, Globe } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";

export default function LeaderAnnouncementsPage() {
  const notices = [
    {
      id: "a1",
      title: "ការដាក់ឱ្យដំណើរការប្រព័ន្ធគ្រប់គ្រង STJ និងការណែនាំចែករំលែកតំណភ្ជាប់វត្តមាន",
      date: "2026-10-30",
      content: "សូមជម្រាបជូនប្រធានមុខវិជ្ជាទាំងអស់ឱ្យបានជ្រាបថា ចាប់ពីសប្តាហ៍នេះតទៅ លោកអ្នកអាចបង្កើតតំណភ្ជាប់ចែករំលែក (Share Links) និងកូដ QR សម្រាប់ផ្ញើជូនសមាជិកដើម្បីពិនិត្យវត្តមានផ្លូវការ។",
    },
    {
      id: "a2",
      title: "ការបញ្ជូនសំណើកែតម្រូវវត្តមានរបស់សមាជិក",
      date: "2026-10-20",
      content: "រាល់ករណីនិស្សិតសុំច្បាប់ ឬមានកំហុសឆ្គងក្នុងការកត់ត្រា សូមប្រើប្រាស់មុខងារ 'ស្នើសុំកែតម្រូវ' នៅក្នុងទំព័រវត្តមាន។ គណៈគ្រប់គ្រងនឹងពិនិត្យអនុម័តក្នុងរយៈពេល ២៤ម៉ោង។",
    },
  ];

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Institutional Broadcasts</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            សេចក្តីជូនដំណឹង (Course Announcements)
          </h1>
          <p className="text-xs text-muted-foreground">
            សេចក្តីប្រកាសព័ត៌មានពីគណៈគ្រប់គ្រង STJ ជូនដល់ប្រធានមុខវិជ្ជា
          </p>
        </div>

        <div className="space-y-4">
          {notices.map((n) => (
            <Card key={n.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{n.date}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    STJ Bulletin
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground">{n.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

