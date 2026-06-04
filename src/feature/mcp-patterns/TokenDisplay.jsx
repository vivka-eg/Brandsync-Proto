"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Eye, EyeSlash, Copy, Check } from "phosphor-react";

export default function TokenDisplay({ token }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayValue = visible
    ? token
    : token.replace(/[^-]/g, (_, i) => (i % 8 === 0 ? token[i] : "•"));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: "#111",
        borderRadius: "12px",
        px: 3,
        py: 1.5,
        maxWidth: 480,
        width: "100%",
      }}
    >
      <Typography
        component="span"
        sx={{
          flex: 1,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: "#e0e0e0",
          letterSpacing: "0.03em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          userSelect: visible ? "text" : "none",
        }}
      >
        {displayValue}
      </Typography>

      <Tooltip title={visible ? "Hide token" : "Show token"}>
        <IconButton
          size="small"
          onClick={() => setVisible((v) => !v)}
          sx={{ color: "#aaa", "&:hover": { color: "#fff" } }}
        >
          {visible ? <EyeSlash size={18} /> : <Eye size={18} />}
        </IconButton>
      </Tooltip>

      <Tooltip title={copied ? "Copied!" : "Copy token"}>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{ color: copied ? "#4caf50" : "#aaa", "&:hover": { color: "#fff" } }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
