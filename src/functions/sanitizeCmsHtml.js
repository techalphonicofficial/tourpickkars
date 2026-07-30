/**
 * Sanitize CMS HTML content by replacing any localhost / dev-environment
 * URLs with the canonical production URL.
 *
 * Covers:
 *   http://localhost:3000   →  https://www.tourpickkars.in
 *   http://localhost        →  https://www.tourpickkars.in
 *   http://127.0.0.1:3000  →  https://www.tourpickkars.in
 *   http://127.0.0.1       →  https://www.tourpickkars.in
 *   https://localhost:3000  →  https://www.tourpickkars.in
 *   https://localhost       →  https://www.tourpickkars.in
 *
 * Safe to call on any string — returns the original value if input is
 * falsy or not a string.
 */

const PRODUCTION_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tourpickkars.in"
).replace(/\/+$/, "");

// Matches http(s)://localhost[:port] and http(s)://127.0.0.1[:port]
const LOCALHOST_RE = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/gi;

export function sanitizeCmsHtml(html) {
  if (!html || typeof html !== "string") return html ?? "";
  
  // Strip out any <title>...</title> tags to prevent SEO tool false-positives
  let cleanHtml = html.replace(/<title[^>]*>.*?<\/title>/gi, "");
  
  return cleanHtml.replace(LOCALHOST_RE, PRODUCTION_URL);
}
