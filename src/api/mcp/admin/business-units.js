import { api } from "../instance.js";

const BASE = "/categories";

export const getBusinessUnits = () => api.get(BASE);

export const getBusinessUnit = (idOrCode) => api.get(`${BASE}/${idOrCode}`);

export const createBusinessUnit = ({ code, name, description, active }) =>
  api.post(BASE, { code, name, description, active });

export const updateBusinessUnit = (id, { code, name, description, active }) =>
  api.put(`${BASE}/${id}`, { code, name, description, active });

export const deleteBusinessUnit = (id) => api.delete(`${BASE}/${id}`);

export const getComponentsByBusinessUnit = (idOrCode, { limit, offset } = {}) =>
  api.get(`${BASE}/${idOrCode}/components`, { params: { limit, offset } });
