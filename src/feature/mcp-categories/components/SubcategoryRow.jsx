"use client";

import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { PencilSimple, Trash } from "phosphor-react";

export default function SubcategoryRow({ category, onEdit, onDelete }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1.25,
        ml: 3,
        borderLeft: "2px solid",
        borderColor: "divider",
        pl: 2.5,
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
        <Typography sx={{ fontSize: "0.875rem" }}>{category.name}</Typography>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontFamily: "monospace",
            color: "text.secondary",
            backgroundColor: "background.paper",
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {category.code}
        </Typography>
        {!category.active && (
          <Chip label="Inactive" size="small" color="default" sx={{ height: 20, fontSize: "0.7rem" }} />
        )}
        {category.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", md: "block" } }}>
           ; {category.description}
          </Typography>
        )}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: "right" }}>
          {category.componentCount} components
        </Typography>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => onEdit(category)}
            sx={{ "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
          >
            <PencilSimple size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(category)}
            sx={{ "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
          >
            <Trash size={16} />
          </IconButton>
        </Tooltip>
        <Box sx={{ width: 20 }} />
      </Stack>
    </Box>
  );
}
