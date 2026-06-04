import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getTopIcons = async () => {
  const { data } = await axiosWithAuth.get("/api/icons/dashboard/top-icons");
  return data;
};

export const getCategoryStats = async () => {
  const { data } = await axiosWithAuth.get("/api/icons/dashboard/category-stats");
  return data;
};

export const getDateTrends = async () => {
  const { data } = await axiosWithAuth.get("/api/icons/dashboard/date-trends");
  return data;
};

export const getPlatformTotals = async () => {
  const { data } = await axiosWithAuth.get("/api/icons/dashboard/totals");
  return data;
};
