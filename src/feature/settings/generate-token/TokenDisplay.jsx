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
        bgcolor: "#111118",
        border: "1px solid",
        borderColor: "rgba(255,255,255,0.1)",
        borderRadius: "16px",
        px: 3,
        py: 2,
        width: "100%",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <Typography
        component="span"
        sx={{
          flex: 1,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "14px",
          color: visible ? "#10b981" : "#a1a1aa",
          letterSpacing: visible ? "normal" : "0.15em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          userSelect: visible ? "text" : "none",
          fontWeight: 500,
        }}
      >
        {displayValue}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Tooltip title={visible ? "Hide token" : "Show token"} placement="top">
          <IconButton
            size="small"
            onClick={() => setVisible((v) => !v)}
            sx={{ 
              color: visible ? "#fff" : "rgba(255,255,255,0.5)", 
              transition: "all 0.2s",
              "&:hover": { 
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)"
              } 
            }}
          >
            {visible ? <EyeSlash size={20} weight="duotone" /> : <Eye size={20} weight="duotone" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={copied ? "Copied!" : "Copy token"} placement="top">
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{ 
              color: copied ? "#10b981" : "rgba(255,255,255,0.5)", 
              transition: "all 0.2s",
              "&:hover": { 
                color: copied ? "#10b981" : "#fff",
                bgcolor: "rgba(255,255,255,0.1)"
              } 
            }}
          >
            {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="duotone" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}