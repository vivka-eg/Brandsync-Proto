import Keycloak from "keycloak-js";

// Keycloak configuration
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

// Initialize Keycloak instance
let keycloakInstance = null;
let initPromise = null; // Track initialization promise

/**
 * Get or create Keycloak instance
 */
export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  return keycloakInstance;
};

/**
 * Initialize Keycloak - ensures single initialization
 */
export const initKeycloak = async (options = {}) => {
  // If already initializing, return the existing promise
  if (initPromise) {
    return initPromise;
  }

  const keycloak = getKeycloakInstance();

  // If already initialized, return current state
  if (keycloak.authenticated !== undefined) {
    return {
      authenticated: keycloak.authenticated,
      keycloak,
    };
  }

  const defaultOptions = {
    onLoad: "login-required",
    checkLoginIframe: false,
  };

  // Create and store the initialization promise
  initPromise = keycloak
    .init(defaultOptions)
    .then((authenticated) => {
      return { authenticated, keycloak };
    })
    .catch((error) => {
      console.error("Failed to initialize Keycloak:", error);
      // Reset promise on error so it can be retried
      initPromise = null;
      throw error;
    });

  return initPromise;
};

/**
 * Login user
 */
export const login = (options = {}) => {
  const keycloak = getKeycloakInstance();
  return keycloak.login({
    redirectUri:
      typeof window !== "undefined"
        ? window.location.origin + "/design-system"
        : undefined,
    ...options,
  });
};

/**
 * Logout user
 */
export const logout = (options = {}) => {
  const keycloak = getKeycloakInstance();
  return keycloak.logout({
    redirectUri:
      typeof window !== "undefined"
        ? window.location.origin + "/login"
        : undefined,
    ...options,
  });
};

/**
 * Get user profile information
 */
export const getUserProfile = async () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }

  try {
    const profile = await keycloak.loadUserProfile();
    const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      role: getUserRole(),
      isMcpBetaUser: realmRoles.includes("mcp-beta-user"),
    };
  } catch (error) {
    console.error("Failed to load user profile:", error);
    throw error;
  }
};

/**
 * Get the users role
 */

export const getUserRole = () => {
  const keycloak = getKeycloakInstance();
  const clientId = keycloakConfig.clientId;

  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  } else {
    const roles = [
      ...(keycloak.tokenParsed?.realm_access?.roles || []),
      ...(keycloak.tokenParsed?.resource_access?.[clientId]?.roles || []),
    ];
    return roles.includes("superadmin")
      ? "SUPERADMIN"
      : roles.includes("admin")
      ? "ADMIN"
      : "USER";
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.authenticated || false;
};

/**
 * Get access token (synchronous - returns current token without refresh)
 * For guaranteed fresh token, use getValidToken from tokenRefresh.js
 */
export const getToken = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.token;
};

/**
 * Get a fresh access token (async - refreshes if needed)
 * @returns {Promise<string>} A valid access token
 */
export const getTokenAsync = async () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }

  try {
    // Refresh token if it expires in less than 30 seconds
    await keycloak.updateToken(30);

    // Update localStorage with the current token
    if (keycloak.token) {
      localStorage.setItem("keycloak-token", keycloak.token);
    }

    return keycloak.token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

/**
 * Reset Keycloak instance (for testing or forced re-initialization)
 */
export const resetKeycloak = () => {
  keycloakInstance = null;
  initPromise = null;
};

export default {
  getKeycloakInstance,
  initKeycloak,
  login,
  logout,
  getUserProfile,
  isAuthenticated,
  getToken,
  getTokenAsync,
  resetKeycloak,
};
