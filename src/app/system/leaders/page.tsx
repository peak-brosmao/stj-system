"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, BookOpen, Shield, Plus, X } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface LeaderItem {
  id: string;
  fullNameKh: string;
  fullNameEn: string;
  email: string;
  phone?: string | null;
  studentId?: string | null;
  status: string;
  courses: string[];
}

export default function SystemLeadersPage() {
  const [leaders, setLeaders] = useState<LeaderItem[]>([
    {
      id: "l1",
      fullNameKh: "លាង ជីងហេង",
      fullNameEn: "LEANG JINGHENG",
      email: "leang.jingheng@itc.edu.kh",
      phone: "0976355500",
      studentId: "e20240704",
      status: "ACTIVE",
      courses: ["PROG101 - Programming & Algorithmic Thinking"],
    },
    {
      id: "l2",
      fullNameKh: "គឹម រតនៈ",
      fullNameEn: "KIM Ratanak",
      email: "kim.ratanak@itc.edu.kh",
      phone: "010650202",
      studentId: "e20221423",
      status: "ACTIVE",
      courses: ["MATH101 - Engineering Mathematics"],
    },
    {
      id: "l3",
      fullNameKh: "គ្រុយ អីុខាង",
      fullNameEn: "KRUY Ykhang",
      email: "kruy.ykhang@itc.edu.kh",
      phone: "0968925682",
      studentId: "e20240096",
      status: "ACTIVE",
      courses: ["PHYS101 - Engineering Physics"],
    },
    {
      id: "l4",
      fullNameKh: "ខេង លីឧស្សាហ៍",
      fullNameEn: "KHENG Lyussa",
      email: "kheng.lyussa@itc.edu.kh",
      phone: "0974253117",
      studentId: "e20240046",
      status: "ACTIVE",
      courses: ["CHEM101 - General Chemistry"],
    },
    {
      id: "l5",
      fullNameKh: "ផល ដាវីត",
      fullNameEn: "PHAL David",
      email: "phal.david@itc.edu.kh",
      phone: "086439191",
      studentId: "e20221334",
      status: "ACTIVE",
      courses: ["STJ Leadership & Academic Coordination"],
    },
    {
      id: "l6",
      fullNameKh: "សុខ សេងលី",
      fullNameEn: "SOK SENGLY",
      email: "sok.sengly@itc.edu.kh",
      phone: "015399209",
      studentId: "e20230969",
      status: "ACTIVE",
      courses: ["Student Association Representative & Liaison"],
    },
  ]);

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Senior Tutors Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងប្រធានមុខវិជ្ជា (Course Leaders)
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីរៀមច្បងបង្រៀនប្អូន និងការចាត់តាំងមុខវិជ្ជាទទួលបន្ទុក
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaders.map((leader) => (
            <Card key={leader.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      {leader.fullNameEn.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{leader.fullNameKh}</h3>
                      <p className="text-xs text-muted-foreground">{leader.fullNameEn}</p>
                    </div>
                  </div>
                  <Badge variant="success">សកម្ម (Active)</Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{leader.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{leader.phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1.5">
                    មុខវិជ្ជាទទួលបន្ទុក (Assigned Courses):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {leader.courses.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

