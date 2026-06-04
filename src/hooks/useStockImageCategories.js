import { useState, useEffect } from "react";
import { getStockImageCategories } from "@/api/assets/digital-assets";

export function useStockImageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getStockImageCategories().then((result) => {
      if (cancelled) return;
      if (result?.data) {
        const mapped = result.data.map((cat) => ({
          id: cat.pseudoId,
          label: cat.name,
          count: null, // null = not yet fetched; drives skeleton in CountBadge
        }));

        setCategories(mapped);
        setLoading(false);

        // Fetch each category count independently so badges resolve one by one.
        mapped.forEach((cat) => {
          fetch(`/api/digital-assets?category=${encodeURIComponent(cat.id)}&pageSize=1&page=1`)
            .then((r) => r.json())
            .then((data) => {
              if (cancelled) return;
              const count = data.meta?.total ?? 0;
              setCategories((prev) =>
                prev.map((c) => (c.id === cat.id ? { ...c, count } : c))
              );
            })
            .catch(() => {
              if (cancelled) return;
              setCategories((prev) =>
                prev.map((c) => (c.id === cat.id ? { ...c, count: 0 } : c))
              );
            });
        });
      } else {
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}
