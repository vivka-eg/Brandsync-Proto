"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { getComponentsByCategory } from "@/api/mcp/admin/categories";
import { deleteComponent } from "@/api/mcp/admin/components";
import { useMcpCategories } from "@/context/mcp/McpCategoriesContext";
import CategorySidebar from "./BusinessUnitSidebar";
import SubCategoryPatternsPanel from "./SubCategoryPatternsPanel";
import PatternDetailView from "./PatternDetailView";

const PAGE_SIZE = 20;

// Stores the sub-category the user clicked before a cross-category navigation.
// Read once on mount then cleared so it doesn't leak to subsequent renders.
let pendingSubId = null;

export default function CategoryPatternsPage({ categoryId }) {
  const router = useRouter();
  const { categories: allCategories } = useMcpCategories();

  const [selectedSubId, setSelectedSubId] = useState(pendingSubId ?? null);
  const [view, setView] = useState("subcategory");
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build sidebar-compatible grouped structure from flat API response
  const categoryGroups = useMemo(() => {
    const parents = allCategories.filter((c) => c.parentId === null);
    return parents.map((parent) => ({
      id: parent.id,
      name: parent.name,
      thumbnail: parent.thumbnail ?? null,
      subCategories: allCategories
        .filter((c) => c.parentId === parent.id)
        .map((sub) => ({ id: sub.id, name: sub.name })),
    }));
  }, [allCategories]);

  // Current parent category and its subcategories
  const currentCategory = categoryGroups.find((g) => g.id === categoryId) ?? {
    id: categoryId,
    name: categoryId,
    subCategories: [],
  };

  const firstSubCat = currentCategory.subCategories[0] ?? null;

  // Initialise selectedSubId once categories are available from context
  useEffect(() => {
    if (allCategories.length === 0) return;
    const pending = pendingSubId;
    pendingSubId = null;
    setSelectedSubId((prev) => prev ?? pending ?? firstSubCat?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCategories]);

  const selectedSubCategory =
    currentCategory.subCategories.find((s) => s.id === selectedSubId) ??
    firstSubCat;

  // Fetch patterns whenever the selected subcategory changes
  useEffect(() => {
    if (!selectedSubId) return;
    setLoading(true);
    setPatterns([]);
    getComponentsByCategory(selectedSubId, { limit: PAGE_SIZE, offset: 0 })
      .then((res) => setPatterns(res.data?.components ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedSubId]);

  function handleSelectSub(catId, subId) {
    setSelectedSubId(subId);
    setView("subcategory");
    setSelectedPattern(null);
    if (catId !== categoryId) {
      pendingSubId = subId;
      router.push(`/mcp/patterns/${catId}`);
    }
  }

  function handleSelectPattern(pattern) {
    setSelectedPattern(pattern);
    setView("detail");
  }

  function handleBackToList() {
    setView("subcategory");
    setSelectedPattern(null);
  }

  function handleBackToCategories() {
    router.push("/mcp/patterns");
  }

  async function handleDelete(patternId) {
    await deleteComponent(patternId);
    setPatterns((prev) => prev.filter((p) => p.id !== patternId));
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, md: 4 },
        alignItems: "flex-start",
        py: { xs: 2, md: 4 },
        maxWidth: 1300,
        mx: "auto",
        px: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      <CategorySidebar
        categories={categoryGroups}
        selectedCategoryId={categoryId}
        selectedSubId={selectedSubId}
        onSelectSub={handleSelectSub}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {view === "subcategory" ? (
          <SubCategoryPatternsPanel
            category={currentCategory}
            subCategory={selectedSubCategory}
            patterns={patterns}
            loading={loading}
            onBack={handleBackToCategories}
            onSelectPattern={handleSelectPattern}
            onDelete={handleDelete}
          />
        ) : (
          <PatternDetailView
            category={currentCategory}
            subCategory={selectedSubCategory}
            pattern={selectedPattern}
            onBack={handleBackToList}
          />
        )}
      </Box>
    </Box>
  );
}
