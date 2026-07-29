export function normaliseSlug(value = "") {
  let decodedValue = String(value).trim();

  try {
    decodedValue = decodeURIComponent(decodedValue);
  } catch {
    // Keep the original value when malformed encoding is received.
  }

  return decodedValue
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[’‘']/g, "")           // Remove apostrophes completely (don't replace with hyphen)
    .replace(/&/g, " and ")          // Replace ampersand with 'and'
    .replace(/[•·]/g, " ")           // Replace bullet points with space
    .replace(/[–—]/g, "-")           // Replace en/em dashes with hyphen
    .replace(/[^a-zA-Z0-9]+/g, "-")  // Replace any non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, "")         // Remove leading/trailing hyphens
    .replace(/-{2,}/g, "-")          // Collapse consecutive hyphens
    .toLowerCase();                  // Convert to lowercase
}

export function getPackageUrl(packageItem) {
  if (!packageItem) return "/";

  // Use the best available source field
  const sourceSlug =
    packageItem?.slug ||
    packageItem?.package_slug ||
    packageItem?.seo_slug ||
    packageItem?.title ||
    packageItem?.name ||
    "";

  const slug = normaliseSlug(sourceSlug);

  return slug ? `/${slug}` : "/";
}

// Backward compatibility (we can also safely use this everywhere we used createSlug before, but getPackageUrl is preferred for packages)
export const createSlug = normaliseSlug;
