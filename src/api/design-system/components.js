import ApiHandler, { api } from ".";
import { withCache } from "@/utils/apiCache";

export const getComponent = async (id) => {
  return withCache(`component:${id}`, async () => {
    const api = await ApiHandler.init();
    return await api.findOne("components", id);
  });
};

export const getComponentByName = async (name) => {
  return withCache(`component:name:${name}`, async () => {
    const api = await ApiHandler.init();
    return await api.findOneBySpecificKeyMatch("components", "Title", name);
  });
};

export const getComponentList = async () => {
  return withCache("component:list", async () => {
    const api = await ApiHandler.init();
    const { data } = await api.find("components");
    return data;
  });
};

export const getSingleTypeComponent = async (componentName) => {
  return withCache(`component:single:${componentName}`, async () => {
    const componentNameToSingleTypeMap = {
      Chips: "chip",
      "Navigation Header": "navigation-header",
    };
    const api = await ApiHandler.init();
    return await api.getSingleType(componentNameToSingleTypeMap[componentName]);
  });
};
