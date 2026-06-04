"use client";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Add,
  Delete,
  Download,
  Favorite,
  Settings,
} from "@mui/icons-material";
import { adjustColor } from "../../utils/adjustColor";

const ButtonStates = ({ primaryColor }) => {
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
        Button States
      </Typography>

      {/* Primary Buttons */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Primary
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              backgroundColor: primaryColor,
              "&:hover": { backgroundColor: adjustColor(primaryColor, -15) },
            }}
          >
            Default
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              backgroundColor: adjustColor(primaryColor, -15),
            }}
          >
            Hover
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              backgroundColor: adjustColor(primaryColor, -25),
            }}
          >
            Active
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              backgroundColor: primaryColor,
              "&:focus": {
                boxShadow: `0 0 0 3px ${primaryColor}40`,
              },
              boxShadow: `0 0 0 3px ${primaryColor}40`,
            }}
          >
            Focus
          </Button>
          <Button
            variant="contained"
            disabled
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          >
            Disabled
          </Button>
        </Box>
      </Box>

      {/* Secondary/Outlined Buttons */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Secondary
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: primaryColor,
              color: primaryColor,
              "&:hover": { borderColor: primaryColor, backgroundColor: `${primaryColor}08` },
            }}
          >
            Default
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: `${primaryColor}08`,
            }}
          >
            Hover
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: `${primaryColor}15`,
            }}
          >
            Active
          </Button>
          <Button
            variant="outlined"
            disabled
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          >
            Disabled
          </Button>
        </Box>
      </Box>

      {/* Text/Ghost Buttons */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Ghost
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              color: primaryColor,
            }}
          >
            Default
          </Button>
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              color: primaryColor,
              backgroundColor: `${primaryColor}08`,
            }}
          >
            Hover
          </Button>
          <Button
            variant="text"
            disabled
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          >
            Disabled
          </Button>
        </Box>
      </Box>

      {/* Icon Buttons */}
      <Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          With Icons
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              backgroundColor: primaryColor,
              "&:hover": { backgroundColor: adjustColor(primaryColor, -15) },
            }}
          >
            Add New
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: primaryColor,
              color: primaryColor,
            }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          >
            Delete
          </Button>
          <IconButton sx={{ color: primaryColor }}>
            <Settings />
          </IconButton>
          <IconButton sx={{ color: primaryColor }}>
            <Favorite />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ButtonStates;
