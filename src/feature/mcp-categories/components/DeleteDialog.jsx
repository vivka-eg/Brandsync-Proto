"use client";

import {
  Button,
  CircularProgress,
  Alert,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function DeleteDialog({ open, category, onClose, onConfirm, loading }) {
  const isParent = category?.subcategoryCount > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: isParent ? 1.5 : 0 }}>
          Are you sure you want to delete{" "}
          <strong>&quot;{category?.name}&quot;</strong>?
        </Typography>
        {isParent && (
          <Alert severity="warning" sx={{ fontSize: "0.8rem" }}>
            This is a parent category with{" "}
            <strong>{category.subcategoryCount} subcategories</strong>. All
            subcategories will also be deleted. Components in those categories
            will be orphaned.
          </Alert>
        )}
        {!isParent && category?.componentCount > 0 && (
          <Alert severity="warning" sx={{ fontSize: "0.8rem" }}>
            This category has <strong>{category.componentCount} components</strong>{" "}
            which will be orphaned.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} size="small">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          size="small"
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
