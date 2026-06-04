import { Button, Box } from "@mui/material";
import { Check, Copy } from "phosphor-react";
import React, { useState } from "react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function CopyButton({ text, copyText, sx = {} }) {
  const [copied, setCopied] = useState(false);
  const { showSnackbar } = useAccessiblePaletteContext();

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    showSnackbar(`${copyText} copied to clipboard!`, "success");
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Button
      sx={{
        width: "fit-content",
        textAlign: "center",
        display: "flex",
        gap: 1,
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: copied ? "scale(1.05)" : "scale(1)",
        ...sx,
      }}
      onClick={handleCopy}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          transition: "all 0.3s ease-in-out",
          animation: copied ? "bounce 0.5s ease-in-out" : "none",
          "@keyframes bounce": {
            "0%, 100%": {
              transform: "translateY(0)",
            },
            "50%": {
              transform: "translateY(-4px)",
            },
          },
        }}
      >
        {copied ? (
          <Check size={20} weight="bold" />
        ) : (
          <Copy size={20} weight="bold" />
        )}{" "}
        {text}
      </Box>
    </Button>
  );
}

export default CopyButton;
