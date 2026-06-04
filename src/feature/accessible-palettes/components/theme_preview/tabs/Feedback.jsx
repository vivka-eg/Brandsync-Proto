import {
  Box,
  Stack,
  Typography,
  Button as MuiButton,
  LinearProgress,
} from "@mui/material";
import { CheckCircle } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function Feedback({ themeTab }) {
  const bgColor = themeTab === 0 ? "#EAEAEB" : "#1D1B20";
  const textColor = themeTab === 0 ? "#121212" : "#EEF1F1";
  const labelColor = themeTab === 0 ? "#636970" : "#A2AAB2";
  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;

  return (
    <Stack spacing={3}>
      {/* Snackbar */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Snackbar
        </Typography>
        <Box
          sx={{
            maxWidth: 480,
            backgroundColor: themeTab === 0 ? "#121212" : "rgba(234, 234, 235, 0.9)",
            borderRadius: "8px",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircle size={24} color={primaryColor} weight="fill" />
            <Typography
              variant="body2"
              sx={{ color: themeTab === 0 ? "#FFFFFF" : "#121212", fontSize: "14px" }}
            >
              Files uploaded successfully.
            </Typography>
          </Stack>
          <MuiButton
            sx={{
              textTransform: "none",
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "4px",
              px: 2,
              py: 0.5,
              minHeight: 32,
              "&:hover": {
                backgroundColor: primaryColor,
                opacity: 0.9,
              },
            }}
          >
            Label
          </MuiButton>
        </Box>
      </Box>

      {/* Progress indicator */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Progress indicator
        </Typography>
        <Box sx={{ maxWidth: 260 }}>
          <LinearProgress
            variant="determinate"
            value={30}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: themeTab === 0 ? "#D4D6D8" : "#232323",
              "& .MuiLinearProgress-bar": {
                backgroundColor: primaryColor,
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: textColor, fontSize: "14px" }}
          >
            Label
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default Feedback;
