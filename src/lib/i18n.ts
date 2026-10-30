import kmMessages from "@/messages/km.json";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import { Locale } from "@/types";

export const DEFAULT_LOCALE: Locale = "km";

export const translations: Record<Locale, typeof kmMessages> = {
  km: kmMessages,
  en: enMessages,
  fr: frMessages,
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE) {
  return translations[locale] || translations[DEFAULT_LOCALE];
}

export function translate(
  locale: Locale,
  path: string,
  params?: Record<string, string | number>
): string {
  const dict = getDictionary(locale);
  const keys = path.split(".");
  let current: unknown = dict;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  if (typeof current !== "string") {
    return path;
  }

  let result = current;
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${key}}`, "g"), String(val));
    }
  }

  return result;
}

