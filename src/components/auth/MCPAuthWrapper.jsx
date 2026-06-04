"use client";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import Loader from "../shared/Loader";

const MCPAuthWrapper = ({ children }) => {
  const { loading } = useMCPAuthContext();

  if (loading) return <Loader />;

  return children;
};

export default MCPAuthWrapper;
