import { Box, Typography, Stack, Tooltip } from "@mui/material";
import { Download, FilePdf, PresentationChart } from "phosphor-react";

const focusVisibleStyle = {
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: "2px",
    borderRadius: "8px",
  },
};

function DownloadSection({ onDownload, onCviDownload, onPptDownload, selectedLogo }) {
  const hasCvi = !!selectedLogo?.assets?.cviURL;
  const hasPpt = !!selectedLogo?.assets?.powerpointURL;

  return (
    <Box mt={3}>
      {/* Download Logo Kit */}
      <Box
        role="button"
        tabIndex={0}
        onClick={onDownload}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDownload(); } }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 3,
          py: 1.5,
          bgcolor: "#2C3642",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: "#1F2733",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          ...focusVisibleStyle,
        }}
      >
        <Download size={20} weight="bold" />
        <Typography variant="body2" fontWeight={500}>
          Download Logo kit for this product
        </Typography>
      </Box>

      {/* CVI + PowerPoint */}
      <Stack direction="row" spacing={1.5} mt={1.5}>
        <Tooltip title={hasCvi ? "Download CVI PDF" : "Coming soon"} placement="bottom">
          <Stack
            direction="row"
            spacing={1}
            {...(hasCvi && {
              role: "button",
              tabIndex: 0,
              onClick: onCviDownload,
              onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCviDownload(); } },
            })}
            sx={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 1.25,
              borderRadius: "8px",
              bgcolor: hasCvi ? "#2C3642" : "rgba(44, 54, 66, 0.02)",
              color: hasCvi ? "white" : "text.secondary",
              opacity: hasCvi ? 1 : 0.6,
              cursor: hasCvi ? "pointer" : "default",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              ...(hasCvi && {
                "&:hover": {
                  bgcolor: "#1F2733",
                  transform: "translateY(-1px)",
                  boxShadow: 1,
                },
                ...focusVisibleStyle,
              }),
            }}
          >
            <FilePdf size={16} />
            <Typography variant="caption" fontWeight={500}>
              Download CVI
            </Typography>
          </Stack>
        </Tooltip>

        <Tooltip title={hasPpt ? "Download PowerPoint template" : "Coming soon"} placement="bottom">
          <Stack
            direction="row"
            spacing={1}
            {...(hasPpt && {
              role: "button",
              tabIndex: 0,
              onClick: onPptDownload,
              onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPptDownload(); } },
            })}
            sx={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 1.25,
              borderRadius: "8px",
              bgcolor: hasPpt ? "#2C3642" : "rgba(44, 54, 66, 0.02)",
              color: hasPpt ? "white" : "text.secondary",
              opacity: hasPpt ? 1 : 0.6,
              cursor: hasPpt ? "pointer" : "default",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              ...(hasPpt && {
                "&:hover": {
                  bgcolor: "#1F2733",
                  transform: "translateY(-1px)",
                  boxShadow: 1,
                },
                ...focusVisibleStyle,
              }),
            }}
          >
            <PresentationChart size={16} />
            <Typography variant="caption" fontWeight={500}>
              Download PowerPoint
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>
    </Box>
  );
}

export default DownloadSection;
