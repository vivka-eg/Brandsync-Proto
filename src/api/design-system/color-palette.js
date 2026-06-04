import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const fetchColorPalette = async (colorName) => {
  const response = await axiosWithAuth.get(`/api/palettes/${colorName}`);
  return response.data;
};

export const fetchSemanticPalettes = async () => {
  const response = await axiosWithAuth.get(`/api/palettes/semantics`);
  return response.data;
};
