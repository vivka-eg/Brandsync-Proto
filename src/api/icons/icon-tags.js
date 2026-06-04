import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getIconTags = async (params = {}) => {
  const { data } = await axiosWithAuth.get("/api/icons/tags", { params });
  return data;
};

export const createIconTag = async (tagName) => {
  const { data } = await axiosWithAuth.post("/api/icons/tags", {
    data: { tag_name: tagName },
  });
  return data;
};

export const updateIconTag = async (documentId, tagName) => {
  const { data } = await axiosWithAuth.put(`/api/icons/tags/${documentId}`, {
    data: { tag_name: tagName },
  });
  return data;
};

export const deleteIconTag = async (documentId) => {
  const { data } = await axiosWithAuth.delete(`/api/icons/tags/${documentId}`);
  return data;
};

export const generateIconTags = async (iconNameList) => {
  const { data } = await axiosWithAuth.post("/api/icons/tags/generate", {
    icon_name_list: iconNameList,
  });
  return data;
};
