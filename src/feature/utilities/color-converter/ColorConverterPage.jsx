"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import { CopySimple, Check, ArrowsLeftRight, ArrowLeft, Eyedropper } from "phosphor-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// ─── Conversion utilities ─────────────────────────────────────────────────────

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c, m, y, k) {
  return {
    r: Math.round(255 * (1 - c / 100) * (1 - k / 100)),
    g: Math.round(255 * (1 - m / 100) * (1 - k / 100)),
    b: Math.round(255 * (1 - y / 100) * (1 - k / 100)),
  };
}

/** Derive all formats from a canonical RGB. Returns null if rgb is null. */
function deriveAll(rgb) {
  if (!rgb) return null;
  const { r, g, b } = rgb;
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    cmyk: rgbToCmyk(r, g, b),
  };
}

// ─── Parse helpers ────────────────────────────────────────────────────────────

function parseRgbString(str) {
  const m = str.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return null;
  const [r, g, b] = [+m[1], +m[2], +m[3]];
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
  return { r, g, b };
}

function parseHslString(str) {
  const m = str.match(/(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/);
  if (!m) return null;
  const [h, s, l] = [+m[1], +m[2], +m[3]];
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return hslToRgb(h, s, l);
}

function parseCmykString(str) {
  const m = str.match(/(\d+)%?[,\s]+(\d+)%?[,\s]+(\d+)%?[,\s]+(\d+)%?/);
  if (!m) return null;
  const [c, my, y, k] = [+m[1], +m[2], +m[3], +m[4]];
  if ([c, my, y, k].some((v) => v < 0 || v > 100)) return null;
  return cmykToRgb(c, my, y, k);
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [value]);

  return (
    <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
      <IconButton size="small" onClick={handleCopy} sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={15} weight="bold" color="green" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CopySimple size={15} />
            </motion.span>
          )}
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}

// ─── FormatInput ──────────────────────────────────────────────────────────────

function FormatInput({ label, value, onChange, placeholder, error, suffix }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={0.5} sx={{ fontSize: 11, letterSpacing: "0.08em" }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          border: "1px solid",
          borderColor: error ? "error.main" : "divider",
          borderRadius: 1.5,
          bgcolor: "background.default",
          transition: "border-color 0.15s",
          "&:focus-within": {
            borderColor: error ? "error.main" : "primary.main",
          },
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            flex: 1,
            fontSize: 13,
            fontFamily: "monospace",
            color: "inherit",
            minWidth: 0,
          }}
        />
        {suffix && (
          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontFamily: "monospace" }}>
            {suffix}
          </Typography>
        )}
        {value && <CopyButton value={value} />}
      </Box>
      {error && (
        <Typography variant="caption" color="error" mt={0.25} display="block">
          {error}
        </Typography>
      )}
    </Box>
  );
}

// ─── NumericChannelInput ──────────────────────────────────────────────────────

