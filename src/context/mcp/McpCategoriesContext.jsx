"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCategories } from "@/api/mcp/admin/categories";
import { useMCPAuthContext } from "./MCPAuthContext";

const McpCategoriesContext = createContext(null);

export function McpCategoriesProvider({ children }) {
  const { loading: authLoading } = useMCPAuthContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    getCategories()
      .then((res) => setCategories(res.data?.categories ?? []))
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading) fetchCategories();
  }, [authLoading, fetchCategories]);

  const parents = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  const getSubcats = useCallback(
    (parentId) => categories.filter((c) => c.parentId === parentId),
    [categories]
  );

  return (
    <McpCategoriesContext.Provider
      value={{ categories, loading, error, setError, refetch: fetchCategories, parents, getSubcats }}
    >
      {children}
    </McpCategoriesContext.Provider>
  );
}

export function useMcpCategories() {
  const ctx = useContext(McpCategoriesContext);
  if (!ctx) throw new Error("useMcpCategories must be used within McpCategoriesProvider");
  return ctx;
}
