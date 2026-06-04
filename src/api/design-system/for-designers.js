import ApiHandler from ".";

export const getForDesigners = async () => {
  const api = await ApiHandler.init();
  return await api.getSingleType("for-designer");
}