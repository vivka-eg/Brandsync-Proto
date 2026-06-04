"use client";
 
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
 
/**
 * Dummy browser-mockup placeholder.
 * Replace the inner content with a real <img> or Next/Image once
 * actual pattern screenshots are available.
 */
export default function PatternCardImageDummy({ label = "Dashboard UI" }) {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "2px",
        bgcolor: "background.default",
      }}
    >
      {/* Browser chrome bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          bgcolor: "#f0f0f0",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Traffic-light dots */}
        {["#f87171", "#fbbf24", "#34d399"].map((color) => (
          <Box
            key={color}
            sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }}
          />
        ))}
        {/* Fake URL bar */}
        <Box
          sx={{
            flex: 1,
            mx: 1,
            height: 16,
            bgcolor: "white",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            px: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", fontSize: "0.6rem", lineHeight: 1 }}
          >
            https://brandsync.dk
          </Typography>
        </Box>
      </Box>
 
      {/* Content area placeholder */}
      <Box
        sx={{
          height: 110,
          bgcolor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 2,
        }}
      >
        {/* Skeleton rows mimicking a data table */}
        {[85, 70, 75, 65, 70].map((w, i) => (
          <Box
            key={i}
            sx={{
              width: `${w}%`,
              height: 8,
              borderRadius: 1,
              bgcolor: i === 0 ? "grey.300" : "grey.200",
            }}
          />
        ))}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 1, fontSize: "0.65rem" }}
        >
          {label}; preview coming soon
        </Typography>
      </Box>
    </Box>
  );
}
 
 