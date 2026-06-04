"use client";
import { getIconCategories } from "@/api/icons/icon-categories";
import { getIconTypes } from "@/api/icons/icon-types";
import { useEffect, useState } from "react";

function useIconTypesAndCategory() {
  const [categories, setCategories] = useState([]);
  const [iconTypes, setIconTypes] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getIconCategories({
        "populate[icons][fields][0]": "id",
        "pagination[pageSize]": 100,
      });
      setCategories(
        (response.data ?? []).map((category) => ({
          id: category.documentId,
          numericId: category.id,
          label: category.category_name,
          name: category.category_name,
          count: category.icons?.length ?? 0,
        }))
      );
    } catch {
      setCategories([]);
    }
  };

  const fetchIconTypes = async () => {
    try {
      const response = await getIconTypes({
        "populate[icons][fields][0]": "id",
        "pagination[pageSize]": 100,
      });
      setIconTypes(
        (response.data ?? []).map((type) => ({
          id: type.documentId,
          numericId: type.id,
          label: type.type_name[0].toUpperCase() + type.type_name.slice(1),
          name: type.type_name,
          count: type.icons?.length ?? 0,
        }))
      );
    } catch {
      setIconTypes([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchIconTypes();
  }, []);

  return { categories, iconTypes, setCategories, setIconTypes };
}

export default useIconTypesAndCategory;
