import ApiHandler, { api } from ".";

export const getComponents = async () => {
  try {
    const api = await ApiHandler.init();
    const result = await api.find("component-lists");
    const response = result?.data;

    if (!response || result.error) return { error: result.error ?? "No data returned" };

    const components = response.map(({ ComponentItem }) => ({
      title: ComponentItem.ComponentName,
      image: ComponentItem.ComponentImage || ComponentItem.ComponentRel?.Image,
      rel: ComponentItem.ComponentRel,
      category: ComponentItem.Category,
    }));

    const data = {};

    // Group components by category :
    components.forEach((component) => {
      let { category } = component;
      category = category || "Uncategorized";
      if (!data[category]) {
        data[category] = [];
      }
      data[category].push(component);
    });

    // Sort components alphabetically within each category
    Object.keys(data).forEach((category) => {
      data[category].sort((a, b) => a.title.localeCompare(b.title));
    });

    return data;
  } catch (error) {
    console.error("Error fetching components:", error);
    return { error: "Failed to fetch components" };
  }
};

export const getComponentsForSidebar = async () => {
  try {
    const api = await ApiHandler.init();
    const result = await api.find("component-lists");
    const response = result?.data;

    if (!response || result.error) return { error: result.error ?? "No data returned" };

    return response
      .filter(({ ComponentItem }) => ComponentItem.ComponentRel?.documentId)
      .map(({ ComponentItem }) => ({
        title: ComponentItem.ComponentName,
        id: ComponentItem.ComponentRel.documentId,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error fetching components for sidebar:", error);
    return { error: "Failed to fetch components" };
  }
};
