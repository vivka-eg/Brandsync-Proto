"use client";

import React, { useMemo, forwardRef } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Image as ImageIcon } from "phosphor-react";
import { proxyImageUrl } from "../lib/proxyImageUrl";
import { getBrandPaletteEntries, getSortedShadeKeysForPalette, getShadeHex } from "../brandPalettes";

function paletteStrips(max = 3) {
  return getBrandPaletteEntries().slice(0, max).map((p) => {
    const keys = getSortedShadeKeysForPalette(p.name).slice(0, 4);
    return {
      name: p.name,
      label: p.label,
      swatches: keys.map((k) => ({ key: k, hex: getShadeHex(p.name, k) })),
    };
  });
}

function Thumb({ src, alt, aspectRatio = "4 / 3", tall }) {
  if (!src) {
    return (
      <Box
        sx={{
          width: "100%",
          aspectRatio,
          borderRadius: 1.5,
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.disabled",
        }}
      >
        <ImageIcon size={tall ? 28 : 22} weight="duotone" />
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={alt || ""}
      sx={{
        width: "100%",
        aspectRatio,
        borderRadius: 1.5,
        objectFit: "cover",
        display: "block",
        boxShadow: (t) => `0 8px 24px ${alpha(t.palette.common.black, 0.12)}`,
        border: "1px solid",
        borderColor: "divider",
      }}
    />
  );
}

const OnboardingBrandGalleryMosaic = forwardRef(function OnboardingBrandGalleryMosaic(
  { portrait = [], landscape = [], stockLoading = false, logos = [] },
  ref,
) {
  const strips = useMemo(() => paletteStrips(3), []);
  const logoRows = useMemo(
    () =>
      logos
        .slice(0, 3)
        .map((l) => {
          const src = l?.assets?.logo ? proxyImageUrl(l.assets.logo) : null;
          if (!src) return null;
          return { src, name: l?.name || "Product" };
        })
        .filter(Boolean),
    [logos],
  );

  const l1 = landscape[0];
  const l2 = landscape[1];
  const p1 = portrait[0];
  const p2 = portrait[1];

  return (
    <Box ref={ref} sx={{ width: "100%", px: { xs: 0, sm: 0.5 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1.35fr 0.9fr 1.15fr" },
          gap: { xs: 1.5, sm: 1.25 },
          alignItems: "start",
        }}
      >
        {/* Left: stock thumbnails */}
        <Stack spacing={1.25} sx={{ width: "100%" }}>
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            {stockLoading ? (
              <>
                <Skeleton variant="rounded" sx={{ flex: 1, height: { xs: 72, sm: 84 }, borderRadius: 1.5 }} />
                <Skeleton variant="rounded" sx={{ flex: 1, height: { xs: 72, sm: 84 }, borderRadius: 1.5 }} />
              </>
            ) : (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Thumb
                    src={l1?.thumbnail ? proxyImageUrl(l1.thumbnail) : null}
                    alt={l1?.title || "Landscape stock example"}
                    aspectRatio="16 / 9"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Thumb
                    src={l2?.thumbnail ? proxyImageUrl(l2.thumbnail) : null}
                    alt={l2?.title || "Landscape stock example"}
                    aspectRatio="16 / 9"
                  />
                </Box>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            {stockLoading ? (
              <>
                <Skeleton variant="rounded" sx={{ flex: 1, height: { xs: 112, sm: 128 }, borderRadius: 1.5 }} />
                <Skeleton variant="rounded" sx={{ flex: 1, height: { xs: 112, sm: 128 }, borderRadius: 1.5 }} />
              </>
            ) : (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Thumb
                    src={p1?.thumbnail ? proxyImageUrl(p1.thumbnail) : null}
                    alt={p1?.title || "Portrait stock example"}
                    aspectRatio="3 / 4"
                    tall
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Thumb
                    src={p2?.thumbnail ? proxyImageUrl(p2.thumbnail) : null}
                    alt={p2?.title || "Portrait stock example"}
                    aspectRatio="3 / 4"
                    tall
                  />
                </Box>
              </>
            )}
          </Stack>
        </Stack>

        {/* Center: product logos */}
        <Stack spacing={1.25} sx={{ width: "100%", alignItems: "center" }}>
          {logoRows.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ py: 0.5, textAlign: "center" }}>
              Product logos load from your library when available.
            </Typography>
          ) : (
            <Stack spacing={1} sx={{ width: "100%", alignItems: "center" }}>
              {logoRows.map((row, i) => (
                <Box
                  key={`onboarding-logo-${i}`}
                  component="img"
                  src={row.src}
                  alt={row.name ? `${row.name} logo` : "Product logo"}
                  sx={{
                    height: { xs: 32, sm: 36 },
                    maxWidth: { xs: 120, sm: 140 },
                    width: "auto",
                    objectFit: "contain",
                    objectPosition: "center",
                    filter: (t) => (t.palette.mode === "dark" ? "brightness(0.95)" : "none"),
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>

        {/* Right: color palettes */}
        <Stack spacing={1.15} sx={{ width: "100%", alignItems: { xs: "center", sm: "flex-end" } }}>
          {strips.map((strip) => (
            <Stack key={strip.name} spacing={0.5} alignItems="center">
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                {strip.swatches.map((s) => (
                  <Box
                    key={`${strip.name}-${s.key}`}
                    title={`${strip.label} · ${s.key}`}
                    sx={{
                      width: { xs: 22, sm: 26 },
                      height: { xs: 22, sm: 26 },
                      borderRadius: "50%",
                      bgcolor: s.hex,
                      boxShadow: `inset 0 0 0 1px ${alpha("#000", 0.08)}`,
                    }}
                  />
                ))}
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  maxWidth: 130,
                  textAlign: { xs: "center", sm: "right" },
                  lineHeight: 1.2,
                }}
              >
                {strip.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
});

export default OnboardingBrandGalleryMosaic;
