import { Stack, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function PillarCard({
  icon: Icon,
  badgeText,
  badgeBgColor,
  badgeColor,
  badgeBorderColor,
  iconBgColor,
  title,
  description,
  children,
}) {
  return (
    <Stack
      gap={2.5}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        p: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" gap={2} alignItems="flex-start">
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
          <Icon size={22} color="white" />
        </Box>
        <Stack gap={1} flex={1}>
          <Box
            sx={{
              bgcolor: badgeBgColor,
              color: badgeColor,
              borderRadius: "16px",
              px: 2,
              py: 0.5,
              fontSize: "0.7rem",
              fontWeight: 600,
              width: "fit-content",
              border: `1px solid ${badgeBorderColor}`,
            }}
          >
            {badgeText}
          </Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {title}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {description}
      </Typography>

      <Stack gap={1.5}>{children}</Stack>
    </Stack>
  );
}
