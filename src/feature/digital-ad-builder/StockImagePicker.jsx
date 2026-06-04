"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  TextField,
  Typography,
  Skeleton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";
import { useStockImageCategories } from "@/hooks/useStockImageCategories";
import { proxyImageUrlOrEmpty } from "./lib/proxyImageUrl";
import { normalizeCategoryIds } from "./lib/stockImagePickerUtils";

function idsEqual(a, b) {
  if (a == null || b == null) return false;
  return String(a) === String(b);
}

const PAGE_SIZE = 24;
const FETCH_SKELETON_COUNT = 12;
const SCROLL_LOAD_THRESHOLD_PX = 140;

/** Padding-bottom square; use instead of aspect-ratio when children are position:absolute (avoids 0-height grid rows in flex layouts). */
const aspect1x1CellSx = {
  position: "relative",
  width: "100%",
  minWidth: 0,
  height: 0,
  paddingBottom: "100%",
  boxSizing: "border-box",
};

const aspect1x1InnerSx = {
  position: "absolute",
  inset: 0,
  borderRadius: 1,
  overflow: "hidden",
};

function StockImageThumbnail({ thumb, alt = "" }) {
  const [loaded, setLoaded] = useState(false);
  const proxied = proxyImageUrlOrEmpty(thumb);
  /** Prefer direct thumbnail for the modal UI; fall back to proxy if blocked. */
  const [useProxy, setUseProxy] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setUseProxy(false);
  }, [proxied]);

  if (!thumb) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "action.hover",
        }}
      />
    );
  }

  return (
    <>
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: loaded ? "none" : "block",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={useProxy ? proxied : thumb}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!useProxy && proxied) {
            // If the proxy rejects this host/URL, the direct request might still work.
            // Switch modes once so we don't get stuck with a blank tile.
            setUseProxy(true);
            return;
          }
          setLoaded(true);
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}

