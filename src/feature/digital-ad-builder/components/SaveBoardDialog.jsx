"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

function defaultBoardName() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Dialog for naming and saving / renaming an ad board.
 *
 * Props:
 *   open          – boolean
 *   onClose       – () => void
 *   onConfirm     – (name: string) => Promise<void>
 *   initialName   – string | undefined  (pre-fill for renames)
 *   isRename      – boolean             (changes title/CTA text)
 */
export default function SaveBoardDialog({ open, onClose, onConfirm, initialName, isRename = false }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName(initialName ?? defaultBoardName());
      setError("");
      setSaving(false);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [open, initialName]);

  const handleConfirm = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Board name cannot be empty.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onConfirm(trimmed);
      onClose();
    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !saving) handleConfirm();
    if (e.key === "Escape") onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        {isRename ? "Rename board" : "Save board"}
      </DialogTitle>

      <DialogContent sx={{ pt: "8px !important" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isRename
            ? "Enter a new name for this board."
            : "Give your board a name so you can find it later."}
        </Typography>

        <TextField
          inputRef={inputRef}
          label="Board name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error || " "}
          fullWidth
          autoFocus
          size="small"
          disabled={saving}
          inputProps={{ maxLength: 120 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={saving}
          variant="text"
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={saving || !name.trim()}
          variant="contained"
          sx={{ textTransform: "none", fontWeight: 700, minWidth: 90 }}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {saving ? "Saving…" : isRename ? "Rename" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
