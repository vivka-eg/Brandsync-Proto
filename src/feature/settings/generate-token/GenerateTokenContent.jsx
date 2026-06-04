"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import TokenDisplay from "./TokenDisplay";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import {
  Key,
  ChartBar,
  WarningCircle,
  SquaresFour,
  Lightning,
  CaretRight,
} from "phosphor-react";
import { notFound } from "next/navigation";
import { useAuthContext } from "@/context/auth/AuthContext";
import { MCP_BETA_ACCESS_FORM_URL } from "@/constants";
import { Lock } from "phosphor-react";

function StatCard({ label, value }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: 800,
          color: "text.primary",
          lineHeight: 1,
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

function StatDivider() {
  return (
    <Box
      sx={{ width: "1px", alignSelf: "stretch", bgcolor: "divider", mx: 1 }}
    />
  );
}

export default function GenerateTokenContent() {
  const { token, mcpUserProfile } = useMCPAuthContext();
  const { isMcpBetaUser } = useAuthContext();

  const usage = mcpUserProfile?.tokenUsage ?? mcpUserProfile?.usage ?? null;
  const requestsUsed =
    typeof usage === "object"
      ? (usage?.used ?? usage?.count ?? usage?.requests ?? null)
      : typeof usage === "number"
        ? usage
        : null;
  const requestsLimit =
    typeof usage === "object" ? (usage?.limit ?? null) : null;
  const totalCalls =
    mcpUserProfile?.totalCalls ?? mcpUserProfile?.calls ?? null;
  const lastActive =
    mcpUserProfile?.lastActive ?? mcpUserProfile?.lastSeen ?? null;

  if (!isMcpBetaUser) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            bgcolor: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock size={28} weight="duotone" color="#6366f1" />
        </Box>
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "28px", md: "36px" },
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Beta access required
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "text.secondary", lineHeight: 1.6 }}>
            MCP tokens are only available to beta participants. Request access to get your token and connect your AI tools to BrandSync.
          </Typography>
        </Box>
       <Button
            component={Link}
            href={MCP_BETA_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{
              border: "1px solid #005591",
              color: "#005591",
              borderRadius: "8px",
              px: "20px",
              py: "10px",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "rgba(0, 85, 145, 0.06)",
                border: "1px solid #005591",
              },
            }}
          >
            Request beta access <CaretRight size={16} weight="bold" color="#005591" />
          </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* ── Header ── */}
      <Box sx={{ mb: 6 }}>
        <Chip
          icon={<Key size={16} weight="fill" color="#6366f1" />}
          label="Authentication"
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            borderColor: "rgba(99, 102, 241, 0.3)",
            bgcolor: "rgba(99, 102, 241, 0.05)",
            color: "text.primary",
            px: 1,
          }}
        />
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            fontSize: { xs: "32px", md: "40px" },
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          MCP Token
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            color: "text.secondary",
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Use this personal access token to authenticate your local AI tools
          (like Claude Desktop or Cursor) with the BrandSync MCP server.
        </Typography>
      </Box>

      {/* ── Token Field ── */}
      <Box sx={{ mb: 6, maxWidth: 600 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
          }}
        >
          Your active token
        </Typography>
        <TokenDisplay token={token} />

        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            borderRadius: "12px",
            bgcolor: "rgba(245, 158, 11, 0.05)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <WarningCircle size={20} weight="fill" color="#f59e0b" />
          <Typography
            sx={{ fontSize: "14px", color: "text.secondary", lineHeight: 1.5 }}
          >
            Keep your token secure. Do not share it publicly or commit it to
            version control.
          </Typography>
        </Box>
      </Box>

      {/* ── Usage Stats ── */}
      {/* {mcpUserProfile != null && (
        <Box sx={{ mb: 6, maxWidth: 600 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "text.primary",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ChartBar size={18} weight="duotone" color="#10b981" /> Your Usage
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
              px: 4,
              py: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <StatCard
              label="Requests Used"
              value={requestsUsed?.toLocaleString()}
            />
            {requestsLimit != null && (
              <>
                <StatDivider />
                <StatCard
                  label="Monthly Limit"
                  value={requestsLimit?.toLocaleString()}
                />
              </>
            )}
            {totalCalls != null && (
              <>
                <StatDivider />
                <StatCard
                  label="Total Calls"
                  value={totalCalls?.toLocaleString()}
                />
              </>
            )}
            {lastActive != null && (
              <>
                <StatDivider />
                <StatCard
                  label="Last Active"
                  value={new Date(lastActive).toLocaleDateString()}
                />
              </>
            )}
          </Box>
        </Box>
      )} */}

      {/* ── Quick Links ── */}
      <Box sx={{ maxWidth: 600 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
          }}
        >
          Helpful links
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            component={Link}
            href="/mcp/getting-started/installation"
            variant="outlined"
            startIcon={<Lightning size={16} weight="duotone" />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderColor: "divider",
              color: "text.primary",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "transparent",
                transform: "translateY(-1px)",
              },
            }}
          >
            Setup Instructions
          </Button>
          <Button
            component={Link}
            href="/mcp/patterns"
            variant="outlined"
            startIcon={<SquaresFour size={16} weight="duotone" />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderColor: "divider",
              color: "text.primary",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "transparent",
                transform: "translateY(-1px)",
              },
            }}
          >
            Explore Patterns
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
