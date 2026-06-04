import { NextResponse } from "next/server";

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

export async function POST(request) {
  try {
    const formData = await request.formData();

    // console.log("Processing upload request...");

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

    // Upload all files to Strapi in parallel
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
      uploadFileToStrapi(logoFile),
      uploadFileToStrapi(bundleFile),
      uploadFileToStrapi(lightHorizontalFile),
      uploadFileToStrapi(lightVerticalFile),
      uploadFileToStrapi(darkHorizontalFile),
      uploadFileToStrapi(darkVerticalFile),
      uploadFileToStrapi(negativeHorizontalFile),
      uploadFileToStrapi(negativeVerticalFile),
      uploadFileToStrapi(pptFile),
      uploadFileToStrapi(cviFile),
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

    // Create the document data structure
    const documentData = {
      data: {
        Name: formData.get("name") || "Untitled Logo Upload",
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

    // console.log("Creating document with data:", JSON.stringify(documentData));

    // Create document in Strapi using REST API
    const createResponse = await fetch(`${strapiUrl}/logos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify(documentData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      // console.error("Document creation failed:", error);
      throw new Error(`Failed to create document: ${error}`);
    }

    const result = await createResponse.json();

    // console.log("Document created successfully:", result);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    // console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload files and create document",
      },
      { status: 500 },
    );
  }
}
