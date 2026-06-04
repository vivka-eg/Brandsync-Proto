import { api } from "../instance.js";

export const getComponentsForAdmin = () => api.get("/admin/components");

export const uploadComponent = ({
  componentName,
  title,
  description,
  prompt,
  categoryId,
  tags,
  screenshotDesktop,
  screenshotTablet,
  screenshotMobile,
}) => {
  const formData = new FormData();
  formData.append("componentName", componentName);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);
  if (prompt) formData.append("prompt", prompt);
  if (categoryId) formData.append("categoryId", categoryId);
  if (tags) formData.append("tags", tags);
  formData.append("screenshotDesktop", screenshotDesktop);
  if (screenshotTablet) formData.append("screenshotTablet", screenshotTablet);
  if (screenshotMobile) formData.append("screenshotMobile", screenshotMobile);

  return api.post("/admin/components", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateComponent = (
  id,
  { title, description, prompt, categoryId, tags, screenshotDesktop, screenshotTablet, screenshotMobile }
) => {
  const formData = new FormData();
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);
  if (prompt) formData.append("prompt", prompt);
  if (categoryId !== undefined) formData.append("categoryId", categoryId); // "" removes association
  if (tags) formData.append("tags", tags);
  if (screenshotDesktop) formData.append("screenshotDesktop", screenshotDesktop);
  if (screenshotTablet) formData.append("screenshotTablet", screenshotTablet);
  if (screenshotMobile) formData.append("screenshotMobile", screenshotMobile);

  return api.put(`/admin/components/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteComponent = (id) =>
  api.delete(`/admin/components/${id}`);


