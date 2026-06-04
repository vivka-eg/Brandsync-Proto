import ApiHandler from ".";

export const getDesignPhilosophy = async () => {
  const api = await ApiHandler.init();
  return await api.getSingleType("design-philosophy");
};
