/** Portrait / Landscape from API or inferred from dimensions. */
export function resolveOrientation(item) {
  if (item.orientation === "Portrait" || item.orientation === "Landscape") {
    return item.orientation;
  }
  const w = item.dimensions?.width ?? 0;
  const h = item.dimensions?.height ?? 0;
  if (w > 0 && h > 0) {
    if (h > w) return "Portrait";
    if (w > h) return "Landscape";
  }
  return null;
}

export function matchesOrientationFilter(item, filter) {
  if (!filter || filter === "all") return true;
  const want = filter === "landscape" ? "Landscape" : "Portrait";
  const o = resolveOrientation(item);
  return o === want;
}

/** Strapi may return category as string, array of ids, or array of objects. */
export function normalizeCategoryIds(category) {
  if (!category) return [];
  if (Array.isArray(category)) {
    return category
      .map((c) => {
        if (c == null) return null;
        if (typeof c === "object")
          return c.documentId ?? c.id ?? c.pseudoId ?? null;
        return String(c);
      })
      .filter(Boolean);
  }
  if (typeof category === "string") {
    try {
      const p = JSON.parse(category);
      if (Array.isArray(p)) return p.map(String).filter(Boolean);
    } catch {
      /* plain string */
    }
    return category.trim() ? [category.trim()] : [];
  }
  return [];
}
