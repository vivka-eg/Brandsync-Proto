"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton, Checkbox, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { PencilSimple, Trash, ImageSquare, WarningCircle } from "phosphor-react";

const MotionBox = motion(Box);
const GENERIC_BUSINESS_UNITS = new Set(["", "general", "other", "all", null]);

const shimmerSx = {
  background: "linear-gradient(90deg, #efefef 25%, #e0e0e0 50%, #efefef 75%)",
  backgroundSize: "200% 100%",
  animation: "cardShimmer 1.5s ease-in-out infinite",
  "@keyframes cardShimmer": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
};

export default function PhotoCard({
  photo,
  onClick,
  isSelectMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  businessUnits = [],
  showBusinessUnitHoverIcon = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const businessUnitValue = String(
    photo?.businessUnitId || photo?.businessUnit || photo?.businessUnitName || ""
  )
    .trim()
    .toLowerCase();
  const matchedBusinessUnit =
    businessUnits.find((bu) => String(bu.id || "").trim() === String(photo?.businessUnitId || "").trim()) ||
    businessUnits.find((bu) => String(bu.id || "").trim() === String(photo?.businessUnit || "").trim());
  const assignedBusinessUnit =
    matchedBusinessUnit?.name || String(photo?.businessUnitName || "").trim();
  const showBusinessUnitBadge =
    showBusinessUnitHoverIcon &&
    !GENERIC_BUSINESS_UNITS.has(businessUnitValue) &&
    Boolean(assignedBusinessUnit);

  const isPortrait =
    photo.dimensions && photo.dimensions.height > photo.dimensions.width;

  const aspectRatio =
    photo.dimensions?.width && photo.dimensions?.height
      ? `${photo.dimensions.width} / ${photo.dimensions.height}`
      : isPortrait
        ? "3 / 4"
        : "4 / 3";

  const handleCardClick = (e) => {
    if (isSelectMode) {
      e.stopPropagation();
      onSelect(photo.id);
    } else {
      onClick();
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(photo);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(photo);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect(photo.id);
  };

  return (
    <MotionBox
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      sx={{
        cursor: "pointer",
        borderRadius: "16px",
        boxShadow: isSelected
          ? "0 0 0 3px #1976d2, 0 4px 16px rgba(25, 118, 210, 0.2)"
          : isHovered
            ? "0 8px 24px rgba(0,0,0,0.18)"
            : "0 1px 4px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.25s ease",
        overflow: "hidden",
        display: "block",
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: aspectRatio,
          bgcolor: "#efefef",
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        {!imageLoaded && !imageError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              ...shimmerSx,
            }}
          />
        )}

        {imageError ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #b0b0b0 0%, #d8d8d8 50%, #b0b0b0 100%)",
              color: "rgba(0,0,0,0.5)",
              gap: 1,
            }}
          >
            <ImageSquare size={32} weight="regular" />
            <Typography variant="caption" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
              Unable to load image
            </Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={photo.thumbnail}
            alt={photo.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
            p: 1.5,
            pt: 5,
            display: "flex",
            alignItems: "flex-end",
            zIndex: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.85rem",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              width: "100%",
            }}
          >
            {photo.title}
          </Typography>
        </Box>

        {showBusinessUnitBadge && (
          <Tooltip
            title={`This image should only be used by the assigned business unit: ${assignedBusinessUnit}.`}
            arrow
            placement="right"
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "rgba(122, 82, 0, 0.92)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(4px)",
                zIndex: 4,
              }}
            >
              <WarningCircle size={18} weight="fill" />
            </Box>
          </Tooltip>
        )}

        <AnimatePresence>
          {isHovered && !isSelectMode && (onEdit || onDelete) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.15)",
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                {onEdit && (
                  <IconButton
                    size="small"
                    onClick={handleEditClick}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.95)",
                      color: "primary.main",
                      width: 32,
                      height: 32,
                      "&:hover": { bgcolor: "primary.main", color: "white" },
                    }}
                  >
                    <PencilSimple size={18} weight="bold" />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={handleDeleteClick}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.95)",
                      color: "error.main",
                      width: 32,
                      height: 32,
                      "&:hover": { bgcolor: "error.main", color: "white" },
                    }}
                  >
                    <Trash size={18} weight="bold" />
                  </IconButton>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {isSelectMode && (
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <Checkbox
              checked={isSelected || false}
              onClick={handleCheckboxClick}
              sx={{
                p: 0,
                bgcolor: "rgba(255,255,255,0.95)",
                borderRadius: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "white" },
                "& .MuiSvgIcon-root": {
                  fontSize: 24,
                  color: isSelected ? "primary.main" : "text.secondary",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}
