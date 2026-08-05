import canonicalMap from '@/data/canonicalMap.json';

/**
 * Returns the canonical URL for a given path.
 * Checks the canonicalMap.json first, and falls back to a generated absolute URL.
 * 
 * @param {string} path - The relative path of the page (e.g., '/upcoming-trips' or 'upcoming-trips')
 * @returns {string} The full canonical URL
 */
export function getCanonicalUrl(path) {
  const defaultBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tourpickkars.in';
  
  // Normalize path (ensure it starts with / and trim trailing slashes if any)
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Check if it exists in the JSON map
  if (canonicalMap[normalizedPath]) {
    return canonicalMap[normalizedPath];
  }
  
  // Return the default canonical URL
  // If the path is just '/', don't append a double slash
  if (normalizedPath === '/') {
    return defaultBaseUrl;
  }
  
  return `${defaultBaseUrl}${normalizedPath}`;
}
