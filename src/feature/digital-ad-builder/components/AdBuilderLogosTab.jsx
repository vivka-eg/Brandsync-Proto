"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AlignCenterHorizontal, AlignLeft, AlignRight } from "phosphor-react";
import {
  formatShadeMenuLabel,
  getShadeHex,
  getSortedShadeKeysForPalette,
  resolveShadeKeyForPalette,
} from "../brandPalettes";
import SliderValueInput from "./SliderValueInput";

function SliderBlock({ label, valueBox, slider, minLabel, maxLabel }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {valueBox}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, fontVariantNumeric: "tabular-nums" }}>
          {minLabel}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>{slider}</Box>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {maxLabel}
        </Typography>
      </Stack>
    </Box>
  );
}

const LOGO_SCALE_MIN = 0.5;
const LOGO_SCALE_MAX = 1.5;
const LOGO_SCALE_STEP = 0.05;
const HORIZONTAL_LOGO_VARIANT_DEFS = [
  { value: "light", label: "Light horizontal" },
  { value: "dark", label: "Dark horizontal" },
  { value: "negative", label: "Negative horizontal" },
];

/** Short labels for 3-stop palettes; keeps the control one row. */
function shortShadeLabel(key) {
  const map = { 1: "Deep", 2: "Brand", 3: "Light" };
  return map[key] ?? key;
}

function getHorizontalLogoVariants(logo) {
  if (!logo?.assets) return [];
  return HORIZONTAL_LOGO_VARIANT_DEFS.map((variant) => ({
    ...variant,
    url: logo.assets[variant.value]?.horizontal ?? null,
  })).filter((variant) => Boolean(variant.url));
}

