"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { X, SquaresFour, Palette, Code, Rows } from "phosphor-react";
import { getComponent } from "@/api/mcp/client/components";

const CATEGORY_COLORS_LOCAL = {
  Form: "#0073E1",
  "Data Display": "#7C3AED",
  Navigation: "#059669",
  Feedback: "#D97706",
  Layout: "#DC2626",
};

function SectionLabel({ icon: Icon, children }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75} mb={1}>
      <Icon size={14} weight="bold" />
      <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }}>
        {children}
      </Typography>
    </Stack>
  );
}

export default function ComponentDetailModal({ component, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BRANDSYNC_MCP_URL || !component?.name) return;
    setLoading(true);
    getComponent(component.name)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [component]);

  const data = detail || component;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pb: 1.5,
          pr: 1.5,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
            {data.name}
          </Typography>
          {data.category && (
            <Chip
              label={data.category}
              size="small"
              sx={{
                mt: 0.75,
                bgcolor: `${CATEGORY_COLORS_LOCAL[data.category]}18`,
                color: CATEGORY_COLORS_LOCAL[data.category] || "text.secondary",
                fontWeight: 600,
                border: "none",
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ ml: 1 }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Stack gap={3}>
            {data.description && (
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {data.description}
              </Typography>
            )}

            {data.variants?.length > 0 && (
              <Box>
                <SectionLabel icon={Rows}>Variants</SectionLabel>
                <Stack direction="row" gap={0.75} flexWrap="wrap">
                  {data.variants.map((v) => (
                    <Chip key={v} label={v} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}

            {data.frameworks?.length > 0 && (
              <Box>
                <SectionLabel icon={Code}>Frameworks</SectionLabel>
                <Stack direction="row" gap={0.75} flexWrap="wrap">
                  {data.frameworks.map((f) => (
                    <Chip key={f} label={f} size="small" />
                  ))}
                </Stack>
              </Box>
            )}

            {data.tokens?.length > 0 && (
              <Box>
                <SectionLabel icon={Palette}>
                  Design Tokens ({data.tokens.length})
                </SectionLabel>
                <Stack direction="row" gap={0.75} flexWrap="wrap">
                  {data.tokens.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      size="small"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        bgcolor: "background.default",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {data.cssClasses?.length > 0 && (
              <Box>
                <SectionLabel icon={SquaresFour}>
                  CSS Classes ({data.cssClasses.length})
                </SectionLabel>
                <Stack direction="row" gap={0.75} flexWrap="wrap">
                  {data.cssClasses.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      size="small"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        bgcolor: "background.default",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {!data.description && !data.variants && !data.tokens && !data.cssClasses && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                Full component details are available when the MCP service is connected.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
