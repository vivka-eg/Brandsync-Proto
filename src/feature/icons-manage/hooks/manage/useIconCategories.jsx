"use client";
import { useState } from "react";
import {
  createIconCategory,
  deleteIconCategory,
  updateIconCategory,
} from "@/api/icons/icon-categories";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { useToast } from "@/context/shared/ToastContext";

function useIconCategories() {
  const { categories, setCategories } = useIconTypesAndCategoryContext();
  const [selectedcategories, setSelectedCategories] = useState([]);
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: "add",
  });
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const { setToast } = useToast();

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id, checked) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      if (selectedcategories.includes(id)) {
        setSelectedCategories((prev) =>
          prev.filter((categoryId) => categoryId !== id)
        );
      }
    }
  };

  const addCategory = async () => {
    try {
      const response = await createIconCategory(categoryName);
      setOpenModal((prev) => ({ ...prev, open: false }));
      setCategoryName("");
      setCategories((prev) => [
        ...prev,
        {
          id: response.data.documentId,
          numericId: response.data.id,
          name: categoryName,
          count: 0,
          label: categoryName,
        },
      ]);
      setToast({
        open: true,
        type: "success",
        message: "Category added successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to add category.",
        variant: "filled",
      });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteIconCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setSelectedCategories((prev) =>
        prev.filter((categoryId) => categoryId !== id)
      );
      setToast({
        open: true,
        type: "success",
        message: "Category deleted successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to delete category.",
        variant: "filled",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedcategories.length === 0) return;

    try {
      await Promise.all(selectedcategories.map((id) => deleteIconCategory(id)));
      setCategories((prev) =>
        prev.filter((category) => !selectedcategories.includes(category.id))
      );
      const count = selectedcategories.length;
      setSelectedCategories([]);
      setToast({
        open: true,
        type: "success",
        message: `${count} ${count === 1 ? "category" : "categories"} deleted successfully.`,
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to delete categories.",
        variant: "filled",
      });
    }
  };

  const editCategory = async () => {
    try {
      await updateIconCategory(currentEditCategory, categoryName);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === currentEditCategory
            ? { ...category, name: categoryName, label: categoryName }
            : category
        )
      );
      setCurrentEditCategory(null);
      setCategoryName("");
      setOpenModal((prev) => ({ ...prev, open: false }));
      setToast({
        open: true,
        type: "success",
        message: "Category updated successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to update category.",
        variant: "filled",
      });
    }
  };

  return {
    categories,
    setCategories,
    selectedcategories,
    setSelectedCategories,
    openModal,
    setOpenModal,
    categoryName,
    setCategoryName,
    handleSelectAll,
    handleSelectCategory,
    deleteCategory,
    handleDeleteSelected,
    editCategory,
    addCategory,
    setCurrentEditCategory,
  };
}

export default useIconCategories;
