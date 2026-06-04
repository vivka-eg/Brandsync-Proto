import { getKeycloakInstance } from "../keycloak";

// Store the refresh promise to prevent concurrent refresh requests
let refreshPromise = null;

/**
 * Refreshes the Keycloak token if it's about to expire
 * Ensures only one refresh happens at a time (prevents race conditions)
 * @param {number} minValidity - Minimum validity in seconds (default: 30)
 * @returns {Promise<string>} The current valid token
 */
export const refreshTokenIfNeeded = async (minValidity = 30) => {
  const keycloak = getKeycloakInstance();

  // Check if keycloak is initialized and authenticated
  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }

  // If a refresh is already in progress, wait for it to complete
  if (refreshPromise) {
    console.log("Token refresh already in progress, waiting...");
    await refreshPromise;
    return keycloak.token;
  }

  try {
    // Create a new refresh promise
    refreshPromise = keycloak.updateToken(minValidity).then((refreshed) => {
      if (refreshed) {
        // Token was refreshed, update localStorage
        localStorage.setItem("keycloak-token", keycloak.token);
        console.log("Token refreshed successfully");
      }
      return keycloak.token;
    });

    // Wait for the refresh to complete
    const token = await refreshPromise;

    // Return the current valid token
    return token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Token refresh failed, user needs to re-authenticate
    throw new Error("Token refresh failed");
  } finally {
    // Clear the refresh promise after completion (success or failure)
    refreshPromise = null;
  }
};

/**
 * Get the current token, refreshing if necessary
 * @returns {Promise<string|null>} The current valid token or null if not authenticated
 */
export const getValidToken = async () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak.authenticated) {
    return null;
  }

  try {
    await refreshTokenIfNeeded();
    return keycloak.token;
  } catch (error) {
    console.error("Failed to get valid token:", error);
    return null;
  }
};
