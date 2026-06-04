import { api } from "../instance.js";

export const login = (email, name) => api.post("/auth/token", { email, name });

export const getCurrentUser = () => api.get("/users/me");
