"use client";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import { CheckCircle, Star } from "@mui/icons-material";
import { adjustColor } from "../../utils/adjustColor";

const ChipsSection = ({ primaryColor }) => {
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
      <Typography sx={{ fontWeight: 600, color: "#111827", mb: 3 }}>
        Chips & Tags
      </Typography>

      {/* Status Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Status
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="Active"
            size="small"
            sx={{
              backgroundColor: "#DCFCE7",
              color: "#166534",
              fontWeight: 500,
            }}
          />
          <Chip
            label="Pending"
            size="small"
            sx={{
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              fontWeight: 500,
            }}
          />
          <Chip
            label="Inactive"
            size="small"
            sx={{
              backgroundColor: "#F3F4F6",
              color: "#374151",
              fontWeight: 500,
            }}
          />
          <Chip
            label="Error"
            size="small"
            sx={{
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
              fontWeight: 500,
            }}
          />
          <Chip
            label="Info"
            size="small"
            sx={{
              backgroundColor: "#DBEAFE",
              color: "#1E40AF",
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>

      {/* Primary Color Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Primary Color Variants
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="Filled"
            size="small"
            sx={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              fontWeight: 500,
            }}
          />
          <Chip
            label="Soft"
            size="small"
            sx={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
              fontWeight: 500,
            }}
          />
          <Chip
            label="Outlined"
            size="small"
            variant="outlined"
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              fontWeight: 500,
            }}
          />
          <Chip
            label="With Icon"
            size="small"
            icon={<CheckCircle sx={{ fontSize: 16, color: "#FFFFFF" }} />}
            sx={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              fontWeight: 500,
              "& .MuiChip-icon": { color: "#FFFFFF" },
            }}
          />
          <Chip
            label="Deletable"
            size="small"
            onDelete={() => {}}
            sx={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
              fontWeight: 500,
              "& .MuiChip-deleteIcon": { color: primaryColor },
            }}
          />
        </Box>
      </Box>

      {/* Interactive Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Interactive
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            avatar={<Avatar sx={{ bgcolor: primaryColor }}>A</Avatar>}
            label="With Avatar"
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            avatar={<Avatar src="/avatars/user.jpg">U</Avatar>}
            label="User Chip"
            size="small"
            onDelete={() => {}}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<Star sx={{ fontSize: 16 }} />}
            label="Featured"
            size="small"
            sx={{
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>

      {/* Filter Chips */}
      <Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Filter Tags
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {["All", "Design", "Development", "Marketing", "Sales"].map((tag, idx) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              clickable
              sx={{
                backgroundColor: idx === 0 ? primaryColor : "#F3F4F6",
                color: idx === 0 ? "#FFFFFF" : "#374151",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: idx === 0 ? adjustColor(primaryColor, -15) : "#E5E7EB",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ChipsSection;
