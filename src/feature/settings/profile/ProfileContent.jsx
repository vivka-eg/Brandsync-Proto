"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useAuthContext } from "@/context/auth/AuthContext";
import {
  DownloadSimple,
  Image,
  FileImage,
  Folder,
  UserCircle,
  IdentificationBadge,
  ClockClockwise,
  ChartBar,
  EnvelopeSimple,
  At
} from "phosphor-react";
import useDownloadActivity from "./hooks/useDownloadActivity";
import useRecentDownloads from "./hooks/useRecentDownloads";

const ROLE_COLOR = {
  SUPERADMIN: "error",
  ADMIN: "warning",
  USER: "default",
};

const TYPE_CHIP_COLOR = {
  "Logo": "rgba(99, 102, 241, 0.1)", // Indigo
  "Logo Text": "#6366f1",
  "Icon": "rgba(236, 72, 153, 0.1)", // Pink
  "Icon Text": "#ec4899",
  "Digital Asset": "rgba(245, 158, 11, 0.1)", // Amber
  "Digital AssetText": "#f59e0b",
};

function DownloadIcon({ type }) {
  if (type === "logo") return <FileImage size={20} weight="duotone" color="#6366f1" />;
  if (type === "icon") return <Image size={20} weight="duotone" color="#ec4899" />;
  return <Folder size={20} weight="duotone" color="#f59e0b" />;
}

function StatCard({ label, value, icon, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: "calc(50% - 8px)", md: 140 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "16px",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
          borderColor: color,
        }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: "12px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          bgcolor: `${color}15`, 
          color: color 
        }}>
          {icon}
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
          {value}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Typography>
    </Box>
  );
}

