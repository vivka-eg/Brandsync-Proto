"use client";
import { getKeycloakInstance, getUserProfile, initKeycloak, logout as kcLogout } from "@/lib/keycloak";
import { setUserEmail, clearUserEmail } from "@/lib/userEmail";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Keycloak SSO is DISABLED — the app runs on the fixed mock DB user below, with
// no Keycloak init/login/redirect (so no login loop). All the SSO wiring stays
// in place; flip BYPASS_AUTH back to false to re-enable real EG login once the
// IAM client redirect URIs and the deploy pipeline are fully sorted.
const BYPASS_AUTH = true;
const MOCK_USER = {
  id: "dev-user",
  email: "vivka@eg.dk",
  username: "vivka",
  fullName: "Vignesh V Kamath",
  role: "SUPERADMIN",
};

function useAuth() {
  const [user, setUser] = useState(BYPASS_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  // In bypass mode, publish the mock email during render (before any child
  // data-fetch effect runs) so getUserEmail() resolves the DB user.
  if (BYPASS_AUTH) setUserEmail(MOCK_USER.email);

  // Pull the Keycloak profile into app state AND publish the email so the
  // Make data calls (projects/patterns/usage/orgs/generate) resolve the DB
  // user by the signed-in identity instead of a hardcoded address.
  const handleUpdateAuth = async () => {
    const keycloak = getKeycloakInstance();
    try {
      localStorage.setItem("keycloak-token", keycloak.token);
    } catch {
      /* private mode */
    }
    const profile = await getUserProfile();
    if (profile) {
      setUserEmail(profile.email); // must precede setUser so gated views read it
      setUser(profile);
    }
  };

  const handleKeycloakLogin = async () => {
    try {
      const keycloak = getKeycloakInstance();

      // Already initialised (e.g. navigating back after a redirect): just sync.
      if (keycloak.authenticated !== undefined) {
        if (keycloak.authenticated) await handleUpdateAuth();
        setLoading(false);
        return;
      }

      // check-sso (via the shared idempotent init): silently detect an
      // existing SSO session without forcing a redirect. Public pages stay
      // open; AuthWrapper sends protected routes to /login when there's none.
      const authenticated = await initKeycloak();

      if (authenticated) await handleUpdateAuth();
      setLoading(false);
    } catch (error) {
      console.error("Keycloak initialization failed:", error);
      setAuthError("auth_init_failed");
      setLoading(false);
    }
  };

  const redirectToLogin = () => router.push("/login");

  const signOut = () => {
    if (BYPASS_AUTH) return; // no real session to end while SSO is disabled
    clearUserEmail();
    kcLogout();
  };

  useEffect(() => {
    if (BYPASS_AUTH) return;
    handleKeycloakLogin();
  }, []);

  return {
    user,
    setUser,
    loading,
    authError,
    role: user ? user.role : null,
    isAuthenticated: user ? true : false,
    isSuperAdmin: user ? user.role === "SUPERADMIN" : false,
    isAdmin: user ? user.role === "ADMIN" : false,
    isUser: user ? user.role === "USER" : false,
    redirectToLogin,
    signOut,
  };
}

export default useAuth;
