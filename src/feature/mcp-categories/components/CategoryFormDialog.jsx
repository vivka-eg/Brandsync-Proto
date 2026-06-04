"use client";

import {
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import CategoryForm from "./CategoryForm";

export default function CategoryFormDialog({
  open,
  onClose,
  editingCategory,
  form,
  onChange,
  parents,
  onSave,
  saving,
  formError,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {editingCategory ? "Edit Category" : "New Category"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        {formError && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {formError}
          </Alert>
        )}
        <CategoryForm
          form={form}
          onChange={onChange}
          parents={parents}
          editingCategory={editingCategory}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={saving}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={saving}
          size="small"
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ textTransform: "none", fontWeight: 600, boxShadow: "none" }}
        >
          {editingCategory ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
