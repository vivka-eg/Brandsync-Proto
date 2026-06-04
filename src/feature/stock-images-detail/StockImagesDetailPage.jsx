"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Skeleton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ImageSquare, PencilSimple, WarningCircle, Sparkle, Scissors } from "phosphor-react";
import Image from "next/image";
import { useStockImageCategories } from "@/hooks/useStockImageCategories";
import { useAppEnv } from "@/hooks/useAppEnv";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import { useAuthContext } from "@/context/auth/AuthContext";
import { captureEvent } from "@/lib/analytics/posthog";
import { recordDownload } from "@/api/download-tracking";

// ---------------------------------------------------------------------------
// Heavy modules — loaded only when first needed to keep initial JS small.
// ---------------------------------------------------------------------------

// react-advanced-cropper is ~120 kB parsed; only load it when the modal opens.
const ImageEditorModal = dynamic(
  () => import("./components/ImageEditorModal"),
  { ssr: false, loading: () => null }
);

// DownloadSection lives below the fold on all viewports; split it out.
const DownloadSection = dynamic(
  () => import("./components/DownloadSection"),
  { ssr: false, loading: () => <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} /> }
);

// RelatedPhotoCard — below the fold, load lazily.
const RelatedPhotoCard = dynamic(
  () => import("./components/RelatedPhotoCard"),
  { ssr: false }
);

// BackgroundRemover — AI-powered, loaded on demand.
const BackgroundRemover = dynamic(
  () => import("./components/BackgroundRemover"),
  { ssr: false, loading: () => null }
);

// Lottie is ~120 kB; used for the post-download success snackbar and bg-removal animation.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// framer-motion MotionBox — only used for below-fold Related Images section.
const MotionRelatedGrid = dynamic(
  () =>
    import("framer-motion").then((mod) => {
      const { motion } = mod;
      const MotionBox = motion(Box);
      // eslint-disable-next-line react/display-name
      return function MotionRelatedGrid({ children, ...props }) {
        return (
          <MotionBox
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            animate="visible"
            {...props}
          >
            {children}
          </MotionBox>
        );
      };
    }),
  { ssr: false }
);

const MAX_RELATED_PHOTOS = 12;
const GENERIC_BUSINESS_UNITS = new Set(["", "null", "general", "other", "all", null]);

function isInternalTag(tag) {
  return typeof tag === "string" && tag.startsWith("_");
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return [value];
  return [];
}

