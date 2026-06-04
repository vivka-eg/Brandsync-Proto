import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import LazyImage from "@/components/shared/LazyImage";

/**
 * Mobile card view component for displaying a single logo
 *
 * @param {Object} props
 * @param {Object} props.logo - Logo data object
 * @param {Function} props.onEdit - Callback for edit action
 * @param {Function} props.onDelete - Callback for delete action
 * @param {boolean} props.showDeleteButton - Whether to show delete button
 */
const MobileLogoCard = ({ logo, onEdit, onDelete, showDeleteButton }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {logo.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => onEdit(logo.id)}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.dark",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              {showDeleteButton && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(logo)}
                  sx={{
                    color: "error.main",
                    "&:hover": { bgcolor: "error.light", color: "error.dark" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Color Palette
            </Typography>
            <Chip
              label={logo.colorPalette}
              size="small"
              sx={{
                bgcolor: `${logo.colorPalette}.50`,
                color: `${logo.colorPalette}.700`,
                fontWeight: 500,
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Logo Preview
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                justifyContent: "center",
              }}
            >
              {logo.logo && (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "white",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <LazyImage
                    src={logo.logo}
                    alt={logo.name}
                    width={60}
                    height={60}
                    enableModal={false}
                    style={{ objectFit: "contain", padding: "8px" }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Black Variants
            </Typography>
            <Stack direction="row" spacing={1}>
              {logo.verticalLogo && (
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <LazyImage
                    src={logo.verticalLogo}
                    alt={`${logo.name} vertical`}
                    width={50}
                    height={50}
                    enableModal={false}
                    style={{ objectFit: "contain", padding: "4px" }}
                  />
                </Box>
              )}
              {logo.horizontalLogo && (
                <Box
                  sx={{
                    width: 70,
                    height: 50,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <LazyImage
                    src={logo.horizontalLogo}
                    alt={`${logo.name} horizontal`}
                    width={70}
                    height={50}
                    enableModal={false}
                    style={{ objectFit: "contain", padding: "4px" }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MobileLogoCard;
