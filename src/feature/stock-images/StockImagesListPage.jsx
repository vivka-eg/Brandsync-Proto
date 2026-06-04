"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  useMediaQuery,
  useTheme,
  Chip,
  Menu,
  MenuItem,
  Fab,
  Tooltip,
} from "@mui/material";
import { notFound, useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckSquare,
  X,
  Trash,
  Funnel,
  User,
  CaretDown,
  FrameCorners,
  Users,
  UserMinus,
  Rectangle,
  Rectangle as RectangleVertical,
  Image,
  ImageIcon,
  WifiSlash,
  ArrowUp,
} from "@phosphor-icons/react";
import PhotoEditModal from "./components/PhotoEditModal";
import PhotoCard from "./components/PhotoCard";
import SearchAndFilters from "./components/SearchAndFilters";
import VpnGate, { useIsVpnError } from "@/components/shared/VpnGate";
import {
  DeletePhotoDialog,
  BulkDeleteDialog,
} from "./components/DeleteDialogs";
import { useAuthContext } from "@/context/auth/AuthContext";
import { useToast } from "@/context/shared/ToastContext";
import { useAppEnv } from "@/hooks/useAppEnv";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import { useStockImageCategories } from "@/hooks/useStockImageCategories";

const MotionBox = motion(Box);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ITEMS_PER_PAGE = 40;

// Defined outside the page component so its identity is stable across re-renders.
// If defined inside, React sees a new component type on every render and unmounts/
// remounts the sidebar, causing the visible flicker.
// count === null  → still fetching  → show skeleton
// count === 0     → no images       → show nothing
// count > 0       → ready           → show pill badge
function CountBadge({ count, active }) {
  if (count === null) {
    return (
      <Box
        sx={{
          ml: "auto",
          flexShrink: 0,
          width: 32,
          height: 18,
          borderRadius: "20px",
          background: "linear-gradient(90deg, #e0e0e0 25%, #efefef 50%, #e0e0e0 75%)",
          backgroundSize: "200% 100%",
          animation: "countShimmer 1.4s ease-in-out infinite",
          "@keyframes countShimmer": {
            "0%": { backgroundPosition: "200% 0" },
            "100%": { backgroundPosition: "-200% 0" },
          },
        }}
      />
    );
  }
  if (!count) return null;
  return (
    <Box
      sx={{
        ml: "auto",
        flexShrink: 0,
        px: "7px",
        py: "1px",
        borderRadius: "20px",
        bgcolor: active ? "primary.main" : "action.hover",
        color: active ? "primary.contrastText" : "text.secondary",
        fontSize: "11px",
        fontWeight: 600,
        lineHeight: "18px",
        minWidth: "22px",
        textAlign: "center",
        transition: "background-color 0.15s, color 0.15s",
      }}
    >
      {count.toLocaleString()}
    </Box>
  );
}

function CategoriesSidebar({ selectedCategory, onCategoryChange, categories, loading, totalCount }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title row: matches design system header box spacing */}
      <Box sx={{ py: "12px" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            lineHeight: "1.5rem",
            color: "text.primary",
          }}
        >
          Categories
        </Typography>
      </Box>
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 250px)" }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedCategory === "all"}
              onClick={() => onCategoryChange("all")}
              sx={{
                py: "12px",
                px: "8px",
                borderRadius: 1,
                color: "neutral.main",
                "&.Mui-selected": {
                  bgcolor: "neutral.container",
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "neutral.container" },
                },
                "&:hover": { bgcolor: "neutral.hover" },
              }}
            >
              <ListItemText
                primary="All Images"
                primaryTypographyProps={{ fontSize: "16px", fontWeight: 500, noWrap: true }}
                sx={{ overflow: "hidden" }}
              />
              <CountBadge count={totalCount || null} active={selectedCategory === "all"} />
            </ListItemButton>
          </ListItem>
          {categories.map((category) => (
            <ListItem key={category.id} disablePadding>
              <ListItemButton
                selected={selectedCategory === category.id}
                onClick={() => onCategoryChange(category.id)}
                sx={{
                  py: "12px",
                  px: "8px",
                  borderRadius: 1,
                  color: "neutral.main",
                  "&.Mui-selected": {
                    bgcolor: "neutral.container",
                    color: "text.primary",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "neutral.container" },
                  },
                  "&:hover": { bgcolor: "neutral.hover" },
                }}
              >
                <ListItemText
                  primary={category.label}
                  primaryTypographyProps={{ fontSize: "16px", fontWeight: 500, noWrap: true }}
                  sx={{ overflow: "hidden" }}
                />
                <CountBadge count={category.count} active={selectedCategory === category.id} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        )}
      </Box>
    </Paper>
  );
}

