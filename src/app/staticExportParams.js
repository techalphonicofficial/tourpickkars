const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function toSafeSlugParams(items) {
  return (items || [])
    .filter((item) => SAFE_SLUG_PATTERN.test(String(item?.slug || "")))
    .map((item) => ({ slug: String(item.slug) }));
}
