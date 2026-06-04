"use client";
import { getCurrentUser, login } from "@/api/mcp/auth";
import { clearMcpToken, setMcpToken } from "@/api/mcp/instance";
import { useAuthContext } from "@/context/auth/AuthContext";
import { useEffect, useState } from "react";

function useMCPAuth() {
  const { user: keycloakUser } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [mcpUser, setMcpUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [mcpUserProfile, setMcpUserProfile] = useState(null);

  useEffect(() => {
    if (!keycloakUser) return;

    const authenticate = async () => {
      try {
        setLoading(true);
        const { data } = await login(keycloakUser.email, keycloakUser.fullName);
        if (data?.success) {
          setMcpToken(data.token);
          setToken(data.token);
          setMcpUser(data.user);

          try {
            const { data: userData } = await getCurrentUser();
            if (userData) {
              setTokenUsage(userData.tokenUsage ?? userData.usage ?? null);
              setMcpUserProfile(userData);
            }
          } catch {
            // token usage not available
          }
        }
      } catch (error) {
        console.error("MCP authentication failed:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticate();

    return () => clearMcpToken();
  }, [keycloakUser]);

  return {
    loading,
    mcpUser,
    mcpUserProfile,
    token,
    tokenUsage,
    role: mcpUser?.role,
    isAdmin: mcpUser?.role === "ADMIN",
    isSuperAdmin: mcpUser?.role === "SUPER_ADMIN",
    isUser: mcpUser?.role === "USER",
  };
}

export default useMCPAuth;
