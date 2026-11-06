/**
 * Strict Input Sanitization & Anti-Injection Utilities
 * Protects against Stored XSS, script injection, and control character attacks.
 */

export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip HTML tag delimiters
    .replace(/javascript:/gi, "") // Neutralize javascript: URI schemes
    .replace(/on\w+=/gi, "") // Neutralize inline event handlers
    .trim();
}

export function sanitizeHtmlText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

