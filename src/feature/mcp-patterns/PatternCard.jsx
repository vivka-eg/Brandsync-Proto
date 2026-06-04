"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Star, Sparkle, Plus, Desktop, DeviceTablet, DeviceMobileCamera, PencilSimple, Trash } from "phosphor-react";
import { useRouter } from "next/navigation";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import PatternCardImageDummy from "./PatternCardImageDummy";
import GeneratePromptDialog from "./GeneratePromptDialog";
import PatternImagePreviewer from "./PatternImagePreviewer";

const DEVICE_TABS = [
  { id: "desktop", label: "Desktop", Icon: Desktop           },
  { id: "tablet",  label: "Tablet",  Icon: DeviceTablet       },
  { id: "mobile",  label: "Mobile",  Icon: DeviceMobileCamera },
];

export default function PatternCard({ pattern, onDelete }) {
  const { title, businessUnit, rating, screenshots, description } = pattern;
  const router = useRouter();
  const { isAdmin, isSuperAdmin } = useMCPAuthContext();
  const canManage = isAdmin || isSuperAdmin;

  const [activeDevice, setActiveDevice] = useState("desktop");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const screenshotUrl = screenshots?.find((s) => s.platform === activeDevice.toUpperCase())?.url;

  function handleDeviceChange(id) {
    if (id === activeDevice) return;
    setActiveDevice(id);
  }

  function handleEdit() {
    router.push(`/mcp/patterns/upload?id=${pattern.id}`);
  }

  function handleDeleteConfirm() {
    onDelete?.(pattern.id);
    setDeleteDialogOpen(false);
  }

  return (
    <Box
      sx={{
        bgcolor: "neutral.border",
        border: "1px solid #A9ACB1",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      }}
    >
      {/* Title row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: "text.muted" }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />

        {/* Green star rating */}
        {rating != null && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Star size={14} weight="fill" color="#22c55e" />
            <Typography variant="caption" fontWeight={700} sx={{ color: "text.primary", lineHeight: 1 }}>
              {Number(rating).toFixed(1)}
            </Typography>
          </Box>
        )}

        {/* Admin actions */}
        {canManage && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Tooltip title="Edit pattern">
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
              >
                <PencilSimple size={15} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete pattern">
              <IconButton
                size="small"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
              >
                <Trash size={15} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Description */}
      {description && (
        <Typography
          variant="caption"
          sx={{ lineHeight: 1.6, display: "block", mt: -0.25, color: "text.muted", fontWeight: 400 }}
        >
          {description}
        </Typography>
      )}

      {/* Device tabs + Generate Prompt */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", borderBottom: "1px solid", borderColor: "divider" }}>
          {DEVICE_TABS.map(({ id, label, Icon }) => {
            const active = id === activeDevice;
            return (
              <ButtonBase
                key={id}
                onClick={() => handleDeviceChange(id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.25,
                  py: 0.75,
                  borderBottom: "2px solid",
                  borderColor: active ? "text.primary" : "transparent",
                  color: active ? "text.primary" : "text.disabled",
                  mb: "-1px",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={13} weight={active ? "bold" : "regular"} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: active ? 600 : 400, color: "inherit", fontSize: "0.78rem", lineHeight: 1 }}
                >
                  {label}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<Sparkle size={13} />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderRadius: 1.5,
            fontSize: "0.72rem",
            py: 0.5,
            px: 1.25,
            mb: 0.5,
            textTransform: "none",
            borderColor: "#A9ACB1",
            color: "text.primary",
            bgcolor: "background.primary",
            boxShadow: "none",
            fontWeight: 500,
            "&:hover": { borderColor: "#8c8f94", bgcolor: "#d4d4d5", boxShadow: "none" },
          }}
        >
          Generate Prompt
        </Button>
      </Box>

      {/* Preview */}
      {screenshotUrl ? (
        <Box
          sx={{
            position: "relative",
            "&:hover .preview-overlay": { opacity: 1 },
          }}
        >
          <PatternImagePreviewer
            src={screenshotUrl}
            alt={title}
            activeDevice={activeDevice}
          />

          {/* Generate Prompt hover overlay; pointer-events: none so magnify icon stays on top */}
          <Box
            className="preview-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={buttonHovered ? <Plus size={17} color="#121212" /> : <Sparkle size={16} color="#121212" />}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              onClick={(e) => { e.stopPropagation(); setDialogOpen(true); }}
              sx={{
                pointerEvents: "auto",
                borderRadius: 1.5,
                fontSize: "0.85rem",
                py: 0.9,
                px: 2,
                textTransform: "none",
                borderColor: "#A9ACB1",
                color: "text.primary",
                bgcolor: "background.primary",
                boxShadow: "none",
                fontWeight: 500,
                transition: "transform 0.2s, background-color 0.2s, border-color 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                  borderColor: "#A9ACB1",
                  bgcolor: "background.primary",
                  boxShadow: "none",
                },
              }}
            >
              Generate Prompt
            </Button>
          </Box>
        </Box>
      ) : (
        <PatternCardImageDummy label={title} />
      )}

      <GeneratePromptDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        pattern={pattern}
        activeDevice={activeDevice}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Pattern</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 1, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
