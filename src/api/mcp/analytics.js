import { api } from "./instance";

export const getToolsSummary = (days) =>
  api.get("/analytics/tools", { params: days ? { days } : undefined });

export const getUsersSummary = () => api.get("/analytics/users/summary");

export const getUsersList = (days) =>
  api.get("/analytics/users", { params: days ? { days } : undefined });

export const getTimeline = (days = 30) =>
  api.get("/analytics/timeline", { params: { days } });
