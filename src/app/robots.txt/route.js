export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const robotsContent = `
User-agent: *
Allow: /

# Important pages
Allow: /wp-content/uploads/
Allow: /assets/
Allow: /images/

# Disallow sensitive/system paths
Disallow: /admin/
Disallow: /login/
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/
Disallow: /storage/
Disallow: /vendor/
Disallow: /private/
Disallow: /shopdetail/

# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tourpickkars.in'}/sitemap.xml
`.trim();

  return new Response(robotsContent, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
}
