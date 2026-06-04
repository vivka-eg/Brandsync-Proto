"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

export function DeletePhotoDialog({
  open,
  onClose,
  photoTitle,
  onConfirm,
  deleting,
}) {
  return (
    <Dialog open={open} onClose={() => !deleting && onClose()} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Image</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete &quot;{photoTitle}&quot;? This action
          cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={deleting}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function BulkDeleteDialog({
  open,
  onClose,
  count,
  onConfirm,
  deleting,
}) {
  return (
    <Dialog open={open} onClose={() => !deleting && onClose()} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Multiple Images</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {count} image{count !== 1 ? "s" : ""}?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={deleting}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {deleting ? "Deleting..." : `Delete ${count} Image${count !== 1 ? "s" : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
