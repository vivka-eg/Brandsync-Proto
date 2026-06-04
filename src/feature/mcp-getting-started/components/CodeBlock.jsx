"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Copy, Check } from "phosphor-react";

export default function CodeBlock({ label, code, copyable = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Box
      sx={{
        bgcolor: "#f7f7f5",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          pt: 2.5,
          pb: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Roboto Mono', Consolas, monospace",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "16px",
            color: "#6d7585",
          }}
        >
          {label}
        </Typography>
        {copyable && (
          <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
            <IconButton
              onClick={handleCopy}
              size="small"
              sx={{
                width: 32,
                height: 32,
                color: copied ? "success.main" : "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          px: 2.5,
          pb: 2.5,
          fontFamily: "'Roboto Mono', Consolas, monospace",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "20px",
          color: "text.primary",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code}
      </Box>
    </Box>
  );
}
