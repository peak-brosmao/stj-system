import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standard STJ Attendance Rate Calculation Formula:
 * (Present + Late) / (Total Sessions - Excused) * 100%
 * Excused sessions are exempt from denominator.
 */
export function calculateAttendanceRate(
  present: number,
  late: number,
  total: number,
  excused: number
): number {
  const eligibleSessions = total - excused;
  if (eligibleSessions <= 0) return 100;
  const rate = ((present + late) / eligibleSessions) * 100;
  return Math.min(100, Math.max(0, Math.round(rate * 10) / 10));
}

export function formatDate(date: Date | string, locale: string = "km"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Phnom_Penh",
  };

  const localeMap: Record<string, string> = {
    km: "km-KH",
    en: "en-US",
    fr: "fr-FR",
  };

  return new Intl.DateTimeFormat(localeMap[locale] || "km-KH", options).format(d);
}

export function formatTime(time: string): string {
  if (!time) return "-";
  return time;
}

