"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import {
  CaretDown,
  Desktop,
  DeviceTablet,
  DeviceMobileCamera,
  Copy,
} from "phosphor-react";
import { getComponent } from "@/api/mcp/client/components";
import PatternCardImageDummy from "./PatternCardImageDummy";
import { BRAND_TOKENS, FRAMEWORKS } from "./brandTokens";
import PatternImagePreviewer from "./PatternImagePreviewer";

const DEVICE_TABS = [
  { id: "desktop", label: "Desktop", Icon: Desktop },
  { id: "tablet", label: "Tablet", Icon: DeviceTablet },
  { id: "mobile", label: "Mobile", Icon: DeviceMobileCamera },
];

export default function PatternDetailView({
  category,
  subCategory,
  pattern,
  onBack,
}) {
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [framework, setFramework] = useState("Angular");
  const [brandToken, setBrandToken] = useState("Blue");
  const [basePrompt, setBasePrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(true);

  const screenshotUrl = pattern?.screenshots?.find(
    (s) => s.platform === activeDevice.toUpperCase(),
  )?.url;

  function handleDeviceChange(id) {
    if (id === activeDevice) return;
    setActiveDevice(id);
  }

  const selectedBrand = BRAND_TOKENS.find((b) => b.label === brandToken);

  useEffect(() => {
    if (!pattern?.id) return;
    setPromptLoading(true);
    getComponent(pattern.id)
      .then((res) => setBasePrompt(res?.data?.prompt ?? ""))
      .catch(() => setBasePrompt(""))
      .finally(() => setPromptLoading(false));
  }, [pattern?.id]);

  const frameworkInstruction =
    framework === "Other"
      ? "Identify the framework from the project structure and build this accordingly."
      : `Build this using ${framework}.`;
  const result =
    basePrompt +
    `\n\n${frameworkInstruction} Apply the ${brandToken} brand color across the UI.`;

  function handleCopy() {
    navigator.clipboard.writeText(result);
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <Typography
          component="span"
          variant="body2"
          onClick={onBack}
          sx={{
            color: "primary.main",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {category?.name}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {">"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subCategory?.name ?? ""}
        </Typography>
      </Box>

      {/* Title */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {pattern?.title}
      </Typography>

      {/* Device tabs + fullscreen */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            bgcolor: "neutral.container",
            p: 1,
            borderRadius: 4,
          }}
        >
          {DEVICE_TABS.map(({ id, label, Icon }) => {
            const active = id === activeDevice;
            return (
              <Button
                key={id}
                size="small"
                variant={active ? "contained" : "outlined"}
                startIcon={<Icon size={14} />}
                onClick={() => handleDeviceChange(id)}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  fontSize: "0.78rem",
                  fontWeight: active ? 600 : 400,
                  py: 0.5,
                  px: 1.5,
                  boxShadow: "none",
                  border: "none",
                  color: active ? "white" : "text.secondary",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        {/* <IconButton
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={() => onBack()}
        >
          <ArrowsOut size={18} />
        </IconButton> */}
      </Box>

      {/* Preview */}
      {screenshotUrl ? (
        <PatternImagePreviewer
          src={screenshotUrl}
          alt={pattern?.title}
          activeDevice={activeDevice}
          sx={{ mb: 3 }}
        />
      ) : (
        <Box sx={{ mb: 3 }}>
          <PatternCardImageDummy label={pattern?.title} />
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Prompt section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Copy Prompt
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Copy a BrandSync MCP prompt tailored to your selected framework and
        brand color
      </Typography>

      {/* Selectors */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
            Select your Brand Color
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={brandToken}
              onChange={(e) => {
                setBrandToken(e.target.value);
              }}
              IconComponent={(props) => <CaretDown size={14} {...props} />}
              sx={{ borderRadius: 1.5 }}
              renderValue={(val) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: selectedBrand?.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">{val}</Typography>
                </Box>
              )}
            >
              {BRAND_TOKENS.map((b) => (
                <MenuItem key={b.label} value={b.label}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: b.color,
                        flexShrink: 0,
                      }}
                    />
                    {b.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
            Select your Framework
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={framework}
              onChange={(e) => {
                setFramework(e.target.value);
              }}
              IconComponent={(props) => <CaretDown size={14} {...props} />}
              sx={{ borderRadius: 1.5 }}
            >
              {FRAMEWORKS.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Dark prompt box */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#111111",
          borderRadius: 2,
          minHeight: 180,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {promptLoading ? (
          <Box
            sx={{
              flex: 1,
              p: 2.5,
              filter: "blur(3px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <Typography
              component="pre"
              sx={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                whiteSpace: "pre-wrap",
                m: 0,
              }}
            >
              {`Loading prompt for ${framework} with ${brandToken} brand color...`}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Copy icon button */}
            <Tooltip title="Copy prompt" placement="left">
              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  zIndex: 1,
                  bgcolor: "rgba(234,234,235,0.12)",
                  color: "white",
                  borderRadius: 1,
                  p: "6px",
                  "&:hover": { bgcolor: "rgba(234,234,235,0.22)" },
                }}
              >
                <Copy size={16} />
              </IconButton>
            </Tooltip>

            {/* Prompt text */}
            <Box sx={{ p: 2.5, pt: 2 }}>
              <Typography
                component="pre"
                sx={{
                  color: "white",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  m: 0,
                }}
              >
                {result}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
