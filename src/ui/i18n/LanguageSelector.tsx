"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/ui/i18n/I18nProvider";
import { Locale } from "@/types";

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  const options: Array<{ code: Locale; label: string }> = [
    { code: "km", label: "ខ្មែរ" },
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
  ];

  return (
    <div className="flex items-center space-x-1 border border-border bg-card rounded-lg p-1 text-xs font-medium">
      <Globe className="w-3.5 h-3.5 ml-1 mr-0.5 text-muted-foreground" />
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLocale(opt.code)}
          className={`px-2 py-1 rounded transition-colors ${
            locale === opt.code
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
