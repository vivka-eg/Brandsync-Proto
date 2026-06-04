"use client";

import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  PencilSimple,
  Trash,
  CaretDown,
  CaretRight,
  FolderSimple,
  FolderOpen,
} from "phosphor-react";

export default function ParentRow({ category, onEdit, onDelete, expanded, onToggle }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1.5,
        backgroundColor: "neutral.hover",
        borderRadius: 1,
        cursor: category.subcategoryCount > 0 ? "pointer" : "default",
        "&:hover": { backgroundColor: alpha(theme.palette.neutral.hover, 0.8) },
        gap: 1,
      }}
      onClick={category.subcategoryCount > 0 ? onToggle : undefined}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
        {category.subcategoryCount > 0 ? (
          expanded ? (
            <FolderOpen size={18} weight="fill" color={theme.palette.primary.main} />
          ) : (
            <FolderSimple size={18} weight="fill" color={theme.palette.primary.main} />
          )
        ) : (
          <FolderSimple size={18} color={theme.palette.text.secondary} />
        )}
        <Typography fontWeight={700} sx={{ fontSize: "0.9rem" }}>
          {category.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
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
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: "right" }}>
          {category.subcategoryCount > 0
            ? `${category.subcategoryCount} subcategories`
            : `${category.componentCount} components`}
        </Typography>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
            sx={{ "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
          >
            <PencilSimple size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => { e.stopPropagation(); onDelete(category); }}
            sx={{ "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
          >
            <Trash size={16} />
          </IconButton>
        </Tooltip>
        {category.subcategoryCount > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
            {expanded ? <CaretDown size={16} /> : <CaretRight size={16} />}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
