"use client";

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Trash } from "phosphor-react";
import { useIconsUploadContext } from "../context/IconsUploadContext";
import Image from "next/image";
import { CustomChip } from "@/constants";

const MAX_VISIBLE_TAGS = 4;

function TagList({ tags = [] }) {
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflow = tags.length - MAX_VISIBLE_TAGS;
  return (
    <Stack direction="row" flexWrap="wrap" gap={0.5}>
      {visible.map((tag, i) => (
        <Chip
          key={i}
          label={tag}
          size="small"
          sx={{ borderRadius: "6px", fontSize: 12 }}
        />
      ))}
      {overflow > 0 && (
        <Chip
          label={`+${overflow}`}
          size="small"
          sx={{
            borderRadius: "6px",
            fontSize: 12,
            bgcolor: "action.selected",
            color: "text.secondary",
          }}
        />
      )}
    </Stack>
  );
}

function CategoryList({ categories = [] }) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={0.5}>
      {categories.map((cat, i) => (
        <CustomChip key={i} label={cat.label} variant="default" sx={{ minWidth: 0, px: 1, fontSize: 12 }} />
      ))}
    </Stack>
  );
}

function ReviewAndUpload() {
  const { icons, setIcons } = useIconsUploadContext();

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary">
        {icons.length} icon{icons.length !== 1 ? "s" : ""} ready to upload — review before submitting
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "neutral.light" }}>
              <TableCell sx={{ width: 56, py: 1.25, fontWeight: 600, fontSize: 13 }}>Icon</TableCell>
              <TableCell sx={{ py: 1.25, fontWeight: 600, fontSize: 13 }}>Name</TableCell>
              <TableCell sx={{ py: 1.25, fontWeight: 600, fontSize: 13 }}>Type</TableCell>
              <TableCell sx={{ py: 1.25, fontWeight: 600, fontSize: 13 }}>Categories</TableCell>
              <TableCell sx={{ py: 1.25, fontWeight: 600, fontSize: 13 }}>Tags</TableCell>
              <TableCell sx={{ width: 48, py: 1.25 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {icons.map((icon, index) => {
              const { name, iconType, categories = [], tags = [], url } = icon;
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.15s",
                  }}
                >
                  {/* Icon preview */}
                  <TableCell sx={{ py: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "neutral.light",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image src={url} width={24} height={24} alt="" />
                    </Box>
                  </TableCell>

                  {/* Name */}
                  <TableCell sx={{ py: 1 }}>
                    <Typography fontWeight={600} fontSize={14} noWrap>
                      {name.split(".")[0]}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell sx={{ py: 1 }}>
                    <CustomChip
                      label={iconType?.label || "Unknown"}
                      variant="info"
                      sx={{ minWidth: 0 }}
                    />
                  </TableCell>

                  {/* Categories */}
                  <TableCell sx={{ py: 1 }}>
                    <CategoryList categories={categories} />
                  </TableCell>

                  {/* Tags */}
                  <TableCell sx={{ py: 1 }}>
                    <TagList tags={tags} />
                  </TableCell>

                  {/* Delete */}
                  <TableCell sx={{ py: 1 }} align="right">
                    <IconButton
                      size="small"
                      onClick={() => setIcons(icons.filter((_, i) => i !== index))}
                      aria-label="Remove icon"
                      sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <Trash size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default ReviewAndUpload;
