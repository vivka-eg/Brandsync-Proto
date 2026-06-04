"use client";

import { Box, Button, Divider, Typography, useTheme, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, PencilSimpleLine, Plus } from "phosphor-react";

const SidebarItem = ({ icon: Icon, label, href }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: isActive ? "neutral.container" : "",
        "&:hover": {
          backgroundColor: isActive ? "neutral.container" : "neutral.hover",
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon
          size={20}
          weight="regular"
          color={theme.palette.neutral.main}
        />
        <Typography
          fontWeight={500}
          sx={{ fontSize: "16px" }}
          color="neutral.main"
        >
          <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
            {label}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default function Sidebar() {
  const router = useRouter();

  const sidebarItems = [
    {
      icon: Layout,
      label: "Dashboard",
      href: "/digital-assets/icons/admin",
    },
    {
      icon: PencilSimpleLine,
      label: "Manage Icons",
      href: "/digital-assets/icons/admin/manage",
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: 0,
        width: 230,
        height: "calc(100vh - 64px)",
        zIndex: 4,
        overflowY: "auto",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        overscrollBehavior: "contain",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Button
        variant="contained"
        startIcon={<Plus size={16} weight="bold" />}
        onClick={() => router.push("/digital-assets/icons/admin/upload")}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          justifyContent: "flex-start",
          px: 2,
          py: 1.5,
        }}
        fullWidth
      >
        Add Icons
      </Button>

      <Divider />

      <Stack spacing="4px">
        {sidebarItems.map(({ icon, label, href }, index) => (
          <SidebarItem icon={icon} label={label} key={index} href={href} />
        ))}
      </Stack>
    </Box>
  );
}
