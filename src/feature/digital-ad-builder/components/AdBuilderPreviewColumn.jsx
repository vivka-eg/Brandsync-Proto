"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Tooltip,
  Alert,
  LinearProgress,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FrameCorners, FloppyDisk, FolderOpen, CaretDown, Copy, Bug, FilePlus } from "phosphor-react";
import ExportDownloadButton from "./ExportDownloadButton";
import AdBuilderPreviewFloatingToolbar from "./AdBuilderPreviewFloatingToolbar";
import AdBuilderInlineTextToolbarPortal from "./AdBuilderInlineTextToolbarPortal";
import PreviewShortcutsPopover from "./PreviewShortcutsPopover";
import AdArtboard from "../AdArtboard";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";
import { PREVIEW_ENTER_MS } from "../lib/previewConstants";
import { computeBoardLayoutDims, computeArtboardBasePositions } from "../boardLayout";

function renderBoardSlot({
  ab,
  artboardPropsById,
  activeArtboardId,
  compositeDisplayScale,
  renderModeKey,
  previewArtboardMotionSx,
  showImageMiniPreview,
  onArtboardHeadlineChange,
  onArtboardSubtextChange,
  onContextMenu,
}) {
  const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
  const props = artboardPropsById[ab.id];
  if (!preset || !props) return null;
  const isActive = ab.id === activeArtboardId;
  return (
    <Box
      onContextMenu={onContextMenu}
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: 1,
        border: isActive ? "2px solid transparent" : "1px solid",
        borderColor: isActive ? "transparent" : "divider",
        background: isActive
          ? `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(135deg, #38bdf8 0%, #818cf8 100%) border-box`
          : theme.palette.background.paper,
        boxShadow: isActive
          ? "0 0 0 4px rgba(56,189,248,0.12), 0 8px 32px rgba(56,189,248,0.28), 0 2px 8px rgba(129,140,248,0.18)"
          : theme.shadows[2],
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        ...previewArtboardMotionSx,
      })}
    >
      <Box sx={{ width: preset.width, height: preset.height, lineHeight: 0 }}>
        <AdArtboard
          key={`${ab.id}-${ab.selectedSizeId}-${ab.placement}-${renderModeKey}`}
          {...props}
          previewInteractionScale={compositeDisplayScale}
          width={preset.width}
          height={preset.height}
          onHeadlineChange={isActive ? onArtboardHeadlineChange : undefined}
          onSubtextChange={isActive ? onArtboardSubtextChange : undefined}
          showImagePanMiniPreview={showImageMiniPreview}
        />
      </Box>
    </Box>
  );
}

