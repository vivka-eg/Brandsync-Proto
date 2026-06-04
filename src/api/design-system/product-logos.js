import { getStrapiURL } from "@/strapi/utils";
import ApiHandler from ".";
import { axiosWithAuth } from "@/lib/axios/axiosInstance";

const transformSizeValues = (size) => ({
  width: size.Width,
  height: size.Height,
  marginLeft: size["Margin Left"] || 0,
});

const transformLogo = (logo) => {
  const horizontalSizes = transformSizeValues(logo.Sizes.SplashHorizontalSize);
  const verticalSizes = transformSizeValues(logo.Sizes.SplashSquareSize);

  return {
    id: logo.documentId,
    name: logo.Name,
    image: "",
    colorPalette: logo.ColorPalette,
    assets: {
      bundleURL: getStrapiURL(logo.Assets.Bundle),
      powerpointURL: getStrapiURL(logo.Powerpoint?.[0]),
      cviURL: getStrapiURL(logo.CVI?.[0]),
      logo: getStrapiURL(logo.Assets.Logo),
      light: {
        vertical: getStrapiURL(logo.Assets.LightLogo.Vertical),
        horizontal: getStrapiURL(logo.Assets.LightLogo.Horizontal),
      },
      dark: {
        vertical: getStrapiURL(logo.Assets.DarkLogo.Vertical),
        horizontal: getStrapiURL(logo.Assets.DarkLogo.Horizontal),
      },
      negative: {
        vertical: getStrapiURL(logo.Assets.NegativeLogo.Vertical),
        horizontal: getStrapiURL(logo.Assets.NegativeLogo.Horizontal),
      },
    },
    sizes: {
      horizontalSizes,
      verticalSizes,
      headerSizes: transformSizeValues(logo.Sizes.HeaderSize),
      drawerSizes: transformSizeValues(logo.Sizes.DrawerSize),
    },
  };
};

export const getProductLogos = async ({ page = 1, pageSize = 12, search = "" } = {}) => {
  const api = await ApiHandler.init();

  // Build filters for search
  const filters = {};
  if (search) {
    filters.Name = {
      $containsi: search, // Case-insensitive search
    };
  }

  const result = await api.find("logos", {
    page,
    pageSize,
    filters,
    customPopulate: ["Assets", "Assets.Logo"],
  });
  if (result?.error) throw new Error(result.error);
  const { data: response, meta } = result;
  return {
    data: (response ?? []).map((logo) => ({
      id: logo.documentId,
      name: logo.Name,
      /** Brand palette key (e.g. teal), same as Logos page / logo detail. */
      colorPalette: logo.ColorPalette ?? null,
      assets: { logo: getStrapiURL(logo.Assets.Logo) },
    })),
    totalCount: meta?.pagination?.total ?? 0,
  };
};

export const getProductLogoById = async (id) => {
  const api = await ApiHandler.init();
  const logo = await api.findOne("logos", id);
  return transformLogo(logo);
};

export const getProductLogosForTable = async ({
  page = 1,
  pageSize = 10,
  search = "",
  sort = "createdAt:desc",
} = {}) => {
  const api = await ApiHandler.init();

  // Build filters for search
  const filters = {};
  if (search) {
    filters.Name = {
      $containsi: search, // Case-insensitive search
    };
  }

  const { data: response, meta } = await api.find("logos", {
    page,
    pageSize,
    filters,
    sort,
    customPopulate: [
      "Assets",
      "Assets.Logo",
      "Assets.DarkLogo",
      "Assets.DarkLogo.Vertical",
      "Assets.DarkLogo.Horizontal",
      "Powerpoint",
      "CVI",
    ],
  });
  return {
    data: (response ?? []).map((logo) => ({
      id: logo.documentId,
      name: logo.Name,
      colorPalette: logo.ColorPalette,
      logo: getStrapiURL(logo.Assets?.Logo),
      verticalLogo: getStrapiURL(logo.Assets?.DarkLogo?.Vertical),
      horizontalLogo: getStrapiURL(logo.Assets?.DarkLogo?.Horizontal),
      hasPowerpoint: !!logo.Powerpoint?.length,
      hasCvi: !!logo.CVI?.length,
    })),
    totalCount: meta?.pagination?.total ?? 0,
  };
};

export const deleteProductLogo = async (logoId) => {
  try {
    const response = await axiosWithAuth.delete(`/api/logos/${logoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete logo");
  }
};

export const getProductLogoByIdRaw = async (id) => {
  const response = await axiosWithAuth.get(`/api/logos/${id}/raw`);
  console.log("[raw response]", JSON.stringify(response.data).slice(0, 500));
  const logo = response.data.data;
  // Return both transformed and raw asset IDs
  return {
    ...transformLogo(logo),
    rawAssetIds: {
      logo: logo.Assets?.Logo?.id || null,
      bundle: logo.Assets?.Bundle?.id || null,
      powerpoint: logo.Powerpoint?.[0]?.id || null,
      cvi: logo.CVI?.[0]?.id || null,
      lightLogo: {
        horizontal: logo.Assets?.LightLogo?.Horizontal?.id || null,
        vertical: logo.Assets?.LightLogo?.Vertical?.id || null,
      },
      darkLogo: {
        horizontal: logo.Assets?.DarkLogo?.Horizontal?.id || null,
        vertical: logo.Assets?.DarkLogo?.Vertical?.id || null,
      },
      negativeLogo: {
        horizontal: logo.Assets?.NegativeLogo?.Horizontal?.id || null,
        vertical: logo.Assets?.NegativeLogo?.Vertical?.id || null,
      },
    },
  };
};

export const getProductLogosByMatchingColorPalette = async (colorPalette) => {
  const api = await ApiHandler.init();
  const { data } = await api.find("logos", {
    filters: {
      ColorPalette: colorPalette,
    },
    customPopulate: [
      "Assets",
      "Assets.Logo",

      "Assets.LightLogo",
      "Assets.LightLogo.Horizontal",

      "Assets.DarkLogo",
      "Assets.DarkLogo.Horizontal",
    ],
  });
  return data;
};
