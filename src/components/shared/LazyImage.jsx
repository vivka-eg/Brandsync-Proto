"use client";
import {
  Box,
  CircularProgress,
  useTheme,
  Modal,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react";
import Image from "next/image";

/**
 * LazyImage component with built-in lazy loading and circular progress loader
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} [props.width] - Image width (not needed if using fill)
 * @param {number} [props.height] - Image height (not needed if using fill)
 * @param {boolean} [props.fill] - Whether image should fill container
 * @param {boolean} [props.priority] - Whether to load with priority (default: false)
 * @param {Object} [props.style] - Custom styles
 * @param {Object} [props.sx] - MUI sx prop for container
 * @param {number} [props.testDelay] - Force loading state for testing (in ms)
 * @param {boolean} [props.enableModal] - Enable click modal (default: true)
 * @param {...Object} rest - Other props passed to Next.js Image
 */
const LazyImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  style,
  sx,
  testDelay = 0,
  enableModal = true,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();

  // Validate required props
  if (!src) {
    console.warn("LazyImage: src prop is required");
    return null;
  }

  // Check if URL is valid (only for non-relative URLs)
  if (src.startsWith("http") || src.startsWith("//")) {
    try {
      new URL(src);
    } catch (error) {
      console.warn("LazyImage: Invalid URL provided", src);
      setHasError(true);
      setIsLoading(false);
    }
  }

  if (!alt) {
    console.warn("LazyImage: alt prop is required for accessibility");
  }

  const handleLoadingComplete = () => {
    // console.log("LazyImage: Image loaded successfully", src);
    // Add test delay if specified
    if (testDelay > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, testDelay);
    } else {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    // console.log("LazyImage: Image failed to load", error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleClick = () => {
    if (enableModal && !hasError && !isLoading) {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Determine dimensions for loader and error state
  const containerWidth = fill ? "100%" : width || "100%";
  const containerHeight = fill ? "100%" : height || 200;

  if (hasError) {
    return (
      <Box
        component="span"
        sx={{
          width: containerWidth,
          height: containerHeight,
          backgroundColor:
            theme.palette.mode === "dark" ? "grey.800" : "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "grey.700" : "grey.300",
          ...sx,
        }}
      >
        <span
          style={{
            color: theme.palette.mode === "dark" ? "#999" : "#666",
            fontSize: "14px",
          }}
        >
          Failed to load image
        </span>
      </Box>
    );
  }

  return (
    <>
      <Box
        component="span"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: "relative",
          display: "block",
          lineHeight: 0,
          cursor: enableModal ? "pointer" : "default",
          ...sx,
        }}
        onClick={handleClick}
      >
        {isLoading && (
          <Box
            component="span"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
              borderRadius: 1,
              zIndex: 1,
            }}
          >
            <CircularProgress
              size={40}
              sx={{
                color: theme.palette.mode === "dark" ? "white" : "primary.main",
              }}
            />
          </Box>
        )}

        <Image
          src={src}
          alt={alt || ""}
          width={fill ? undefined : (width || 800)}
          height={fill ? undefined : (height || 600)}
          fill={fill}
          priority={priority}
          onLoad={handleLoadingComplete}
          onError={handleError}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            borderRadius: "4px",
            ...(fill ? { objectFit: "cover" } : {}),
            ...style,
          }}
        />

        {/* Magnify icon in corner on hover */}
        {enableModal && hovered && !isLoading && !hasError && (
          <Tooltip title="Enlarged view" placement="bottom">
            <Box
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
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <MagnifyingGlassPlusIcon size={24} weight="bold" color="white" />
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Modal for enlarged image */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
        onClick={handleCloseModal}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#fff",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Tooltip title="close" placement="bottom">
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>

          {/* Enlarged image */}
          <Box
            sx={{
              width: "90vw",
              aspectRatio: "16/9", 
              maxHeight: "90vh",
              position: "relative",
            }}
          >
            <Image
              src={src}
              alt={alt || ""}
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LazyImage;