export default function AdBuilderPreviewColumn({
  previewPreset,
  previewZoom,
  setPreviewZoom,
  previewPan,
  displayScale,
  prefersReducedMotion,
  artboardProps,
  artboardPropsById = {},
  state,
  artboards = [],
  activeArtboardId,
  onSelectArtboard,
  /** Clicking empty preview padding clears the active banner selection. */
  onClearArtboardSelection,
  onRemoveArtboard,
  onReorderArtboards,
  onUpdateArtboardPosition,
  exportError,
  exporting,
  onExport,
  /** When true, export is blocked until a banner is selected on the canvas. */
  exportDisabled = false,
  /** When true, no artboard is selected — the export button shows "Download All (ZIP)". */
  exportAll = false,
  bgImageLoading,
  spacePanHeld,
  panDraggingUi,
  bindPreviewWheelRef,
  onPreviewPointerDown,
  onPreviewPointerMove,
  onPreviewPointerUp,
  onFitPreviewView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onArtboardHeadlineChange,
  onArtboardSubtextChange,
  activeInlineTextRole,
  inlineTextAnchorEl,
  setField,
  onOpenStockDialog,
  shortcutsPopoverProps,
  onCopyContentToAll,
  onSave,
  onSaveAs,
  isSaving = false,
  onOpenLoadBoards,
  onNewBoard,
  panTargetRef,
  savedBoardId,
  currentBoardName,
  onSupportNavigation,
}) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuAnchor({ mouseX: e.clientX, mouseY: e.clientY });
  };
  const handleContextMenuClose = () => setContextMenuAnchor(null);

  const boardDims = useMemo(() => computeBoardLayoutDims(artboards), [artboards]);
  const artboardBasePositions = useMemo(() => computeArtboardBasePositions(artboards), [artboards]);
  /** Multi-banner scale must not depend on the active artboard’s preset (that caused a “zoom out” when selecting ads). */
  const compositeDisplayScaleMulti = useMemo(() => {
    const maxPreviewW = 720;
    const maxPreviewH = 560;
    return Math.min(maxPreviewW / boardDims.w, maxPreviewH / boardDims.h, 1) * previewZoom;
  }, [boardDims.w, boardDims.h, previewZoom]);
  const compositeDisplayScale =
    artboards.length > 1 ? compositeDisplayScaleMulti : displayScale;

  const [showImageMiniPreview, setShowImageMiniPreview] = useState(false);
  const [saveMenuAnchor, setSaveMenuAnchor] = useState(null);

  // Delayed overlay visibility for fade-out when bg image finishes loading
  const [showBgOverlay, setShowBgOverlay] = useState(false);
  const bgOverlayTimerRef = useRef(null);
  useEffect(() => {
    if (bgImageLoading) {
      clearTimeout(bgOverlayTimerRef.current);
      setShowBgOverlay(true);
    } else {
      bgOverlayTimerRef.current = setTimeout(() => setShowBgOverlay(false), 280);
    }
    return () => clearTimeout(bgOverlayTimerRef.current);
  }, [bgImageLoading]);

  const dragFromIdx = React.useRef(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Free-form artboard drag state
  const artboardDragRef = React.useRef(null); // { id, startClientX, startClientY, posX, posY }
  const [artboardDragDelta, setArtboardDragDelta] = useState(null); // { id, dx, dy }

  useEffect(() => {
    if (activeInlineTextRole !== "image") {
      setShowImageMiniPreview(false);
    }
  }, [activeInlineTextRole]);

  useEffect(() => {
    setShowImageMiniPreview(false);
  }, [state.selectedSizeId]);

  const inlineToolbarRepositionKey = useMemo(
    () =>
      `${previewZoom}-${previewPan.x}-${previewPan.y}-${compositeDisplayScale}-${state.headlineFontScale}-${state.subtextFontScale}-${state.headlineAlign}-${state.subtextAlign}-${state.ctaFontScale}-${state.ctaPaddingScale}-${state.ctaAlign}-${state.photoBandHeightRatio}-${state.logoScale}-${state.logoAlign}-${state.logoPlacement}-${state.imageScale}`,
    [
      previewZoom,
      previewPan.x,
      previewPan.y,
      compositeDisplayScale,
      state.headlineFontScale,
      state.subtextFontScale,
      state.headlineAlign,
      state.subtextAlign,
      state.ctaFontScale,
      state.ctaPaddingScale,
      state.ctaAlign,
      state.photoBandHeightRatio,
      state.logoScale,
      state.logoAlign,
      state.logoPlacement,
      state.imageScale,
    ],
  );
  const previewArtboardMotionSx =
    prefersReducedMotion
      ? {}
      : {
          "@keyframes dabPreviewEnter": {
            from: { opacity: 0.72 },
            to: { opacity: 1 },
          },
          animation: `dabPreviewEnter ${PREVIEW_ENTER_MS}s ease-out`,
        };

  /** Same dot grid as the loading-state wrapper in DigitalAdBuilderPage so the preview area stays visually consistent. */
  const previewShellDotBg = (theme) => ({
    bgcolor: "background.default",
    backgroundImage: `radial-gradient(${alpha(theme.palette.divider, 0.2)} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
  });

  return (
    <>
    <Box
      sx={(theme) => ({
        ...previewShellDotBg(theme),
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: 0, lg: 0 },
        height: { xs: "auto", lg: "100%" },
        maxHeight: { lg: "100%" },
        overflow: "hidden",
        order: { xs: 1, lg: 2 },
        maxWidth: { xs: "100%", lg: "none" },
        mx: { xs: "auto", lg: 0 },
      })}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: { xs: 2, md: 2.5 },
          pt: { xs: 1.5, md: 2 },
          pb: { xs: 1, md: 1.25 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          sx={{ width: "100%", minHeight: 40 }}
        >
          {/* Board management — left cluster */}
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Tooltip title="New board" arrow placement="bottom" enterDelay={300}>
              <IconButton
                size="small"
                onClick={onNewBoard}
                aria-label="Create a new blank board"
                sx={{ width: 32, height: 32 }}
              >
                <FilePlus size={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="My boards" arrow placement="bottom" enterDelay={300}>
              <IconButton
                size="small"
                onClick={onOpenLoadBoards}
                aria-label="Browse and load previously saved boards"
                sx={{ width: 32, height: 32 }}
              >
                <FolderOpen size={16} />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              disabled={isSaving}
              onClick={(e) => setSaveMenuAnchor(e.currentTarget)}
              startIcon={<FloppyDisk size={14} />}
              endIcon={<CaretDown size={11} />}
              aria-haspopup="true"
              sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.75rem" }}
            >
              Save
            </Button>

            <Menu
              anchorEl={saveMenuAnchor}
              open={Boolean(saveMenuAnchor)}
              onClose={() => setSaveMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              slotProps={{ paper: { sx: { minWidth: 180, mt: 0.5 } } }}
            >
              <MenuItem
                disabled={!savedBoardId || isSaving}
                onClick={() => { onSave?.(); setSaveMenuAnchor(null); }}
                dense
              >
                <ListItemIcon><FloppyDisk size={15} /></ListItemIcon>
                <ListItemText
                  primary="Save"
                  secondary={savedBoardId ? `Overwrites "${currentBoardName}"` : "No board loaded"}
                  slotProps={{ secondary: { sx: { fontSize: "0.68rem" } } }}
                />
              </MenuItem>
              <MenuItem
                onClick={() => { onSaveAs?.(); setSaveMenuAnchor(null); }}
                dense
              >
                <ListItemIcon><Copy size={15} /></ListItemIcon>
                <ListItemText primary="Save as new board…" />
              </MenuItem>
            </Menu>

            {currentBoardName && (
              <Tooltip title={`Currently editing: ${currentBoardName}`} arrow placement="bottom" enterDelay={400}>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    maxWidth: 160,
                    fontSize: "0.72rem",
                    color: "text.secondary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: { xs: "none", md: "block" },
                    ml: 0.25,
                  }}
                >
                  {currentBoardName}
                </Typography>
              </Tooltip>
            )}
          </Stack>

          {/* Actions — right cluster */}
          <Stack direction="row" alignItems="center" gap={0.75} flexShrink={0}>
            <Tooltip
              title="Beta — you may run into rough edges while we improve this. Click to report a bug."
              arrow
              placement="bottom"
              enterDelay={200}
              slotProps={{ tooltip: { sx: { maxWidth: 260, typography: "caption", lineHeight: 1.45 } } }}
            >
              <IconButton
                onClick={onSupportNavigation}
                size="small"
                aria-label="Report a bug"
                sx={{
                  width: 32,
                  height: 32,
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  position: "relative",
                  "&::after": {
                    content: '"β"',
                    position: "absolute",
                    top: -5,
                    right: -5,
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    px: "3px",
                    py: "1px",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: "4px",
                  },
                }}
              >
                <Bug size={15} />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ExportDownloadButton
                exporting={exporting}
                disabled={exporting || !state.selectedSizeId || exportDisabled}
                onExport={onExport}
                size="small"
                exportAll={exportAll}
              />
            </Box>
          </Stack>
        </Stack>
        {artboards.length > 0 && (
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            gap={0.75}
            sx={{ width: "100%", mt: 1.25, pt: 1.25, borderTop: "1px solid", borderColor: "divider" }}
            role="tablist"
            aria-label="Artboard sizes on this creative"
          >
            {artboards.map((ab, idx) => {
              const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
              const sizeLabel = preset
                ? `${preset.label} · ${preset.width}×${preset.height}`
                : ab.selectedSizeId;
              const placeLabel =
                ab.placement === "center"
                  ? "Main"
                  : ab.placement.charAt(0).toUpperCase() + ab.placement.slice(1);
              const label = artboards.length > 1 ? `${sizeLabel} · ${placeLabel}` : sizeLabel;
              const isActive = ab.id === activeArtboardId;
              const isDragOver = dragOverIdx === idx;
              return (
                <Box
                  key={ab.id}
                  draggable
                  onDragStart={(e) => {
                    dragFromIdx.current = idx;
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverIdx(idx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDragLeave={() => setDragOverIdx(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverIdx(null);
                    if (dragFromIdx.current !== null && dragFromIdx.current !== idx) {
                      onReorderArtboards?.(dragFromIdx.current, idx);
                    }
                    dragFromIdx.current = null;
                  }}
                  onDragEnd={() => {
                    setDragOverIdx(null);
                    dragFromIdx.current = null;
                  }}
                  sx={(theme) => ({
                    cursor: "grab",
                    outline: isDragOver ? `2px dashed ${theme.palette.primary.main}` : "none",
                    outlineOffset: 2,
                    borderRadius: "16px",
                    transition: "outline 0.15s ease, opacity 0.15s ease, transform 0.15s ease",
                    opacity: dragFromIdx.current === idx ? 0.4 : 1,
                    transform: isDragOver ? "scale(1.04)" : "scale(1)",
                    ...(prefersReducedMotion
                      ? {}
                      : {
                          "@keyframes chipIn": {
                            from: { opacity: 0, transform: "scale(0.88)" },
                            to: { opacity: 1, transform: "scale(1)" },
                          },
                          animation: `chipIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.04}s both`,
                        }),
                  })}
                >
                  <Chip
                    size="small"
                    label={label}
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtboard?.(ab.id);
                    }}
                    onDelete={
                      onRemoveArtboard ? () => onRemoveArtboard(ab.id) : undefined
                    }
                    sx={{ fontVariantNumeric: "tabular-nums", maxWidth: "100%", cursor: "grab" }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
        {exporting && (
          <LinearProgress sx={{ mt: 1.25, borderRadius: 1, height: 3 }} />
        )}
      </Box>

      {exportError && (
        <Alert severity="error" sx={{ flexShrink: 0, mx: 2, mt: 1.5, borderRadius: 1 }}>
          {exportError}
        </Alert>
      )}

      <Box
        ref={bindPreviewWheelRef}
        role="region"
        aria-label="Live preview canvas. Ctrl or Command plus scroll wheel to zoom. Hold Space and drag to pan."
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            // Force-commit any in-progress inline text edit before deselecting the artboard.
            // Clicking the non-focusable canvas background doesn't trigger a native blur, so
            // the contentEditable stays focused while activeArtboardId becomes null — the next
            // blur would then call setField with idx === -1 and silently drop the edit.
            // Explicitly blurring first ensures onCommit fires while the artboard is still active.
            const ae = document.activeElement;
            if (ae && ae !== document.body && e.currentTarget.contains(ae)) {
              ae.blur();
            }
            onClearArtboardSelection?.();
          }
          onPreviewPointerDown(e);
        }}
        onPointerMove={onPreviewPointerMove}
        onPointerUp={onPreviewPointerUp}
        onPointerCancel={onPreviewPointerUp}
        sx={{
          flex: 1,
          minHeight: { xs: 280, lg: 0 },
          position: "relative",
          overflow: "hidden",
          py: 3,
          px: { xs: 2, md: 3 },
          cursor: spacePanHeld ? (panDraggingUi ? "grabbing" : "grab") : "default",
          userSelect: spacePanHeld ? "none" : undefined,
          touchAction: spacePanHeld ? "none" : undefined,
          bgcolor: "transparent",
        }}
      >
        {artboards.length === 0 ? (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              textAlign: "center",
              px: 3,
              maxWidth: 340,
            }}
          >
            <FrameCorners size={44} weight="duotone" style={{ opacity: 0.28 }} aria-hidden />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontWeight: 600 }}>
              Pick a template to get started
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: "block", lineHeight: 1.55 }}>
              Choose a layout from the Templates tab on the left, or select an ad size to start from scratch.
            </Typography>
          </Box>
        ) : previewPreset && artboards.length > 1 ? (
          <Box
            ref={panTargetRef}
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: boardDims.w * compositeDisplayScale,
              height: boardDims.h * compositeDisplayScale,
              transform: `translate(-50%, -50%) translate(${previewPan.x}px, ${previewPan.y}px)`,
              willChange: "transform",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: boardDims.w,
                height: boardDims.h,
                transform: `scale(${compositeDisplayScale})`,
                transformOrigin: "top left",
                overflow: "visible",
              }}
            >
              {artboards.map((ab) => {
                const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
                const props = artboardPropsById[ab.id];
                if (!preset || !props) return null;
                const isActive = ab.id === activeArtboardId;
                const base = artboardBasePositions[ab.id] ?? { x: 0, y: 0 };
                const dragDelta = artboardDragDelta?.id === ab.id ? artboardDragDelta : null;
                const finalX = base.x + (ab.posX ?? 0) + (dragDelta?.dx ?? 0);
                const finalY = base.y + (ab.posY ?? 0) + (dragDelta?.dy ?? 0);
                const isDraggingThis = Boolean(dragDelta);

                const handleDragPointerDown = (e) => {
                  if (spacePanHeld || e.button !== 0) return;
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  artboardDragRef.current = {
                    id: ab.id,
                    startClientX: e.clientX,
                    startClientY: e.clientY,
                    posX: ab.posX ?? 0,
                    posY: ab.posY ?? 0,
                    moved: false,
                  };
                };
                const handleDragPointerMove = (e) => {
                  if (!artboardDragRef.current || artboardDragRef.current.id !== ab.id) return;
                  const rawDx = (e.clientX - artboardDragRef.current.startClientX) / compositeDisplayScale;
                  const rawDy = (e.clientY - artboardDragRef.current.startClientY) / compositeDisplayScale;
                  if (!artboardDragRef.current.moved && Math.abs(rawDx) < 4 && Math.abs(rawDy) < 4) return;
                  artboardDragRef.current.moved = true;
                  setArtboardDragDelta({ id: ab.id, dx: rawDx, dy: rawDy });
                };
                const handleDragPointerUp = (e) => {
                  if (!artboardDragRef.current || artboardDragRef.current.id !== ab.id) return;
                  if (artboardDragRef.current.moved) {
                    const dx = (e.clientX - artboardDragRef.current.startClientX) / compositeDisplayScale;
                    const dy = (e.clientY - artboardDragRef.current.startClientY) / compositeDisplayScale;
                    onUpdateArtboardPosition?.(
                      ab.id,
                      Math.round(artboardDragRef.current.posX + dx),
                      Math.round(artboardDragRef.current.posY + dy),
                    );
                  }
                  artboardDragRef.current = null;
                  setArtboardDragDelta(null);
                };
                const handleDragPointerCancel = () => {
                  artboardDragRef.current = null;
                  setArtboardDragDelta(null);
                };

                const CORNER_POSITIONS = [
                  { top: -4, left: -4 },
                  { top: -4, right: -4 },
                  { bottom: -4, left: -4 },
                  { bottom: -4, right: -4 },
                ];

                return (
                  <Box
                    key={ab.id}
                    role="presentation"
                    sx={{
                      position: "absolute",
                      left: finalX,
                      top: finalY,
                      lineHeight: 0,
                      zIndex: isDraggingThis ? 10 : isActive ? 2 : 1,
                      cursor: isDraggingThis ? "grabbing" : "default",
                      userSelect: "none",
                      touchAction: "none",
                      // Reveal corner handles on hover or while dragging
                      "&:hover [data-drag-handle]": { opacity: 1, transform: "scale(1)" },
                      ...(isDraggingThis ? { "& [data-drag-handle]": { opacity: 1, transform: "scale(1)" } } : {}),
                    }}
                    onClick={(e) => {
                      if (artboardDragRef.current?.moved) return;
                      e.stopPropagation();
                      onSelectArtboard?.(ab.id);
                    }}
                  >
                    {renderBoardSlot({
                      ab,
                      artboardPropsById,
                      activeArtboardId,
                      compositeDisplayScale,
                      renderModeKey: `multi-${artboards.length}`,
                      previewArtboardMotionSx,
                      showImageMiniPreview,
                      onArtboardHeadlineChange,
                      onArtboardSubtextChange,
                      onContextMenu: handleContextMenu,
                    })}

                    {/* Corner drag handles */}
                    {CORNER_POSITIONS.map((pos, i) => (
                      <Box
                        key={i}
                        data-drag-handle
                        onPointerDown={handleDragPointerDown}
                        onPointerMove={handleDragPointerMove}
                        onPointerUp={handleDragPointerUp}
                        onPointerCancel={handleDragPointerCancel}
                        sx={(theme) => ({
                          position: "absolute",
                          ...pos,
                          width: 8,
                          height: 8,
                          bgcolor: "background.paper",
                          border: "1.5px solid",
                          borderColor: "primary.main",
                          borderRadius: "2px",
                          boxShadow: `0 1px 3px rgba(0,0,0,0.22), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.12)}`,
                          opacity: 0,
                          transform: "scale(0.55)",
                          transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.15s ease",
                          cursor: isDraggingThis ? "grabbing" : "grab",
                          zIndex: 12,
                          "&:hover": {
                            transform: "scale(1.35)",
                            bgcolor: "primary.main",
                          },
                        })}
                      />
                    ))}
                  </Box>
                );
              })}
            </Box>
            {showBgOverlay && state.backgroundImageUrl && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.12)",
                  borderRadius: 1,
                  zIndex: 4,
                  pointerEvents: "none",
                  opacity: bgImageLoading ? 1 : 0,
                  transition: "opacity 0.28s ease",
                }}
              >
                <CircularProgress size={40} thickness={4} />
              </Box>
            )}
          </Box>
        ) : previewPreset ? (
          <Box
            ref={panTargetRef}
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: previewPreset.width * displayScale,
              height: previewPreset.height * displayScale,
              transform: `translate(-50%, -50%) translate(${previewPan.x}px, ${previewPan.y}px)`,
              willChange: "transform",
              zIndex: 1,
            }}
          >
            <Box
              key={state.activeArtboardId ?? state.selectedSizeId}
              role="presentation"
              onContextMenu={handleContextMenu}
              onClick={(e) => {
                e.stopPropagation();
                const id = artboards[0]?.id;
                if (id) onSelectArtboard?.(id);
              }}
              sx={(theme) => ({
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 1,
                border: activeArtboardId ? "2px solid transparent" : "1px solid",
                borderColor: activeArtboardId ? "transparent" : "divider",
                background: activeArtboardId
                  ? `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(135deg, #38bdf8 0%, #818cf8 100%) border-box`
                  : theme.palette.background.paper,
                boxShadow: activeArtboardId
                  ? "0 0 0 4px rgba(56,189,248,0.12), 0 8px 32px rgba(56,189,248,0.28), 0 2px 8px rgba(129,140,248,0.18)"
                  : theme.shadows[2],
                bgcolor: "background.paper",
                cursor: "pointer",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                ...previewArtboardMotionSx,
              })}
            >
              <Box
                sx={{
                  width: previewPreset.width,
                  height: previewPreset.height,
                  transform: `scale(${displayScale})`,
                  transformOrigin: "top left",
                }}
              >
                <AdArtboard
                  key={`${artboards[0]?.id ?? "single"}-${state.selectedSizeId}-${artboards.length}-single`}
                  {...artboardProps}
                  width={previewPreset.width}
                  height={previewPreset.height}
                  onHeadlineChange={onArtboardHeadlineChange}
                  onSubtextChange={onArtboardSubtextChange}
                  showImagePanMiniPreview={showImageMiniPreview}
                />
              </Box>
              {showBgOverlay && state.backgroundImageUrl && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(0,0,0,0.18)",
                    borderRadius: 1,
                    zIndex: 4,
                    pointerEvents: "none",
                    opacity: bgImageLoading ? 1 : 0,
                    transition: "opacity 0.28s ease",
                  }}
                >
                  <CircularProgress size={40} thickness={4} />
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              textAlign: "center",
              px: 3,
              maxWidth: 340,
            }}
          >
            <FrameCorners size={44} weight="duotone" style={{ opacity: 0.28 }} aria-hidden />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontWeight: 600 }}>
              Pick a template to get started
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: "block", lineHeight: 1.55 }}>
              Choose a layout from the Templates tab on the left, or select an ad size to start from scratch.
            </Typography>
          </Box>
        )}

        {activeInlineTextRole &&
          inlineTextAnchorEl &&
          setField &&
          (activeInlineTextRole !== "image" || onOpenStockDialog) && (
            <AdBuilderInlineTextToolbarPortal
              open
              anchorEl={inlineTextAnchorEl}
              role={activeInlineTextRole}
              state={state}
              setField={setField}
              onOpenStockDialog={onOpenStockDialog}
              repositionKey={inlineToolbarRepositionKey}
              prefersReducedMotion={prefersReducedMotion}
              showMiniPreview={showImageMiniPreview}
              onToggleMiniPreview={() => setShowImageMiniPreview((v) => !v)}
            />
          )}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pb: { xs: 2, sm: 2.5 },
            pointerEvents: "none",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ pointerEvents: "none", flexWrap: "wrap", maxWidth: "100%", px: 1 }}
          >
            <Box sx={{ pointerEvents: "auto" }}>
              <AdBuilderPreviewFloatingToolbar
                previewZoom={previewZoom}
                setPreviewZoom={setPreviewZoom}
                onFitToView={onFitPreviewView}
                hasPreset={Boolean(previewPreset)}
                disabled={!previewPreset}
                onUndo={onUndo}
                onRedo={onRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                prefersReducedMotion={prefersReducedMotion}
              />
            </Box>
            {shortcutsPopoverProps && (
              <Box sx={{ pointerEvents: "auto" }}>
                <PreviewShortcutsPopover {...shortcutsPopoverProps} inline />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>

    <Menu
      open={Boolean(contextMenuAnchor)}
      onClose={handleContextMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenuAnchor
          ? { top: contextMenuAnchor.mouseY, left: contextMenuAnchor.mouseX }
          : undefined
      }
      slotProps={{ paper: { sx: { minWidth: 200 } } }}
    >
      <MenuItem
        disabled={!onCopyContentToAll || artboards.length < 2}
        onClick={() => {
          onCopyContentToAll?.();
          handleContextMenuClose();
        }}
      >
        <ListItemIcon>
          <Copy size={16} />
        </ListItemIcon>
        <ListItemText
          primary="Copy content to all"
          secondary={artboards.length < 2 ? "Add more artboards first" : null}
        />
      </MenuItem>
    </Menu>
    </>
  );
}
