"use client";
import React, { useState } from "react";
import CustomIconButton from "@/components/shared/IconButton";
import { Stack, Typography } from "@mui/material";
import { Plus } from "phosphor-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import { PencilSimple, Trash } from "phosphor-react";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomTextField from "@/components/shared/CustomTextField";
import useIconCategories from "../../hooks/manage/useIconCategories";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

export function AddOrEditCategoryModal({
  open,
  onClose,
  value,
  setValue,
  onSubmit,
  type,
  mode = "add",
}) {
  const [error, setError] = useState(false);

  const textValues = {
    iconType: {
      label: "Icon Type Name",
      title: mode == "add" ? "Add New Icon Type" : "Edit Icon Type",
      placeholder: "Enter icon type name",
      errorText: "Icon type name is required",
    },
    category: {
      label: "Category Name",
      title: mode == "add" ? "Add New Category" : "Edit Category",
      placeholder: "Enter category name",
      errorText: "Category name is required",
    },
  };

  const handleSubmit = () => {
    if (!value.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSubmit();
    setValue("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{textValues[type].title}</DialogTitle>
      <DialogContent>
        <CustomTextField
          label={textValues[type].label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={textValues[type].placeholder}
          helperText={error ? textValues[type].errorText : ""}
          error={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function MultipleSelectionActions({ categoryHook }) {
  const { selectedcategories, handleDeleteSelected } = categoryHook;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteSelectedIcons = () => {
    handleDeleteSelected();
    setDeleteModalOpen(false);
  };

  if (selectedcategories.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        {selectedcategories.length} selected
      </Typography>
      <CustomIconButton
        text="Delete"
        onClick={() => {
          setDeleteModalOpen(true);
        }}
        Icon={Trash}
        startIcon
        variant="destructive"
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSelectedIcons}
        itemCount={selectedcategories.length}
        itemName="category"
        itemPluralName="categories"
      />
    </Stack>
  );
}

function CategoriesTable({ categoryHook }) {
  const {
    categories,
    selectedcategories,
    handleSelectAll,
    handleSelectCategory,
    handleDeleteSelected,
    deleteCategory,
    setOpenModal,
    setCategoryName,
    setCurrentEditCategory,
  } = categoryHook;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryIdForDelete, setSelectedCategoryIdForDelete] =
    useState(null);

  const handleDeleteCategory = () => {
    deleteCategory(selectedCategoryIdForDelete);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <MultipleSelectionActions categoryHook={categoryHook} />
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="icon table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={categories.length === selectedcategories.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  indeterminate={
                    selectedcategories.length > 0 &&
                    selectedcategories.length < categories.length
                  }
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Icons count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={index} hover>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selectedcategories.includes(category.id)}
                    onChange={(e) =>
                      handleSelectCategory(category.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.count}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setOpenModal({ open: true, mode: "edit" });
                      setCurrentEditCategory(category.id);
                      setCategoryName(category.name);
                    }}
                  >
                    <PencilSimple size={20} />
                  </IconButton>
                  <IconButton>
                    <Trash
                      size={20}
                      onClick={() => {
                        setSelectedCategoryIdForDelete(category.id);
                        setDeleteModalOpen(true);
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        itemCount={selectedcategories.length}
        itemName="category"
        itemPluralName="categories"
      />
    </>
  );
}

function Categories() {
  const categoryHook = useIconCategories();
  const {
    categories,
    setOpenModal,
    openModal,
    categoryName,
    setCategoryName,
    addCategory,
    editCategory,
  } = categoryHook;

  return (
    <Stack spacing="16px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          fontWeight={600}
          fontSize={"20px"}
          color="text.body"
        >
          {categories.length} Results
        </Typography>
        <CustomIconButton
          text="Add Category"
          Icon={Plus}
          startIcon
          onClick={() => {
            setCategoryName("");
            setOpenModal({
              open: true,
              mode: "add",
            });
          }}
        />
      </Stack>
      <CategoriesTable categoryHook={categoryHook} />

      <AddOrEditCategoryModal
        open={openModal.open}
        onClose={() => {
          setOpenModal((prev) => ({ ...prev, open: false }));
        }}
        value={categoryName}
        setValue={setCategoryName}
        onSubmit={openModal.mode === "add" ? addCategory : editCategory}
        type="category"
        mode={openModal.mode}
      />
    </Stack>
  );
}

export default Categories;
