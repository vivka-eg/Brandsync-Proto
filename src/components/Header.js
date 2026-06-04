"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import BreadcrumbsNav from "./BreadcrumbsNav";
import SearchBar from "./header/SearchBar";
import ThemeToggle from "./ThemeToggle";
import MenuButton from "./header/MenuButton";
import Logo from "./Logo";
import { MagnifyingGlass, Headset } from "phosphor-react";
import NavLinks from "./header/NavLinks";
import SearchCard from "./SearchCard";
import { SignOut, Gear } from "phosphor-react";
import Link from "next/link";
import { useTheme } from "@mui/system";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/AuthContext";
import { logout } from "@/lib/keycloak";
import { useToast } from "@/context/shared/ToastContext";
import MobileSidebar from "./MobileSidebar";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

export default function Header() {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const theme = useTheme();
  const { setUser, user } = useAuthContext();
  // const user = null;
  const router = useRouter();
  const { setToast } = useToast();

  // Unified navigation for all header elements
  const { register, onKeyDown } = useArrowKeyNavigation();

  const handleLogout = async () => {
    // Clear the token from localStorage :
    localStorage.removeItem("keycloak_token");

    // clear the user :
    // setUser(null);

    // logout from Keycloak :
    try {
      await logout();
    } catch (error) {
      setToast({
        message: "Logout failed. Please try again.",
        severity: "error",
        variant: "filled",
      });
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "32px",
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 1,
          [theme.breakpoints.down(1200)]: {
            px: "16px",
          },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        {/* Left: Logo and Hamburger (mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Hamburger Menu - Only visible on mobile */}
          <IconButton
            sx={{
              display: "none",
              [theme.breakpoints.down(1200)]: {
                display: "flex",
              },
            }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo - Hidden on mobile */}
          <Box
            sx={{
              display: "flex",
              [theme.breakpoints.down(1200)]: {
                display: "none",
              },
            }}
          >
            <Logo />
          </Box>
        </Box>

        {/* Center: Navigation Links - Hidden on mobile */}
        <Box
          sx={{
            display: "flex",
            [theme.breakpoints.down(1200)]: {
              display: "none",
            },
          }}
        >
          <NavLinks navigationProps={{ register, onKeyDown }} />
        </Box>

        {/* Right: FAQs, Support, Search, Logout */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >

          {/* Support Link */}
          <Tooltip title="Get help, report issues, or contact the team" placement="bottom">
            <Link
              href="/support"
              aria-label="Support — get help, report issues, or contact the team"
              style={{ textDecoration: "none", outline: "none" }}
              ref={register(9)}
              onKeyDown={(e) => onKeyDown(e, 9)}
            >
              <Box
                sx={{
                  borderRadius: 1,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  "&:active": {
                    backgroundColor: "neutral.containerPressed",
                  },
                  "a:focus-visible &": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                    borderRadius: 1,
                  },
                }}
              >
                <Headset
                  style={{ color: "#21262F" }}
                  size={20}
                  weight="regular"
                />
              </Box>
            </Link>
          </Tooltip>


          <Tooltip title="Search across design system, components & assets" placement="bottom">
            <Box
              onClick={() => setSearchEnabled((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label="Toggle search"
              ref={register(10)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSearchEnabled((prev) => !prev);
                } else {
                  onKeyDown(e, 10);
                }
              }}
              sx={{
                borderRadius: 1,
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&:active": {
                  backgroundColor: "neutral.containerPressed",
                },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: "2px",
                },
              }}
            >
              <MagnifyingGlass
                style={{ color: "#21262F" }}
                size={24}
                weight="regular"
              />
            </Box>
          </Tooltip>

          <SearchCard open={searchEnabled} setOpen={setSearchEnabled} />

          {user && (
            <>
              <Tooltip title="Account" placement="bottom">
                <IconButton
                  onClick={(e) => setProfileAnchor(e.currentTarget)}
                  size="small"
                  aria-label="Account menu"
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "13px",
                      fontWeight: 700,
                      bgcolor: "primary.main",
                      color: "primary.light",
                      cursor: "pointer",
                    }}
                  >
                    {user?.firstName?.[0] ?? user?.username?.[0] ?? "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setProfileAnchor(null);
                    router.push("/settings");
                  }}
                  sx={{ gap: 1.5, py: 1.25, fontSize: "14px" }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Gear size={18} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setProfileAnchor(null);
                    handleLogout();
                  }}
                  sx={{ gap: 1.5, py: 1.25, fontSize: "14px", color: "error.main" }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: "error.main" }}>
                    <SignOut size={18} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
}
