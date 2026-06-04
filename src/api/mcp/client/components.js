import { api } from "../instance.js";

export const getComponents = () => api.get("/components");

export const getComponent = (idOrName) => api.get(`/components/${idOrName}`);
