"use client";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  CircularProgress,
  Badge,
  Slider,
} from "@mui/material";
import { Notifications, Person, Settings } from "@mui/icons-material";

const ColorWeightSection = ({ primaryColor }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Progress Indicators */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Progress Indicators
        </Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#374151" }}>Progress</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#6B7280" }}>65%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={65}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${primaryColor}20`,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: primaryColor,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <CircularProgress
            variant="determinate"
            value={75}
            size={48}
            thickness={4}
            sx={{ color: primaryColor }}
          />
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={85}
              size={56}
              thickness={4}
              sx={{ color: primaryColor }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
                85%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Badges */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Badges & Indicators
        </Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Badge badgeContent={4} sx={{ "& .MuiBadge-badge": { backgroundColor: primaryColor, color: "#FFFFFF" } }}>
            <Notifications sx={{ color: "#6B7280" }} />
          </Badge>
          <Badge badgeContent={12} sx={{ "& .MuiBadge-badge": { backgroundColor: primaryColor, color: "#FFFFFF" } }}>
            <Box sx={{ p: 1, backgroundColor: "#F3F4F6", borderRadius: 1 }}>
              <Person sx={{ color: "#6B7280" }} />
            </Box>
          </Badge>
          <Badge
            variant="dot"
            sx={{ "& .MuiBadge-badge": { backgroundColor: primaryColor } }}
          >
            <Settings sx={{ color: "#6B7280" }} />
          </Badge>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} />
            <Typography sx={{ fontSize: "0.75rem", color: "#374151" }}>Online</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: primaryColor }} />
            <Typography sx={{ fontSize: "0.75rem", color: "#374151" }}>Active</Typography>
          </Box>
        </Box>
      </Box>

      {/* Slider */}
      <Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Slider
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            defaultValue={60}
            sx={{
              color: primaryColor,
              "& .MuiSlider-thumb": {
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0 0 0 8px ${primaryColor}20`,
                },
              },
              "& .MuiSlider-rail": {
                backgroundColor: `${primaryColor}30`,
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ColorWeightSection;
