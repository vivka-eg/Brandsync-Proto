import axios from "axios";
import qs from "qs";
import { refreshTokenIfNeeded } from "../auth/tokenRefresh";

/**
 * Create axios instance with token refresh interceptors
 */
const createAxiosInstance = () => {
  const instance = axios.create({
    paramsSerializer: (params) => qs.stringify(params, { encodeValuesOnly: true }),
  });

  // Request interceptor - refresh token before each request
  instance.interceptors.request.use(
    async (config) => {
      try {
        // Attempt to refresh token if needed (within 30 seconds of expiry)
        const token = await refreshTokenIfNeeded(30);

        // If we have a token, add it to the request headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Token refresh failed in request interceptor:", error);
        // If refresh fails, try to get token from localStorage as fallback
        const storedToken = localStorage.getItem("keycloak-token");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401 errors
  instance.interceptors.response.use(
    (response) => {
      // If response is successful, just return it
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const token = await refreshTokenIfNeeded(30);

          if (token) {
            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // Retry the original request
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed after 401:", refreshError);

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export a singleton instance
export const axiosWithAuth = createAxiosInstance();
