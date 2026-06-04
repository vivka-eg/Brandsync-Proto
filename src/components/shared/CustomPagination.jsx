"use client";

import { Box, Button, IconButton, InputBase, Typography } from "@mui/material";
import { CaretLeft, CaretRight } from "phosphor-react";

const CustomPagination = ({ page, totalPages, onPageChange, sx }) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={sx}>
      <Button onClick={handlePrev} size="small" sx={{ p: "12px" }}>
        <CaretLeft size={20} weight="regular" />
      </Button>

      <Box
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          border: "1px solid #E0E0E0",
          minWidth: 40,
          textAlign: "center",
        }}
      >
        <Typography fontSize={14}>{page}</Typography>
      </Box>

      <Typography fontSize={14} color="text.secondary">
        of {totalPages} pages
      </Typography>

      <Button onClick={handleNext} size="small" sx={{ p: "12px" }}>
        <CaretRight size={20} weight="regular" />
      </Button>
    </Box>
  );
};

export default CustomPagination;
