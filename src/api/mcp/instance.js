import axios from "axios";

let mcpToken = null;

export const setMcpToken = (token) => {
  mcpToken = token;
};

export const clearMcpToken = () => {
  mcpToken = null;
};

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BRANDSYNC_MCP_URL,
  });

  const PUBLIC_ROUTES = ["/auth/token", "/health"];

  instance.interceptors.request.use((config) => {
    if (PUBLIC_ROUTES.includes(config.url)) return config;
    if (mcpToken) config.headers.Authorization = `Bearer ${mcpToken}`;
    return config;
  });

  return instance;
};

// Export a singleton instance
export const api = createAxiosInstance();
