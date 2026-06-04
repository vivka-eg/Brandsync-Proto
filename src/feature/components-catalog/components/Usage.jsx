"use client";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { Box } from "@mui/material";

function Usage({ usage }) {
  return (
    <Box>
      <MarkdownRenderer content={usage.Content}></MarkdownRenderer>
    </Box>
  );
}

export default Usage;
