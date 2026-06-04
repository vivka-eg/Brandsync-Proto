"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";

function IconsEmptyState({ searchValue, categories, styles, onClearSearch, onClearFilters }) {
  const hasSearch = searchValue?.trim().length > 0;
  const hasFilters = categories?.length > 0 || styles?.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 12,
        px: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <MagnifyingGlass size={36} weight="light" style={{ opacity: 0.4 }} />
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        No icons found
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
        {hasSearch
          ? <>No results for <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>"{searchValue}"</Box>. Try a different search term or clear your filters.</>
          : "No icons match the selected filters. Try adjusting your selection."}
      </Typography>

      <Stack direction="row" spacing={1.5}>
        {hasSearch && (
          <Button variant="outlined" size="small" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
        {hasFilters && (
          <Button variant="outlined" size="small" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default IconsEmptyState;
