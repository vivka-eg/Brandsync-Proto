import { useMcpCategories } from "@/context/mcp/McpCategoriesContext";

export default function useCategories({ skip = false } = {}) {
  const { categories, loading, error, setError, refetch: fetchCategories, parents, getSubcats } =
    useMcpCategories();

  return {
    categories,
    loading: skip ? false : loading,
    error,
    setError,
    fetchCategories,
    parents,
    getSubcats,
  };
}
