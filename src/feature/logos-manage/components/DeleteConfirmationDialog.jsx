import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

/**
 * Confirmation dialog for deleting a logo
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Object} props.logoToDelete - Logo object to delete
 * @param {boolean} props.deleting - Whether deletion is in progress
 * @param {Function} props.onConfirm - Callback for confirming deletion
 * @param {Function} props.onCancel - Callback for canceling deletion
 */
const DeleteConfirmationDialog = ({
  open,
  logoToDelete,
  deleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Logo</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the logo "{logoToDelete?.name}"? This
          action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
