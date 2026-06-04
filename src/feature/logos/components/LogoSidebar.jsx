import React from "react";
import { Box, Typography, Skeleton, Divider } from "@mui/material";
import { MagnifyingGlass, X } from "phosphor-react";

function LogoSidebar({
  logos,
  selectedLogo,
  onLogoSelect,
  isLoading,
  currentPage,
  onPageChange,
  totalPages = 1,
  searchQuery = "",
  onSearchChange,
}) {
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        position: "fixed",
        top: "64px",
        left: 0,
        height: "calc(100vh - 64px)",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        zIndex: 10,
      }}
    >
      {/* Search */}
      <Box sx={{ px: 2, pt: 2.5, pb: 1.5, flexShrink: 0 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Select Logo
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.default",
          }}
        >
          <MagnifyingGlass size={16} style={{ opacity: 0.45, flexShrink: 0 }} />
          <input
            placeholder="Search logos…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              fontSize: 13,
              color: "inherit",
            }}
          />
          {searchQuery && (
            <Box
              onClick={() => onSearchChange("")}
              sx={{ cursor: "pointer", display: "flex", opacity: 0.45, "&:hover": { opacity: 1 }, flexShrink: 0 }}
            >
              <X size={14} />
            </Box>
          )}
        </Box>
      </Box>

      <Divider />

      {/* List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          py: 1,
          position: "relative",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": { background: "#D1D5DB", borderRadius: 3 },
        }}
      >
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1, mb: 0.5 }}
            >
              <Skeleton variant="rounded" width={28} height={28} sx={{ flexShrink: 0, borderRadius: 1 }} />
              <Skeleton variant="text" width="60%" height={18} />
            </Box>
          ))
        ) : logos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No logos found
          </Typography>
        ) : (
          logos.map((logo) => {
            const isSelected = selectedLogo?.id === logo.id;
            return (
              <Box
                key={logo.id}
                onClick={() => onLogoSelect(logo)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  mb: 0.5,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  bgcolor: isSelected ? "action.selected" : "transparent",
                  "&:hover": { bgcolor: isSelected ? "action.selected" : "action.hover" },
                  transition: "all 0.15s",
                }}
              >
                {logo.assets?.logo ? (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 1,
                      bgcolor: "#ffffff",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.assets.logo}
                      alt={logo.name}
                      width={22}
                      height={22}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ width: 28, height: 28, bgcolor: "action.hover", borderRadius: 1 }} />
                )}
                <Typography
                  variant="body2"
                  fontWeight={isSelected ? 600 : 400}
                  noWrap
                  title={logo.name}
                >
                  {logo.name}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

    </Box>
  );
}

export default LogoSidebar;
