import { Stack, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function FeatureItem({ icon: Icon, title, description, iconBgColor = "#F5F5F5", iconColor = "#666" }) {
  return (
    <Stack direction="row" gap={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: "32px",
          height: "32px",
          bgcolor: iconBgColor,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.5,
        }}
      >
        <Icon size={18} color={iconColor} />
      </Box>
      <Stack gap={0.5}>
        <Typography variant="body1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
