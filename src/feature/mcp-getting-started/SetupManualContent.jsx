"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { CheckCircle, Info } from "phosphor-react";
import BetaCtaBanner from "@/feature/mcp-getting-started/components/BetaCtaBanner";
import Breadcrumb from "@/feature/mcp-getting-started/components/Breadcrumb";
import PageHeader from "@/feature/mcp-getting-started/components/PageHeader";
import SectionHeading from "@/feature/mcp-getting-started/components/SectionHeading";
import CodeBlock from "@/feature/mcp-getting-started/components/CodeBlock";
import PageNav from "@/feature/mcp-getting-started/components/PageNav";
import { useAuthContext } from "@/context/auth/AuthContext";
import { useAppEnv } from "@/hooks/useAppEnv";

// ── Success Hint ───────────────────────────────────────────────────────────────

function SuccessHint({ children }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ px: 2.5, py: 1 }}
    >
      <CheckCircle
        size={32}
        weight="regular"
        color="#1b5d43"
        style={{ flexShrink: 0 }}
      />
      <Typography
        sx={{ fontSize: "16px", color: "#1b5d43", lineHeight: "24px" }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

// ── Platform sub-label ─────────────────────────────────────────────────────────

function PlatformLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: "16px",
        fontWeight: 500,
        color: "text.primary",
        lineHeight: "24px",
      }}
    >
      {children}
    </Typography>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SetupManualContent() {
  const { isMcpBetaUser } = useAuthContext();
  const { env } = useAppEnv();
  const baseURL =
    env === "dev"
      ? "https://mcp.brand.dev.egsync.com"
      : env == "stage"
        ? "https://mcp.brand.stage.egsync.com"
        : "https://mcp.brand.egsync.com";

  // ── Shared JSON config ─────────────────────────────────────────────────────────

  const MCP_JSON = `{
  "mcpServers": {
    "brandsync": {
      "url": "${baseURL}",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}`;

  const MCP_REMOTE_JSON = `{
  "mcpServers": {
    "brandsync": {
      "command": "mcp-remote",
      "args": [
        "${baseURL}",
        "--header",
        "Authorization: Bearer YOUR_TOKEN"
      ]
    }
  }
}`;

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        {/* Breadcrumb + Hero */}
        <Stack spacing={3}>
          <Breadcrumb current="Installation" />
          <PageHeader
            title="Installation - Connect your AI assistant"
            subtitle="Follow these steps to configure your MCP client to communicate securely with the BrandSync design system."
          />
        </Stack>

        {/* Beta CTA */}
        <BetaCtaBanner
          title="Don't have access yet?"
          description="BrandSync MCP is in closed beta. Request access first — you'll need a token before completing these steps."
          show={!isMcpBetaUser}
        />

      

        {/* Get your Tokens */}
        <Stack spacing={1}>
          <SectionHeading title="Get your Tokens" />
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            You need a personal access token to authenticate your local AI tools
            with the BrandSync server.
          </Typography>
          <Stack spacing={1} sx={{ pt: 0.5 }}>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              1. Navigate to{" "}
              <Typography
                component="a"
                href="/settings/generate-token"
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "text.primary",
                  textDecoration: "underline",
                  textDecorationSkipInk: "none",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                Settings &gt; MCP Token
              </Typography>{" "}
              (accessible from your profile dropdown in the top-right).
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              2. Generate a new token, copy it, and keep it secure. You will use
              this token in the configuration steps below.
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* Quick Setup */}
        <Stack spacing={3}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <Typography
                sx={{
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: "40px",
                  color: "text.primary",
                }}
              >
                Quick Setup
              </Typography>
              <Box
                sx={{
                  bgcolor: "#c5ebd5",
                  borderRadius: "120px",
                  px: 1.5,
                  py: "2px",
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#1b5d43",
                    lineHeight: "20px",
                  }}
                >
                  Recommended
                </Typography>
              </Box>
            </Stack>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              The fastest way to connect on Mac/Linux using Claude Code.
            </Typography>
          </Box>

          <Stack spacing={1}>
            <Stack spacing={0.5}>
              <PlatformLabel>For Claude Code (Mac/Linux)</PlatformLabel>
              <Typography
                sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
              >
                Run this command in your terminal to add the BrandSync MCP
                server. Replace{" "}
                <Box
                  component="span"
                  sx={{
                    fontFamily: "'Roboto Mono', Consolas, monospace",
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  YOUR_TOKEN
                </Box>{" "}
                with your MCP Token
              </Typography>
            </Stack>
            <CodeBlock
              label="BASH"
              code={`claude mcp add --transport http brandsync ${baseURL} --header "Authorization: Bearer YOUR_TOKEN"`}
            />
          </Stack>

          {/* Info callout */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ bgcolor: "#eef0f6", borderRadius: "12px", p: 2.5 }}
          >
            <Info size={32} color="#53585c" style={{ flexShrink: 0 }} />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Once connected, type &quot;List all BrandSync components&quot; in Claude to
              confirm the server is responding.
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* Manual Setup */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="Manual Setup" />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              If you prefer full control, use a different AI tool, or want to
              configure Cursor/VSCode manually.
            </Typography>
          </Box>

          {/* Claude Desktop */}
          <Stack spacing={2}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "24px",
                color: "text.primary",
              }}
            >
              Claude Desktop
            </Typography>

            <Stack spacing={1}>
              <PlatformLabel>Mac/Linux</PlatformLabel>
              <Typography sx={{ fontSize: "14px", color: "#535b5c", lineHeight: "normal" }}>
                If mcp-remote is not already installed, run: npm install -g mcp-remote
              </Typography>
              <CodeBlock
                label="Code"
                code="~/Library/Application Support/Claude/claude_desktop_config.json"
              />
              <CodeBlock label="JSON" code={MCP_REMOTE_JSON} />
            </Stack>

            <Stack spacing={1}>
              <PlatformLabel>Windows</PlatformLabel>
              <CodeBlock label="Code" code="npm install -g mcp-remote" />
              <CodeBlock
                label="Code"
                code="%APPDATA%\Claude\claude_desktop_config.json"
              />
              <CodeBlock label="JSON" code={MCP_REMOTE_JSON} />
            </Stack>

            <SuccessHint>After saving, restart Claude Desktop.</SuccessHint>
          </Stack>

          {/* Cursor / VS Code */}
          <Stack spacing={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Cursor / VS Code
              </Typography>
              <Typography
                sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
              >
                If you are using Cursor or the Claude Code VSCode extension, you
                can configure it globally or per-project.
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              <PlatformLabel>Project-Level (Claude Code extension)</PlatformLabel>
              <CodeBlock label="Code" code=".claude/mcp_settings.json" />
              <Typography sx={{ fontSize: "14px", color: "#535b5c", lineHeight: "normal" }}>
                For Cursor, use .cursor/mcp.json instead.
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <PlatformLabel>Global (Mac/Linux)</PlatformLabel>
              <CodeBlock label="Code" code="~/.claude/mcp_settings.json" />
            </Stack>

            <Stack spacing={1}>
              <PlatformLabel>Global (Windows)</PlatformLabel>
              <CodeBlock
                label="Code"
                code="%USERPROFILE%\.config\claude\config.json"
              />
              <CodeBlock label="JSON" code={MCP_JSON} />
            </Stack>

            <SuccessHint>
              Reload your editor window to apply changes.
            </SuccessHint>
          </Stack>
        </Stack>

        <Divider />

        {/* Verify Installation */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="Verify Installation" />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Make sure your AI can successfully talk to the BrandSync server.
            </Typography>
          </Box>

          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            Once configured, try sending one of these prompts to your AI
            assistant. A successful response returns a list of BrandSync
            component names. If you see an error or no response, double-check
            that your token is correct and the server URL matches exactly.
          </Typography>

          <Stack spacing={0.5}>
            <PlatformLabel>Desktop &amp; Editor Chat</PlatformLabel>
            <CodeBlock label="Code" code="List all BrandSync components" />
          </Stack>

          <Stack spacing={0.5}>
            <PlatformLabel>Terminal / CLI</PlatformLabel>
            <CodeBlock
              label="BASH"
              code={`claude chat "List all BrandSync components"`}
            />
          </Stack>
        </Stack>

        {/* Beta CTA */}
        {/* <BetaCtaBanner
          title="Help shape what comes next"
          description="You're in. Share your feedback and help us shape what BrandSync MCP becomes next."
          buttonText="Share beta feedback"
          show={isMcpBetaUser}
        /> */}

        <Divider />

        <PageNav
          prev={{
            href: "/mcp/getting-started/introduction",
            label: "Previous",
          }}
          next={{
            href: "/mcp/getting-started/understand-tokens",
            label: "Next: Understand Tokens",
          }}
        />
      </Stack>
    </Box>
  );
}
