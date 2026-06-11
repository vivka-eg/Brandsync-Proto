"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Keycloak auth has been removed from this build — the app runs on a fixed
// mock SUPERADMIN user. Re-introduce a real auth provider here if needed.
const MOCK_USER = {
  id: "dev-user",
  email: "dev@local",
  username: "dev",
  fullName: "Dev User",
  role: "SUPERADMIN",
  isMcpBetaUser: true,
};

function useAuth() {
  const [user, setUser] = useState(MOCK_USER);
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/login");
  };

  return {
    user,
    setUser,
    loading: false,
    authError: null,
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
