import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getIconCategories = async (params = {}) => {
  const { data } = await axiosWithAuth.get("/api/icons/categories", { params });
  return data;
};

export const createIconCategory = async (categoryName) => {
  const { data } = await axiosWithAuth.post("/api/icons/categories", {
    data: { category_name: categoryName },
  });
  return data;
};

export const updateIconCategory = async (documentId, categoryName) => {
  const { data } = await axiosWithAuth.put(`/api/icons/categories/${documentId}`, {
    data: { category_name: categoryName },
  });
  return data;
};

export const deleteIconCategory = async (documentId) => {
  const { data } = await axiosWithAuth.delete(`/api/icons/categories/${documentId}`);
  return data;
};
