"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ArrowsOut, X } from "phosphor-react";
import BrowserFrame from "./BrowserFrame";

/**
 * Pattern image previewer with loading state, hover magnify icon, and expand modal.
 *
 * @param {string}  props.src          - Screenshot URL
 * @param {string}  props.alt          - Alt text
 * @param {string}  [props.activeDevice] - "desktop" | "tablet" | "mobile" (default: "desktop")
 * @param {Object}  [props.sx]         - Extra sx for the outer container
 */
export default function PatternImagePreviewer({
  src,
  alt,
  activeDevice = "desktop",
  sx,
}) {
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);
  }, [src]);

  const image = (
    <Box
      component="img"
      src={src}
      alt={alt}
      onLoad={() => setLoading(false)}
      onError={() => { setLoading(false); setHasError(true); }}
      sx={{
        display: "block",
        width: "100%",
        height: "auto",
        opacity: loading ? 0 : 1,
        transition: "opacity 0.2s",
      }}
    />
  );

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: "#f0f2f5",
          borderRadius: 1.5,
          p: 2,
          overflow: "hidden",
          ...sx,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Loading spinner */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f0f2f5",
              borderRadius: 1.5,
              zIndex: 1,
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Device-sized wrapper with browser frame */}
        <Box
          sx={{
            ...(activeDevice === "desktop" && { width: "100%" }),
            ...(activeDevice === "tablet"  && { width: 600, minWidth: 600, flexShrink: 0 }),
            ...(activeDevice === "mobile"  && { width: 400, minWidth: 400, flexShrink: 0 }),
          }}
        >
          <BrowserFrame device={activeDevice}>
            {image}
          </BrowserFrame>
        </Box>

        {/* Magnify icon; only shown on hover when image is ready */}
        {hovered && !loading && !hasError && (
          <Tooltip title="Enlarged view" placement="bottom">
            <Box
              onClick={() => setModalOpen(true)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ArrowsOut size={24} weight="bold" color="white" />
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Expanded image modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
        onClick={() => setModalOpen(false)}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
            borderRadius: 2,
            overflow: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Close" placement="bottom">
            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
              }}
            >
              <X size={20} />
            </IconButton>
          </Tooltip>

          <BrowserFrame device={activeDevice}>
            <Box
              component="img"
              src={src}
              alt={alt}
              sx={{ display: "block", width: "100%", height: "auto" }}
            />
          </BrowserFrame>
        </Box>
      </Modal>
    </>
  );
}