function NumericChannelInput({ label, value, onChange, min, max, unit }) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);

  React.useEffect(() => {
    if (!focused) setRaw(String(value));
  }, [value, focused]);

  const handleChange = (e) => {
    setRaw(e.target.value);
    const n = Number(e.target.value);
    if (!isNaN(n) && n >= min && n <= max) onChange(n);
  };

  const isError = raw !== "" && (isNaN(Number(raw)) || Number(raw) < min || Number(raw) > max);

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.25} sx={{ fontFamily: "monospace", fontSize: 11 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          py: 0.6,
          border: "1px solid",
          borderColor: isError ? "error.main" : "divider",
          borderRadius: 1,
          bgcolor: "background.default",
          "&:focus-within": { borderColor: isError ? "error.main" : "primary.main" },
        }}
      >
        <input
          value={raw}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setRaw(String(value)); }}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            width: "100%",
            fontSize: 13,
            fontFamily: "monospace",
            textAlign: "center",
            color: "inherit",
            minWidth: 0,
          }}
        />
        {unit && (
          <Typography component="span" sx={{ fontSize: 13, fontFamily: "monospace", color: "text.secondary", flexShrink: 0, lineHeight: 1 }}>
            {unit}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ─── ColorSwatch ─────────────────────────────────────────────────────────────

function ColorSwatch({ hex, onPickerChange, showHint, onHintDismiss }) {
  const isValid = hex && hexToRgb(hex) !== null;
  const labelColor = isValid
    ? (() => {
        const { r, g, b } = hexToRgb(hex);
        const lum = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
        return lum > 0.35 ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)";
      })()
    : "text.disabled";

  return (
    <Box
      sx={{
        width: "100%",
        height: 140,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: isValid ? hex : "action.hover",
        transition: "background-color 0.25s ease",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Color picker trigger; top-right corner */}
      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
        {/* Hint bubble */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                right: 0,
                whiteSpace: "nowrap",
                background: "rgba(0,0,0,0.78)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
                padding: "5px 10px",
                borderRadius: 6,
                pointerEvents: "none",
              }}
            >
              Click to pick a color
              {/* Arrow */}
              <span style={{
                position: "absolute",
                bottom: -5,
                right: 10,
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid rgba(0,0,0,0.78)",
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <Box
          component="label"
          onClick={onHintDismiss}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "6px",
            bgcolor: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.4)",
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            transition: "background 0.15s",
          }}
        >
          <Eyedropper size={14} weight="bold" color={isValid ? labelColor : "inherit"} />
          <input
            type="color"
            value={isValid ? hex : "#000000"}
            onChange={(e) => onPickerChange(e.target.value)}
            style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", inset: 0 }}
          />
        </Box>
      </Box>

      {/* Hex label bottom-left */}
      {isValid ? (
        <Typography
          sx={{
            position: "absolute",
            bottom: 10,
            left: 12,
            fontSize: 12,
            fontFamily: "monospace",
            fontWeight: 600,
            color: labelColor,
            letterSpacing: "0.04em",
          }}
        >
          {hex}
        </Typography>
      ) : (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Enter a color to preview
        </Typography>
      )}
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const DEFAULT_HEX = "#0057B8";

function ColorConverterPage() {
  const router = useRouter();
  // Source of truth: RGB
  const initialRgb = hexToRgb(DEFAULT_HEX);
  const initial = deriveAll(initialRgb);

  const [rgb, setRgb] = useState(initial.rgb);
  const [hexInput, setHexInput] = useState(initial.hex);
  const [hexError, setHexError] = useState(null);
  const [showHint, setShowHint] = useState(true);

  // Auto-dismiss hint after 4s
  React.useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const derived = deriveAll(rgb);
  const { hsl, cmyk } = derived;

  // ── HEX input ──────────────────────────────────────────────────────────────
  const handleHexChange = (val) => {
    setHexInput(val);
    const cleaned = val.startsWith("#") ? val : "#" + val;
    const parsed = hexToRgb(cleaned);
    if (parsed) {
      setRgb(parsed);
      setHexError(null);
    } else {
      setHexError("Invalid hex; use #RRGGBB or #RGB");
    }
  };

  // ── RGB channel inputs ─────────────────────────────────────────────────────
  const handleRgbChannel = (channel, value) => {
    const next = { ...rgb, [channel]: value };
    setRgb(next);
    setHexInput(rgbToHex(next.r, next.g, next.b));
    setHexError(null);
  };

  // ── HSL channel inputs ─────────────────────────────────────────────────────
  const handleHslChannel = (channel, value) => {
    const next = { ...hsl, [channel]: value };
    const newRgb = hslToRgb(next.h, next.s, next.l);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHexError(null);
  };

  // ── CMYK channel inputs ────────────────────────────────────────────────────
  const handleCmykChannel = (channel, value) => {
    const next = { ...cmyk, [channel]: value };
    const newRgb = cmykToRgb(next.c, next.m, next.y, next.k);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHexError(null);
  };

  // ── Formatted output strings ───────────────────────────────────────────────
  const hexStr = derived.hex;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
  const cmykStr = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: { xs: 2, md: 5 }, py: { xs: 5, md: 8 } }}>
      {/* Back link */}
      <Box
        onClick={() => router.push("/utilities")}
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, mb: 3, cursor: "pointer", color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.15s" }}
      >
        <ArrowLeft size={15} />
        <Typography variant="body2">Utilities</Typography>
      </Box>

      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Color Converter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert between HEX, RGB, HSL, and CMYK. Edit any format and all others update instantly. Use HEX and RGB for web and digital, HSL for UI theming, and CMYK for print production.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, alignItems: "start" }}>

        {/* Left column: swatch + HEX input */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ColorSwatch
            hex={hexError ? null : derived.hex}
            onPickerChange={handleHexChange}
            showHint={showHint}
            onHintDismiss={() => setShowHint(false)}
          />

          <FormatInput
            label="HEX"
            value={hexInput}
            onChange={handleHexChange}
            placeholder="#0057B8"
            error={hexError}
          />

          {/* Copy-ready output strings */}
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.25, bgcolor: "action.hover" }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 10 }}>
                Copy-ready values
              </Typography>
            </Box>
            <Divider />
            {[
              { label: "RGB", val: rgbStr },
              { label: "HSL", val: hslStr },
              { label: "CMYK", val: cmykStr },
            ].map(({ label, val }, i, arr) => (
              <React.Fragment key={label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    gap: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      fontFamily: "monospace",
                      minWidth: 36,
                      color: "text.disabled",
                      fontSize: 11,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", flex: 1, fontSize: 13 }}
                  >
                    {val}
                  </Typography>
                  <CopyButton value={val} />
                </Box>
                {i < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Box>

        {/* Right column: channel sliders */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* RGB */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <ArrowsLeftRight size={14} style={{ opacity: 0.45 }} />
              <Typography variant="subtitle2" fontWeight={600}>RGB</Typography>
              <Typography variant="caption" color="text.disabled">0 – 255 per channel</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { key: "r", label: "R", color: "#ef4444" },
                { key: "g", label: "G", color: "#22c55e" },
                { key: "b", label: "B", color: "#3b82f6" },
              ].map(({ key, label }) => (
                <NumericChannelInput
                  key={key}
                  label={label}
                  value={rgb[key]}
                  onChange={(v) => handleRgbChannel(key, v)}
                  min={0}
                  max={255}
                />
              ))}
            </Box>
            {/* RGB sliders */}
            <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
              {[
                { key: "r", label: "R", track: "linear-gradient(to right, #000, #ff0000)" },
                { key: "g", label: "G", track: "linear-gradient(to right, #000, #00ff00)" },
                { key: "b", label: "B", track: "linear-gradient(to right, #000, #0000ff)" },
              ].map(({ key, track }) => (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ flex: 1, position: "relative", height: 6, borderRadius: 3, background: track, border: "1px solid", borderColor: "divider" }}>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb[key]}
                      onChange={(e) => handleRgbChannel(key, +e.target.value)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        margin: 0,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: `${(rgb[key] / 255) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: "background.paper",
                        border: "2px solid",
                        borderColor: "primary.main",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                        transition: "left 0.05s",
                      }}
                    />
                  </Box>
                  <Typography sx={{ width: 28, textAlign: "right", fontFamily: "monospace", fontSize: 12, color: "text.secondary", flexShrink: 0 }}>
                    {rgb[key]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* HSL */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <ArrowsLeftRight size={14} style={{ opacity: 0.45 }} />
              <Typography variant="subtitle2" fontWeight={600}>HSL</Typography>
              <Typography variant="caption" color="text.disabled">Hue / Saturation / Lightness</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { key: "h", label: "H", unit: "°", min: 0, max: 360 },
                { key: "s", label: "S", unit: "%", min: 0, max: 100 },
                { key: "l", label: "L", unit: "%", min: 0, max: 100 },
              ].map(({ key, label, unit, min, max }) => (
                <NumericChannelInput
                  key={key}
                  label={label}
                  unit={unit}
                  value={hsl[key]}
                  onChange={(v) => handleHslChannel(key, v)}
                  min={min}
                  max={max}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* CMYK */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <ArrowsLeftRight size={14} style={{ opacity: 0.45 }} />
              <Typography variant="subtitle2" fontWeight={600}>CMYK</Typography>
              <Typography variant="caption" color="text.disabled">Print color model</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { key: "c", label: "C" },
                { key: "m", label: "M" },
                { key: "y", label: "Y" },
                { key: "k", label: "K" },
              ].map(({ key, label }) => (
                <NumericChannelInput
                  key={key}
                  label={label}
                  unit="%"
                  value={cmyk[key]}
                  onChange={(v) => handleCmykChannel(key, v)}
                  min={0}
                  max={100}
                />
              ))}
            </Box>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2, fontSize: 12 }}>
            CMYK values are screen approximations. For print, use a calibrated color profile.
          </Alert>
        </Box>
      </Box>
    </Box>
  );
}

export default ColorConverterPage;
