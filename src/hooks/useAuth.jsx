"use client";
import axios from "axios";
import { getAuthToken, setDownloadTrackingToken } from "@/api/download-tracking";
import { getKeycloakInstance, getUserProfile } from "@/lib/keycloak";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BYPASS_AUTH = true;
const MOCK_USER = {
  id: "dev-user",
  email: "dev@local",
  username: "dev",
  fullName: "Dev User",
  role: "SUPERADMIN",
  isMcpBetaUser: true,
};

function useAuth() {
  const [user, setUser] = useState(BYPASS_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  const handleUpdateAuth = async () => {
    // get the keycloak instance :
    const keycloakInstance = getKeycloakInstance();

    // update the token in the local storage :
    localStorage.setItem("keycloak-token", keycloakInstance.token);

    // User is already authenticated, fetch the user profile :
    const profile = await getUserProfile();

    // update the auth context with the user profile :
    if (profile) {
      setUser(profile);

      // Exchange the Keycloak identity for a download-tracking JWT
      try {
        const { token } = await getAuthToken({
          email: profile.email,
          sub: profile.id,
          username: profile.username,
          name: profile.fullName,
        });
        // console.log("Download tracking token:", token);
        setDownloadTrackingToken(token);
      } catch (error) {
        // Network errors mean the assets backend is unreachable (e.g. off VPN).
        // Download tracking is non-critical — fail silently so the rest of
        // the app continues to work normally.
        if (!axios.isAxiosError(error) || error.code !== "ERR_NETWORK") {
          console.error("Failed to obtain download tracking token:", error);
        }
      }
    }
  };

  const handleKeycloakLogin = async () => {
    try {
      const keycloakInstance = getKeycloakInstance();

      // If already initialised (e.g. navigating back after Keycloak redirect),
      // just sync the user state without re-initialising.
      if (keycloakInstance.authenticated !== undefined) {
        if (keycloakInstance.authenticated) {
          await handleUpdateAuth();
        }
        setLoading(false);
        return;
      }

      // check-sso: silently detects an existing SSO session.
      // Does NOT redirect unauthenticated users; public pages stay open.
      // Protected routes enforce login themselves via AuthWrapper.
      const authenticated = await keycloakInstance.init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      });

      if (authenticated) {
        await handleUpdateAuth();
      }
      setLoading(false);
    } catch (error) {
      console.error("Keycloak initialization failed:", error);
      setAuthError("vpn_required");
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    router.push("/login");
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
    isMcpBetaUser: user ? user.isMcpBetaUser === true : false,
    redirectToLogin,
  };
}

export default useAuth;
