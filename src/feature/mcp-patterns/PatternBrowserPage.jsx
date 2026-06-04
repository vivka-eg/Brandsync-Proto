"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";
import PatternCardImageDummy from "./PatternCardImageDummy";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import { useMcpCategories } from "@/context/mcp/McpCategoriesContext";
import { Plus } from "phosphor-react";
import { useGridKeyNavigation } from "@/hooks/useGridKeyNavigation";
import { useTheme } from "@mui/material";
import McpVideoPlayer from "@/components/shared/McpVideoPlayer";

export default function PatternBrowserPage() {
  const router = useRouter();
  const { isAdmin, isSuperAdmin } = useMCPAuthContext();
  const canManage = isAdmin || isSuperAdmin;

  const { parents: categories, loading } = useMcpCategories();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const columns = isMd ? 3 : isSm ? 2 : 1;
  const { register, onKeyDown, focusedIndex, focusItem } = useGridKeyNavigation(columns);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          pt: 3,
          pb: 8,
          px: { xs: 2, md: 12 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            maxWidth: 900,
            mx: "auto",
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "48px",
              color: "#121212",
              textAlign: "center",
              letterSpacing: "0.375px",
            }}
          >
            UI patterns for your product stack
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#53585c",
              maxWidth: 520,
              textAlign: "center",
              lineHeight: "24px",
              letterSpacing: "0.15px",
            }}
          >
            Browse, configure, and generate BrandSync MCP prompts for any screen — tailored to your framework and brand colors.
          </Typography>
        </Box>
      </Box>

      {/* Video demo */}
      <Box sx={{ width: "100%", maxWidth: 833, px: { xs: 2, md: 0 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary",fontSize: "24px", lineHeight: "32px" }}>
          Video demo:
        </Typography>
        <McpVideoPlayer src="/mcp/videos/Level%20Up%20Your%20UI%20with%20BrandSync%20Patterns%20%F0%9F%9A%80.webm" poster="/mcp/videos/patterns-thumbnail.jpg" />
      </Box>

      {/* Browse by category */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            maxWidth: 900,
            mx: "auto",
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "36px",
              color: "#121212",
              textAlign: "center",
            }}
          >
            Browse by category
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#53585c",
              maxWidth: 520,
              textAlign: "center",
              lineHeight: "24px",
              letterSpacing: "0.15px",
            }}
          >
            Each category contains ready-to-configure patterns. Pick one to see what&apos;s available for your stack.
          </Typography>
        </Box>

        {/* Upload button (admin only) */}
        {canManage && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: 821, px: { xs: 2, md: 0 } }}>
            <Button
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={() => router.push("/mcp/patterns/upload")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 2.5,
                py: 1,
                boxShadow: "none",
              }}
            >
              Upload Pattern
            </Button>
          </Box>
        )}

        {/* Category grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">No categories available yet.</Typography>
          </Box>
        ) : (
          <Box
            role="grid"
            aria-label="Pattern categories"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 4,
              width: "100%",
              maxWidth: 821,
              px: { xs: 2, md: 0 },
              pb: 10,
            }}
          >
            {categories.map((category, index) => {
              const activeIndex = focusedIndex === -1 ? 0 : focusedIndex;
              return (
                <ButtonBase
                  key={category.id}
                  ref={register(index)}
                  role="gridcell"
                  aria-label={category.name}
                  tabIndex={activeIndex === index ? 0 : -1}
                  onFocus={() => focusItem(index)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  onClick={() => router.push(`/mcp/patterns/${category.id}`)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "10px",
                    borderRadius: "8px",
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    textAlign: "left",
                    p: "10px",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0px 14px 20px -3px rgba(0,0,0,0.12), 0px 6px 8px -2px rgba(0,0,0,0.1)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "3px",
                    },
                  }}
                >
                  {category.thumbnail?.url ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 143,
                        overflow: "hidden",
                        borderRadius: "2px",
                        bgcolor: "background.default",
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={category.thumbnail.url}
                        alt={category.name}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ width: "100%", height: 143, flexShrink: 0 }}>
                      <PatternCardImageDummy label={category.name} />
                    </Box>
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%" }}>
                    <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", lineHeight: "24px" }}>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography sx={{ fontSize: "12px", color: "#5d6472", lineHeight: "16px" }}>
                        {category.description}
                      </Typography>
                    )}
                  </Box>
                </ButtonBase>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