export default function StockImagesDetailPage({ initialPhoto }) {
  const router = useRouter();
  const { categories: allCategories } = useStockImageCategories();
  const { businessUnits } = useBusinessUnits();

  const [photo, setPhoto] = useState(initialPhoto);
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [selectedSizeWeb, setSelectedSizeWeb] = useState(
    initialPhoto?.sizes?.[0] ?? null
  );
  const [downloadTab, setDownloadTab] = useState("print");
  const [editorOpen, setEditorOpen] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);
  const [editTooltipOpen, setEditTooltipOpen] = useState(false);
  const [error, setError] = useState(null);
  const [webpError, setWebpError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [webpDownloading, setWebpDownloading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success", showAnimation: false });
  const [bgRemoverOpen, setBgRemoverOpen] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const animationLoadedRef = useRef(false);
  const { isProd } = useAppEnv();
  const { isAdmin, isSuperAdmin } = useAuthContext();

  const ensureAnimationLoaded = () => {
    if (animationLoadedRef.current) return;
    animationLoadedRef.current = true;
    fetch("/animations/successful-download.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {});
  };


  const businessUnitValue = String(
    photo?.businessUnitId || photo?.businessUnit || photo?.businessUnitName || ""
  )
    .trim()
    .toLowerCase();
  const matchedBusinessUnit =
    businessUnits.find((bu) => String(bu.id || "").trim() === String(photo?.businessUnitId || "").trim()) ||
    businessUnits.find((bu) => String(bu.id || "").trim() === String(photo?.businessUnit || "").trim());
  const assignedBusinessUnit = matchedBusinessUnit?.name || String(photo?.businessUnitName || "").trim();
  const showBusinessUnitAlert =
    !GENERIC_BUSINESS_UNITS.has(businessUnitValue) && Boolean(assignedBusinessUnit);

  useEffect(() => {
    const fetchRelatedPhotos = async () => {
      if (!photo?.id) {
        setRelatedPhotos([]);
        return;
      }

      const currentId = String(photo.id);

      const rawCategories = toArray(photo.category).filter(Boolean);
      const rawTags = toArray(photo.tags).filter((t) => !isInternalTag(t));

      const currentCategories = new Set(rawCategories.map(normalizeValue));
      const currentTags = new Set(rawTags.map(normalizeValue));

      try {
        const categoryRequests = rawCategories.map((cat) =>
          fetch(`/api/digital-assets?page=1&pageSize=48&category=${encodeURIComponent(cat)}`)
            .then((r) => r.ok ? r.json() : { data: [] })
            .then((r) => Array.isArray(r.data) ? r.data : [])
            .catch(() => [])
        );

        const tagRequests = rawTags.slice(0, 3).map((tag) =>
          fetch(`/api/digital-assets?page=1&pageSize=24&search=${encodeURIComponent(tag)}`)
            .then((r) => r.ok ? r.json() : { data: [] })
            .then((r) => Array.isArray(r.data) ? r.data : [])
            .catch(() => [])
        );

        const allResults = await Promise.all([...categoryRequests, ...tagRequests]);

        const seen = new Set();
        const candidates = [];
        for (const batch of allResults) {
          for (const item of batch) {
            const id = String(item.id);
            if (id === currentId || seen.has(id)) continue;
            seen.add(id);
            candidates.push(item);
          }
        }

        const currentBusinessUnit = normalizeValue(photo.businessUnit);
        const rankedPhotos = candidates
          .map((candidate) => {
            const candidateBusinessUnit = normalizeValue(candidate.businessUnit);
            const candidateCategories = toArray(candidate.category).map((c) => normalizeValue(c));
            const candidateTags = toArray(candidate.tags).filter((t) => !isInternalTag(t)).map((t) => normalizeValue(t));

            let score = 0;
            score += candidateCategories.filter((c) => currentCategories.has(c)).length * 3;
            score += candidateTags.filter((t) => currentTags.has(t)).length * 2;
            if (candidateBusinessUnit && candidateBusinessUnit === currentBusinessUnit) score += 1;
            if (candidate.orientation && candidate.orientation === photo.orientation) score += 1;

            return { ...candidate, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_RELATED_PHOTOS);

        setRelatedPhotos(rankedPhotos);
      } catch {
        setRelatedPhotos([]);
      }
    };

    fetchRelatedPhotos();
  }, [photo]);

  useEffect(() => {
    setWebpError(null);
  }, [downloadTab]);

  const getProxiedImageUrl = (url) => {
    if (!url) return null;
    const externalDomains = [
      "s3.eu-central-1.amazonaws.com",
      "api.brand.dev.egsync.com",
      "api.brand.stage.egsync.com",
      "api.brand.egsync.com",
    ];
    if (externalDomains.some((domain) => url.includes(domain))) {
      return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const handleDownload = async () => {
    if (!photo || downloading) return;

    const downloadUrl = photo.fullImage || photo.fullSize;
    if (!downloadUrl) {
      alert("No image available for download.");
      return;
    }

    let extension = "jpg";
    const urlMatch = downloadUrl.match(/\.(jpg|jpeg|png|webp|tiff?|JPG|JPEG|PNG|WEBP|TIFF?)(\?|$)/i);
    if (urlMatch) extension = urlMatch[1].toLowerCase();

    const fileName = `${photo.title || "image"}-Original.${extension}`;

    captureEvent("stock_image_download_original", {
      image_id: photo.id,
      image_title: photo.title,
    });

    setDownloading(true);

    try {
      const proxiedUrl = getProxiedImageUrl(downloadUrl);
      const response = await fetch(proxiedUrl, { method: "GET", cache: "default" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || `image/${extension}`;
      const blob = new Blob([arrayBuffer], { type: contentType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      recordDownload({
        assetId: String(photo.id),
        assetName: photo.title || "image",
        assetType: "digital_asset",
        format: `.${extension}`,
      }).catch(() => {});

      ensureAnimationLoaded();
      setSnackbar({
        open: true,
        message: `${photo.title || "Image"} original image downloaded!`,
        severity: "success",
        showAnimation: true,
      });
    } catch {
      alert("Failed to download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAsWebP = async () => {
    if (!photo || !selectedSizeWeb) return;

    captureEvent("stock_image_download_webp", {
      image_id: photo.id,
      image_title: photo.title,
      size_label: selectedSizeWeb?.label,
    });

    setWebpError(null);
    setWebpDownloading(true);

    try {
      const imageUrl = selectedSizeWeb.url || photo.fullImage;
      const proxiedUrl = getProxiedImageUrl(imageUrl);

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = proxiedUrl;
      });

      const canvas = document.createElement("canvas");
      const targetWidth = selectedSizeWeb.width || img.width;
      const targetHeight = selectedSizeWeb.height || img.height;
      const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${photo.title || "image"}-${selectedSizeWeb.label || "webp"}.webp`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              recordDownload({
                assetId: String(photo.id),
                assetName: photo.title || "image",
                assetType: "digital_asset",
                format: ".webp",
              }).catch(() => {});
              ensureAnimationLoaded();
              setSnackbar({
                open: true,
                message: `${photo.title || "Image"} WebP downloaded!`,
                severity: "success",
                showAnimation: true,
              });
              resolve();
            } else {
              reject(new Error("WebP conversion failed. Your browser may not support WebP."));
            }
          },
          "image/webp",
          0.9
        );
      });
    } catch (err) {
      setWebpError(err.message || "Failed to convert image to WebP. Please try again.");
    } finally {
      setWebpDownloading(false);
    }
  };

  const handleRelatedPhotoClick = (photoId) => {
    router.push(`/digital-assets/stock-images/${photoId}`);
  };

  const handleCopyPageLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      captureEvent("stock_image_copy_link", {
        image_id: photo.id,
        image_title: photo.title,
      });
      setSnackbar({ open: true, message: "Link copied to clipboard", severity: "success", showAnimation: false });
    } catch {
      setSnackbar({
        open: true,
        message: "Could not copy link. Copy the address from your browser instead.",
        severity: "error",
        showAnimation: false,
      });
    }
  };

  const handleDeleteClick = () => setDeleteDialogOpen(true);
  const handleDeleteCancel = () => setDeleteDialogOpen(false);

  const handleDeleteConfirm = async () => {
    if (!photo || deleting) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/digital-assets/${photo.id}`, { method: "DELETE" });
      const result = await response.json();

      if (result.success) {
        setDeleteDialogOpen(false);
        router.push("/digital-assets/stock-images");
      } else {
        alert(result.error || "Failed to delete photo. Please try again.");
        setDeleting(false);
      }
    } catch {
      alert("Failed to delete photo. Please try again.");
      setDeleting(false);
    }
  };

  if (error || !photo) {
    return (
      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => router.push("/digital-assets/stock-images?useStoredSettings=true")}
            sx={{ mb: 3, color: "text.secondary", "&:hover": { bgcolor: "action.hover" } }}
          >
            Back to Gallery
          </Button>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Photo not found"}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box>
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} href="/digital-assets" underline="hover" color="inherit" sx={{ fontSize: "0.875rem" }}>
              Digital Assets
            </MuiLink>
            <MuiLink component={Link} href="/digital-assets/stock-images" underline="hover" color="inherit" sx={{ fontSize: "0.875rem" }}>
              Stock Images
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: "0.875rem" }}>
              {photo.title}
            </Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => router.push("/digital-assets/stock-images?useStoredSettings=true")}
            sx={{ mb: 3, color: "text.secondary", "&:hover": { bgcolor: "action.hover" } }}
          >
            Back to Gallery
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
            gap: 4,
          }}
        >
          <Box>
            <Box
              onClick={() => setEditorOpen(true)}
              onMouseEnter={() => setEditTooltipOpen(false)}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "grey.100",
                border: "1px solid",
                borderColor: "divider",
                aspectRatio: "16/10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.01)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {mainImageError ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #b0b0b0 0%, #d8d8d8 50%, #b0b0b0 100%)",
                    color: "rgba(0,0,0,0.5)",
                    gap: 1.5,
                  }}
                >
                  <ImageSquare size={48} weight="regular" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Unable to load image
                  </Typography>
                </Box>
              ) : (
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  onLoad={() => {
                    setMainImageLoaded(true);
                    setEditTooltipOpen(true);
                    setTimeout(() => setEditTooltipOpen(false), 3000);
                  }}
                  onError={() => setMainImageError(true)}
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  priority
                />
              )}

              {mainImageLoaded && (
                <>
                  {showBusinessUnitAlert && (
                    <Tooltip
                      title={`This image should only be used by the assigned business unit: ${assignedBusinessUnit}.`}
                      arrow
                      placement="right"
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          bgcolor: "rgba(122, 82, 0, 0.88)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.2)",
                          backdropFilter: "blur(4px)",
                          zIndex: 2,
                        }}
                      >
                        <WarningCircle size={20} weight="fill" />
                      </Box>
                    </Tooltip>
                  )}

                  <Tooltip title="Click to edit" open={editTooltipOpen} arrow placement="left">
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <PencilSimple size={18} color="white" weight="bold" />
                    </Box>
                  </Tooltip>

                  <Tooltip title="Remove background" arrow placement="right">
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        setBgRemoverOpen(true);
                      }}
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.625,
                        borderRadius: "20px",
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "white",
                        cursor: "pointer",
                        backdropFilter: "blur(4px)",
                        userSelect: "none",
                      }}
                    >
                      <Scissors size={14} weight="bold" color="white" />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "white", lineHeight: 1 }}>
                        Remove background
                      </Typography>
                    </Box>
                  </Tooltip>
                </>
              )}
            </Box>

            {showBusinessUnitAlert && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2, alignItems: "center" }}>
                This photo must be used only for {assignedBusinessUnit}.
              </Alert>
            )}

            {bgRemoverOpen && (
              <BackgroundRemover
                photo={photo}
                imageUrl={photo.fullImage || photo.fullSize || photo.thumbnail}
              />
            )}
          </Box>

          <Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "flex-start" }}
              justifyContent="space-between"
              sx={{ mb: 1, gap: { sm: 2 } }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  lineHeight: 1.2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {photo.title}
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1, lineHeight: 1.5 }}>
              {photo.description}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                mb: 2,
                px: 1.25,
                py: 0.5,
                borderRadius: "20px",
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Sparkle size={12} weight="fill" style={{ color: "inherit", opacity: 0.6 }} />
              <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500, lineHeight: 1 }}>
                Title &amp; description generated by AI
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
              {photo.orientation && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Orientation
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={photo.orientation}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1.5, textTransform: "capitalize" }}
                    />
                  </Stack>
                </Box>
              )}

              {photo.category?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Categories
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {photo.category.map((catId) => {
                      const cat = allCategories.find((c) => c.id === catId);
                      return (
                        <Chip
                          key={catId}
                          component={Link}
                          href={`/digital-assets/stock-images?category=${encodeURIComponent(catId)}`}
                          label={cat ? cat.label : catId}
                          size="small"
                          variant="outlined"
                          clickable
                          sx={{ borderRadius: 1.5, textTransform: "capitalize", textDecoration: "none" }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Assigned Product
              </Typography>
              <Chip
                label={
                  businessUnits.find((bu) => bu.id === photo.businessUnitId)?.name ||
                  businessUnits.find((bu) => bu.id === photo.businessUnit)?.name ||
                  "All Products"
                }
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1.5, textTransform: "capitalize" }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(photo.tags || []).map((tag) => {
                  const internal = isInternalTag(tag);
                  const chipSx = { borderRadius: 1.5, textTransform: "capitalize", mb: 0.5 };
                  if (internal) {
                    return <Chip key={tag} label={tag} size="small" variant="outlined" sx={chipSx} />;
                  }
                  return (
                    <Chip
                      key={tag}
                      component={Link}
                      href={`/digital-assets/stock-images?search=${encodeURIComponent(tag)}`}
                      label={tag}
                      size="small"
                      variant="outlined"
                      clickable
                      sx={{ ...chipSx, textDecoration: "none" }}
                    />
                  );
                })}
              </Stack>
            </Box>

            {(isAdmin || isSuperAdmin) && photo.updatedAt && (
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 0.75, color: "text.disabled" }}>
                <Typography variant="caption">
                  Last updated:{" "}
                  {new Date(photo.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
            )}

            <DownloadSection
              photo={photo}
              downloadTab={downloadTab}
              onTabChange={setDownloadTab}
              onCopyPageLink={handleCopyPageLink}
              selectedSizeWeb={selectedSizeWeb}
              onSizeSelect={setSelectedSizeWeb}
              onDownload={handleDownload}
              onDownloadWebP={handleDownloadAsWebP}
              downloading={downloading}
              webpDownloading={webpDownloading}
              webpError={webpError}
            />
          </Box>
        </Box>

        {relatedPhotos.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Related Images
            </Typography>
            <MotionRelatedGrid
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {relatedPhotos.map((relatedPhoto) => (
                <RelatedPhotoCard
                  key={relatedPhoto.id}
                  photo={relatedPhoto}
                  onClick={() => handleRelatedPhotoClick(relatedPhoto.id)}
                />
              ))}
            </MotionRelatedGrid>
          </Box>
        )}
      </Container>

      <ImageEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        photo={photo}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            alignItems: "center",
            bgcolor: "#111",
            color: "#fff",
            "& .MuiAlert-icon": { mr: 2, p: 0 },
            py: 1,
            px: 2,
            borderRadius: 2,
          }}
          icon={
            snackbar.showAnimation && animationData ? (
              <Box sx={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginRight: -1 }}>
                <Lottie animationData={animationData} loop={false} style={{ width: "100%", height: "100%" }} />
              </Box>
            ) : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
