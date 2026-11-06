/**
 * Bridge helper for connecting Next.js to the dedicated Laravel 13 MySQL Backend
 * Base URL: process.env.LARAVEL_API_URL || process.env.NEXT_PUBLIC_API_URL
 */

export const LARAVEL_API_BASE =
  process.env.LARAVEL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://datastj.peakbrosmao.me/api";

export async function fetchFromLaravel(endpoint: string, options: RequestInit = {}) {
  const url = `${LARAVEL_API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      next: { revalidate: 0 },
    });
    return res;
  } catch (err) {
    console.error(`[Laravel API Error] Failed to fetch ${url}:`, err);
    return null;
  }
}

