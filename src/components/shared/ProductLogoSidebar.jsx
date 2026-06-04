"use client";
import React, { useState } from "react";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import {
  Box,
  Typography,
  Skeleton,
  ButtonBase,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
  useTheme,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import { CaretLeft, CaretRight, MagnifyingGlass } from "phosphor-react";
import { WifiSlash } from "@phosphor-icons/react";

function ProductLogoSidebar({
  logos,
  selectedLogo,
  onSelect,
  isLoading,
  searchQuery: externalSearch,
  onSearchChange: externalOnSearchChange,
  fetchError,
  positionVariant = "sticky",
  /** Narrow panels (e.g. AD Studio tab): full width, no viewport-height sidebar */
  embedded = false,
}) {
  const theme = useTheme();
  const [internalSearch, setInternalSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { register, onKeyDown, focusItem, focusedIndex } = useArrowKeyNavigation();

  const isControlled = externalSearch !== undefined;
  const searchQuery = isControlled ? externalSearch : internalSearch;
  const onSearchChange = isControlled ? externalOnSearchChange : setInternalSearch;

  const logos_list = isControlled
    ? logos
    : logos.filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box
      sx={{
        width: embedded ? "100%" : 260,
        flexShrink: 0,
        ...(embedded
          ? {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              borderRight: "none",
            }
          : positionVariant === "fixed"
            ? { position: "fixed", top: "64px", left: 0, bottom: "80px", zIndex: 10 }
            : {
                position: "sticky",
                top: 0,
                alignSelf: "flex-start",
                height: "calc(100vh - 64px)",
              }),
        ...(!embedded && {
          borderRight: "1px solid",
          borderColor: "divider",
        }),
        display: "flex",
        flexDirection: "column",
        bgcolor: embedded ? "transparent" : "background.paper",
      }}
    >
      <Box sx={{ px: embedded ? 0 : 2, pt: embedded ? 0 : 2.5, pb: 1.5, flexShrink: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            mb: 1.5,
            gap: 1,
          }}
        >
          {!collapsed && (
            <Typography variant="subtitle2" fontWeight={600}>
              Select Logo
            </Typography>
          )}
          <ButtonBase
            onClick={() => setCollapsed((c) => !c)}
            sx={{
              borderRadius: "6px",
              p: "4px",
              flexShrink: 0,
              "&:hover": { bgcolor: "action.hover" },
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
          </ButtonBase>
        </Box>
      </Box>

      {/* Search  -  hidden when collapsed */}
      {!collapsed && (
        <>
          <Box sx={{ px: embedded ? 0 : 2, pb: 1 }}>
            <TextField
              placeholder="Search logos…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey && logos_list.length > 0) {
                  e.preventDefault();
                  focusItem(0);
                }
              }}
              size="small"
              variant="outlined"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlass size={18} color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                  },
                },
              }}
              sx={{ mx: embedded ? 0 : "8px", width: embedded ? "100%" : "calc(100% - 16px)" }}
            />
          </Box>
          {embedded && selectedLogo && (
            <Box
              sx={{
                px: embedded ? 0 : 2,
                mt: 1.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              {selectedLogo.assets?.logo ? (
                <Box
                  sx={{
                    width: 36,
                    height: 36,
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
                    src={`/api/proxy-image?url=${encodeURIComponent(selectedLogo.assets.logo)}`}
                    alt=""
                    width={26}
                    height={26}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              ) : (
                <Box sx={{ width: 36, height: 36, bgcolor: "action.hover", borderRadius: 1, flexShrink: 0 }} />
              )}
              <Box sx={{ minWidth: 0, pt: 0.1 }}>
                <Typography variant="body2" fontWeight={600} noWrap title={selectedLogo.name}>
                  {selectedLogo.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.35, lineHeight: 1.35 }}
                >
                  Brand colours from this product apply to the ad when available.
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}

      <Divider sx={embedded ? { mx: 0 } : undefined} />

      {/* List  -  overflow-y: auto shows scrollbar only when content exceeds available height */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: embedded ? 0 : 1.5,
          py: 1,
          position: "relative",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": { background: "#D1D5DB", borderRadius: 3 },
        }}
      >
        {isLoading ? (
          Array.from({ length: logos.length || 10 }).map((_, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1, mb: 0.5 }}
            >
              <Skeleton variant="rounded" width={28} height={28} sx={{ flexShrink: 0, borderRadius: 1 }} />
              {!collapsed && <Skeleton variant="text" width="60%" height={18} />}
            </Box>
          ))
        ) : fetchError ? (
          <Alert
            severity="warning"
            icon={<WifiSlash size={16} />}
            sx={{ mx: 1, my: 1.5, fontSize: "0.75rem" }}
          >
            <AlertTitle sx={{ fontSize: "0.8rem" }}>VPN required</AlertTitle>
            Connect to the EG VPN and refresh.
          </Alert>
        ) : logos_list.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: collapsed ? "center" : "left" }}>
            No logos found
          </Typography>
        ) : (
          (() => {
            const selectedIndex = logos_list.findIndex((l) => l.id === selectedLogo?.id);
            const clampedFocus = focusedIndex >= 0 && focusedIndex < logos_list.length ? focusedIndex : -1;
            const rovingIndex = clampedFocus !== -1 ? clampedFocus : (selectedIndex !== -1 ? selectedIndex : 0);
            return logos_list.map((logo, index) => {
            const isSelected = selectedLogo?.id === logo.id;
            return (
              <Tooltip
                key={logo.id}
                title={collapsed ? logo.name : ""}
                placement="right"
                arrow
              >
                <ButtonBase
                  ref={register(index)}
                  onClick={() => onSelect(logo)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  tabIndex={rovingIndex === index ? 0 : -1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    width: "100%",
                    py: "10px",
                    px: "8px",
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: isSelected ? "neutral.container" : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "action.selected" : "action.hover",
                    },
                    "&.Mui-focusVisible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "2px",
                    },
                  }}
                >
                  <Stack direction="row" spacing={collapsed ? 0 : 1.5} alignItems="center">
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
                      {logo.assets?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/proxy-image?url=${encodeURIComponent(logo.assets.logo)}`}
                          alt={logo.name}
                          width={22}
                          height={22}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <Box sx={{ width: 22, height: 22, bgcolor: "action.hover", borderRadius: 1 }} />
                      )}
                    </Box>
                    {!collapsed && (
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 600 : 400}
                        noWrap
                        title={logo.name}
                        sx={{
                          color: isSelected ? "text.primary" : "neutral.main",
                          textAlign: "left",
                        }}
                      >
                        {logo.name}
                      </Typography>
                    )}
                  </Stack>
                </ButtonBase>
              </Tooltip>
            );
          });
          })()
        )}
      </Box>
    </Box>
  );
}

export default ProductLogoSidebar;