import { Stack, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function StepCard({
  icon: Icon,
  stepNumber,
  title,
  description,
  iconBgColor,
  iconColor,
  children
}) {
  return (
    <Stack
      direction="row"
      gap={2}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        p: 2.5,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          width: "48px",
          height: "48px",
          bgcolor: iconBgColor,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={iconColor} />
      </Box>
      <Stack gap={1} flex={1}>
        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem" }}>
          {stepNumber}
        </Typography>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
