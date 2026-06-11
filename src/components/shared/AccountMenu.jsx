"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Button,
  ListItemIcon,
} from "@mui/material";
import { SignOut, SignIn, CaretDown } from "phosphor-react";
import { useAuthContext } from "@/context/auth/AuthContext";

// Derive 2-letter initials from a name ("Vignesh Kamath" -> "VK") or, failing
// that, the email ("vivka@eg.dk" -> "VI").
function initials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

const ROLE_LABEL = { SUPERADMIN: "Super admin", ADMIN: "Admin", USER: "Member" };

export default function AccountMenu() {
  const { user, loading, isAuthenticated, role, redirectToLogin, signOut } =
    useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Still resolving the session — show a neutral placeholder so the bar
  // doesn't jump.
  if (loading) {
    return (
      <Avatar
        sx={{
          width: 30,
          height: 30,
          bgcolor: "var(--bs-surface-container)",
          color: "var(--bs-text-muted)",
        }}
      />
    );
  }

  // Signed out — a clear call to action.
  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => redirectToLogin?.()}
        startIcon={<SignIn size={16} weight="bold" />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color: "var(--bs-text-on-action, #fff)",
          bgcolor: "var(--bs-color-primary-default)",
          borderRadius: "var(--bs-border-radius-full)",
          px: 2,
          "&:hover": { bgcolor: "var(--bs-color-primary-hover)" },
        }}
      >
        Sign in
      </Button>
    );
  }

  const name = user?.fullName || user?.username || "";
  const email = user?.email || "";

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap={0.75}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          cursor: "pointer",
          pl: 0.5,
          pr: 1,
          py: 0.5,
          borderRadius: "var(--bs-border-radius-full)",
          border: "1px solid var(--bs-border-default)",
          bgcolor: "var(--bs-surface-base)",
          "&:hover": { bgcolor: "var(--bs-surface-hover)" },
        }}
        aria-label="Account menu"
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: "var(--bs-color-primary-container)",
            color: "var(--bs-color-primary-default)",
          }}
        >
          {initials(name, email)}
        </Avatar>
        <CaretDown size={12} weight="bold" color="var(--bs-text-muted)" />
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 240,
              borderRadius: "var(--bs-border-radius-150)",
              border: "1px solid var(--bs-border-default)",
              bgcolor: "var(--bs-surface-raised)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" alignItems="center" gap={1.25}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: 13,
                fontWeight: 700,
                bgcolor: "var(--bs-color-primary-container)",
                color: "var(--bs-color-primary-default)",
              }}
            >
              {initials(name, email)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ color: "var(--bs-text-default)" }}
              >
                {name || email}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ display: "block", color: "var(--bs-text-muted)" }}
              >
                {email}
              </Typography>
            </Box>
          </Stack>
          {role && (
            <Box
              sx={{
                mt: 1,
                display: "inline-block",
                px: 1,
                py: 0.25,
                borderRadius: "var(--bs-border-radius-full)",
                bgcolor: "var(--bs-surface-container)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--bs-text-muted)",
              }}
            >
              {ROLE_LABEL[role] ?? role}
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "var(--bs-border-default)" }} />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            signOut?.();
          }}
          sx={{ py: 1.25, color: "var(--bs-text-default)" }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <SignOut size={16} color="var(--bs-text-default)" />
          </ListItemIcon>
          <Typography variant="body2">Sign out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
