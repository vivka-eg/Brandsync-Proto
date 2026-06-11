"use client";
import { getKeycloakInstance, getUserProfile, logout as kcLogout } from "@/lib/keycloak";
import { setUserEmail, clearUserEmail } from "@/lib/userEmail";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Set to true to run on a fixed mock SUPERADMIN user (no Keycloak). Real EG
// SSO login is the default; flip this for offline/local work.
const BYPASS_AUTH = false;
const MOCK_USER = {
  id: "dev-user",
  email: "dev@local",
  username: "dev",
  fullName: "Dev User",
  role: "SUPERADMIN",
};

function useAuth() {
  const [user, setUser] = useState(BYPASS_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

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

      // check-sso: silently detect an existing SSO session without forcing a
      // redirect. Public pages stay open; AuthWrapper sends protected routes
      // to /login when there's no session.
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      });

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
