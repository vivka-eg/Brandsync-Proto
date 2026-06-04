import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getIcons = async (params = {}) => {
  const { data } = await axiosWithAuth.get("/api/icons", { params });
  return data;
};

export const getIconById = async (documentId, params = {}) => {
  const { data } = await axiosWithAuth.get(`/api/icons/${documentId}`, { params });
  return data;
};

export const createIcon = async (iconData) => {
  const { data } = await axiosWithAuth.post("/api/icons", iconData);
  return data;
};

export const updateIcon = async (documentId, iconData) => {
  const { data } = await axiosWithAuth.put(`/api/icons/${documentId}`, iconData);
  return data;
};

export const deleteIcon = async (documentId) => {
  const { data } = await axiosWithAuth.delete(`/api/icons/${documentId}`);
  return data;
};

export const uploadIcons = async ({ files, tags, categories, types }, multiple = false) => {
  const { data } = await axiosWithAuth.post(
    `/api/icons/upload${multiple ? "?multiple_icons=true" : ""}`,
    { files, tags, categories, types }
  );
  return data;
};

export const downloadIcon = async (documentId, filetype = "svg") => {
  if (filetype === "svg") {
    const { data } = await axiosWithAuth.get(`/api/icons/${documentId}/download`, {
      params: { filetype },
    });
    const svgString = atob(data.content);
    return new Blob([svgString], { type: "image/svg+xml" });
  }
  const { data } = await axiosWithAuth.get(`/api/icons/${documentId}/download`, {
    params: { filetype },
    responseType: "blob",
  });
  return data;
};

export const bulkPublishIcons = async (documentIds, status) => {
  const { data } = await axiosWithAuth.put("/api/icons/publish", {
    documentIds,
    status,
  });
  return data;
};

export const schedulePublishIcons = async (documentIds, scheduleTime, status = "PUBLISHED") => {
  const { data } = await axiosWithAuth.post("/api/icons/schedule-publish", {
    documentIds,
    schedule_time: scheduleTime,
    status,
  });
  return data;
};
