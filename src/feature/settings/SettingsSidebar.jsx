"use client";

import { Box, Stack, Typography, ButtonBase, useTheme } from "@mui/material";
import { alpha } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
  UserCircle,
  ImageSquare,
  Monitor,
  Key,
  ChartBar,
} from "phosphor-react";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import { useMemo } from "react";
import Link from "next/link";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";


export default function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const { register, onKeyDown, focusedIndex } = useArrowKeyNavigation();
  const { isSuperAdmin } = useMCPAuthContext();
  const NAV_ITEMS = useMemo(
    () => [
      { label: "Profile", href: "/settings/profile", icon: UserCircle },
      { label: "MCP Token", href: "/settings/generate-token", icon: Key },
      ...(isSuperAdmin
        ? [
            {
              label: "MCP Analytics",
              href: "/settings/mcp-analytics",
              icon: ChartBar,
            },
          ]
        : []),
    ],
    [isSuperAdmin],
  );

  return (
    <Box
      width={280}
      sx={{
        borderRight: 1,
        borderColor: "divider",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down(950)]: { display: "none" },
        p: "16px",
        pl: "32px",
      }}
      role="navigation"
      aria-label="Settings navigation"
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "12px",
          pl: "4px",
          pr: "6px",
          paddingBottom: "40px",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        role="list"
        aria-label="Settings navigation items"
      >
        <Stack sx={{ gap: "8px" }}>
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            const isFocused = focusedIndex === index;
            const Icon = item.icon;

            return (
              <ButtonBase
                key={item.href}
                onClick={() => router.push(item.href)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  py: "12px",
                  px: "8px",
                  borderRadius: 1,
                  color: "neutral.main",
                  backgroundColor: isActive ? "neutral.container" : "",
                  "&:hover": {
                    backgroundColor: isActive
                      ? alpha("#A2AAB2", 0.24)
                      : "neutral.hover",
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                  },
                }}
                onKeyDown={(e) => onKeyDown(e, index)}
                ref={register(index)}
                tabIndex={isFocused ? 0 : -1}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon
                    size={24}
                    weight="regular"
                    color={
                      isActive
                        ? theme.palette.action.active
                        : theme.palette.neutral.icons
                    }
                    style={{ flexShrink: 0 }}
                  />
                  <Typography
                    fontWeight={500}
                    sx={{
                      fontSize: "16px",
                      color: isActive
                        ? theme.palette.text.primary
                        : theme.palette.neutral.main,
                      textAlign: "left",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              </ButtonBase>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
