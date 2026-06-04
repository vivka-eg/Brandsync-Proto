"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Stack,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { DownloadSimple, Check, CopySimple } from "phosphor-react";
import { useParams } from "next/navigation";
import { downloadZipBundle } from "@/api/design-system/image-gallery";
import { captureEvent } from "@/lib/analytics/posthog";
import { recordDownload } from "@/api/download-tracking";

export default function DownloadSection({
  photo,
  downloadTab,
  onTabChange,
  onCopyPageLink,
  selectedSizeWeb,
  onSizeSelect,
  onDownload,
  onDownloadWebP,
  downloading,
  webpDownloading,
  webpError,
}) {
  const params = useParams();
  const id = params?.id;
  const [zipLoading, setZipLoading] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  return (
    <Box>
      <Tabs
        value={downloadTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Tab
          label="Print Media"
          value="print"
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        />
        <Tab
          label="Web"
          value="web"
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        />
        <Tab
          label="Link"
          value="link"
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        />
      </Tabs>

      {downloadTab === "print" && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Original Quality
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: 2,
              border: "2px solid",
              borderColor: "primary.main",
              bgcolor: "primary.50",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Original
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {photo?.dimensions?.width || "-"} x{" "}
                {photo?.dimensions?.height || "-"} px • Full quality, no
                compression
              </Typography>
            </Box>
            <Check size={20} weight="bold" color="#1976d2" />
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            Print media downloads the original uncompressed file for maximum
            quality.
          </Typography>
        </Box>
      )}

      {downloadTab === "web" && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Select Size
          </Typography>
          <Stack spacing={1}>
            {photo?.sizes?.map((size) => (
              <Box
                key={size.label}
                onClick={() => onSizeSelect(size)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor:
                    selectedSizeWeb?.label === size.label
                      ? "primary.main"
                      : "divider",
                  bgcolor:
                    selectedSizeWeb?.label === size.label
                      ? "primary.50"
                      : "background.paper",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor:
                      selectedSizeWeb?.label === size.label
                        ? "primary.main"
                        : "primary.light",
                  },
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {size.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {size.width} x {size.height} px
                  </Typography>
                </Box>
                {selectedSizeWeb?.label === size.label && (
                  <Check size={20} weight="bold" color="#1976d2" />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {downloadTab === "link" && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Page URL
          </Typography>
          <TextField
            value={pageUrl}
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
            onFocus={(e) => {
              try {
                e.target.select();
              } catch {
                // no-op
              }
            }}
          />
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<CopySimple size={18} weight="bold" />}
            onClick={() => onCopyPageLink?.()}
            disabled={!onCopyPageLink}
            sx={{
              mt: 1.25,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Copy
          </Button>
        </Box>
      )}

      {downloadTab === "print" && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={
            downloading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DownloadSimple size={20} weight="bold" />
            )
          }
          onClick={onDownload}
          disabled={downloading}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          {downloading ? "Original loading..." : "Download Original"}
        </Button>
      )}

      {downloadTab === "web" && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={
              webpDownloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadSimple size={20} weight="bold" />
              )
            }
            onClick={onDownloadWebP}
            disabled={!selectedSizeWeb || webpDownloading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {webpDownloading ? "WebP loading..." : "Download as WebP"}
          </Button>
          {webpError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {webpError}
            </Alert>
          )}
        </Box>
      )}

      {downloadTab === "web" && (
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            startIcon={
              zipLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadSimple size={20} weight="bold" />
              )
            }
            onClick={async () => {
              captureEvent("stock_image_download_zip", {
                image_id: id,
                image_title: photo.title,
                size_label: selectedSizeWeb?.label,
              });
              setZipLoading(true);
              try {
                await downloadZipBundle(id, photo.title);
                recordDownload({
                  assetId: String(id),
                  assetName: photo.title || "image",
                  assetType: "digital_asset",
                  format: ".zip",
                }).catch(() => {});
              } finally {
                setZipLoading(false);
              }
            }}
            disabled={!selectedSizeWeb || zipLoading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            {zipLoading ? "ZIP Bundle loading..." : "Download Zip bundle"}
          </Button>
          {webpError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {webpError}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}
