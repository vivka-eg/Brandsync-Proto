import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function PageHeader({ current, title, subtitle }) {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          // component="a"
          // href="/mcp/how-it-works"
          sx={{
            fontSize: "16px",
            color: "text.secondary",
            textDecoration: "none",
          }}
        >
          How it works
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: "16px", color: "text.secondary" }}
        >
          ›
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: "16px", fontWeight: 600, color: "text.primary" }}
        >
          {current}
        </Typography>
      </Stack>
      <Box
        sx={{ bgcolor: "#fbfbfb", borderRadius: "12px", p: 4, width: "100%" }}
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
        <Typography
          sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}
