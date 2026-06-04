import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Breadcrumb({ current }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography sx={{ fontSize: "16px", color: "text.secondary" }}>
        Get Started
      </Typography>
      <Typography component="span" sx={{ fontSize: "16px", color: "text.secondary" }}>
        ›
      </Typography>
      <Typography
        component="span"
        sx={{ fontSize: "16px", fontWeight: 600, color: "text.primary" }}
      >
        {current}
      </Typography>
    </Stack>
  );
}
