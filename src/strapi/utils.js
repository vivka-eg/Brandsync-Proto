import { axiosWithAuth } from "@/lib/axios/axiosInstance";

export const getStrapiURL = (Image) => {
  return Image?.url;
};

export const getSignedUrl = async (url) => {
  if (!url) {
    throw new Error("URL is required");
  }

  try {
    let uniqueName;

    // Check if URL is absolute (starts with http/https) or relative
    if (url.startsWith("http://") || url.startsWith("https://")) {
      // Parse absolute URL
      const parsedUrl = new URL(url);
      // Get the full path without leading slash (e.g., "accessible-palettes/purple.svg")
      uniqueName = parsedUrl.pathname.split("/").filter(segment => segment.length > 0).join("/");
    } else {
      // Handle relative URL (e.g., /uploads/image.jpg or /accessible-palettes/purple.svg)
      const pathSegments = url.split("/").filter(segment => segment.length > 0);
      // Join all segments to preserve the full path (e.g., "accessible-palettes/purple.svg")
      uniqueName = pathSegments.join("/");
    }

    if (!uniqueName) {
      throw new Error("Invalid URL format");
    }

    const response = await axiosWithAuth.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/signed-media?key=${uniqueName}`,
      {
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data && response.data.signedUrl) {
      return response.data.signedUrl;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    // Return the original URL as fallback
    return url;
  }
};
