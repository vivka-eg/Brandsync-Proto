import ApiHandler from ".";
import { withCache } from "@/utils/apiCache";

/**
 * Retrieves an individual foundation page from the foundations collection type.
 * @param {"Typography" | "Spacing" | "Layout"} page the page to retrieve
 */
export const getIndividualFoundationPage = async (page) => {
  return withCache(`foundation:${page}`, async () => {
    const api = await ApiHandler.init();
    const { data } = await api.find("foundations", {
      filters: {
        Article: {
          Title: {
            $eq: page,
          },
        },
      },
    });
    return data;
  });
};