export default function AdBuilderLogosTab({
  logos,
  selectedLogo,
  selectLogo,
  setField,
  setFieldsPatch,
  isLoading,
  fetchError,
  logoScale,
  logoAlign,
  logoPlacement,
  logoTone,
  logoOrientation,
  bgPalette,
  bgShade,
  lockedPaletteName,
  lockedPaletteLabel,
  lockedSwatchHex,
  dense = false,
}) {
  const scale = typeof logoScale === "number" ? logoScale : 1;
  const scalePct = Math.round(scale * 100);
  const placement = ["inLayout", "onPhotoTop"].includes(logoPlacement) ? logoPlacement : "inLayout";

  const options = useMemo(() => logos ?? [], [logos]);
  const horizontalLogoVariants = useMemo(() => getHorizontalLogoVariants(selectedLogo), [selectedLogo]);
  const selectedLogoTone = horizontalLogoVariants.some((variant) => variant.value === logoTone)
    ? logoTone
    : horizontalLogoVariants[0]?.value ?? "";

  useEffect(() => {
    if (!selectedLogo || !selectedLogoTone || !setFieldsPatch) return;
    if (logoTone === selectedLogoTone && logoOrientation === "horizontal") return;
    setFieldsPatch(
      {
        logoTone: selectedLogoTone,
        logoOrientation: "horizontal",
      },
      { skipHistory: true },
    );
  }, [logoOrientation, logoTone, selectedLogo, selectedLogoTone, setFieldsPatch]);

  const paletteNameForShades = bgPalette || lockedPaletteName || null;
  const shadeKeysForPicker = useMemo(() => {
    if (!paletteNameForShades) return [];
    return getSortedShadeKeysForPalette(paletteNameForShades).slice(0, 3);
  }, [paletteNameForShades]);

  const resolvedBgShade = useMemo(() => {
    if (!paletteNameForShades) return typeof bgShade === "string" ? bgShade : "2";
    return resolveShadeKeyForPalette(paletteNameForShades, bgShade ?? "2");
  }, [paletteNameForShades, bgShade]);

  const previewSwatchHex = useMemo(() => {
    if (paletteNameForShades) {
      return getShadeHex(paletteNameForShades, resolvedBgShade);
    }
    return lockedSwatchHex || "action.hover";
  }, [paletteNameForShades, resolvedBgShade, lockedSwatchHex]);

  const onShadeSelect = useCallback(
    (shadeKey) => {
      if (!setFieldsPatch) return;
      setFieldsPatch({ bgShade: shadeKey, frostShade: shadeKey });
    },
    [setFieldsPatch],
  );

  const sectionTitleSx = dense
    ? { mb: 0.5, fontSize: "0.75rem", lineHeight: 1.2, fontWeight: 600 }
    : { mb: 1 };

  return (
    <Stack spacing={dense ? 1.25 : 2.5} sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: { lg: dense ? 0.25 : 0.5 } }}>
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={sectionTitleSx}>
          Product logo
        </Typography>
        {fetchError ? (
          <Typography variant="body2" color="error">
            Could not load logos. Check your connection and try again.
          </Typography>
        ) : (
          <Autocomplete
            loading={isLoading}
            options={options}
            value={selectedLogo && options.some((l) => l.id === selectedLogo.id) ? selectedLogo : null}
            onChange={(_, logo) => {
              selectLogo(logo ?? null);
              if (setFieldsPatch) {
                setFieldsPatch({
                  logoDocumentId: logo?.id ?? null,
                  headlineRich: null,
                  subtextRich: null,
                });
              } else {
                setField("logoDocumentId", logo?.id ?? null);
              }
            }}
            getOptionLabel={(o) => o?.name ?? ""}
            isOptionEqualToValue={(a, b) => a?.id === b?.id}
            filterOptions={(opts, state) => {
              const q = state.inputValue.trim().toLowerCase();
              if (!q) return opts;
              return opts.filter((o) => o.name?.toLowerCase().includes(q));
            }}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box component="li" key={key} {...rest} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  {option.assets?.logo ? (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        bgcolor: "#fff",
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
                        src={`/api/proxy-image?url=${encodeURIComponent(option.assets.logo)}`}
                        alt=""
                        width={22}
                        height={22}
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ width: 28, height: 28, bgcolor: "action.hover", borderRadius: 1, flexShrink: 0 }} />
                  )}
                  <Typography variant="body2" noWrap>
                    {option.name}
                  </Typography>
                </Box>
              );
            }}
            renderInput={(params) => {
              const thumbUrl = selectedLogo?.assets?.logo;
              return (
                <TextField
                  {...params}
                  label="Logo"
                  placeholder="Search or pick a product…"
                  size="small"
                  sx={dense ? { "& .MuiInputBase-input": { fontSize: "0.75rem", py: 0.75 } } : undefined}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        {thumbUrl ? (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              mr: 0.75,
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: dense ? 22 : 24,
                                height: dense ? 22 : 24,
                                borderRadius: 0.75,
                                bgcolor: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/api/proxy-image?url=${encodeURIComponent(thumbUrl)}`}
                                alt=""
                                width={dense ? 18 : 20}
                                height={dense ? 18 : 20}
                                style={{ objectFit: "contain" }}
                              />
                            </Box>
                          </Box>
                        ) : null}
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              );
            }}
            noOptionsText="No logos match"
          />
        )}
      </Box>

      {selectedLogo && (
        <Box>
          {horizontalLogoVariants.length > 0 ? (
            <Box sx={{ mb: dense ? 1.25 : 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="ad-builder-logo-variant-label">Logo variant</InputLabel>
                <Select
                  labelId="ad-builder-logo-variant-label"
                  label="Logo variant"
                  value={selectedLogoTone}
                  onChange={(event) => {
                    if (!event.target.value) return;
                    if (setFieldsPatch) {
                      setFieldsPatch({
                        logoTone: event.target.value,
                        logoOrientation: "horizontal",
                      });
                    } else {
                      setField("logoTone", event.target.value);
                      setField("logoOrientation", "horizontal");
                    }
                  }}
                  renderValue={(value) => {
                    const selectedVariant = horizontalLogoVariants.find((variant) => variant.value === value);
                    return selectedVariant?.label ?? "Horizontal logo";
                  }}
                  sx={dense ? { "& .MuiSelect-select": { fontSize: "0.75rem", py: 0.75 } } : undefined}
                >
                  {horizontalLogoVariants.map((variant) => (
                    <MenuItem key={variant.value} value={variant.value}>
                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 24,
                            borderRadius: 0.75,
                            bgcolor: variant.value === "negative" ? "grey.900" : "#fff",
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
                            src={`/api/proxy-image?url=${encodeURIComponent(variant.url)}`}
                            alt=""
                            width={36}
                            height={18}
                            style={{ objectFit: "contain" }}
                          />
                        </Box>
                        <Typography variant="body2" noWrap>
                          {variant.label}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : null}

          <Typography variant="subtitle2" fontWeight={600} sx={{ ...sectionTitleSx, mb: dense ? 0.35 : 0.5 }}>
            Colour palette
          </Typography>
          <Box>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
              <Box
                aria-hidden
                sx={{
                  width: dense ? 22 : 24,
                  height: dense ? 22 : 24,
                  borderRadius: 0.75,
                  flexShrink: 0,
                  bgcolor: previewSwatchHex || "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2, minWidth: 0 }} noWrap>
                {lockedPaletteLabel || lockedPaletteName || "-"}
              </Typography>
            </Stack>
            {shadeKeysForPicker.length > 0 && paletteNameForShades && setFieldsPatch ? (
              <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={
                  shadeKeysForPicker.includes(resolvedBgShade) ? resolvedBgShade : shadeKeysForPicker[0] ?? null
                }
                onChange={(_, v) => v != null && onShadeSelect(v)}
                aria-label="Shade for ad background and card"
                sx={{
                  mt: 0.25,
                  gap: 0.5,
                  "& .MuiToggleButtonGroup-grouped": {
                    flex: 1,
                    minWidth: 0,
                  },
                }}
              >
                {shadeKeysForPicker.map((key) => {
                  const hex = getShadeHex(paletteNameForShades, key);
                  const ariaFull = formatShadeMenuLabel(key);
                  return (
                    <ToggleButton
                      key={key}
                      value={key}
                      aria-label={`${ariaFull}. Select this shade.`}
                      sx={(theme) => ({
                        py: 0.45,
                        px: 0.35,
                        flexDirection: "column",
                        gap: 0.35,
                        textTransform: "none",
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: `${theme.shape.borderRadius}px`,
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.06),
                          borderColor: alpha(theme.palette.primary.main, 0.45),
                        },
                        "&.Mui-selected": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: "primary.main",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.14),
                          },
                        },
                      })}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: 4,
                          borderRadius: 0.5,
                          bgcolor: hex,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{
                          fontSize: dense ? "0.65rem" : "0.7rem",
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: 0.01,
                        }}
                      >
                        {shortShadeLabel(key)}
                      </Typography>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            ) : null}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5, lineHeight: 1.3, fontSize: dense ? "0.65rem" : "0.7rem" }}
            >
              Tap a shade to update the background and frosted card.
            </Typography>
          </Box>
        </Box>
      )}

      {selectedLogo && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={sectionTitleSx}>
            Logo on ad
          </Typography>
          <Stack spacing={dense ? 1.25 : 1.75}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                Placement
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                fullWidth
                value={placement}
                onChange={(_, v) => v && setField("logoPlacement", v)}
                aria-label="Logo placement"
              >
                <ToggleButton value="inLayout">In layout</ToggleButton>
                <ToggleButton value="onPhotoTop">On top photo</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <SliderBlock
              label="Size"
              minLabel="50%"
              maxLabel="150%"
              valueBox={
                <SliderValueInput
                  displayValue={scalePct}
                  unit="%"
                  min={50}
                  max={150}
                  step={5}
                  onCommit={(v) => setField("logoScale", v / 100)}
                />
              }
              slider={
                <Slider
                  size="small"
                  value={scale}
                  min={LOGO_SCALE_MIN}
                  max={LOGO_SCALE_MAX}
                  step={LOGO_SCALE_STEP}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
                  aria-label="Logo size"
                  onChange={(_, v) => setField("logoScale", v)}
                />
              }
            />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                Align
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                fullWidth
                value={["left", "center", "right"].includes(logoAlign) ? logoAlign : "left"}
                onChange={(_, v) => v && setField("logoAlign", v)}
                aria-label="Logo horizontal alignment"
              >
                <ToggleButton value="left" aria-label="Align left">
                  <AlignLeft size={dense ? 16 : 18} />
                </ToggleButton>
                <ToggleButton value="center" aria-label="Align center">
                  <AlignCenterHorizontal size={dense ? 16 : 18} />
                </ToggleButton>
                <ToggleButton value="right" aria-label="Align right">
                  <AlignRight size={dense ? 16 : 18} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