function ReadOnlyField({ label, value, icon }) {
  return (
    <Box sx={{ flex: 1, minWidth: 200 }}>
      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        {icon} {label}
      </Typography>
      <Box
        sx={{
          bgcolor: "neutral.container",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          px: 2,
          py: 1.5,
          color: "text.primary",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {value || "Not provided"}
      </Box>
    </Box>
  );
}

// Map API assetType to display label / icon key
const ASSET_TYPE_LABEL = { logo: "Logo", icon: "Icon", digital_asset: "Digital Asset" };
const ASSET_TYPE_ICON = { logo: "logo", icon: "icon", digital_asset: "asset" };

function resolveAssetHref(assetType, assetId) {
  if (assetType === "logo") return `/logos?logo=${assetId}`;
  if (assetType === "digital_asset") return `/digital-assets/stock-images/${assetId}`;
  if (assetType === "icon") return `/assets`;
  return null;
}

export default function ProfileContent() {
  const { user } = useAuthContext();

  const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName ?? user?.name ?? "";
  const username = user?.username ?? user?.preferredUsername ?? "";
  const email = user?.email ?? "";
  const role = user?.role ?? user?.roles?.[0] ?? "USER";

  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || username?.[0]?.toUpperCase() || "U";

  const { total, breakdown, loading: activityLoading } = useDownloadActivity();
  const { downloads, hasMore, loading: downloadsLoading, loadingMore, loadMore } = useRecentDownloads();

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* ── Header ── */}
      <Box sx={{ mb: 6 }}>
        <Chip 
          icon={<UserCircle size={16} weight="fill" color="#10b981" />} 
          label="Account" 
          variant="outlined"
          sx={{ 
            mb: 3, 
            borderRadius: "8px", 
            fontWeight: 600, 
            fontSize: "13px",
            borderColor: "rgba(16, 185, 129, 0.3)",
            bgcolor: "rgba(16, 185, 129, 0.05)",
            color: "text.primary",
            px: 1
          }} 
        />
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{ 
            fontSize: { xs: "32px", md: "40px" }, 
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 2
          }}
        >
          Your Profile
        </Typography>
        <Typography sx={{ fontSize: "16px", color: "text.secondary", maxWidth: 600, lineHeight: 1.6 }}>
          Manage your personal information and view your activity across the BrandSync platform.
        </Typography>
      </Box>

      {/* ── Profile ID Card ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
          bgcolor: "background.paper",
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 4 },
          mb: 6,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background glow */}
        <Box 
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />

        <Avatar
          sx={{
            width: 88,
            height: 88,
            bgcolor: "#10b981",
            color: "#fff",
            fontSize: "32px",
            fontWeight: 800,
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            zIndex: 1,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0, zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Typography variant="h5" fontWeight={800} noWrap sx={{ letterSpacing: "-0.01em" }}>
              {displayName || username || "Unknown User"}
            </Typography>
            <Chip
              label={role}
              color={ROLE_COLOR[role] ?? "default"}
              size="small"
              sx={{ fontWeight: 700, fontSize: "11px", height: 22, textTransform: "uppercase", letterSpacing: "0.05em" }}
            />
          </Stack>
          
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 3 }, mt: 2 }}>
            <Typography sx={{ fontSize: "14px", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.75, fontWeight: 500 }}>
              <EnvelopeSimple size={16} weight="duotone" /> {email || "No email"}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.75, fontWeight: 500 }}>
              <At size={16} weight="duotone" /> {username}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Account Information ── */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <IdentificationBadge size={20} weight="duotone" color="#6366f1" /> Personal Details
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <ReadOnlyField label="Display Name" value={displayName} />
          <ReadOnlyField label="Username" value={username} />
          {email && <ReadOnlyField label="Email Address" value={email} />}
        </Box>
      </Box>

      {/* ── Download Stats ── */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <ChartBar size={20} weight="duotone" color="#f59e0b" /> Activity Overview
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{ flexWrap: "wrap", gap: { xs: 2, md: 3 }, opacity: activityLoading ? 0.5 : 1, transition: "opacity 0.3s" }}
          useFlexGap
        >
          <StatCard label="Total Downloads" value={total} icon={<DownloadSimple size={24} weight="duotone" />} color="#10b981" />
          <StatCard label="Logos" value={breakdown.logo} icon={<FileImage size={24} weight="duotone" />} color="#6366f1" />
          <StatCard label="Icons" value={breakdown.icon} icon={<Image size={24} weight="duotone" />} color="#ec4899" />
          <StatCard label="Digital Assets" value={breakdown.digital_asset} icon={<Folder size={24} weight="duotone" />} color="#f59e0b" />
        </Stack>
      </Box>

      {/* ── Download History ── */}
      <Box sx={{ mb: 8 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <ClockClockwise size={20} weight="duotone" color="#0ea5e9" /> Recent Downloads
        </Typography>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
            opacity: downloadsLoading ? 0.5 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              display: { xs: "none", sm: "grid" },
              gridTemplateColumns: "1fr 140px 100px 120px",
              px: 3,
              py: 2,
              bgcolor: "neutral.container",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {["Asset Name", "Type", "Format", "Date"].map((col) => (
              <Typography key={col} sx={{ fontSize: "12px", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {col}
              </Typography>
            ))}
          </Box>

          {/* Empty state */}
          {!downloadsLoading && downloads.length === 0 && (
            <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>No downloads yet.</Typography>
            </Box>
          )}

          {/* Loading skeleton rows on initial load */}
          {downloadsLoading && (
            <Box sx={{ px: 3, py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {/* Rows */}
          {downloads.map((item, idx) => {
            const typeLabel = ASSET_TYPE_LABEL[item.assetType] ?? item.assetType;
            const iconKey = ASSET_TYPE_ICON[item.assetType] ?? "asset";
            const href = resolveAssetHref(item.assetType, item.assetId);
            return (
              <Box
                key={item.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 140px 100px 120px" },
                  gap: { xs: 2, sm: 0 },
                  px: 3,
                  py: 2,
                  alignItems: "center",
                  borderBottom: idx < downloads.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "neutral.hover" },
                }}
              >
                {/* Asset Name */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <DownloadIcon type={iconKey} />
                  {href ? (
                    <Typography
                      component={Link}
                      href={href}
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline", color: "primary.main" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.assetName}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "text.primary" }} noWrap>
                      {item.assetName}
                    </Typography>
                  )}
                </Stack>

                {/* Type Chip */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    label={typeLabel}
                    size="small"
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      height: 24,
                      bgcolor: TYPE_CHIP_COLOR[typeLabel],
                      color: TYPE_CHIP_COLOR[`${typeLabel} Text`],
                      border: "none",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                  />
                </Box>

                {/* Format */}
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.secondary", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                  {item.format}
                </Typography>

                {/* Date */}
                <Typography sx={{ fontSize: "13px", color: "text.secondary", fontWeight: 500 }}>
                  {new Date(item.downloadedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
            );
          })}

          {/* Load More */}
          {hasMore && (
            <Box sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "center" }}>
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "13px" }}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}