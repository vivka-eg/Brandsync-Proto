import { Box, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "phosphor-react";

const MotionBox = motion(Box);

function ColorPreviewBox({
  color,
  index,
  selectedLogo,
  selectedColorTab,
  isHovered,
  isCopied,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  // Function to determine if a color is light
  const isLightColor = (hexColor) => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if luminance is greater than 0.7 (lighter colors)
    return luminance > 0.7;
  };

  const useBlackText = isLightColor(color);

  return (
    <MotionBox
      key={`${selectedLogo.id}-${selectedColorTab}-${index}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: index * 0.1,
          ease: [0.43, 0.13, 0.23, 0.96],
        }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      sx={{
        width: "120px",
        height: "120px",
        minWidth: "120px",
        minHeight: "120px",
        flexShrink: 0,
        bgcolor: color,
        borderRadius: "12px",
        border: isHighlighted || isHovered ? "2px solid" : "none",
        borderColor: isHighlighted ? "primary.main" : isHovered ? "primary.light" : "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        outline: "none",
        transition: "border 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isHovered ? "0 8px 20px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.08)",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "3px",
          borderRadius: "12px",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "0",
          height: "0",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.5)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.6s, height 0.6s",
        },
        ...(isCopied && {
          "&::before": {
            width: "300px",
            height: "300px",
          },
        }),
      }}
    >
      {/* Copy Icon - centered and only visible on hover */}
      <AnimatePresence>
        {isHovered && !isCopied && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              }
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: useBlackText ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Copy size={24} weight="bold" color={useBlackText ? "black" : "white"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copied indicator */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.2 }
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.3 }
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: useBlackText ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.4)",
            }}
          >
            <Stack alignItems="center" gap={1}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }
                }}
              >
                <Check size={32} weight="bold" color={useBlackText ? "black" : "white"} />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.1 }
                }}
              >
                <Typography
                  sx={{
                    color: useBlackText ? "black" : "white",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Copied!
                </Typography>
              </motion.div>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionBox>
  );
}

export default ColorPreviewBox;
