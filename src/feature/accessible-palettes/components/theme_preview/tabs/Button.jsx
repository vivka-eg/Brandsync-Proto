import { Box, Stack, Typography, Button as MuiButton, IconButton } from "@mui/material";
import { Plus } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function Button({ themeTab }) {
  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;
  const tertiaryColor = themeTab === 0 ? "#121212" : "#EEF1F1";

  return (
    <Stack spacing={4}>
      {/* Button Section */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: themeTab === 0 ? "#121212" : "#EEF1F1" }}
        >
          Button
        </Typography>
        <Stack direction="row" gap={2} flexWrap="wrap">
          <MuiButton
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: primaryColor,
                opacity: 0.9,
                transform: "translateY(-1px)",
              },
              "&:active": {
                opacity: 0.8,
                transform: "translateY(0)",
              },
            }}
          >
            Primary
          </MuiButton>
          <MuiButton
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "rgba(234, 234, 235, 0.9)",
              color: "#29303B",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(234, 234, 235, 1)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                backgroundColor: "rgba(220, 220, 221, 1)",
                transform: "translateY(0)",
              },
            }}
          >
            Neutral
          </MuiButton>
          <MuiButton
            variant="text"
            sx={{
              backgroundColor: "transparent",
              color: tertiaryColor,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: themeTab === 0 ? "rgba(18, 18, 18, 0.04)" : "rgba(238, 241, 241, 0.04)",
              },
              "&:active": {
                backgroundColor: themeTab === 0 ? "rgba(18, 18, 18, 0.08)" : "rgba(238, 241, 241, 0.08)",
              },
            }}
          >
            Tertiary
          </MuiButton>
          <MuiButton
            variant="outlined"
            sx={{
              backgroundColor: "transparent",
              color: primaryColor,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              border: 2,
              borderColor: primaryColor,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: `${primaryColor}08`,
                border: 2,
                borderColor: primaryColor,
                transform: "translateY(-1px)",
              },
              "&:active": {
                backgroundColor: `${primaryColor}12`,
                transform: "translateY(0)",
              },
            }}
          >
            Outlined
          </MuiButton>
        </Stack>
      </Box>

      {/* Icon Button Section */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: themeTab === 0 ? "#121212" : "#EEF1F1" }}
        >
          Icon Button
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <IconButton
            sx={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              width: 40,
              height: 40,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: primaryColor,
                opacity: 0.9,
                transform: "translateY(-1px)",
              },
              "&:active": {
                opacity: 0.8,
                transform: "translateY(0)",
              },
            }}
          >
            <Plus size={20} weight="bold" />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "rgba(234, 234, 235, 0.9)",
              color: "#121212",
              width: 40,
              height: 40,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(234, 234, 235, 1)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                backgroundColor: "rgba(220, 220, 221, 1)",
                transform: "translateY(0)",
              },
            }}
          >
            <Plus size={20} weight="bold" />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "transparent",
              color: tertiaryColor,
              width: 40,
              height: 40,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: themeTab === 0 ? "rgba(18, 18, 18, 0.04)" : "rgba(238, 241, 241, 0.04)",
              },
              "&:active": {
                backgroundColor: themeTab === 0 ? "rgba(18, 18, 18, 0.08)" : "rgba(238, 241, 241, 0.08)",
              },
            }}
          >
            <Plus size={20} weight="bold" />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "transparent",
              color: primaryColor,
              width: 40,
              height: 40,
              borderRadius: 2,
              border: 2,
              borderColor: primaryColor,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: `${primaryColor}08`,
                border: 2,
                borderColor: primaryColor,
                transform: "translateY(-1px)",
              },
              "&:active": {
                backgroundColor: `${primaryColor}12`,
                transform: "translateY(0)",
              },
            }}
          >
            <Plus size={20} weight="bold" />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Button;
