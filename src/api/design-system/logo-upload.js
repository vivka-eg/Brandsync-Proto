import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export async function uploadLogoAndSizes(
  name,
  colorPalette,
  logo,
  sizes,
  variants,
  bundle,
  ppt,
  cvi
) {
  const formData = new FormData();

  // Add logo and bundle files :
  const logoFile = logo;
  const bundleFile = bundle?.file;

  formData.append("name", name);
  formData.append("colorPalette", colorPalette);

  if (logoFile) formData.append("assets.logo", logoFile);
  if (bundleFile) formData.append("assets.bundle", bundleFile);
  if (ppt?.file) formData.append("assets.powerpoint", ppt.file);
  if (cvi?.file) formData.append("assets.cvi", cvi.file);

  // Add logo variations files :
  formData.append("assets.light.horizontal", variants.light.horizontal.file);
  formData.append("assets.light.vertical", variants.light.vertical.file);
  formData.append("assets.dark.horizontal", variants.dark.horizontal.file);
  formData.append("assets.dark.vertical", variants.dark.vertical.file);
  formData.append(
    "assets.negative.horizontal",
    variants.negative.horizontal?.file
  );
  formData.append("assets.negative.vertical", variants.negative.vertical?.file);

  // Add sizes as JSON strings
  formData.append("sizes.headerSize", JSON.stringify(sizes.headerSize));
  formData.append("sizes.drawerSize", JSON.stringify(sizes.drawerSize));
  formData.append(
    "sizes.splashHorizontalSize",
    JSON.stringify(sizes.splashHorizontalSize)
  );
  formData.append(
    "sizes.splashVerticalSize",
    JSON.stringify(sizes.splashVerticalSize)
  );

  console.log(formData);

  const response = await axiosWithAuth.post("/api/logos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const result = response.data;
  return result;
}

export async function updateLogoAndSizes(
  logoId,
  name,
  colorPalette,
  logo,
  sizes,
  variants,
  bundle,
  existingAssets,
  ppt,
  cvi
) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("colorPalette", colorPalette);

  // Add new files if they exist, otherwise add existing IDs
  if (logo && logo.file) {
    formData.append("assets.logo", logo.file);
  } else if (existingAssets?.logo) {
    formData.append("existing.assets.logo", existingAssets.logo);
  }

  if (bundle && bundle.file) {
    formData.append("assets.bundle", bundle.file);
  } else if (existingAssets?.bundle) {
    formData.append("existing.assets.bundle", existingAssets.bundle);
  }

  if (ppt?.file) formData.append("assets.powerpoint", ppt.file);
  else if (existingAssets?.powerpoint) formData.append("existing.assets.powerpoint", existingAssets.powerpoint);

  if (cvi?.file) formData.append("assets.cvi", cvi.file);
  else if (existingAssets?.cvi) formData.append("existing.assets.cvi", existingAssets.cvi);

  // Handle light variants
  if (variants.light.horizontal?.file) {
    formData.append("assets.light.horizontal", variants.light.horizontal.file);
  } else if (existingAssets?.lightLogo?.horizontal) {
    formData.append("existing.assets.light.horizontal", existingAssets.lightLogo.horizontal);
  }

  if (variants.light.vertical?.file) {
    formData.append("assets.light.vertical", variants.light.vertical.file);
  } else if (existingAssets?.lightLogo?.vertical) {
    formData.append("existing.assets.light.vertical", existingAssets.lightLogo.vertical);
  }

  // Handle dark variants
  if (variants.dark.horizontal?.file) {
    formData.append("assets.dark.horizontal", variants.dark.horizontal.file);
  } else if (existingAssets?.darkLogo?.horizontal) {
    formData.append("existing.assets.dark.horizontal", existingAssets.darkLogo.horizontal);
  }

  if (variants.dark.vertical?.file) {
    formData.append("assets.dark.vertical", variants.dark.vertical.file);
  } else if (existingAssets?.darkLogo?.vertical) {
    formData.append("existing.assets.dark.vertical", existingAssets.darkLogo.vertical);
  }

  // Handle negative variants
  if (variants.negative.horizontal?.file) {
    formData.append("assets.negative.horizontal", variants.negative.horizontal.file);
  } else if (existingAssets?.negativeLogo?.horizontal) {
    formData.append("existing.assets.negative.horizontal", existingAssets.negativeLogo.horizontal);
  }

  if (variants.negative.vertical?.file) {
    formData.append("assets.negative.vertical", variants.negative.vertical.file);
  } else if (existingAssets?.negativeLogo?.vertical) {
    formData.append("existing.assets.negative.vertical", existingAssets.negativeLogo.vertical);
  }

  // Add sizes as JSON strings
  formData.append("sizes.headerSize", JSON.stringify(sizes.headerSize));
  formData.append("sizes.drawerSize", JSON.stringify(sizes.drawerSize));
  formData.append(
    "sizes.splashHorizontalSize",
    JSON.stringify(sizes.splashHorizontalSize)
  );
  formData.append(
    "sizes.splashVerticalSize",
    JSON.stringify(sizes.splashVerticalSize)
  );

  console.log("Updating logo with ID:", logoId);

  const response = await axiosWithAuth.put(`/api/logos/${logoId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const result = response.data;
  return result;
}
