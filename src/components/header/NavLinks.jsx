"use client";

import React, { useState } from "react";
import { Stack, Typography, ButtonBase, Divider } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { blogNavItem, designerNavItems, marketingNavItems } from "./navConfig";

function NavLinks({ navigationProps }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const pathname = usePathname();
  const router = useRouter();
  const { register, onKeyDown } = navigationProps || {};

  const renderLink = (item, index) => {
    const { label, icon: Icon, href } = item;
    const isSelected =
      label === "Home" ? pathname === "/" : pathname.startsWith(href);
    const isHovered = index === hoveredIndex;

    return (
      <ButtonBase
        key={label}
        onClick={() => router.push(href)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pl: "12px",
          pr: "16px",
          py: "12px",
          borderRadius: 1,
          transition: "all 0.2s ease-in-out",
          color: isSelected ? "text.primary" : "text.caption",
          "&:hover": {
            color: "text.primary",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(-1)}
        ref={register ? register(index) : undefined}
        onKeyDown={onKeyDown ? (e) => onKeyDown(e, index) : undefined}
        tabIndex={register ? 0 : undefined}
      >
        {isSelected && (
          <Icon size={20} weight="regular" style={{ transition: "opacity 0.2s ease-in-out" }} />
        )}
        <Typography
          variant="body2"
          fontWeight={isSelected ? 600 : isHovered ? 500 : 400}
        >
          {label}
        </Typography>
      </ButtonBase>
    );
  };

  let navIndex = 0;
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {designerNavItems.map((item) => renderLink(item, navIndex++))}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 0.5, borderColor: "divider", alignSelf: "stretch", my: 1 }}
      />
      {marketingNavItems.map((item) => renderLink(item, navIndex++))}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 0.5, borderColor: "divider", alignSelf: "stretch", my: 1 }}
      />
      {renderLink(blogNavItem, navIndex++)}
    </Stack>
  );
}

export default NavLinks;