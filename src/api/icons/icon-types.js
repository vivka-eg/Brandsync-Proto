import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getIconTypes = async (params = {}) => {
  const { data } = await axiosWithAuth.get("/api/icons/types", { params });
  return data;
};

export const createIconType = async (typeName) => {
  const { data } = await axiosWithAuth.post("/api/icons/types", {
    data: { type_name: typeName },
  });
  return data;
};

export const updateIconType = async (documentId, typeName) => {
  const { data } = await axiosWithAuth.put(`/api/icons/types/${documentId}`, {
    data: { type_name: typeName },
  });
  return data;
};

export const deleteIconType = async (documentId) => {
  const { data } = await axiosWithAuth.delete(`/api/icons/types/${documentId}`);
  return data;
};
