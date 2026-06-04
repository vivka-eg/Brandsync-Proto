"use client";

import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useHomePageContext } from "../context/HomePageContext";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <Box
      sx={{
        ml: "auto",
        flexShrink: 0,
        px: "7px",
        py: "1px",
        borderRadius: "20px",
        bgcolor: "action.hover",
        color: "text.secondary",
        fontSize: "11px",
        fontWeight: 600,
        lineHeight: "18px",
        minWidth: "22px",
        textAlign: "center",
      }}
    >
      {count}
    </Box>
  );
}

export default function Sidebar() {
  const { categories, setCategories } = useHomePageContext();
  const { categories: allCategories } = useIconTypesAndCategoryContext();

  const allSelected = categories.length === 0;

  const handleAllClick = () => setCategories([]);

  const handleCategoryClick = (name) => {
    setCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const allItems = [
    { name: "All", count: null },
    ...allCategories.map((c) => ({ name: c.name, count: c.count })),
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: 0,
        width: 280,
        height: "calc(100vh - 64px)",
        zIndex: 4,
        overflowY: "auto",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        overscrollBehavior: "contain",
        p: "16px",
        pl: "32px",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "3px" },
        "&:hover::-webkit-scrollbar-thumb": { background: "#D1D5DB" },
        "&:hover::-webkit-scrollbar-thumb:hover": { background: "#9CA3AF" },
        scrollbarWidth: "thin",
        scrollbarColor: "transparent transparent",
        "&:hover": { scrollbarColor: "#D1D5DB transparent" },
      }}
    >
      <Box sx={{ py: "12px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "1.25rem", lineHeight: "1.5rem", color: "text.primary" }}
        >
          Categories
        </Typography>
      </Box>

      <List disablePadding>
        {/* "All" item — clears selection */}
        <ListItem disablePadding>
          <ListItemButton
            selected={allSelected}
            onClick={handleAllClick}
            sx={{
              py: "8px",
              px: "8px",
              borderRadius: 1,
              color: "neutral.main",
              "&.Mui-selected": {
                bgcolor: "neutral.container",
                color: "text.primary",
                fontWeight: 600,
                "&:hover": { bgcolor: "neutral.container" },
              },
              "&:hover": { bgcolor: "neutral.hover" },
            }}
          >
            <ListItemText
              primary="All"
              primaryTypographyProps={{ fontSize: "16px", fontWeight: allSelected ? 600 : 500, noWrap: true }}
              sx={{ overflow: "hidden" }}
            />
          </ListItemButton>
        </ListItem>

        {allItems.slice(1).map((item) => {
          const isSelected = categories.includes(item.name);
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                onClick={() => handleCategoryClick(item.name)}
                sx={{
                  py: "6px",
                  px: "8px",
                  borderRadius: 1,
                  color: "neutral.main",
                  bgcolor: isSelected ? "neutral.container" : "transparent",
                  "&:hover": { bgcolor: "neutral.hover" },
                }}
              >
                <Checkbox
                  size="small"
                  checked={isSelected}
                  disableRipple
                  tabIndex={-1}
                  sx={{
                    p: 0,
                    mr: 1,
                    color: "text.disabled",
                    "&.Mui-checked": { color: "text.primary" },
                  }}
                />
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: isSelected ? 600 : 500,
                    noWrap: true,
                    color: isSelected ? "text.primary" : "inherit",
                  }}
                  sx={{ overflow: "hidden" }}
                />
                <CountBadge count={item.count} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
