import { useState } from "react";
import { deleteCategory } from "@/api/mcp/admin/categories";

export default function useCategoryDelete({ onError } = {}) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const clearDeleteTarget = () => setDeleteTarget(null);

  const handleDeleteConfirm = async (onSuccess) => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? "Failed to delete category.";
      setDeleteTarget(null);
      if (onError) onError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteTarget,
    deleting,
    setDeleteTarget,
    clearDeleteTarget,
    handleDeleteConfirm,
  };
}
