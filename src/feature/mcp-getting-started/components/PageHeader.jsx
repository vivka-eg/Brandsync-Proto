import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PageHeader({ title, subtitle }) {
  return (
    <Box
      sx={{
        bgcolor: "#fbfbfb",
        borderRadius: "12px",
        p: 4,
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: "48px",
          fontWeight: 700,
          lineHeight: "60px",
          color: "text.primary",
          mb: 1.25,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}
