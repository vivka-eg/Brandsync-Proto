import { Stack, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function PrincipleCard({
  icon: Icon,
  title,
  description,
  bgColor = "background.paper",
  iconBgColor,
  iconColor = "white",
  variant = "default",
  gridProps = {}
}) {
  const isLarge = variant === "large";

  return (
    <Stack
      direction={isLarge ? "column" : "row"}
      gap={2}
      sx={{
        p: 3,
        bgcolor: bgColor,
        borderRadius: "8px",
        alignItems: isLarge ? "flex-start" : "flex-start",
        ...gridProps
      }}
    >
      <Box
        sx={{
          width: "48px",
          height: "48px",
          bgcolor: iconBgColor,
          border: iconBgColor === "#FFFFFF" ? "1px solid #E0E0E0" : "none",
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
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
