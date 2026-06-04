"use client";
import {
  createIconType,
  deleteIconType,
  updateIconType,
} from "@/api/icons/icon-types";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { useToast } from "@/context/shared/ToastContext";
import { useState } from "react";

function useIconTypes() {
  const { iconTypes, setIconTypes } = useIconTypesAndCategoryContext();
  const [selectedIconTypes, setSelectedIconTypes] = useState([]);
  const [iconTypeName, setIconTypeName] = useState("");
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: "add",
  });
  const [currentEditIconType, setCurrentEditIconType] = useState(null);
  const { setToast } = useToast();

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIconTypes(iconTypes.map((iconType) => iconType.id));
    } else {
      setSelectedIconTypes([]);
    }
  };

  const addNewIconType = async () => {
    try {
      const response = await createIconType(iconTypeName);
      setOpenModal((prev) => ({ ...prev, open: false }));
      setIconTypeName("");
      setIconTypes((prev) => [
        ...prev,
        {
          id: response.data.documentId,
          name: iconTypeName,
          count: 0,
          label: iconTypeName,
        },
      ]);
      setToast({
        open: true,
        type: "success",
        message: "Icon type added successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to add icon type.",
        variant: "filled",
      });
    }
  };

  const removeIconType = async (id) => {
    try {
      await deleteIconType(id);
      setIconTypes((prev) => prev.filter((iconType) => iconType.id !== id));
      if (selectedIconTypes.includes(id)) {
        setSelectedIconTypes((prev) =>
          prev.filter((iconTypeId) => iconTypeId !== id)
        );
      }
      setToast({
        open: true,
        type: "success",
        message: "Icon type deleted successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to delete icon type.",
        variant: "filled",
      });
    }
  };

  const handleIconTypeSelection = (id, checked) => {
    if (checked) {
      setSelectedIconTypes((prev) => [...prev, id]);
    } else {
      setSelectedIconTypes((prev) =>
        prev.filter((iconTypeId) => iconTypeId !== id)
      );
    }
  };

  const handleDeleteSelectedIconTypes = async () => {
    try {
      await Promise.all(selectedIconTypes.map((id) => deleteIconType(id)));
      setIconTypes((prev) =>
        prev.filter((iconType) => !selectedIconTypes.includes(iconType.id))
      );
      const count = selectedIconTypes.length;
      setSelectedIconTypes([]);
      setToast({
        open: true,
        type: "success",
        message: `${count} icon ${count === 1 ? "type" : "types"} deleted successfully.`,
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to delete icon types.",
        variant: "filled",
      });
    }
  };

  const editIconType = async () => {
    try {
      await updateIconType(currentEditIconType, iconTypeName);
      setIconTypes((prev) =>
        prev.map((iconType) =>
          iconType.id === currentEditIconType
            ? { ...iconType, name: iconTypeName, label: iconTypeName }
            : iconType
        )
      );
      setOpenModal((prev) => ({ ...prev, open: false }));
      setCurrentEditIconType(null);
      setIconTypeName("");
      setToast({
        open: true,
        type: "success",
        message: "Icon type updated successfully.",
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to update icon type.",
        variant: "filled",
      });
    }
  };

  return {
    iconTypes,
    setIconTypes,
    selectedIconTypes,
    setSelectedIconTypes,
    iconTypeName,
    setIconTypeName,
    openModal,
    setOpenModal,
    handleSelectAll,
    removeIconType,
    handleIconTypeSelection,
    handleDeleteSelectedIconTypes,
    addNewIconType,
    editIconType,
    currentEditIconType,
    setCurrentEditIconType,
  };
}

export default useIconTypes;
