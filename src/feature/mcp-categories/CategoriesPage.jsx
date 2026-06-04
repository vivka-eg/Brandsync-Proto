"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Collapse,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { Plus } from "phosphor-react";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import useCategories from "./hooks/useCategories";
import useCategoryForm from "./hooks/useCategoryForm";
import useCategoryDelete from "./hooks/useCategoryDelete";
import ParentRow from "./components/ParentRow";
import SubcategoryRow from "./components/SubcategoryRow";
import CategoryFormDialog from "./components/CategoryFormDialog";
import DeleteDialog from "./components/DeleteDialog";

export default function CategoriesPage() {
  const { isAdmin, isSuperAdmin, loading: authLoading } = useMCPAuthContext();
  const canManage = isAdmin || isSuperAdmin;

  const [expandedIds, setExpandedIds] = useState({});

  const {
    categories,
    loading,
    error,
    setError,
    fetchCategories,
    parents,
    getSubcats,
  } = useCategories({ skip: authLoading });

  const {
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
  } = useCategoryForm();

  const {
    deleteTarget,
    deleting,
    setDeleteTarget,
    clearDeleteTarget,
    handleDeleteConfirm,
  } = useCategoryDelete({ onError: setError });

  const handleToggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!canManage) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Access Restricted
        </Typography>
        <Typography color="text.secondary">
          You need ADMIN or SUPER_ADMIN role to manage categories.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the 2-level category hierarchy for MCP patterns.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={openCreate}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            px: 2.5,
            py: 1,
            boxShadow: "none",
          }}
        >
          New Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No categories yet.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Plus size={16} />}
            onClick={openCreate}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600 }}
          >
            Create first category
          </Button>
        </Box>
      ) : (
        <Stack spacing={1}>
          {parents.map((parent) => {
            const subs = getSubcats(parent.id);
            const isExpanded =
              expandedIds[parent.id] !== false && subs.length > 0
                ? expandedIds[parent.id] ?? true
                : expandedIds[parent.id] ?? false;

            return (
              <Box key={parent.id}>
                <ParentRow
                  category={parent}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  expanded={isExpanded}
                  onToggle={() => handleToggleExpand(parent.id)}
                />
                {subs.length > 0 && (
                  <Collapse in={isExpanded}>
                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                      {subs.map((sub) => (
                        <SubcategoryRow
                          key={sub.id}
                          category={sub}
                          onEdit={openEdit}
                          onDelete={setDeleteTarget}
                        />
                      ))}
                    </Stack>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        editingCategory={editingCategory}
        form={form}
        onChange={handleFormChange}
        parents={parents}
        onSave={() => handleSave(fetchCategories)}
        saving={saving}
        formError={formError}
      />

      <DeleteDialog
        open={Boolean(deleteTarget)}
        category={deleteTarget}
        onClose={clearDeleteTarget}
        onConfirm={() => handleDeleteConfirm(fetchCategories)}
        loading={deleting}
      />
    </Box>
  );
}
