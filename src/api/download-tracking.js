import axios from "axios";

let downloadTrackingToken = null;

export const setDownloadTrackingToken = (token) => {
  downloadTrackingToken = token;
};

export const clearDownloadTrackingToken = () => {
  downloadTrackingToken = null;
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "",
});

instance.interceptors.request.use((config) => {
  if (downloadTrackingToken) {
    config.headers.Authorization = `Bearer ${downloadTrackingToken}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Exchange user identity for a signed JWT.
 *
 * @param {{ email: string, sub?: string, username?: string, name?: string }} user
 * @returns {Promise<{ token: string, user: object }>}
 */
export const getAuthToken = (user) =>
  instance.post("/auth/token", user).then((res) => res.data);

// ─── Downloads ────────────────────────────────────────────────────────────────

/**
 * Record a download event for the authenticated user.
 *
 * @param {{ assetId: string, assetName: string, assetType: 'logo'|'icon'|'digital_asset', format: string }} payload
 * @returns {Promise<{ success: boolean, id: string, downloadedAt: string }>}
 */
export const recordDownload = (payload) =>
  instance.post("/downloads", payload).then((res) => res.data);

/**
 * Return the total download count and a per-type breakdown for the authenticated user.
 *
 * @param {{ from?: string, to?: string }} [params]
 * @returns {Promise<{ total: number, breakdown: { logo: number, icon: number, digital_asset: number } }>}
 */
export const getDownloadActivity = (params = {}) =>
  instance.get("/downloads/activity", { params }).then((res) => res.data);

/**
 * Return a paginated list of the authenticated user's recent downloads, newest first.
 *
 * @param {{ limit?: number, offset?: number, assetType?: 'logo'|'icon'|'digital_asset' }} [params]
 * @returns {Promise<{ data: object[], total: number, hasMore: boolean }>}
 */
export const getRecentDownloads = (params = {}) =>
  instance.get("/downloads/recent", { params }).then((res) => res.data);
