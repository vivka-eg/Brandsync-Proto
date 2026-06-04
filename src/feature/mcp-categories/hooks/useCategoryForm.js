import { useState } from "react";
import { createCategory, updateCategory } from "@/api/mcp/admin/categories";

const EMPTY_FORM = {
  code: "",
  name: "",
  description: "",
  parentId: "",
  active: true,
  thumbnail: null,
};

export default function useCategoryForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setForm({
      code: category.code,
      name: category.name,
      description: category.description ?? "",
      parentId: category.parentId ?? "",
      active: category.active,
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeDialog = () => {
    if (!saving) setDialogOpen(false);
  };

  const handleSave = async (onSuccess) => {
    if (!form.code.trim() || !form.name.trim()) {
      setFormError("Code and Name are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        parentId: form.parentId || null,
        active: form.active,
        thumbnail: form.thumbnail || undefined,
      };
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      setDialogOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Failed to save category.";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  return {
    dialogOpen,
    editingCategory,
    form,
    formError,
    saving,
    openCreate,
    openEdit,
    handleFormChange,
    handleSave,
    closeDialog,
  };
}
