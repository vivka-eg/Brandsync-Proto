import ApiHandler from ".";

export const getOldLogoPlacement = async () => {
  const api = await ApiHandler.init();
  return await api.getSingleType("logo-placement-for-old-logo");
}