import { api } from "../instance.js";

const BASE = "/categories";

export const getCategories = () => api.get(BASE);

export const getCategory = (idOrCode) => api.get(`${BASE}/${idOrCode}`);

const buildPayload = ({ code, name, description, parentId, active, thumbnail }) => {
  if (thumbnail) {
    const form = new FormData();
    if (code !== undefined) form.append("code", code);
    if (name !== undefined) form.append("name", name);
    if (description !== undefined) form.append("description", description);
    if (parentId !== undefined && parentId !== null) form.append("parentId", String(parentId));
    if (active !== undefined) form.append("active", String(active));
    form.append("thumbnail", thumbnail);
    return form;
  }
  return { code, name, description, parentId: parentId ?? undefined, active };
};

export const createCategory = ({ code, name, description, parentId, active, thumbnail }) =>
  api.post(BASE, buildPayload({ code, name, description, parentId, active, thumbnail }));

export const updateCategory = (id, { code, name, description, parentId, active, thumbnail }) =>
  api.put(`${BASE}/${id}`, buildPayload({ code, name, description, parentId, active, thumbnail }));

export const deleteCategory = (id) => api.delete(`${BASE}/${id}`);

export const getComponentsByCategory = (idOrCode, { limit, offset, search } = {}) =>
  api.get(`${BASE}/${idOrCode}/components`, { params: { limit, offset, search: search || undefined } });


