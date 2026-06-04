"use client";
import {
  Box,
  Typography,
  Modal,
  Button,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import { ContentCopy, Close, Download } from "@mui/icons-material";
import { formatTabs } from "../constants";
import { generateExportCode } from "../utils/exportGenerators";
import { CaretDownIcon, DownloadIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { captureEvent } from "@/lib/analytics/posthog";

const TokenExportModal = ({
  open,
  onClose,
  selectedColor,
  formatTab,
  onFormatChange,
  onCopyAll,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [copied, setCopied] = useState(false);
  const codePreviewRef = useRef(null);
  const modalContentRef = useRef(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyCode = () => {
    const code = generateExportCode(selectedColor, formatTab);
    navigator.clipboard.writeText(code);
    captureEvent("theme_builder_tokens_copied", { color_name: selectedColor, format: formatTab });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset scroll position when format changes
  useEffect(() => {
    if (codePreviewRef.current) {
      codePreviewRef.current.scrollTop = 0;
    }
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [formatTab]);

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFormat = (format) => {
    const code = generateExportCode(selectedColor, format);
    const extensions = { css: "css", scss: "scss", json: "json", js: "js" };
    const filename = `${selectedColor}-theme.${extensions[format]}`;
    captureEvent("theme_builder_tokens_downloaded", { color_name: selectedColor, format });
    downloadFile(code, filename);
    handleMenuClose();
  };

  const handleDownloadZip = async () => {
    try {
      // Dynamically import JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Generate all formats
      const formats = ["css", "scss", "json"];
      formats.forEach((format) => {
        const code = generateExportCode(selectedColor, format);
        const extensions = {
          css: "css",
          scss: "scss",
          json: "json",
        };
        zip.file(
          `${selectedColor}-theme.${extensions[format]}`,
          code
        );
      });

      captureEvent("theme_builder_tokens_downloaded", { color_name: selectedColor, format: "zip" });

      // Generate the zip file
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedColor}-theme.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      handleMenuClose();
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="export-tokens-modal">
      <Box
        ref={modalContentRef}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600, md: 700 },
          maxHeight: "95vh",
          overflow: "auto",
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          boxShadow: 24,
          // overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Image
            src={`/accessible-palettes/${selectedColor}.svg`}
            alt="BrandSync Logo"
            width={50}
            height={50}
          />
          <Typography
            variant="h6"
            component="h2"
            sx={{ ml: 2, fontWeight: 500, fontSize: "1.125rem", flex: 1 }}
          >
            {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}{" "}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close export tokens modal"
            sx={{
              color: "text.primary",
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <Close aria-hidden="true" />
          </IconButton>
        </Box>

        {/* Format Selection */}
        <Box
          sx={{
            px: 3,
            pt: 2,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Tabs
            value={formatTab}
            onChange={(_, v) => onFormatChange(v)}
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                px: 2,
              },
            }}
          >
            {formatTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>

        {/* Code Preview */}
        <Box sx={{ p: 3, position: "relative" }}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton
              onClick={handleCopyCode}
              size="small"
              aria-label={copied ? "Copied!" : "Copy code to clipboard"}
              sx={{
                position: "absolute",
                top: 42,
                right: 48,
                backgroundColor: copied ? "action.active" : "background.paper",
                color: copied ? "#fff" : "text.secondary",
                boxShadow: theme.shadows[2],
                zIndex: 2,
                "&:hover": {
                  backgroundColor: copied ? "action.active" : "action.hover",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box
            ref={codePreviewRef}
            sx={{
              position: "relative",
              backgroundColor: "neutral.light",
              borderRadius: 2,
              p: 2.5,
              pr: 7,
              maxHeight: 350,
              overflow: "auto",
            }}
          >
            <pre
              style={{
                margin: 0,
                color: theme.palette.text.primary,
                fontSize: "1rem",
                // fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {generateExportCode(selectedColor, formatTab)}
            </pre>
          </Box>
        </Box>

        {/* Modal Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            p: 3,
            pt: 0,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#D1D5DB",
              color: "#374151",
              px: 3,
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleMenuClick}
            endIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: 1.5,
                  ml: 1,
                  borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
                }}
              >
                <CaretDownIcon size={18} />
              </Box>
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "action.active",
              px: "16px",
              py: "12px",
              borderRadius: 2,
            }}
          >
            Download tokens
          </Button>

          {/* Download Menu */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              },
              marginTop: "-8px",
            }}
          >
            <MenuItem
              onClick={() => handleDownloadFormat("css")}
              sx={{
                py: "8px",
                px: "16px",
                fontSize: "1rem",
                lineHeight: 1.5,
                "&:hover": { backgroundColor: "#F3F4F6" },
                color: "text.body",
              }}
            >
              CSS
            </MenuItem>
            <MenuItem
              onClick={() => handleDownloadFormat("scss")}
              sx={{
                py: "8px",
                px: "16px",
                fontSize: "1rem",
                lineHeight: 1.5,
                "&:hover": { backgroundColor: "#F3F4F6" },
                color: "text.body",
              }}
            >
              SCSS
            </MenuItem>
            <MenuItem
              onClick={() => handleDownloadFormat("json")}
              sx={{
                py: "8px",
                px: "16px",
                fontSize: "1rem",
                lineHeight: 1.5,
                "&:hover": { backgroundColor: "#F3F4F6" },
                color: "text.body",
              }}
            >
              JSON
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={handleDownloadZip}
              sx={{
                py: "8px",
                px: "16px",
                fontSize: "1rem",

                color: "text.body",
              }}
            >
              Download ZIP
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Modal>
  );
};

export default TokenExportModal;
