import Keycloak from "keycloak-js";

// Keycloak configuration (EG SSO — dev realm). Values come from
// NEXT_PUBLIC_KEYCLOAK_* in .env.local.
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

let keycloakInstance = null;
let initPromise = null;

/** Get or create the singleton Keycloak instance. */
export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  return keycloakInstance;
};

/**
 * Initialize Keycloak exactly once (check-sso: silently detect a session
 * without forcing a redirect). Idempotent — repeated calls return the same
 * in-flight/settled promise, so init() is never run twice (keycloak-js throws
 * if it is). Both useAuth and login() funnel through this.
 */
export const initKeycloak = () => {
  const keycloak = getKeycloakInstance();
  if (keycloak.didInitialize) return Promise.resolve(keycloak.authenticated);
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          typeof window !== "undefined"
            ? window.location.origin + "/silent-check-sso.html"
            : undefined,
      })
      .catch((err) => {
        initPromise = null; // allow a later retry
        throw err;
      });
  }
  return initPromise;
};

/**
 * Trigger the Keycloak login redirect, returning to the Make app on success.
 * Ensures the instance is initialized first — calling keycloak.login() before
 * init() leaves the adapter undefined and throws (the white-screen we hit).
 * If Keycloak is unreachable/misconfigured we log and bail instead of crashing.
 */
export const login = async (options = {}) => {
  const keycloak = getKeycloakInstance();
  if (!keycloak.didInitialize) {
    try {
      await initKeycloak();
    } catch (err) {
      console.error("Keycloak init failed; cannot start login:", err);
    }
  }
  if (!keycloak.didInitialize) {
    console.error(
      "Keycloak unavailable — check NEXT_PUBLIC_KEYCLOAK_* and that this origin is an allowed redirect URI / web origin on the 'brandsync-proto-dev' client. Login aborted."
    );
    return;
  }
  return keycloak.login({
    redirectUri:
      typeof window !== "undefined"
        ? window.location.origin + "/brandsync-make"
        : undefined,
    ...options,
  });
};

/** Log out, returning to the login page. */
export const logout = (options = {}) => {
  const keycloak = getKeycloakInstance();
  if (!keycloak.didInitialize) {
    console.error("Keycloak not initialized; logout skipped.");
    return;
  }
  return keycloak.logout({
    redirectUri:
      typeof window !== "undefined"
        ? window.location.origin + "/login"
        : undefined,
    ...options,
  });
};

/** Load the authenticated user's profile + role from the parsed token. */
export const getUserProfile = async () => {
  const keycloak = getKeycloakInstance();
  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }
  const profile = await keycloak.loadUserProfile();
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
    role: getUserRole(),
  };
};

/** Map Keycloak realm/client roles to the app's SUPERADMIN/ADMIN/USER. */
export const getUserRole = () => {
  const keycloak = getKeycloakInstance();
  const clientId = keycloakConfig.clientId;
  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }
  const roles = [
    ...(keycloak.tokenParsed?.realm_access?.roles || []),
    ...(keycloak.tokenParsed?.resource_access?.[clientId]?.roles || []),
  ];
  return roles.includes("superadmin")
    ? "SUPERADMIN"
    : roles.includes("admin")
    ? "ADMIN"
    : "USER";
};

export const isAuthenticated = () => {
  const keycloak = getKeycloakInstance();
  return keycloak.authenticated || false;
};

/** Current access token (sync, no refresh). */
export const getToken = () => getKeycloakInstance().token;

/** Fresh access token, refreshing if it expires within 30s. */
export const getTokenAsync = async () => {
  const keycloak = getKeycloakInstance();
  if (!keycloak.authenticated) throw new Error("User is not authenticated");
  await keycloak.updateToken(30);
  if (keycloak.token) localStorage.setItem("keycloak-token", keycloak.token);
  return keycloak.token;
};

export const resetKeycloak = () => {
  keycloakInstance = null;
  initPromise = null;
};

export default {
  getKeycloakInstance,
  login,
  logout,
  getUserProfile,
  getUserRole,
  isAuthenticated,
  getToken,
  getTokenAsync,
  resetKeycloak,
};
