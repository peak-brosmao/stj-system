"use client";

import React, { useState } from "react";
import { Building2, Plus, CheckCircle, ShieldCheck } from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SystemDepartmentsPage() {
  const [departments] = useState([
    {
      code: "GIC",
      nameKh: "ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង",
      nameEn: "Department of Information and Communication Engineering",
      nameFr: "Génie Informatique et Communication",
      membersCount: 8,
    },
    {
      code: "GIM",
      nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មឧស្សាហកម្ម និងមេកានិក",
      nameEn: "Department of Industrial and Mechanical Engineering",
      nameFr: "Génie Industriel et Mécanique",
      membersCount: 8,
    },
    {
      code: "GCI",
      nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល",
      nameEn: "Department of Civil Engineering",
      nameFr: "Génie Civil",
      membersCount: 6,
    },
    {
      code: "GEE",
      nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មអគ្គិសនី និងថាមពល",
      nameEn: "Department of Electrical and Energy Engineering",
      nameFr: "Génie Électrique et Énergétique",
      membersCount: 5,
    },
    {
      code: "AMS",
      nameKh: "ដេប៉ាតឺម៉ង់ គណិតវិទ្យាអនុវត្ត និងស្ថិតិ",
      nameEn: "Department of Applied Mathematics and Statistics",
      nameFr: "Mathématiques Appliquées et Statistiques",
      membersCount: 4,
    },
    {
      code: "GAR",
      nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មជនបទ",
      nameEn: "Department of Rural Engineering",
      nameFr: "Génie Rural",
      membersCount: 4,
    },
    {
      code: "GCA",
      nameKh: "ដេប៉ាតឺម៉ង់ វិស្វកម្មសំណង់ស៊ីវិល និងក្សេត្រសាស្រ្ត",
      nameEn: "Department of Civil Engineering and Agronomy",
      nameFr: "Génie Civil et Agronomie",
      membersCount: 2,
    },
    {
      code: "GTI",
      nameKh: "ដេប៉ាតឺម៉ង់ បច្ចេកវិទ្យាព័ត៌មាន",
      nameEn: "Department of Information Technology",
      nameFr: "Génie Télécommunications et Informatique",
      membersCount: 1,
    },
    {
      code: "GTR",
      nameKh: "ដេប៉ាតឺម៉ង់ ទូរគមនាគមន៍ និងបណ្តាញ",
      nameEn: "Department of Telecommunication and Network",
      nameFr: "Génie Télécommunications et Réseaux",
      membersCount: 1,
    },
  ]);

  return (
    <PortalLayout portalType="system" userRole="Super Admin" userName="គណៈគ្រប់គ្រងកណ្តាល">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Building2 className="w-4 h-4" />
              <span>ITC Engineering Faculties</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងដេប៉ាតឺម៉ង់ (ITC Departments)
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីដេប៉ាតឺម៉ង់ផ្លូវការនៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">កូដ</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះជាភាសាខ្មែរ</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះជាភាសាអង់គ្លេស / បារាំង</th>
                  <th className="py-3 px-4 font-semibold text-center">សមាជិក</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.map((d) => (
                  <tr key={d.code} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{d.code}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{d.nameKh}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div>{d.nameEn}</div>
                      <div className="text-[10px] italic">{d.nameFr}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">{d.membersCount}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="success">សកម្ម</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

