export function resolveLogoUrl(logo, tone, orientation) {
  if (!logo?.assets) return null;
  const resolvedTone = tone === "monochrome" ? "negative" : tone;
  const pack = logo.assets[resolvedTone];
  if (pack) {
    if (pack[orientation]) return pack[orientation];
    if (pack.horizontal) return pack.horizontal;
    if (pack.vertical) return pack.vertical;
  }
  return logo.assets.logo ?? null;
}
