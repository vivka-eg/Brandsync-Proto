import ApiHandler from ".";

export const getAccessibility = async () => {
  const api = await ApiHandler.init();
  return await api.getSingleType("accessibility");
};
