"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, GraduationCap, ShieldCheck, Heart } from "lucide-react";
import { useI18n } from "@/ui/i18n/I18nProvider";
import { Logo } from "@/ui/Logo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card/60 text-foreground transition-colors duration-300 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <Logo href="/" size="md" subtitle="Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("common.programFullName")} Ã¡Å¾â€œÃ¡Å¸Æ’ {t("common.institution")}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ã¡Å¾â€šÃ¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â½Ã¡Å¾â€¦Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾ËœÃ¡Å¾Â¢Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¸â€ Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾â€¡Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¸â€” Ã¡Å¾Å Ã¡Å¾Â¾Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¸Ã¡Å¾â€ºÃ¡Å¾Â¾Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¾Â»Ã¡Å¾Å½Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€
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
              Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™ (Navigation)
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
                  Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™ (Sign In)
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
                <span>Ã¡Å¾ËœÃ¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾Å¸Ã¡Å¾Â Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¸Å Ã¡Å¾Â¸, Ã¡Å¾Å¸Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€ºÃ¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¸Â¡, Ã¡Å¾ÂÃ¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾Å’Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€šÃ¡Å¸â€žÃ¡Å¾â‚¬, Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°</span>
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
                  <span>Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶ (ITC Official)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>Ã‚Â© {new Date().getFullYear()} Senior Teaching Junior (STJ) Ã¢â‚¬Â¢ Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶ (ITC)</p>
          <p className="text-[11px]">Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬</p>
        </div>
      </div>
    </footer>
  );
}
