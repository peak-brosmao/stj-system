"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/types";
import { getDictionary, DEFAULT_LOCALE, translate } from "@/lib/i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  dict: ReturnType<typeof getDictionary>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const saved = localStorage.getItem("stj_locale") as Locale;
    if (saved && (saved === "km" || saved === "en" || saved === "fr")) {
      setLocaleState(saved);
      document.cookie = `stj_locale=${saved}; path=/; max-age=31536000`;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("stj_locale", newLocale);
    document.cookie = `stj_locale=${newLocale}; path=/; max-age=31536000`;
  };

  const t = (path: string, params?: Record<string, string | number>) => {
    return translate(locale, path, params);
  };

  const dict = getDictionary(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
