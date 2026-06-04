"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ArrowRight,
  Desktop,
  DeviceTablet,
  DeviceMobileCamera,
  PencilSimple,
  Trash,
} from "phosphor-react";
import { useRouter } from "next/navigation";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import PatternCardImageDummy from "./PatternCardImageDummy";
import PatternImagePreviewer from "./PatternImagePreviewer";

const DEVICE_TABS = [
  { id: "desktop", label: "Desktop", Icon: Desktop },
  { id: "tablet", label: "Tablet", Icon: DeviceTablet },
  { id: "mobile", label: "Mobile", Icon: DeviceMobileCamera },
];

function PatternListItem({ pattern, onSelectPattern, onDelete }) {
  const router = useRouter();
  const { isAdmin, isSuperAdmin } = useMCPAuthContext();
  const canManage = isAdmin || isSuperAdmin;

  const [activeDevice, setActiveDevice] = useState("desktop");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const screenshotUrl = pattern.screenshots?.find(
    (s) => s.platform === activeDevice.toUpperCase(),
  )?.url;

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1" fontWeight={700} sx={{ flex: 1 }}>
          {pattern.title}
        </Typography>

        {canManage && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Edit pattern">
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{
                  color: "text.primary",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "primary.main", color: "white" },
                }}
              >
                <PencilSimple size={16} weight="bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete pattern">
              <IconButton
                size="small"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  color: "text.primary",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "error.main", color: "white" },
                }}
              >
                <Trash size={16} weight="bold" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {pattern.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {pattern.description}
        </Typography>
      )}

      {/* Device tabs + Generate button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            bgcolor: "neutral.container",
            p: 1,
            borderRadius: 4,
          }}
        >
          {DEVICE_TABS.map(({ id, label, Icon }) => {
            const active = id === activeDevice;
            return (
              <Button
                key={id}
                size="small"
                variant={active ? "contained" : "outlined"}
                startIcon={<Icon size={14} />}
                onClick={() => handleDeviceChange(id)}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  fontSize: "0.78rem",
                  fontWeight: active ? 600 : 400,
                  py: 0.5,
                  px: 1.5,
                  boxShadow: "none",
                  border: "none",
                  // borderColor: active ? undefined : "#A9ACB1",
                  color: active ? "white" : "text.secondary",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        <Button
          size="small"
          variant="outlined"
          endIcon={<ArrowRight size={14} />}
          onClick={() => onSelectPattern(pattern)}
          sx={{
            borderRadius: 1.5,
            fontSize: "0.78rem",
            py: 0.5,
            px: 1.5,
            mb: 0.5,
            textTransform: "none",
            borderColor: "#A9ACB1",
            color: "text.primary",
            bgcolor: "background.primary",
            boxShadow: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#8c8f94",
              bgcolor: "#d4d4d5",
              boxShadow: "none",
            },
          }}
        >
          Generate prompt
        </Button>
      </Box>

      {/* Preview */}
      {screenshotUrl ? (
        <PatternImagePreviewer
          src={screenshotUrl}
          alt={pattern.title}
          activeDevice={activeDevice}
        />
      ) : (
        <PatternCardImageDummy label={pattern.title} />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Pattern</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{pattern.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 1, textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ borderRadius: 1, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SubCategoryPatternsPanel({
  category,
  subCategory,
  patterns,
  loading,
  onBack,
  onSelectPattern,
  onDelete,
}) {
  return (
    <Box sx={{ p: 2 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <Typography
          component="span"
          variant="body2"
          onClick={onBack}
          sx={{
            color: "primary.main",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {category.name}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {">"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subCategory?.name ?? ""}
        </Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        {subCategory?.name ?? category.name}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : patterns.length === 0 ? (
        <Typography variant="body2" color="text.disabled">
          No patterns available.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {patterns.map((pattern, idx) => (
            <Box key={pattern.id ?? idx}>
              <PatternListItem
                pattern={pattern}
                onSelectPattern={onSelectPattern}
                onDelete={onDelete}
              />
              {idx < patterns.length - 1 && <Divider sx={{ mt: 4 }} />}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
