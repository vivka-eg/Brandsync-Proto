import ApiHandler, { api } from ".";

export const getIntroduction = async () => {
  const api = await ApiHandler.init();
  const { data } = await api.find("introductions");
  return data;
};