export default function StockImagesListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const searchParams = useSearchParams();
  const useStoredSettings = searchParams.get("useStoredSettings") === "true";
  const storedContainsPeople = localStorage.getItem("containsPeople") || "all";
  const storedOrientation = localStorage.getItem("orientation") || "all";
  const storedCategory = localStorage.getItem("category") || "all";

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isProd } = useAppEnv();
  const { categories, loading: categoriesLoading } = useStockImageCategories();
  const { businessUnits } = useBusinessUnits();
  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "all";
  const containsPeopleFromUrl = searchParams.get("containsPeople") || "all";
  const orientationFromUrl = searchParams.get("orientation") || "all";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [containsPeople, setContainsPeople] = useState(
    containsPeopleFromUrl !== "all" ? containsPeopleFromUrl : useStoredSettings ? storedContainsPeople : "all",
  );
  const [orientation, setOrientation] = useState(
    orientationFromUrl !== "all" ? orientationFromUrl : useStoredSettings ? storedOrientation : "all",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl !== "all" ? categoryFromUrl : useStoredSettings ? storedCategory : "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFooterMenuAnchor, setCategoryFooterMenuAnchor] = useState(null);
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const { setToast } = useToast();
  // const isAdmin = false;
  // const isSuperAdmin = false;

  // Data fetching state
  const [photos, setPhotos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Use photos directly — re-sorting on every append caused stableColsRef to reset
  // and reshuffled the entire grid. Backend already returns newest-first; the search
  // API route is also fixed to return newest-first so page order is stable.
  const displayPhotos = photos;
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const isVpnError = useIsVpnError(error);

  const wasLoadingMoreRef = useRef(false);
  useEffect(() => {
    if (loadingMore) {
      setToast({
        open: true,
        type: "info",
        message: "Loading more images. Please wait.",
        duration: null,
        position: { vertical: "bottom", horizontal: "center" },
      });
    } else if (wasLoadingMoreRef.current) {
      setToast((prev) => ({ ...prev, open: false }));
    }
    wasLoadingMoreRef.current = loadingMore;
  }, [loadingMore, setToast]);

  // Search bar sticky via JS
  const searchBarWrapperRef = useRef(null);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const STICKY_TOP = 64;
    const wrapper = searchBarWrapperRef.current;
    const el = searchBarRef.current;
    if (!wrapper || !el) return;

    let naturalTop = Infinity; // prevents sticky firing before measurement completes

    const measure = () => {
      // Reset so we can measure natural position
      el.style.position = "";
      el.style.top = "";
      el.style.width = "";
      el.style.zIndex = "";
      wrapper.style.height = "auto";
      requestAnimationFrame(() => {
        wrapper.style.height = el.offsetHeight + "px";
        const rect = wrapper.getBoundingClientRect();
        naturalTop = rect.top + window.scrollY;
      });
    };

    measure();

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= naturalTop - STICKY_TOP) {
        el.style.position = "fixed";
        el.style.top = STICKY_TOP + "px";
        el.style.width = wrapper.getBoundingClientRect().width + "px";
        el.style.zIndex = "10";
      } else {
        el.style.position = "";
        el.style.top = "";
        el.style.width = "";
        el.style.zIndex = "";
      }
    };

    const onResize = () => { measure(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Scroll-to-top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScrollTop = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScrollTop, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollTop);
  }, []);

  // Selection state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debounce search (initialized from URL so load with ?search= is instant)
  const [debouncedSearch, setDebouncedSearch] = useState(
    () => searchFromUrl.trim(),
  );

  // Suggested photos when no results in selected category
  const [suggestedPhotos, setSuggestedPhotos] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(false);

  // Menu anchors for dropdown chips
  const [peopleMenuAnchor, setPeopleMenuAnchor] = useState(null);
  const [orientationMenuAnchor, setOrientationMenuAnchor] = useState(null);

  const abortControllerRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  // Tracks the last search value we ourselves wrote to the URL via router.replace,
  // so the URL->state sync can skip re-applying our own writes back to searchTerm.
  const lastUrlSearchWeWroteRef = useRef(searchFromUrl.trim());
  // Stable column assignments: photo id → col index. Never redistributes existing
  // photos, so React never moves DOM nodes between columns (which causes scroll jumps).
  const stableColsRef = useRef({ assignments: new Map(), heights: [], colCount: 0 });

  useEffect(() => {
    async function fetchGrandTotal() {
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("pageSize", "1");
        const response = await fetch(`/api/digital-assets?${params.toString()}`);
        const result = await response.json();
        if (result.success) {
          setGrandTotal(result.meta?.total || 0);
        }
      } catch {
        // silent; header will just omit the count
      }
    }
    fetchGrandTotal();
  }, []);

  // Sync URL search param -> state for external navigation (back/forward, direct URL).
  // Skip when the URL change was triggered by our own router.replace (tracked via ref),
  // to avoid overwriting a searchTerm that is mid-typing with the older debounced value.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch && urlSearch !== searchTerm && urlSearch !== lastUrlSearchWeWroteRef.current) {
      setSearchTerm(urlSearch);
      setDebouncedSearch(urlSearch.trim());
    }
  }, [searchParams.get("search")]);

  // Pure debounce: searchTerm -> debouncedSearch.
  // Depends ONLY on searchTerm so the timer is never cancelled by URL/router changes.
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed === "") {
      setDebouncedSearch("");
      setCurrentPage(1);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync search + filters -> URL so state is fully restored on back-navigation
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (containsPeople !== "all") params.set("containsPeople", containsPeople);
    if (orientation !== "all") params.set("orientation", orientation);
    const qs = params.toString();
    lastUrlSearchWeWroteRef.current = debouncedSearch;
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [debouncedSearch, selectedCategory, containsPeople, orientation, pathname, router]);

  useEffect(() => {
    // Store filter settings in localStorage
    localStorage.setItem("containsPeople", containsPeople);
    localStorage.setItem("orientation", orientation);
    localStorage.setItem("category", selectedCategory);
  }, [selectedCategory, containsPeople, orientation]);

  // Restore search term on mount when the detail page navigates back without URL params
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("stockImagesSearchTerm");
    if (savedSearch && !searchTerm) {
      sessionStorage.removeItem("stockImagesSearchTerm");
      setSearchTerm(savedSearch);
      setDebouncedSearch(savedSearch.trim());
    } else if (savedSearch) {
      // URL already had the search term; just clear the saved value
      sessionStorage.removeItem("stockImagesSearchTerm");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll position after back-navigation once photos have loaded
  useEffect(() => {
    if (!loading) {
      const savedScrollY = sessionStorage.getItem("stockImagesScrollY");
      if (savedScrollY) {
        sessionStorage.removeItem("stockImagesScrollY");
        requestAnimationFrame(() => {
          window.scrollTo({ top: parseInt(savedScrollY, 10), behavior: "instant" });
        });
      }
    }
  }, [loading]);

  // Fetch photos from API
  const fetchPhotos = useCallback(async () => {
    const isFirstPage = currentPage === 1;

    // Cancel any previous in-flight request to prevent stale responses from overwriting newer state
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("pageSize", ITEMS_PER_PAGE.toString());

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      if (containsPeople !== "all") {
        params.append("containsPeople", containsPeople);
      }

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (orientation !== "all") {
        params.append("orientation", orientation);
      }

      const response = await fetch(`/api/digital-assets?${params.toString()}`, {
        signal: controller.signal,
      });
      const result = await response.json();

      if (result.success) {
        const fetchedPhotos = result.data || [];

        if (isFirstPage) {
          setPhotos(fetchedPhotos);
        } else {
          setPhotos((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            return [...prev, ...fetchedPhotos.filter((p) => !seen.has(p.id))];
          });
        }
        setTotalCount(result.meta?.total || fetchedPhotos.length);
        setHasMore(result.meta ? result.meta.page < result.meta.pageCount : fetchedPhotos.length >= ITEMS_PER_PAGE);
      } else {
        setError(result.error || "Failed to fetch photos");
        if (isFirstPage) {
          setPhotos([]);
          setTotalCount(0);
        }
        setHasMore(false);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      if (err.name === "AbortError") {
        // A newer request is already in flight; leave loading state as-is so
        // the spinner stays visible until the replacement request resolves.
        return;
      }
      console.error("Error fetching photos:", err);
      setError("Failed to load photos. Please try again.");
      if (isFirstPage) {
        setPhotos([]);
      }
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
    } finally {
      // NOTE: this block runs even after "return" in catch, so we intentionally
      // do NOT put setLoading(false) here; it is handled explicitly in each
      // non-abort path (success block above and error block above).
    }
  }, [
    debouncedSearch,
    containsPeople,
    selectedCategory,
    orientation,
    currentPage,
  ]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const suggestedAbortControllerRef = useRef(null);

  const fetchSuggestedPhotos = useCallback(async () => {
    if (!debouncedSearch) {
      setSuggestedPhotos([]);
      return;
    }
    // Cancel any previous in-flight suggested-photos request
    if (suggestedAbortControllerRef.current) {
      suggestedAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    suggestedAbortControllerRef.current = controller;

    setLoadingSuggested(true);
    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("pageSize", "9");
      params.append("search", debouncedSearch);
      if (orientation !== "all") params.append("orientation", orientation);
      if (containsPeople !== "all") params.append("containsPeople", containsPeople);
      const response = await fetch(`/api/digital-assets?${params.toString()}`, {
        signal: controller.signal,
      });
      const result = await response.json();
      if (result.success) {
        setSuggestedPhotos(result.data || []);
      } else {
        setSuggestedPhotos([]);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setSuggestedPhotos([]);
    } finally {
      if (!controller.signal.aborted) {
        setLoadingSuggested(false);
      }
    }
  }, [debouncedSearch, orientation, containsPeople]);

  useEffect(() => {
    fetchSuggestedPhotos();
  }, [fetchSuggestedPhotos]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleContainsPeopleChange = (value) => {
    setContainsPeople(value);
    setCurrentPage(1);
  };

  const handleOrientationChange = (value) => {
    setOrientation(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchTerm("");
    setDebouncedSearch("");
    // Clear stale photos and suggestions immediately so the component
    // renders the skeleton on the very next paint instead of briefly
    // showing an empty state before the fetch effect fires.
    // This also prevents a stale "no-category-results" → "empty-state" →
    // "skeleton" triple key transition inside AnimatePresence mode="wait",
    // which can leave nothing rendered when transitions overlap.
    setPhotos([]);
    setSuggestedPhotos([]);
    setLoading(true);
    setCategoryFooterMenuAnchor(null);
  };

  // Disable browser scroll anchoring for this page so adding photos below the
  // viewport never causes the browser to silently adjust window.scrollY.
  useEffect(() => {
    document.documentElement.style.overflowAnchor = "none";
    return () => { document.documentElement.style.overflowAnchor = ""; };
  }, []);

  // Unlock gate only after fetch completes AND scroll has been idle ≥400ms.
  // This prevents trackpad momentum from chaining batches.
  useEffect(() => {
    if (loadingMore) {
      loadingMoreRef.current = true;
      return;
    }
    const tryUnlock = () => {
      if (Date.now() - lastScrollTimeRef.current >= 400) {
        loadingMoreRef.current = false;
        // If user is already at the bottom when gate reopens, load next batch.
        if (hasMore) {
          const scrollHeight = document.documentElement.scrollHeight;
          if (window.scrollY + window.innerHeight >= scrollHeight - 200) {
            loadingMoreRef.current = true;
            setCurrentPage((prev) => prev + 1);
          }
        }
      } else {
        setTimeout(tryUnlock, 100);
      }
    };
    const timer = setTimeout(tryUnlock, 400);
    return () => clearTimeout(timer);
  }, [loadingMore, hasMore]);

  // Single persistent scroll listener; never re-created between batches.
  // loadingMoreRef is the only gate; scroll idle time prevents momentum chaining.
  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();
      if (loadingMoreRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight;
      if (window.scrollY + window.innerHeight >= scrollHeight - 200) {
        loadingMoreRef.current = true;
        setCurrentPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handlePhotoClick = (photoId) => {
    sessionStorage.setItem("stockImagesScrollY", String(window.scrollY));
    if (searchTerm) sessionStorage.setItem("stockImagesSearchTerm", searchTerm);
    router.push(`/digital-assets/stock-images/${photoId}`);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedPhotos([]);
    }
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      return [...prev, photoId];
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map((photo) => photo.id));
    }
  };

  const handleEditPhoto = (photo) => {
    setPhotoToEdit(photo);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedPhoto) => {
    try {
      const response = await fetch(`/api/digital-assets/${updatedPhoto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedPhoto.title,
          description: updatedPhoto.description,
          businessUnitId: updatedPhoto.businessUnitId,
          category: updatedPhoto.category,
          tags: updatedPhoto.tags,
          containsPeople: updatedPhoto.containsPeople,
          orientation: updatedPhoto.orientation,
          gender: updatedPhoto.gender,
          ethnicity: updatedPhoto.ethnicity,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEditModalOpen(false);
        setPhotoToEdit(null);
        // Update the photo in-place using updatedPhoto (already in the correct frontend format)
        // result.data has a nested Strapi structure that doesn't match the frontend shape
        setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? {
          ...p,
          ...updatedPhoto,
        } : p));
      } else {
        setError(result.error || "Failed to update image");
      }
    } catch (err) {
      console.error("Error updating image:", err);
      setError("Failed to update image. Please try again.");
    }
  };

  const handleDeletePhoto = (photo) => {
    setPhotoToDelete(photo);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete?.id) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/digital-assets/${photoToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setDeleteDialogOpen(false);
        setPhotoToDelete(null);
        setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete.id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        setError(result.error || "Failed to delete image");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedPhotos.length === 0) return;

    setDeleting(true);
    try {
      const deletePromises = selectedPhotos.map((photoId) =>
        fetch(`/api/digital-assets/${photoId}`, {
          method: "DELETE",
        }).then((res) => res.json()),
      );

      const results = await Promise.all(deletePromises);
      const successIds = selectedPhotos.filter((_, i) => results[i]?.success);
      const failureCount = results.filter((r) => !r.success).length;

      if (failureCount > 0) {
        setError(`Failed to delete ${failureCount} image(s). Please try again.`);
      }

      setBulkDeleteDialogOpen(false);
      setSelectedPhotos([]);
      setIsSelectMode(false);
      setPhotos((prev) => prev.filter((p) => !successIds.includes(p.id)));
      setTotalCount((prev) => Math.max(0, prev - successIds.length));
    } catch (err) {
      console.error("Error deleting images:", err);
      setError("Failed to delete images. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Categories Sidebar Component with fixed height and scroll

  // if (isProd) {
  //   notFound();
  // }

  return (
    <VpnGate error={error} title="Stock Images">
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        bgcolor: "background.default",
      }}
    >
      {/* Fixed panel (not a flex item): global overflow-x:hidden on body breaks position:sticky */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: "64px",
            left: 0,
            width: 280,
            height: "calc(100vh - 64px)",
            zIndex: 4,
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            overscrollBehavior: "contain",
            p: "16px",
            pl: "32px",
            pb: "80px",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "3px" },
            "&:hover::-webkit-scrollbar-thumb": { background: "#D1D5DB" },
            "&:hover::-webkit-scrollbar-thumb:hover": { background: "#9CA3AF" },
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
            "&:hover": { scrollbarColor: "#D1D5DB transparent" },
          }}
        >
          <CategoriesSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            loading={categoriesLoading}
            totalCount={grandTotal}
          />
        </Box>
      )}
      {!isMobile && <Box aria-hidden sx={{ width: 280, flexShrink: 0 }} />}
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
          px: 4,
          bgcolor: "background.default",
          minWidth: 0,
          pb: { xs: "80px", md: 4 },
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <MotionBox
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              mt: { xs: 2, md: 4 },
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Stock Images
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                }}
              >
                Browse and download high-quality{" "}
                {grandTotal > 0 ? (
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {grandTotal.toLocaleString()}{" "}
                  </Box>
                ) : null}
                stock images
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {(isAdmin || isSuperAdmin) && (
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} weight="bold" />}
                  onClick={() =>
                    router.push("/digital-assets/stock-images/upload")
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Upload
                </Button>
              )}
            </Stack>
          </MotionBox>

          {/* Error Alert (non-VPN errors only — VPN errors are handled by VpnGate) */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Main Content Container */}
          <Box>
            {/* Wrapper holds natural height so layout doesn't jump when bar becomes fixed */}
            <Box ref={searchBarWrapperRef} sx={{ mb: 3 }}>
            {/* Search, People Filter, Orientation Filter, and Bulk actions all in one row */}
            <Box
              ref={searchBarRef}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                py: 1,
                bgcolor: "background.default",
              }}
            >
              {/* Search Bar - Middle */}
              <Box
                sx={{
                  width: { xs: "100%", md: "auto" },
                  // maxWidth: { xs: "100%", md: 500 },
                  flex: 1,
                  display: "flex",
                  // justifyContent: "flex-end",
                }}
              >
                <SearchAndFilters
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                />
              </Box>

              {/* People Filter and Orientation Filter - Left side */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* People Filter Dropdown Chip */}
                <Chip
                  icon={
                    containsPeople === "all" ? (
                      <User size={16} />
                    ) : containsPeople === "yes" ? (
                      <Users size={16} />
                    ) : (
                      <UserMinus size={16} />
                    )
                  }
                  label={
                    containsPeople === "all"
                      ? "All"
                      : containsPeople === "yes"
                        ? "People"
                        : "No People"
                  }
                  deleteIcon={<CaretDown size={16} weight="bold" />}
                  onDelete={(e) => setPeopleMenuAnchor(e.currentTarget)}
                  onClick={(e) => setPeopleMenuAnchor(e.currentTarget)}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                    height: 32,
                    bgcolor:
                      containsPeople !== "all"
                        ? "action.active"
                        : "transparent",
                    color:
                      containsPeople !== "all" ? "white" : "text.secondary",
                    border: "1px solid",
                    borderColor:
                      containsPeople !== "all" ? "primary.main" : "divider",
                    "&:hover": {
                      bgcolor:
                        containsPeople !== "all"
                          ? "primary.dark"
                          : "action.hover",
                    },
                    "& .MuiChip-deleteIcon": {
                      color:
                        containsPeople !== "all" ? "white" : "text.secondary",
                      "&:hover": {
                        color:
                          containsPeople !== "all" ? "white" : "text.primary",
                      },
                    },
                    "& .MuiChip-icon": {
                      color:
                        containsPeople !== "all" ? "white" : "text.secondary",
                    },
                    borderRadius: "120px",
                    px: "8px",
                    py: "6px",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                />
                <Menu
                  anchorEl={peopleMenuAnchor}
                  open={Boolean(peopleMenuAnchor)}
                  onClose={() => setPeopleMenuAnchor(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{ marginTop: 1 }}
                >
                  <MenuItem
                    selected={containsPeople === "all"}
                    onClick={() => {
                      handleContainsPeopleChange("all");
                      setPeopleMenuAnchor(null);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    selected={containsPeople === "yes"}
                    onClick={() => {
                      handleContainsPeopleChange("yes");
                      setPeopleMenuAnchor(null);
                    }}
                  >
                    People
                  </MenuItem>
                  <MenuItem
                    selected={containsPeople === "no"}
                    onClick={() => {
                      handleContainsPeopleChange("no");
                      setPeopleMenuAnchor(null);
                    }}
                  >
                    No People
                  </MenuItem>
                </Menu>

                {/* Orientation Filter Dropdown Chip */}
                <Chip
                  icon={
                    orientation === "all" ? (
                      <FrameCorners size={16} />
                    ) : orientation === "portrait" ? (
                      <RectangleVertical size={16} />
                    ) : (
                      <Rectangle size={16} />
                    )
                  }
                  label={
                    orientation === "all"
                      ? "All"
                      : orientation === "portrait"
                        ? "Portrait"
                        : "Landscape"
                  }
                  deleteIcon={<CaretDown size={16} weight="bold" />}
                  onDelete={(e) => setOrientationMenuAnchor(e.currentTarget)}
                  onClick={(e) => setOrientationMenuAnchor(e.currentTarget)}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                    height: 32,
                    bgcolor:
                      orientation !== "all" ? "action.active" : "transparent",
                    color: orientation !== "all" ? "white" : "text.secondary",
                    border: "1px solid",
                    borderColor:
                      orientation !== "all" ? "primary.main" : "divider",
                    "&:hover": {
                      bgcolor:
                        orientation !== "all" ? "primary.dark" : "action.hover",
                    },
                    "& .MuiChip-deleteIcon": {
                      color: orientation !== "all" ? "white" : "text.secondary",
                      "&:hover": {
                        color: orientation !== "all" ? "white" : "text.primary",
                      },
                    },
                    "& .MuiChip-icon": {
                      color: orientation !== "all" ? "white" : "text.secondary",
                    },
                    borderRadius: "120px",
                    px: "8px",
                    py: "6px",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                />
                <Menu
                  anchorEl={orientationMenuAnchor}
                  open={Boolean(orientationMenuAnchor)}
                  onClose={() => setOrientationMenuAnchor(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{ marginTop: 1 }}
                >
                  <MenuItem
                    selected={orientation === "all"}
                    onClick={() => {
                      handleOrientationChange("all");
                      setOrientationMenuAnchor(null);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    selected={orientation === "portrait"}
                    onClick={() => {
                      handleOrientationChange("portrait");
                      setOrientationMenuAnchor(null);
                    }}
                  >
                    Portrait
                  </MenuItem>
                  <MenuItem
                    selected={orientation === "landscape"}
                    onClick={() => {
                      handleOrientationChange("landscape");
                      setOrientationMenuAnchor(null);
                    }}
                  >
                    Landscape
                  </MenuItem>
                </Menu>
              </Box>

              {/* Bulk actions - Right side */}
              {(isAdmin || isSuperAdmin) && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    variant={isSelectMode ? "contained" : "outlined"}
                    startIcon={
                      isSelectMode ? (
                        <X size={16} weight="bold" />
                      ) : (
                        <CheckSquare size={16} weight="bold" />
                      )
                    }
                    onClick={handleToggleSelectMode}
                    color={isSelectMode ? "secondary" : "primary"}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    {isSelectMode ? "Cancel" : "Select"}
                  </Button>
                  <AnimatePresence>
                    {isSelectMode && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", gap: "8px" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleSelectAll}
                          sx={{ textTransform: "none", fontWeight: 500 }}
                        >
                          {selectedPhotos.length === photos.length
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                        {selectedPhotos.length > 0 && (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<Trash size={16} weight="bold" />}
                            onClick={handleBulkDelete}
                            sx={{ textTransform: "none", fontWeight: 500 }}
                          >
                            Delete ({selectedPhotos.length})
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Stack>
              )}
            </Box>
            </Box>{/* end searchBarWrapperRef */}

            {/* results text */}
            {/* <Box
              sx={{
                mb: 2,
                px: 2,
                display: "flex",
                alignItems: "center",
                // gap: 1,
              }}
            >
              <ImageIcon color={theme.palette.neutral.icons} />
              <Typography
                variant="bodySm"
                color="text.caption"
                sx={{ display: "inline-block", ml: 1 }}
              >
                {photos.length} result
                {photos.length !== 1 ? "s" : ""} found
              </Typography>
            </Box> */}

            {/* Content Container */}
            <Box>

              {/* Photo Grid */}
              <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                <AnimatePresence mode="wait">
                  {(() => {
                    const colCount = isMobile ? 2 : 3;
                    const shimmerSx = {
                      width: "100%",
                      borderRadius: "16px",
                      background: "linear-gradient(90deg, #efefef 25%, #e0e0e0 50%, #efefef 75%)",
                      backgroundSize: "200% 100%",
                      animation: "pinShimmer 1.5s ease-in-out infinite",
                      "@keyframes pinShimmer": {
                        "0%": { backgroundPosition: "200% 0" },
                        "100%": { backgroundPosition: "-200% 0" },
                      },
                    };

                    if (loading) {
                      const skeletonCols = [
                        ["16/9", "4/3", "16/9", "4/3", "16/9", "4/3"],
                        ["4/3", "16/9", "4/3", "16/9", "4/3", "16/9"],
                        ["3/2", "16/9", "4/3", "3/2", "16/9", "4/3"],
                      ];
                      return (
                        <Box key="skeleton" sx={{ display: "flex", gap: "16px", alignItems: "flex-start", width: "100%" }}>
                          {Array.from({ length: colCount }, (_, colIdx) => (
                            <Box key={colIdx} sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                              {skeletonCols[colIdx].map((ratio, i) => (
                                <Box key={i} sx={{ aspectRatio: ratio, ...shimmerSx }} />
                              ))}
                            </Box>
                          ))}
                        </Box>
                      );
                    }

                    if (displayPhotos.length > 0) {
                      // Stable column assignments: once a photo is assigned a column it never
                      // moves. This prevents React from moving DOM nodes between columns when
                      // new batches load, which is what caused the scroll position to jump.
                      const sc = stableColsRef.current;
                      const isReset =
                        sc.colCount !== colCount ||
                        sc.assignments.size > displayPhotos.length ||
                        (displayPhotos[0] && !sc.assignments.has(displayPhotos[0].id));
                      if (isReset) {
                        sc.assignments.clear();
                        sc.heights = Array(colCount).fill(0);
                        sc.colCount = colCount;
                      }
                      const columns = Array.from({ length: colCount }, () => []);
                      displayPhotos.forEach((photo) => {
                        let colIdx = sc.assignments.get(photo.id);
                        if (colIdx === undefined) {
                          colIdx = sc.heights.indexOf(Math.min(...sc.heights));
                          sc.assignments.set(photo.id, colIdx);
                          const h = photo.dimensions?.height || 3;
                          const w = photo.dimensions?.width || 4;
                          sc.heights[colIdx] += h / w;
                        }
                        columns[colIdx].push(photo);
                      });
                      return (
                        <Box key="photos" sx={{ width: "100%" }}>
                          {debouncedSearch && (
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "text.secondary", fontWeight: 500, mb: 2 }}
                            >
                              Showing results for: &ldquo;{debouncedSearch}&rdquo;
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                            {columns.map((colPhotos, colIdx) => (
                              <Box key={colIdx} sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                                {colPhotos.map((photo) => (
                                  <PhotoCard
                                    key={photo.id}
                                    photo={photo}
                                    onClick={() => handlePhotoClick(photo.id)}
                                    isSelectMode={isSelectMode}
                                    isSelected={selectedPhotos.includes(photo.id)}
                                    onSelect={handleSelectPhoto}
                                    onEdit={isAdmin || isSuperAdmin ? handleEditPhoto : null}
                                    onDelete={isAdmin || isSuperAdmin ? handleDeletePhoto : null}
                                    businessUnits={businessUnits}
                                    showBusinessUnitHoverIcon
                                  />
                                ))}
                                {loadingMore && Array(2).fill(null).map((_, i) => {
                                  const ref = colPhotos[colPhotos.length - 1];
                                  const ratio = ref?.dimensions?.width && ref?.dimensions?.height
                                    ? `${ref.dimensions.width} / ${ref.dimensions.height}`
                                    : "4/3";
                                  return <Box key={`sk-${i}`} sx={{ aspectRatio: ratio, ...shimmerSx }} />;
                                })}
                              </Box>
                            ))}
                          </Box>

                          {/* Results count */}
                          {!loadingMore && (
                            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", mt: 3 }}>
                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {isSelectMode && selectedPhotos.length > 0
                                  ? `${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? "s" : ""} selected`
                                  : `Showing ${photos.length} of ${totalCount} photo${totalCount !== 1 ? "s" : ""}`}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    }

                    if (debouncedSearch) {
                      return (
                        <Box key="no-category-results" sx={{ width: "100%", flex: 1 }}>
                    {/* Empty state card */}
                    {/* <Box
                      sx={{
                        bgcolor: "#eef6fa",
                        borderRadius: 3,
                        py: 5,
                        px: 3,
                        mb: 5,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    > */}
                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: "#D8F0FF",
                          mb: 2,
                        }}
                      >
                        <Image
                          size={26}
                          weight="light"
                          color="#1053BD"
                        />
                      </Box> */}

                      {/* <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "primary.lighter",
                          borderRadius: 2,
                          px: 2,
                          py: 0.75,
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          No results found
                        </Typography>
                      </Box> */}


                      {/* <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 0 }}
                      >
                        We couldn&apos;t find any images for &ldquo;
                        {debouncedSearch}&rdquo; in the{" "}
                        <Box component="strong">
                          {categories.find((c) => c.id === selectedCategory)
                            ?.label || selectedCategory}
                        </Box>{" "}
                        category.
                      </Typography> */}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        {/* <Button
                          size="small"
                          variant="outlined"
                          startIcon={<X size={14} weight="bold" />}
                          onClick={() => setSearchTerm("")}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Clear search
                        </Button> */}
                        {/* <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleCategoryChange("all")}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          View all categories
                        </Button> */}
                      </Box>
                    {/* </Box> */}

                    {/* Suggested images */}
                    {loadingSuggested ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", py: 4 }}
                      >
                        <CircularProgress size={32} />
                      </Box>
                    ) : suggestedPhotos.length > 0 ? (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Suggested images for &ldquo;{debouncedSearch}&rdquo;
                          </Typography>
                          {/* <Typography
                            component="span"
                            onClick={() => handleCategoryChange("all")}
                            sx={{
                              color: "primary.main",
                              fontWeight: 500,
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              textDecoration: "underline",
                              "&:hover": { color: "primary.dark" },
                            }}
                          >
                            View All
                          </Typography> */}
                        </Box>
                        <Box
                          sx={{
                            columns: { xs: 2, sm: 2, md: 3 },
                            columnGap: "20px",
                            width: "100%",
                          }}
                        >
                          {suggestedPhotos.map((photo, index) => (
                            <Box
                              key={photo.id}
                              sx={{ breakInside: "avoid", mb: "20px" }}
                            >
                              <PhotoCard
                                photo={photo}
                                index={index}
                                onClick={() => handlePhotoClick(photo.id)}
                                isSelectMode={false}
                                isSelected={false}
                                onSelect={() => {}}
                                onEdit={
                                  isAdmin || isSuperAdmin ? handleEditPhoto : null
                                }
                                onDelete={
                                  isAdmin || isSuperAdmin
                                    ? handleDeletePhoto
                                    : null
                                }
                                businessUnits={businessUnits}
                                showBusinessUnitHoverIcon
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <MotionBox
                        key="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        sx={{
                          textAlign: "center",
                          py: 10,
                          bgcolor: "background.paper",
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          width: "100%",
                        }}
                      >
                        <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                          No Images found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.disabled" }}>
                          Try adjusting your search or filter criteria
                        </Typography>
                      </MotionBox>
                    )}
                  </Box>
                );
              }

              return (
                <MotionBox
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    textAlign: "center",
                    py: 10,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                    No Images found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                    Try adjusting your search or filter criteria
                  </Typography>
                </MotionBox>
              );
            })()}
                </AnimatePresence>

              </Box>
            </Box>
          </Box>
        </Container>
        </Box>{/* close main content Box */}

      {/* Mobile sticky footer — categories dropdown */}
      {isMobile && (
        <>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              px: 2,
              py: 1.5,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Funnel size={16} />}
              endIcon={<CaretDown size={16} weight="bold" />}
              onClick={(e) => setCategoryFooterMenuAnchor(e.currentTarget)}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                justifyContent: "space-between",
                borderRadius: 2,
                "& .MuiButton-endIcon": { ml: "auto" },
              }}
            >
              {selectedCategory === "all"
                ? "All Categories"
                : categories.find((c) => c.id === selectedCategory)?.label || "Category"}
            </Button>
          </Box>
          <Menu
            anchorEl={categoryFooterMenuAnchor}
            open={Boolean(categoryFooterMenuAnchor)}
            onClose={() => setCategoryFooterMenuAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            PaperProps={{
              sx: {
                maxHeight: "60vh",
                width: categoryFooterMenuAnchor?.offsetWidth,
              },
            }}
          >
            <MenuItem
              selected={selectedCategory === "all"}
              onClick={() => handleCategoryChange("all")}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              All Images
              <CountBadge count={grandTotal || null} active={selectedCategory === "all"} />
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                selected={selectedCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {category.label}
                <CountBadge count={category.count} active={selectedCategory === category.id} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      <PhotoEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setPhotoToEdit(null);
        }}
        photo={photoToEdit}
        onSave={handleSaveEdit}
      />

      <DeletePhotoDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        photoTitle={photoToDelete?.title}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      <BulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        count={selectedPhotos.length}
        onConfirm={handleConfirmBulkDelete}
        deleting={deleting}
      />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: isMobile ? 80 : 32,
              right: 32,
              zIndex: 20,
            }}
          >
            <Tooltip title="Scroll to top" placement="left">
              <Fab
                size="medium"
                color="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll to top"
              >
                <ArrowUp size={20} weight="bold" />
              </Fab>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
    </VpnGate>
  );
}
