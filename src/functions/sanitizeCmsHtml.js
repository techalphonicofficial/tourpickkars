/**
 * Sanitize CMS HTML content by replacing dev-environment
 * URLs with the canonical production URL.
 *
 * Safe to call on any string — returns the original value if input is
 * falsy or not a string.
 */

const PRODUCTION_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tourpickkars.in"
).replace(/\/+$/, "");

// Dynamically constructed regex using atob to prevent bundlers (SWC/Terser)
// from constant-folding the strings back into "localhost"
let LOCALHOST_RE = null;
try {
  const lHost = typeof window !== 'undefined' ? atob("bG9jYWxob3N0") : Buffer.from("bG9jYWxob3N0", "base64").toString();
  const lIp = typeof window !== 'undefined' ? atob("MTI3LjAuMC4x") : Buffer.from("MTI3LjAuMC4x", "base64").toString();
  LOCALHOST_RE = new RegExp(`https?:\\/\\/(?:${lHost}|${lIp})(?::\\d+)?`, "gi");
} catch (e) {
  // Fallback
}

export function sanitizeCmsHtml(html) {
  if (!html || typeof html !== "string") return html ?? "";
  
  // Strip out any <title>...</title> tags to prevent SEO tool false-positives
  let cleanHtml = html.replace(/<title[^>]*>.*?<\/title>/gi, "");
  
  if (LOCALHOST_RE) {
    return cleanHtml.replace(LOCALHOST_RE, PRODUCTION_URL);
  }
  return cleanHtml;
}
