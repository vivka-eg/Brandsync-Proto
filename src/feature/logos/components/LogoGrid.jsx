import { Box, Typography, Skeleton } from "@mui/material";
import { FolderOpen } from "phosphor-react";
import { motion } from "motion/react";

function LogoGrid({ logos, selectedLogo, onLogoSelect, isLoading }) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          pr: 1,
          pb: 2,
          p: 0.5,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: "8px",
                bgcolor: "background.paper",
              }}
            >
              <Skeleton
                variant="rounded"
                width={56}
                height={56}
                sx={{ borderRadius: "6px" }}
              />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          </motion.div>
        ))}
      </Box>
    );
  }

  if (logos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            px: 3,
            textAlign: "center",
          }}
        >
          <FolderOpen
            size={64}
            weight="duotone"
            style={{ color: "#9CA3AF", marginBottom: "16px" }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            mb={1}
          >
            No logos found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or browse all available logos
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 2,
        pr: 1.5,
        pb: 2,
        p: 0.5,
      }}
    >
      {logos.map((logo, index) => (
        <motion.div
          key={logo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <motion.div
            whileHover={{
              y: -4,
              scale: 1.02,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 17,
              },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Box
              onClick={() => onLogoSelect(logo)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: "8px",
                cursor: "pointer",
                bgcolor:
                  selectedLogo?.id === logo.id
                    ? "rgba(25, 118, 210, 0.08)"
                    : "background.paper",
                position: "relative",
                overflow: "visible",
                boxShadow:
                  selectedLogo?.id === logo.id
                    ? "inset 0 0 0 2px rgba(25, 118, 210, 0.5)"
                    : "none",
                transition:
                  "background-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  bgcolor:
                    selectedLogo?.id === logo.id
                      ? "rgba(25, 118, 210, 0.12)"
                      : "rgba(0, 0, 0, 0.04)",
                  boxShadow:
                    selectedLogo?.id === logo.id
                      ? "inset 0 0 0 2px rgba(25, 118, 210, 0.6)"
                      : "0 4px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  bgcolor: "background.default",
                  borderRadius: "6px",
                  p: 1,
                }}
              >
                <img
                  src={logo.assets.logo}
                  alt={logo.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                fontWeight={selectedLogo?.id === logo.id ? 600 : 500}
                textAlign="center"
                sx={{
                  color:
                    selectedLogo?.id === logo.id
                      ? "primary.main"
                      : "text.primary",
                  fontSize: "0.875rem",
                  fontFamily: "'Neo Sans', sans-serif",
                }}
              >
                {logo.name}
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      ))}
    </Box>
  );
}

export default LogoGrid;
