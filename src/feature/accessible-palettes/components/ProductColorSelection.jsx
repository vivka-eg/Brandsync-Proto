"use client";
import LazyImage from "@/components/shared/LazyImage";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import { Stack, Typography, Box, Alert, Link } from "@mui/material";
import { Info } from "@mui/icons-material";

const productColors = [
  { name: "purple", src: "/accessible-palettes/purple.svg" },
  { name: "cobalt", src: "/accessible-palettes/cobalt.svg" },
  { name: "blue", src: "/accessible-palettes/blue.svg" },
  { name: "steel", src: "/accessible-palettes/steel.svg" },
  { name: "teal", src: "/accessible-palettes/teal.svg" },
  { name: "jade", src: "/accessible-palettes/jade.svg" },
  { name: "green", src: "/accessible-palettes/green.svg" },
  { name: "lime", src: "/accessible-palettes/lime.svg" },
  { name: "yellow", src: "/accessible-palettes/yellow.svg" },
  { name: "amber", src: "/accessible-palettes/amber.svg" },
  { name: "orange", src: "/accessible-palettes/orange.svg" },
  { name: "magenta", src: "/accessible-palettes/magenta.svg" },
  { name: "maroon", src: "/accessible-palettes/maroon.svg" },
  { name: "violet", src: "/accessible-palettes/violet.svg" },
];

const ProductSelector = () => {
  const { selectedProductColor, setSelectedProductColor, showSnackbar } =
    useAccessiblePaletteContext();

  const { register, onKeyDown } = useArrowKeyNavigation();

  const handleColorSelect = (name) => {
    setSelectedProductColor(name);
    showSnackbar(
      `${name.charAt(0).toUpperCase() + name.slice(1)} palette selected`
    );
  };

  return (
    <Stack
      direction={{ xs: "row", md: "column" }}
      sx={{
        gap: 1.5,
        width: "100%",
        overflowX: { xs: "auto", md: "visible" },
        flexWrap: "nowrap",
        pb: { xs: 1, md: 0 },
        // Custom scrollbar on mobile
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {productColors.map(({ src, name }, index) => (
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            padding: { xs: "8px 6px", md: "10px" },
            gap: { xs: "4px", md: "12px" },
            minWidth: { xs: "68px", md: "auto" },
            flexShrink: 0,
            border: selectedProductColor === name ? "1.5px solid" : "1.5px solid transparent",
            borderColor: selectedProductColor === name ? "primary.main" : "transparent",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: selectedProductColor === name
              ? "rgba(99, 102, 241, 0.08)"
              : "transparent",
            boxShadow: selectedProductColor === name
              ? "0 2px 8px rgba(99, 102, 241, 0.2)"
              : "none",
            "&:hover": {
              backgroundColor: selectedProductColor === name
                ? "rgba(99, 102, 241, 0.12)"
                : "rgba(0, 0, 0, 0.02)",
              borderColor: selectedProductColor === name ? "primary.main" : "rgba(0, 0, 0, 0.08)",
              transform: { xs: "none", md: "translateX(4px)" },
            },
            "&:active": {
              transform: "scale(0.98)",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: "2px",
            },
          }}
          onClick={() => handleColorSelect(name)}
          key={index}
          tabIndex={0}
          ref={register(index)}
          onKeyDown={(e) => onKeyDown(e, index)}
          alignItems="center"
        >
          <Box
            sx={{
              transition: "transform 0.3s ease-in-out",
              flexShrink: 0,
            }}
          >
            <LazyImage
              src={src}
              alt={name}
              width={40}
              height={40}
              priority
              style={{ width: "40px", height: "40px" }}
              enableModal={false}
              sx={{ cursor: "pointer" }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "14px" },
              color: "text.body",
              fontWeight: selectedProductColor === name ? 600 : 400,
              transition: "all 0.3s ease-in-out",
              flex: { xs: "unset", md: 1 },
              textAlign: { xs: "center", md: "left" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "60px", md: "none" },
            }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

function ProductColorSelection() {
  return (
    <Stack sx={{ gap: 2, height: "100%" }}>
      <Stack sx={{ gap: 1, mb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Product Colours
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a colour to view its accessible color system.
        </Typography>

        <Alert
          severity="info"
          icon={<Info />}
          sx={{
            mt: 1,
            display: { xs: "none", md: "flex" },
            bgcolor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            "& .MuiAlert-message": {
              color: "#374151",
              fontSize: "0.875rem",
            },
            "& .MuiAlert-icon": {
              color: "#6B7280",
            },
          }}
        >
          Explore and download your{" "}
          <Link
            href="/logos"
            sx={{
              color: "#374151",
              fontWeight: 600,
              textDecoration: "underline",
              "&:hover": {
                color: "#1F2937",
              },
            }}
          >
            product logos.
          </Link>
        </Alert>
      </Stack>
      <ProductSelector />
    </Stack>
  );
}

export default ProductColorSelection;
