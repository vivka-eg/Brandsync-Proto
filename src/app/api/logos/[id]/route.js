import { NextResponse } from "next/server";
import ApiError from "@/utils/apiError";
import axios from "axios";

const strapiUrl = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const strapiToken = process.env.STRAPI_API_ADMIN_TOKEN;

// Upload a single file to Strapi using REST API
async function uploadFileToStrapi(file) {
  if (!file || file.size === 0) return null;

  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${strapiUrl}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = errorText;
      try {
        const parsed = JSON.parse(errorText);
        errorMsg = parsed?.error?.message || errorText;
      } catch (e) {}
      throw new Error(`Upload failed for ${file.name}: ${errorMsg}`);
    }

    const data = await response.json();
    return data[0]?.id || null;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE handler for deleting a logo document from Strapi
 * @param {Request} request - The incoming request
 * @param {Object} context - Route context containing params
 * @param {string} context.params.id - The logo document ID
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      throw new ApiError("Logo ID is required", 400);
    }

    // console.log(`Deleting logo with ID: ${id}`);

    const response = await axios.delete(`${strapiUrl}/logos/${id}`, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
    });

    // console.log(`Logo ${id} deleted successfully`);

    return NextResponse.json(
      {
        success: true,
        message: "Logo deleted successfully",
        data: response.data,
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Delete error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.status },
      );
    }

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to delete logo";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode },
    );
  }
}

