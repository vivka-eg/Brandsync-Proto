import { useState } from "react";
import { deleteProductLogo } from "@/api/design-system/product-logos";

/**
 * Custom hook for managing delete dialog state and operations
 *
 * @param {Function} onDeleteSuccess - Callback function to execute after successful deletion
 * @param {Function} onDeleteError - Callback function to execute after deletion error
 * @returns {{
 *   deleteDialogOpen: boolean,
 *   logoToDelete: Object|null,
 *   deleting: boolean,
 *   handleDeleteClick: Function,
 *   handleDeleteConfirm: Function,
 *   handleDeleteCancel: Function
 * }}
 */
export const useDeleteDialog = (onDeleteSuccess, onDeleteError) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /**
   * Opens the delete dialog for a specific logo
   * @param {Object} logo - Logo object to delete
   */
  const handleDeleteClick = (logo) => {
    setLogoToDelete(logo);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirms and executes the delete operation
   */
  const handleDeleteConfirm = async () => {
    if (!logoToDelete) return;

    setDeleting(true);
    try {
      const data = await deleteProductLogo(logoToDelete.id);

      if (data.success) {
        onDeleteSuccess?.("Logo deleted successfully");
      } else {
        onDeleteError?.(data.error || "Failed to delete logo");
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      onDeleteError?.(error.message || "Failed to delete logo");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setLogoToDelete(null);
    }
  };

  /**
   * Cancels the delete operation and closes the dialog
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLogoToDelete(null);
  };

  return {
    deleteDialogOpen,
    logoToDelete,
    deleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
