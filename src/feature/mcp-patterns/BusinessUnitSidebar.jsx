"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FolderSimple, CaretRight } from "phosphor-react";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";

function SubCategoryItem({ subCategory, selected, onClick, navIndex, register, onKeyDown, focusedIndex }) {
  return (
    <Box
      component="button"
      ref={register(navIndex)}
      tabIndex={focusedIndex === navIndex ? 0 : -1}
      onClick={() => onClick(subCategory.id)}
      onKeyDown={(e) => onKeyDown(e, navIndex)}
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "48px",
        padding: "0 11px 0 42px",
        alignItems: "center",
        borderRadius: 1.5,
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        bgcolor: selected ? "background.neutral" : "transparent",
        transition: "background 0.15s",
        "&:hover": {
          bgcolor: selected ? "background.neutral" : "background.primary",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "2px",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: selected ? 600 : 400,
          color: selected ? "text.primary" : "text.body",
          fontSize: "0.82rem",
        }}
      >
        {subCategory.name}
      </Typography>
    </Box>
  );
}

function CategoryItem({
  category,
  expanded,
  selectedSubId,
  onToggle,
  onSelectSub,
  navIndex,
  register,
  onKeyDown,
  focusedIndex,
  subNavOffset,
}) {
  const hasSubCats = category.subCategories?.length > 0;

  return (
    <Box>
      <Box
        component="button"
        ref={register(navIndex)}
        tabIndex={focusedIndex === navIndex ? 0 : -1}
        onClick={() => onToggle(category.id)}
        onKeyDown={(e) => onKeyDown(e, navIndex)}
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "48px",
          padding: "0 11px",
          alignItems: "center",
          gap: "12px",
          borderRadius: 1.5,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          bgcolor: "transparent",
          transition: "background 0.15s",
          "&:hover": { bgcolor: "background.primary" },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            color: "text.secondary",
          }}
        >
          <Box
            sx={{
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CaretRight size={13} />
          </Box>
          <FolderSimple size={15} />
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "text.body", fontSize: "0.875rem" }}
        >
          {category.name}
        </Typography>
      </Box>

      {expanded && hasSubCats && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, mt: 0.25 }}>
          {category.subCategories.map((sub, i) => (
            <SubCategoryItem
              key={sub.id}
              subCategory={sub}
              selected={selectedSubId === sub.id}
              onClick={(subId) => onSelectSub(category.id, subId)}
              navIndex={subNavOffset + i}
              register={register}
              onKeyDown={onKeyDown}
              focusedIndex={focusedIndex}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  selectedSubId,
  onSelectSub,
}) {
  const [expandedCatId, setExpandedCatId] = useState(
    selectedCategoryId ?? categories[0]?.id ?? null,
  );

  const { register, onKeyDown, focusedIndex } = useArrowKeyNavigation();

  // Build flat list of visible items to assign sequential nav indices
  const flatItems = useMemo(() => {
    const items = [];
    categories.forEach((cat) => {
      items.push({ type: "category", id: cat.id });
      if (expandedCatId === cat.id && cat.subCategories?.length > 0) {
        cat.subCategories.forEach((sub) => {
          items.push({ type: "sub", catId: cat.id, id: sub.id });
        });
      }
    });
    return items;
  }, [categories, expandedCatId]);

  function handleToggle(catId) {
    setExpandedCatId((prev) => (prev === catId ? null : catId));
  }

  // Compute the nav index offset for each category's sub-items
  let runningIndex = 0;
  const categoryNavData = categories.map((cat) => {
    const catNavIndex = runningIndex;
    runningIndex += 1;
    const subNavOffset = runningIndex;
    if (expandedCatId === cat.id) {
      runningIndex += cat.subCategories?.length ?? 0;
    }
    return { catNavIndex, subNavOffset };
  });

  return (
    <Box
      sx={{
        width: "280px",
        minHeight: "400px",
        padding: "21px 0 14px 0",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "21px",
        flexShrink: 0,
        bgcolor: "#F8FAFC",
        display: "flex",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        overflowY: "auto",
        px: "24px",
        pt: "32px",
        borderRadius: 3,
      }}
      tabIndex={0}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "text.primary", px: "11px", mb: 0.5 }}
      >
        Patterns
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, width: "100%" }}>
        {categories.map((category, i) => (
          <CategoryItem
            key={category.id}
            category={category}
            expanded={expandedCatId === category.id}
            selectedSubId={selectedSubId}
            onToggle={handleToggle}
            onSelectSub={onSelectSub}
            navIndex={categoryNavData[i].catNavIndex}
            subNavOffset={categoryNavData[i].subNavOffset}
            register={register}
            onKeyDown={onKeyDown}
            focusedIndex={focusedIndex}
          />
        ))}
      </Box>
    </Box>
  );
}