/**
 * PUT handler for updating a logo document in Strapi
 * @param {Request} request - The incoming request with form data
 * @param {Object} context - Route context containing params
 * @param {string} context.params.id - The logo document ID
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      throw new ApiError("Logo ID is required", 400);
    }

    const formData = await request.formData();

    // console.log(`Updating logo with ID: ${id}`);

    // Extract files from FormData
    const logoFile = formData.get("assets.logo");
    const bundleFile = formData.get("assets.bundle");
    const lightHorizontalFile = formData.get("assets.light.horizontal");
    const lightVerticalFile = formData.get("assets.light.vertical");
    const darkHorizontalFile = formData.get("assets.dark.horizontal");
    const darkVerticalFile = formData.get("assets.dark.vertical");
    const negativeHorizontalFile = formData.get("assets.negative.horizontal");
    const negativeVerticalFile = formData.get("assets.negative.vertical");
    const pptFile = formData.get("assets.powerpoint");
    const cviFile = formData.get("assets.cvi");

    // Get existing IDs (these will be strings if not updated, or file if updated)
    const existingLogoId = formData.get("existing.assets.logo");
    const existingBundleId = formData.get("existing.assets.bundle");
    const existingLightHorizontalId = formData.get(
      "existing.assets.light.horizontal",
    );
    const existingLightVerticalId = formData.get(
      "existing.assets.light.vertical",
    );
    const existingDarkHorizontalId = formData.get(
      "existing.assets.dark.horizontal",
    );
    const existingDarkVerticalId = formData.get(
      "existing.assets.dark.vertical",
    );
    const existingNegativeHorizontalId = formData.get(
      "existing.assets.negative.horizontal",
    );
    const existingNegativeVerticalId = formData.get(
      "existing.assets.negative.vertical",
    );
    const existingPowerpointId = formData.get("existing.assets.powerpoint");
    const existingCviId = formData.get("existing.assets.cvi");

    // Upload new files only if they exist, otherwise use existing IDs
    const [
      logoId,
      bundleId,
      lightHorizontalId,
      lightVerticalId,
      darkHorizontalId,
      darkVerticalId,
      negativeHorizontalId,
      negativeVerticalId,
      pptId,
      cviId,
    ] = await Promise.all([
      logoFile ? uploadFileToStrapi(logoFile) : Promise.resolve(existingLogoId),
      bundleFile
        ? uploadFileToStrapi(bundleFile)
        : Promise.resolve(existingBundleId),
      lightHorizontalFile
        ? uploadFileToStrapi(lightHorizontalFile)
        : Promise.resolve(existingLightHorizontalId),
      lightVerticalFile
        ? uploadFileToStrapi(lightVerticalFile)
        : Promise.resolve(existingLightVerticalId),
      darkHorizontalFile
        ? uploadFileToStrapi(darkHorizontalFile)
        : Promise.resolve(existingDarkHorizontalId),
      darkVerticalFile
        ? uploadFileToStrapi(darkVerticalFile)
        : Promise.resolve(existingDarkVerticalId),
      negativeHorizontalFile
        ? uploadFileToStrapi(negativeHorizontalFile)
        : Promise.resolve(existingNegativeHorizontalId),
      negativeVerticalFile
        ? uploadFileToStrapi(negativeVerticalFile)
        : Promise.resolve(existingNegativeVerticalId),
      pptFile ? uploadFileToStrapi(pptFile) : Promise.resolve(existingPowerpointId || null),
      cviFile ? uploadFileToStrapi(cviFile) : Promise.resolve(existingCviId || null),
    ]);

    if (!logoId) throw new Error("Logo file upload failed");
    if (!bundleId) throw new Error("Bundle file upload failed");
    if (!lightHorizontalId)
      throw new Error("Light horizontal file upload failed");
    if (!lightVerticalId) throw new Error("Light vertical file upload failed");
    if (!darkHorizontalId)
      throw new Error("Dark horizontal file upload failed");
    if (!darkVerticalId) throw new Error("Dark vertical file upload failed");
    if (!negativeHorizontalId)
      throw new Error("Negative horizontal file upload failed");
    if (!negativeVerticalId)
      throw new Error("Negative vertical file upload failed");

    // Parse sizes from form data
    const sizes = {
      headerSize: JSON.parse(
        formData.get("sizes.headerSize") ||
          '{"width":"auto","height":32,"marginLeft":0}',
      ),
      drawerSize: JSON.parse(
        formData.get("sizes.drawerSize") ||
          '{"width":"auto","height":36,"marginLeft":0}',
      ),
      splashHorizontalSize: JSON.parse(
        formData.get("sizes.splashHorizontalSize") ||
          '{"width":"auto","height":90,"marginLeft":0}',
      ),
      splashVerticalSize: JSON.parse(
        formData.get("sizes.splashVerticalSize") ||
          '{"width":"auto","height":180,"marginLeft":0}',
      ),
    };

    // Create the document data structure for update
    const documentData = {
      data: {
        Name: formData.get("name") || "Untitled Logo",
        ColorPalette: formData.get("colorPalette") || null,

        ...(pptId && { Powerpoint: [pptId] }),
        ...(cviId && { CVI: [cviId] }),

        Assets: {
          Logo: logoId,
          Bundle: bundleId,

          LightLogo: {
            Horizontal: lightHorizontalId,
            Vertical: lightVerticalId,
          },
          DarkLogo: {
            Horizontal: darkHorizontalId,
            Vertical: darkVerticalId,
          },
          NegativeLogo: {
            Horizontal: negativeHorizontalId,
            Vertical: negativeVerticalId,
          },
        },

        Sizes: {
          HeaderSize: {
            Width: sizes.headerSize.width.toString(),
            Height: sizes.headerSize.height.toString(),
            "Margin Left": sizes.headerSize.marginLeft?.toString(),
          },
          DrawerSize: {
            Width: sizes.drawerSize.width.toString(),
            Height: sizes.drawerSize.height.toString(),
            "Margin Left": sizes.drawerSize.marginLeft?.toString(),
          },
          SplashHorizontalSize: {
            Width: sizes.splashHorizontalSize.width.toString(),
            Height: sizes.splashHorizontalSize.height.toString(),
            "Margin Left": sizes.splashHorizontalSize.marginLeft?.toString(),
          },
          SplashSquareSize: {
            Width: sizes.splashVerticalSize.width.toString(),
            Height: sizes.splashVerticalSize.height.toString(),
            "Margin Left": sizes.splashVerticalSize.marginLeft?.toString(),
          },
        },
      },
    };

    // console.log("Updating document with data:", JSON.stringify(documentData));

    // Update document in Strapi using REST API
    const updateResponse = await axios.put(
      `${strapiUrl}/logos/${id}`,
      documentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${strapiToken}`,
        },
      },
    );

    // console.log("Document updated successfully:", updateResponse.data);

    return NextResponse.json(
      {
        success: true,
        message: "Logo updated successfully",
        data: updateResponse.data,
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Update error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.status },
      );
    }

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to update logo";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode },
    );
  }
}
