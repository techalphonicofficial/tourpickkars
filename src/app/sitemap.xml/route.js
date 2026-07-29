export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Escape XML special characters
function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Normalize URL – always rewrite to the canonical base domain
function normalizeUrl(baseUrl, path) {
  if (!path) return null;

  path = String(path).trim();

  // If API returns a full URL, extract just the pathname and rebuild with canonical base
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const parsed = new URL(path);
      path = parsed.pathname.replace(/^\/+/, "");
    } catch {
      return null;
    }
  }

  // Remove leading slash
  path = path.replace(/^\/+/, "");

  return `${baseUrl}/${path}`;
}

export async function GET() {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://www.tourpickkars.in").replace(/\/$/, "");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dashboard.tourpickkars.in/api";

  const today = new Date().toISOString().split("T")[0];

  const staticUrls = [
    {
      key: "home",
      url: baseUrl,
      lastmod: today,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      key: "about",
      url: `${baseUrl}/about`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      key: "contact",
      url: `${baseUrl}/contact`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      key: "blog",
      url: `${baseUrl}/blog`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
  ];

  try {
    const [sitemapRes, packagesRes] = await Promise.allSettled([
      fetch(`${apiUrl}/sitemap-xml`, {
        cache: "no-store",
      }),
      fetch(`${apiUrl}/packages`, {
        cache: "no-store",
      }),
    ]);

    let sitemapUrls = [];

    if (
      sitemapRes.status === "fulfilled" &&
      sitemapRes.value.ok
    ) {
      const data = await sitemapRes.value.json();

      sitemapUrls = data
        .filter((page) => page.url)
        .map((page) => ({
          key: page.url,
          url: normalizeUrl(baseUrl, page.url),
          lastmod: page.lastmod
            ? page.lastmod.split("T")[0]
            : today,
          changefreq: page.changefreq || "weekly",
          priority: page.priority || "0.8",
        }));
    }

    let packageUrls = [];

    if (
      packagesRes.status === "fulfilled" &&
      packagesRes.value.ok
    ) {
      const packages = await packagesRes.value.json();

      packageUrls = packages
        .filter((pkg) => pkg.slug)
        .map((pkg) => ({
          key: pkg.slug,
          url: normalizeUrl(baseUrl, pkg.slug),
          lastmod: pkg.updated_at
            ? pkg.updated_at.split("T")[0]
            : pkg.created_at
              ? pkg.created_at.split("T")[0]
              : today,
          changefreq: "weekly",
          priority: "0.8",
        }));
    }

    // Merge & remove duplicates
    const map = new Map();

    [...staticUrls, ...sitemapUrls, ...packageUrls].forEach((item) => {
      if (
        item.url &&
        item.url.startsWith("https://")
      ) {
        map.set(item.url, item);
      }
    });

    const allUrls = [...map.values()];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
        .map(
          (u) => `  <url>
    <loc>${escapeXml(u.url)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>
  </url>`
        )
        .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap generation failed:", err);

    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
        .map(
          (u) => `  <url>
    <loc>${escapeXml(u.url)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>
  </url>`
        )
        .join("\n")}
</urlset>`;

    return new Response(fallback, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }
}