"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, GraduationCap, ShieldCheck, Heart } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card/60 text-foreground transition-colors duration-300 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <Logo href="/" size="md" subtitle="វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("common.programFullName")} នៃ {t("common.institution")}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              គំនិតផ្តួចផ្តើមអប់រំផ្ទេរចំណេះដឹងវិស្វកម្មពីនិស្សិតរៀមច្បងជូននិស្សិតប្អូនៗ ដើម្បីលើកកម្ពស់គុណភាពសិក្សា ការសរសេរកូដ គណិតវិទ្យា និងវិទ្យាសាស្ត្រពិត។
            </p>
          </div>

          {/* Col 2: Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-foreground">
              {t("nav.programs")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/programs/programming" className="hover:text-primary transition-colors">
                  {t("courses.programming")}
                </Link>
              </li>
              <li>
                <Link href="/programs/mathematics" className="hover:text-primary transition-colors">
                  {t("courses.mathematics")}
                </Link>
              </li>
              <li>
                <Link href="/programs/physics" className="hover:text-primary transition-colors">
                  {t("courses.physics")}
                </Link>
              </li>
              <li>
                <Link href="/programs/chemistry" className="hover:text-primary transition-colors">
                  {t("courses.chemistry")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-foreground">
              រុករកប្រព័ន្ធ (Navigation)
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/structure" className="hover:text-primary transition-colors font-semibold text-primary">
                  {t("nav.structure")} (Organization Tree)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-primary transition-colors">
                  {t("nav.activities")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">
                  {t("nav.news")}
                </Link>
              </li>
              <li>
                <Link href="/portal/login" className="hover:text-primary transition-colors">
                  ច្រកចូលប្រព័ន្ធ (Sign In)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Liaison & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-foreground">
              {t("nav.contact")}
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>មហាវិថីសហព័ន្ធរុស្ស៊ី, សង្កាត់ទឹកល្អក់១, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>stj@itc.edu.kh</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>+855 (0)23 880 370</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://itc.edu.kh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-primary hover:underline font-medium"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC Official)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} Senior Teaching Junior (STJ) • វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)</p>
          <p className="text-[11px]">ប្រព័ន្ធគ្រប់គ្រងការសិក្សា និងវត្តមានផ្លូវការ សម្រាប់និស្សិត និងសមាជិក</p>
        </div>
      </div>
    </footer>
  );
}
