"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardActionArea, CardContent } from "@mui/material";
import { LockSimple, ArrowLeft, ArrowRight, ArrowClockwise, Phone, Envelope, LinkedinLogo, MapPin } from "phosphor-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { getProductLogos } from "@/api/design-system/product-logos";

// ─── Animated logo strip ──────────────────────────────────────────────────────

function LogoIconStrip() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    getProductLogos({ page: 1, pageSize: 7 })
      .then(({ data }) => setLogos(data))
      .catch(() => {});
  }, []);

  if (logos.length === 0) {
    // Placeholder skeleton boxes while loading
    return (
      <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
        {[...Array(7)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "9px",
              bgcolor: "action.hover",
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
      {logos.map((logo, i) => (
        <motion.div
          key={logo.id}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.35,
            delay: i * 0.07,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "9px",
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {logo.assets?.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(logo.assets.logo)}`}
                alt={logo.name}
                width={26}
                height={26}
                style={{ objectFit: "contain" }}
              />
            )}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}

// ─── Browser favicon preview ──────────────────────────────────────────────────

function BrowserFaviconPreview() {
  const [logos, setLogos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getProductLogos({ page: 1, pageSize: 5 })
      .then(({ data }) => setLogos(data.filter((l) => l.assets?.logo)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (logos.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % logos.length);
    }, 1800);
    return () => clearInterval(id);
  }, [logos.length]);

  const activeLogo = logos[activeIndex];

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Browser chrome */}
      <Box
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Tab bar */}
        <Box
          sx={{
            px: 1.5,
            pt: 1,
            pb: 0,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "flex-end",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.6,
              borderRadius: "6px 6px 0 0",
              bgcolor: "background.paper",
              border: "1px solid",
              borderBottom: "none",
              borderColor: "divider",
              minWidth: 100,
              maxWidth: 140,
            }}
          >
            {/* Favicon in tab */}
            <Box sx={{ width: 12, height: 12, flexShrink: 0, position: "relative" }}>
              <AnimatePresence mode="wait">
                {activeLogo ? (
                  <motion.img
                    key={activeLogo.id}
                    src={`/api/proxy-image?url=${encodeURIComponent(activeLogo.assets.logo)}`}
                    alt=""
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: 12, height: 12, objectFit: "contain", position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <Box sx={{ width: 12, height: 12, borderRadius: "2px", bgcolor: "action.selected" }} />
                )}
              </AnimatePresence>
            </Box>
            <Typography sx={{ fontSize: 10, color: "text.secondary", noWrap: true, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", lineHeight: 1 }}>
              {activeLogo?.name ?? "Loading…"}
            </Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Nav buttons */}
          <ArrowLeft size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
          <ArrowRight size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
          <ArrowClockwise size={12} style={{ opacity: 0.3, flexShrink: 0 }} />

          {/* URL bar */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1,
              py: 0.4,
              borderRadius: "4px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <LockSimple size={10} style={{ opacity: 0.4, flexShrink: 0 }} />

            {/* Favicon in URL bar */}
            <Box sx={{ width: 12, height: 12, flexShrink: 0, position: "relative" }}>
              <AnimatePresence mode="wait">
                {activeLogo ? (
                  <motion.img
                    key={activeLogo.id}
                    src={`/api/proxy-image?url=${encodeURIComponent(activeLogo.assets.logo)}`}
                    alt=""
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: 12, height: 12, objectFit: "contain", position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <Box sx={{ width: 12, height: 12, borderRadius: "2px", bgcolor: "action.selected" }} />
                )}
              </AnimatePresence>
            </Box>

            <Typography sx={{ fontSize: 10, color: "text.disabled", lineHeight: 1 }}>
              brand.egsync.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Color converter preview ──────────────────────────────────────────────────

const COLOR_SAMPLES = [
  { hex: "#0057B8", label: "HEX" },
  { rgb: "rgb(0, 87, 184)", label: "RGB" },
  { hsl: "hsl(214, 100%, 36%)", label: "HSL" },
  { cmyk: "cmyk(100%, 53%, 0%, 28%)", label: "CMYK" },
];

function ColorConverterPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % COLOR_SAMPLES.length), 1600);
    return () => clearInterval(id);
  }, []);

  const swatches = ["#0057B8", "#E8173C", "#00A86B", "#F5A623", "#7B2D8B"];

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Swatch row */}
      <Box sx={{ display: "flex", gap: 0.75, mb: 1.5 }}>
        {swatches.map((color, i) => (
          <motion.div
            key={color}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "7px",
                bgcolor: color,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Animated format label */}
      <Box
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box sx={{ width: 14, height: 14, borderRadius: "3px", bgcolor: "#0057B8", flexShrink: 0 }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, minWidth: 0 }}
          >
            <Typography sx={{ fontFamily: "monospace", fontSize: 11, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {Object.values(COLOR_SAMPLES[activeIndex])[0]}
            </Typography>
          </motion.div>
        </AnimatePresence>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "primary.main", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {COLOR_SAMPLES[activeIndex].label}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Email signature preview ──────────────────────────────────────────────────

function EmailSignaturePreview() {
  const mini = { fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.35 };

  return (
    <Box sx={{ mb: 2.5, color: "#333", ...mini }}>
      {/* Fake body lines */}
      <Box sx={{ mb: 1 }}>
        {[70, 55, 63].map((w, i) => (
          <Box key={i} sx={{ height: 5, width: `${w}%`, borderRadius: 1, bgcolor: "action.hover", mb: 0.6 }} />
        ))}
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography sx={{ fontSize: 9.5, color: "text.disabled", mb: 0.45, ...mini }}>
          Venlig hilsen / Best regards,
        </Typography>
        <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "text.primary", ...mini }}>Susan Meier</Typography>
        <Typography sx={{ fontSize: 9.5, color: "text.secondary", ...mini }}>Sales Director, Construction</Typography>

        <Box sx={{ height: 7 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.2 }}>
          <Phone size={10} style={{ color: "#555", flexShrink: 0 }} />
          <Typography sx={{ fontSize: 9.5, color: "text.secondary", ...mini }}>+ 45 64 64 24 98</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.2 }}>
          <Envelope size={10} style={{ color: "#555", flexShrink: 0 }} />
          <Typography sx={{ fontSize: 9.5, color: "text.secondary", ...mini }}>susan.meier@eg.dk</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.2 }}>
          <LinkedinLogo size={10} style={{ color: "#0077B5", flexShrink: 0 }} />
          <Typography sx={{ fontSize: 9.5, color: "#0077B5", ...mini }}>LinkedIn</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 0.35, mt: 0.15 }}>
          <MapPin size={10} style={{ color: "#555", flexShrink: 0, marginTop: 2 }} />
          <Typography sx={{ fontSize: 9.5, color: "text.secondary", whiteSpace: "pre-line", ...mini }}>
            {"Lautrupvang 24,\n2750 Ballerup"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center", mt: 0.35 }}>
          <Typography sx={{ fontSize: 8.5, color: "#007080", ...mini }}>egsoftware.com</Typography>
          <Typography sx={{ fontSize: 8.5, color: "#ccc", ...mini }}>|</Typography>
          <Typography sx={{ fontSize: 8.5, color: "#007080", ...mini }}>Privacy policy</Typography>
        </Box>

        <Box sx={{ borderTop: "1px solid #e0e0e0", my: 0.65, maxWidth: 170 }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/eg-logo/EG_Logo-email.png" alt="" width={22} height={22} style={{ display: "block" }} />
      </Box>
    </Box>
  );
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const tools = [
  {
    label: "App Icon Generator",
    description:
      "Export product logos as PNG icons in all required sizes for iOS, Android, and PWA.",
    href: "/utilities/app-icons",
    preview: <LogoIconStrip />,
  },
  {
    label: "Favicon Generator",
    description:
      "Generate a single .ico file with multiple sizes embedded, perfect for favicons and Windows app icons.",
    href: "/utilities/ico-generator",
    preview: <BrowserFaviconPreview />,
  },
  {
    label: "Color Converter",
    description:
      "Convert between HEX, RGB, HSL, and CMYK instantly. Edit any format and all others update in real time.",
    href: "/utilities/color-converter",
    preview: <ColorConverterPreview />,
  },
  {
    label: "Email Signature Maker",
    description:
      "Generate an on-brand EG email signature in seconds. Fill in your details and copy it straight into Outlook.",
    href: "/utilities/email-signature",
    preview: <EmailSignaturePreview />,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function UtilitiesPage() {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Utilities
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Export logos as platform-ready app icons, generate favicons, and more. Everything you need to put EG brand assets to work.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {tools.map(({ label, description, href, preview }) => {
          const comingSoon = !href;
          return (
            <Card
              key={label}
              variant="outlined"
              sx={{
                borderRadius: 2,
                opacity: comingSoon ? 0.72 : 1,
                transition: "border-color 0.15s, box-shadow 0.15s",
                ...(!comingSoon && {
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  },
                }),
              }}
            >
              <CardActionArea
                onClick={() => !comingSoon && router.push(href)}
                disabled={comingSoon}
                sx={{ height: "100%", cursor: comingSoon ? "default" : "pointer" }}
              >
                <CardContent sx={{ p: 3, position: "relative" }}>
                  {comingSoon && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: "grey.800",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 600,
                        lineHeight: 1.6,
                      }}
                    >
                      Coming Soon
                    </Box>
                  )}
                  {preview}
                  <Typography variant="h6" fontWeight={600} mb={0.5}>
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default UtilitiesPage;
