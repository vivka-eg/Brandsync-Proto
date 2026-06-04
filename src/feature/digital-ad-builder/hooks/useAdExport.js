import { useState, useCallback, useRef } from "react";
import JSZip from "jszip";
import { toPng } from "html-to-image";
import { pngDataUrlToJpegDataUrl } from "../lib/pngDataUrlToJpegDataUrl";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";
import { captureEvent } from "@/lib/analytics/posthog";

/** Slug for filesystem-safe segment (lowercase, hyphens). */
export function slugifyExportSegment(str, fallback = "product") {
  const s = String(str ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s.-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || fallback;
}

/** Download: brandsync-<product-name>-<size>.<ext> */
export function buildExportFilename({ productName, sizeId, ext }) {
  const product = slugifyExportSegment(productName);
  const size = slugifyExportSegment(sizeId, "size");
  return `brandsync-${product}-${size}.${ext}`;
}

async function captureNode(node, preset, isJpeg) {
  const baseOptions = {
    width: preset.width,
    height: preset.height,
    pixelRatio: 1,
    cacheBust: true,
    includeQueryParams: true,
  };
  const pngDataUrl = await toPng(node, baseOptions);
  return isJpeg
    ? pngDataUrlToJpegDataUrl(pngDataUrl, preset.width, preset.height, 0.92)
    : pngDataUrl;
}

function triggerDownload(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

/**
 * Export hook.
 *
 * Behaviour:
 *   • activeArtboardId set  →  single artboard download (PNG or JPEG)
 *   • activeArtboardId null AND artboards.length > 1  →  all artboards zipped
 *   • activeArtboardId null AND artboards.length === 1  →  single artboard (no zip needed)
 */
export default function useAdExport({ artboards, activeArtboardId, selectedLogoName, setToast }) {
  const exportRefs = useRef({});
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const setExportRef = useCallback((id) => (el) => {
    if (el) exportRefs.current[id] = el;
    else delete exportRefs.current[id];
  }, []);

  const handleExport = useCallback(
    async (format) => {
      const isJpeg = format === "jpeg";
      const ext = isJpeg ? "jpg" : "png";
      const kindLabel = isJpeg ? "JPEG" : "PNG";
      setExportError(null);
      setExporting(true);

      try {
        // Brief pause so the offscreen artboards have settled.
        await new Promise((r) => requestAnimationFrame(() => r()));
        await new Promise((r) => setTimeout(r, 200));

        const allBoards = artboards ?? [];

        // Decide what to export
        const isSingleExport =
          activeArtboardId != null || allBoards.length <= 1;

        if (isSingleExport) {
          // ── Single artboard download ────────────────────────────────────────
          const targetId = activeArtboardId ?? allBoards[0]?.id;
          const ab = allBoards.find((a) => a.id === targetId);
          const node = exportRefs.current[targetId];
          const preset = ab ? AD_SIZE_PRESET_MAP[ab.selectedSizeId] : null;

          if (!node || !preset) throw new Error("Preview format not found.");

          const dataUrl = await captureNode(node, preset, isJpeg);
          const filename = buildExportFilename({
            productName: selectedLogoName,
            sizeId: ab.selectedSizeId,
            ext,
          });
          triggerDownload(dataUrl, filename);

          const label = preset.label
            ? `${preset.label} (${preset.width}×${preset.height}px)`
            : `${preset.width}×${preset.height}px`;
          setToast({ open: true, type: "success", message: `${kindLabel} saved: ${label}` });

          captureEvent("digital_ad_downloaded", {
            format,
            export_type: "single",
            size_id: ab.selectedSizeId,
            width: preset.width,
            height: preset.height,
            product_name: selectedLogoName,
            filename,
          });

        } else {
          // ── All artboards → ZIP ─────────────────────────────────────────────
          const zip = new JSZip();

          // Track sizeId usage to disambiguate duplicates with placement suffix.
          const sizeIdCount = {};
          for (const ab of allBoards) {
            sizeIdCount[ab.selectedSizeId] = (sizeIdCount[ab.selectedSizeId] ?? 0) + 1;
          }

          let successCount = 0;
          for (const ab of allBoards) {
            const node = exportRefs.current[ab.id];
            const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
            if (!node || !preset) continue;

            const dataUrl = await captureNode(node, preset, isJpeg);
            const base64 = dataUrl.split(",")[1];

            // Add placement suffix only when the same size appears more than once.
            const sizeSegment =
              sizeIdCount[ab.selectedSizeId] > 1
                ? `${ab.selectedSizeId}-${ab.placement ?? "slot"}`
                : ab.selectedSizeId;

            const filename = buildExportFilename({
              productName: selectedLogoName,
              sizeId: sizeSegment,
              ext,
            });
            zip.file(filename, base64, { base64: true });
            successCount++;
          }

          if (successCount === 0) throw new Error("No artboards could be captured.");

          const blob = await zip.generateAsync({ type: "blob" });
          const objectUrl = URL.createObjectURL(blob);
          const zipName = `brandsync-${slugifyExportSegment(selectedLogoName ?? "ads")}-all-banners.zip`;
          triggerDownload(objectUrl, zipName);
          URL.revokeObjectURL(objectUrl);

          setToast({
            open: true,
            type: "success",
            message: `${successCount} banner${successCount > 1 ? "s" : ""} saved as ZIP.`,
          });

          captureEvent("digital_ad_downloaded", {
            format,
            export_type: "zip",
            banner_count: successCount,
            product_name: selectedLogoName,
            filename: zipName,
          });
        }
      } catch (e) {
        console.error(e);
        setExportError(e.message || "Export failed");
      } finally {
        setExporting(false);
      }
    },
    [artboards, activeArtboardId, selectedLogoName, setToast],
  );

  return { exporting, exportError, handleExport, setExportRef };
}
