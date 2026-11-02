"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Megaphone, Calendar, Tag, ChevronRight } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PortalAnnouncementsPage() {
  const announcements = [
    {
      id: "ann-1",
      title: "កាលវិភាគពិនិត្យកូដ C++ និងអនុវត្តជាក់ស្តែងក្នុងបន្ទប់កុំព្យូទ័រ",
      scope: "PROG101",
      date: "២០ តុលា ២០២៦",
      author: "លាង ជីងហេង (Programming Leader)",
      content:
        "សូមជម្រាបជូនសមាជិកសិក្សាទាំងអស់ក្នុងមុខវិជ្ជា PROG101 ឱ្យបានជ្រាបថា នៅថ្ងៃសៅរ៍ខាងមុខនេះ ក្រុមយើងនឹងរៀបចំវគ្គអនុវត្តផ្ទាល់លើ Dynamic Memory និង Linked List នៅក្នុងបន្ទប់ SF1។ សូមត្រៀមកុំព្យូទ័រយួរដៃឱ្យបានរួចរាល់។",
    },
    {
      id: "ann-2",
      title: "ការចែករំលែកវិញ្ញាសាប្រឡងឆមាសឆ្នាំមុនសម្រាប់និស្សិតវិស្វកម្ម I2",
      scope: "STJ General",
      date: "១៨ តុលា ២០២៦",
      author: "ផល ដាវីត (STJ President)",
      content:
        "គណៈដឹកនាំ STJ បានប្រមូលចងក្រងវិញ្ញាសា និងដំណោះស្រាយលំហាត់ប្រឡង Calculus & Differential Equations ឆ្នាំសិក្សាមុនៗ សម្រាប់ជាឯកសារជំនួយស្មារតីដល់និស្សិតជំនាន់ក្រោយ។ សមាជិកអាចទាញយកតាមរយៈតំណភ្ជាប់ចែករំលែកក្នុងប្រព័ន្ធ។",
    },
    {
      id: "ann-3",
      title: "សេចក្តីជូនដំណឹងស្តីពីវិន័យ និងការស្រង់វត្តមានផ្លូវការឆ្នាំ២០២៦~២០២៧",
      scope: "STJ Administration",
      date: "១០ តុលា ២០២៦",
      author: "គណៈគ្រប់គ្រង STJ កណ្តាល",
      content:
        "រាល់ការស្រង់វត្តមានត្រូវធ្វើឡើងយ៉ាងតឹងរ៉ឹងដោយផ្អែកលើរូបមន្តស្តង់ដារ (Present + Late)/(Total - Excused) * 100%។ និស្សិតដែលមានអវត្តមានលើសពី ៣ ដងដោយគ្មានច្បាប់អនុញ្ញាត នឹងត្រូវកោះហៅដើម្បីពិនិត្យលទ្ធភាពបន្តការសិក្សា។",
    },
  ];

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName="ពៀក ប្រុសម៉ៅ"
      userMemberId="STJ033"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Academic Bulletin & STJ Notices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            សេចក្តីជូនដំណឹងផ្លូវការ (Official Announcements)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            សេចក្តីប្រកាសព័ត៌មានពីគណៈគ្រប់គ្រង STJ និងប្រធានមុខវិជ្ជាទទួលបន្ទុក
          </p>
        </div>

        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {a.scope}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{a.date}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">ប្រកាសដោយ៖ <strong className="text-foreground">{a.author}</strong></span>
                </div>

                <h3 className="font-bold text-base text-foreground">{a.title}</h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

