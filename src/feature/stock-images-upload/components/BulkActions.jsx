"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { Sparkle } from "@phosphor-icons/react";

export default function BulkActions({
  onAnalyzeAll,
  onCategoryAssign,
  bulkAiLoading,
  processingCount,
  totalCount,
  categoryValue,
  onCategoryChange,
  categories = [],
}) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "background.default",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
        Bulk Actions
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
        <Button
          variant="contained"
          size="small"
          startIcon={<Sparkle size={18} weight="fill" />}
          onClick={onAnalyzeAll}
          disabled={bulkAiLoading}
          sx={{ textTransform: "none", fontWeight: 500, mt: 1 }}
        >
          {bulkAiLoading ? "Analyzing All..." : "Analyze All with AI"}
        </Button>
        <Autocomplete
          multiple
          size="small"
          options={categories}
          getOptionLabel={(option) => option.label}
          value={
            Array.isArray(categoryValue)
              ? categories.filter((cat) => categoryValue.includes(cat.id))
              : []
          }
          onChange={(event, newValue) => {
            const categoryIds = newValue.map((v) => v.id);
            onCategoryAssign(categoryIds);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assign Categories to All"
              placeholder="Select categories"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.label}
                  size="small"
                  {...tagProps}
                  sx={{ borderRadius: 1.5 }}
                />
              );
            })
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{ minWidth: 300, flex: 1 }}
        />
      </Stack>
      {bulkAiLoading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Processing {processingCount} of {totalCount} images...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
