import { axiosWithAuth } from "@/lib/axios/axiosInstance";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://api.brand.dev.egsync.com/api";

/**
 * Uploads a digital asset (photo) to Strapi
 * @param {Object} data - The photo data
 * @param {File} data.file - The image file
 * @param {string} data.title - Photo title
 * @param {string} data.description - Photo description
 * @param {string} data.businessUnit - Business unit ID
 * @param {string[]} data.category - Array of category IDs
 * @param {string[]} data.tags - Array of tags
 * @param {boolean} data.containsPeople - Whether photo contains people
 * @param {string} data.orientation - Image orientation ("Portrait" or "Landscape")
 * @param {Object} data.dimensions - { width: number, height: number }
 * @returns {Promise<Object>} The response from Strapi API
 */
export const uploadDigitalAsset = async (data) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Append the file
    formData.append("file", data.file);

    // Append metadata as JSON string
    const metadata = {
      title: data.title,
      description: data.description,
      businessUnitId: data.businessUnitId,
      category: data.category,
      tags: data.tags || [],
      containsPeople: data.containsPeople,
      orientation: data.orientation,
      dimensions: data.dimensions
        ? {
            width: data.dimensions.width,
            height: data.dimensions.height,
          }
        : null,
      gender: data.gender,
      ethnicity: data.ethnicity,
    };

    formData.append("data", JSON.stringify(metadata));

    // Use server-side API route to handle upload (keeps token secure)
    const response = await axiosWithAuth.post("/api/digital-assets/upload", formData, {
      headers: {
        // Don't set Content-Type - let browser set it with boundary
      },
    });

    // console.log("Upload response:", response.data);

    // Check if response indicates success
    if (response.data && response.data.success !== false) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } else {
      return {
        success: false,
        error: response.data?.error || "Upload failed",
        details: response.data?.details,
        status: response.status,
      };
    }
  } catch (error) {
    // console.error("Error uploading digital asset:", error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to upload asset";

    return {
      success: false,
      error: errorMessage,
      details: error.response?.data,
      status: error.response?.status,
    };
  }
};

/**
 * Gets digital assets from Strapi via server-side API route
 * @param {Object} params - Query parameters
 * @param {string} params.businessUnit - Filter by business unit
 * @param {string} params.search - Search term
 * @param {string} params.containsPeople - Filter by contains people ("yes" | "no")
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Page size
 * @returns {Promise<Object>} The response from API
 */
export const getDigitalAssets = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.businessUnit)
      queryParams.append("businessUnit", params.businessUnit);
    if (params.search) queryParams.append("search", params.search);
    if (params.containsPeople)
      queryParams.append("containsPeople", params.containsPeople);
    if (params.page) queryParams.append("page", params.page);
    if (params.pageSize) queryParams.append("pageSize", params.pageSize);

    const response = await axiosWithAuth.get(
      `/api/digital-assets?${queryParams.toString()}`,
    );

    return response.data;
  } catch (error) {
    // console.error("Error fetching digital assets:", error);
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch assets",
    };
  }
};

/**
 * Get all stock image categories
 * @returns {Promise<Object>} Categories data
 */
export async function getStockImageCategories() {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    return { data: [] };
  }
}

/**
 * Get a single digital asset by ID
 * @param {string} id - Asset ID
 * @returns {Promise<Object>} Asset data
 */
export async function getDigitalAssetById(id) {
  try {
    const response = await fetch(`/api/digital-assets/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch asset");
    }

    return result.data;
  } catch (error) {
    // console.error("Error fetching digital asset by ID:", error);
    throw error;
  }
}