export default function StockImagePicker({
  selectedId,
  onSelect,
  /** `select` = always pick (e.g. modal). `toggle` = click again to clear. */
  selectionMode = "toggle",
  hideTitle = false,
  /** When true (e.g. stock dialog maximized), grid fills available height and uses more columns by breakpoint. */
  expanded = false,
}) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [orientation, setOrientation] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreLockRef = useRef(false);
  const gridScrollRef = useRef(null);
  const { categories, loading: categoriesLoading } = useStockImageCategories();

  useEffect(() => {
    const el = gridScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [debounced, categoryId, orientation, expanded]);

  const categoryLabelById = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(c.id, c.label);
    return m;
  }, [categories]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const isFirstPage = page === 1;

    async function run() {
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(PAGE_SIZE),
        });
        const q = debounced.trim();
        if (q) params.set("search", q);
        if (categoryId && categoryId !== "all") params.set("category", categoryId);
        if (orientation && orientation !== "all") params.set("orientation", orientation);

        const res = await fetch(`/api/digital-assets?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (controller.signal.aborted) return;

        if (json.success) {
          const rows = json.data || [];
          if (isFirstPage) {
            setItems(rows);
          } else {
            setItems((prev) => [...prev, ...rows]);
          }
          const meta = json.meta;
          if (meta) {
            setHasMore(meta.page < meta.pageCount);
          } else {
            setHasMore(rows.length >= PAGE_SIZE);
          }
        } else {
          if (isFirstPage) setItems([]);
          setHasMore(false);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (isFirstPage) setItems([]);
        setHasMore(false);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
        loadMoreLockRef.current = false;
      }
    }

    run();
    return () => controller.abort();
  }, [debounced, categoryId, orientation, page]);

  const handleGridScroll = useCallback(
    (e) => {
      const el = e.currentTarget;
      if (loading || loadingMore || !hasMore || loadMoreLockRef.current) return;
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (remaining > SCROLL_LOAD_THRESHOLD_PX) return;
      loadMoreLockRef.current = true;
      setPage((p) => p + 1);
    },
    [loading, loadingMore, hasMore],
  );

  /** If the first page(s) do not fill the scroll area (e.g. strict filter), nothing scrolls  -  load more until we can scroll or API has no more pages. */
  useLayoutEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const el = gridScrollRef.current;
      if (!el || loadMoreLockRef.current) return;
      const { scrollHeight, clientHeight } = el;
      if (clientHeight < 1) return;
      if (scrollHeight <= clientHeight + SCROLL_LOAD_THRESHOLD_PX) {
        loadMoreLockRef.current = true;
        setPage((p) => p + 1);
      }
    };

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [
    items,
    loading,
    loadingMore,
    hasMore,
    expanded,
    debounced,
    categoryId,
    orientation,
  ]);

  return (
    <Box
      sx={
        expanded
          ? {
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%",
              minHeight: 0,
              width: "100%",
              pt: 1,
            }
          : undefined
      }
    >
      {!hideTitle && (
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Background image
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          alignItems: { sm: "flex-start" },
          width: "100%",
          flexShrink: 0,
        }}
      >
        <FormControl
          size="small"
          sx={{
            width: "100%",
            flex: { sm: "0 0 140px", md: "0 0 160px" },
            minWidth: 0,
          }}
        >
          <InputLabel id="stock-picker-category-label">Category</InputLabel>
          <Select
            labelId="stock-picker-category-label"
            label="Category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            disabled={categoriesLoading}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{
            width: "100%",
            flex: { sm: "0 0 140px", md: "0 0 160px" },
            minWidth: 0,
          }}
        >
          <InputLabel id="stock-picker-orientation-label">Orientation</InputLabel>
          <Select
            labelId="stock-picker-orientation-label"
            label="Orientation"
            value={orientation}
            onChange={(e) => {
              setOrientation(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All orientations</MenuItem>
            <MenuItem value="landscape">Landscape</MenuItem>
            <MenuItem value="portrait">Portrait</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          fullWidth
          placeholder="Search stock images…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlass size={18} style={{ opacity: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box
        ref={gridScrollRef}
        onScroll={handleGridScroll}
        sx={{
          display: "grid",
          width: "100%",
          boxSizing: "border-box",
          gridTemplateColumns: expanded
            ? {
                xs: "repeat(3, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
                md: "repeat(5, minmax(0, 1fr))",
                lg: "repeat(6, minmax(0, 1fr))",
                xl: "repeat(8, minmax(0, 1fr))",
              }
            : {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
              },
          gap: expanded ? 2 : { xs: 0.75, sm: 1 },
          alignContent: "start",
          alignItems: "start",
          justifyItems: "stretch",
          ...(expanded
            ? {
                flex: "1 1 0%",
                minHeight: 0,
                maxHeight: "none",
              }
            : {
                maxHeight: hideTitle ? 380 : 220,
              }),
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarGutter: "stable",
          WebkitOverflowScrolling: "touch",
          pr: 0.5,
          mt: 1.5,
        }}
      >
        {loading &&
          Array.from({ length: FETCH_SKELETON_COUNT }, (_, i) => (
            <Box
              key={`fetch-skel-${i}`}
              sx={{
                ...aspect1x1CellSx,
                flexShrink: 0,
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={aspect1x1InnerSx}>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Box>
          ))}
        {!loading && items.length === 0 && (
          <Box sx={{ gridColumn: "1 / -1", py: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No images match your filters.
            </Typography>
          </Box>
        )}
        {!loading &&
          items.map((photo) => {
            /* Stock images: WebP thumbnails only (no original signed URLs in UI). */
            const thumb = photo.thumbnail;
            const isSel = idsEqual(selectedId, photo.id);
            const catIds = normalizeCategoryIds(photo.category);
            const labels = catIds.map((id) => categoryLabelById.get(id)).filter(Boolean);
            return (
              <Box
                key={photo.id}
                onClick={() => {
                  const payload = {
                    id: photo.id,
                    thumbnail: thumb,
                    title: photo.title,
                  };
                  if (selectionMode === "select") {
                    onSelect(payload);
                  } else if (idsEqual(selectedId, photo.id)) {
                    onSelect(null);
                  } else {
                    onSelect(payload);
                  }
                }}
                sx={{
                  ...aspect1x1CellSx,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: isSel ? "primary.main" : "divider",
                  opacity: photo.thumbnail ? 1 : 0.5,
                  flexShrink: 0,
                  "&:hover": { borderColor: "primary.light" },
                }}
              >
                <Box sx={aspect1x1InnerSx}>
                  <StockImageThumbnail thumb={thumb} />
                  {labels.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        px: 0.5,
                        py: 0.35,
                        pt: 1,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
                        pointerEvents: "none",
                      }}
                    >
                      <Typography
                        variant="caption"
                        noWrap
                        title={labels.join(" · ")}
                        sx={{
                          color: "#fff",
                          fontSize: "0.65rem",
                          lineHeight: 1.2,
                          display: "block",
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        }}
                      >
                        {labels.join(" · ")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        {loadingMore && (
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
              py: 1.5,
            }}
          >
            <CircularProgress size={28} aria-label="Loading more images" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
