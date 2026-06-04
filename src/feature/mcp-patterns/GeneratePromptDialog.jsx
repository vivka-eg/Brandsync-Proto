"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { keyframes } from "@emotion/react";
import { X, Sparkle, CaretDown, Plus } from "phosphor-react";
import { getComponent } from "@/api/mcp/client/components";
import { BRAND_TOKENS, FRAMEWORKS } from "./brandTokens";

const pulseA = keyframes`
  0%, 100% { transform: scale(0.85); opacity: 0.5; }
  50%      { transform: scale(1.15); opacity: 1;   }
`;
const pulseB = keyframes`
  0%, 100% { transform: scale(1.1);  opacity: 1;   }
  50%      { transform: scale(0.8);  opacity: 0.45; }
`;

const StarIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#A9ACB1">
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
  </svg>
);

export default function GeneratePromptDialog({ open, onClose, pattern, activeDevice = "desktop" }) {
  const [framework, setFramework] = useState("Angular");
  const [brandToken, setBrandToken] = useState("Blue");
  const [dialogButtonHovered, setDialogButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const screenshotUrl = pattern?.screenshots?.find((s) => s.platform === activeDevice.toUpperCase())?.url;
  const selectedBrand = BRAND_TOKENS.find((b) => b.label === brandToken);

  async function handleGenerate() {
    setIsLoading(true);
    try {
      const [res] = await Promise.all([
        getComponent(pattern?.id),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
      const backendPrompt = res?.data?.prompt ?? "";
      const dynamicSuffix = `\n\nBuild this using ${framework}. Apply the ${brandToken} brand color across the UI.`;
      setResult(backendPrompt + dynamicSuffix);
    } catch {
      setResult(`Use ${framework} and ${brandToken} brand token.`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack() {
    setResult(null);
  }

  function handleCopy() {
    if (result) navigator.clipboard.writeText(result);
  }

  function handleClose() {
    setIsLoading(false);
    setResult(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "22px",
            p: 0,
            width: 779,
            height: 540,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-0.942px 3.768px 5.652px 0 rgba(0,0,0,0.12)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: "40px 30px 45px 45px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          gap: "30px",
          "&:first-of-type": { pt: "40px" },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "action.active" }}>
            {pattern?.title}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ bgcolor: "#f0f0f0", borderRadius: 1.5, p: "12px", "&:hover": { bgcolor: "#e0e0e0" } }}
          >
            <X size={18} color="#121212" />
          </IconButton>
        </Box>

        {result ? (
          /* Result state */
          <>
            <Box
              sx={{
                width: "100%",
                flex: 1,
                minHeight: 0,
                bgcolor: "#111111",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button
                size="small"
                onClick={handleCopy}
                sx={{
                  position: "absolute", top: 12, right: 19, zIndex: 1,
                  textTransform: "none", bgcolor: "rgba(234,234,235,0.9)", color: "text.primary",
                  borderRadius: "8px", fontSize: "0.8rem", px: 1.5, py: 0.5,
                  "&:hover": { bgcolor: "rgba(234,234,235,1)" },
                }}
              >
                Copy
              </Button>
              <Box sx={{ overflowY: "auto", flex: 1, p: 3 }}>
                <Typography
                  component="pre"
                  sx={{
                    color: "white", fontFamily: "monospace", fontSize: "0.85rem",
                    whiteSpace: "pre-wrap", wordBreak: "break-word", m: 0, pt: 5,
                  }}
                >
                  {result}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%", mt: "auto" }}>
              <Button
                variant="outlined"
                onClick={handleGoBack}
                sx={{
                  textTransform: "none", bgcolor: "background.primary", borderColor: "#A9ACB1",
                  color: "text.primary", borderRadius: "12px", fontWeight: 500, fontSize: "1rem",
                  px: 2, py: 1.5, boxShadow: "none",
                  "&:hover": { bgcolor: "#DCDCDC", borderColor: "#A9ACB1", boxShadow: "none" },
                }}
              >
                Go back
              </Button>
              <Button
                variant="contained"
                onClick={handleCopy}
                sx={{
                  textTransform: "none", bgcolor: "#1C2333", color: "white",
                  borderRadius: "12px", fontWeight: 500, fontSize: "1rem",
                  px: 4, py: 1.5, boxShadow: "none",
                  "&:hover": { bgcolor: "#1C2333", boxShadow: "none" },
                }}
              >
                Copy
              </Button>
            </Box>
          </>
        ) : isLoading ? (
          /* Loading state */
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flex: 1, gap: 3 }}>
            <Box sx={{ position: "relative", width: 100, height: 80 }}>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, animation: `${pulseA} 1.6s ease-in-out infinite` }}>
                <StarIcon size={70} />
              </Box>
              <Box sx={{ position: "absolute", top: 0, right: 0, animation: `${pulseB} 1.6s ease-in-out infinite` }}>
                <StarIcon size={32} />
              </Box>
            </Box>
            <Typography sx={{ color: "#A9ACB1", fontSize: "1rem", fontWeight: 400 }}>
              Thinking...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Body */}
            <Box sx={{ display: "flex", gap: "30px", width: "100%", alignItems: "flex-start" }}>
              {/* Left: screenshot */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "neutral.border",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6.67px",
                }}
              >
                {screenshotUrl ? (
                  <Box
                    component="img"
                    src={screenshotUrl}
                    alt={pattern?.title}
                    sx={{
                      width: "100%",
                      display: "block",
                      borderRadius: "8px",
                      ...(activeDevice === "tablet" && { maxWidth: "85%" }),
                      ...(activeDevice === "mobile" && { maxWidth: 100 }),
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.disabled">
                    No preview available
                  </Typography>
                )}
              </Box>

              {/* Right: selectors */}
              <Box sx={{ width: 270, display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 }}>
                {/* Framework */}
                <Box>
                  <Typography sx={{ mb: 1, fontSize: "15.073px", fontWeight: 600, color: "text.body", lineHeight: "22.609px" }}>
                    Select Framework
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={framework}
                      onChange={(e) => setFramework(e.target.value)}
                      IconComponent={(props) => <CaretDown size={16} {...props} />}
                      sx={{
                        borderRadius: 2,
                        "& .MuiSelect-select": { py: "7.54px", px: "11.3px" },
                      }}
                      renderValue={(val) => (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              border: "2px solid #A9ACB1",
                              flexShrink: 0,
                            }}
                          />
                          <Typography sx={{ fontSize: "15.073px", fontWeight: 400, color: "text.body", lineHeight: "22.609px" }}>{val}</Typography>
                        </Box>
                      )}
                    >
                      {FRAMEWORKS.map((f) => (
                        <MenuItem key={f} value={f}>
                          {f}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText>Select your preferred Frontend Framework</FormHelperText>
                </Box>

                {/* Brand Token */}
                <Box>
                  <Typography sx={{ mb: 1, fontSize: "15.073px", fontWeight: 600, color: "text.body", lineHeight: "22.609px" }}>
                    Select Brand Token
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={brandToken}
                      onChange={(e) => setBrandToken(e.target.value)}
                      IconComponent={(props) => <CaretDown size={16} {...props} />}
                      sx={{
                        borderRadius: 2,
                        "& .MuiSelect-select": { py: "7.54px", px: "11.3px" },
                      }}
                      renderValue={(val) => (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              bgcolor: selectedBrand?.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography sx={{ fontSize: "15.073px", fontWeight: 400, color: "text.body", lineHeight: "22.609px" }}>{val}</Typography>
                        </Box>
                      )}
                    >
                      {BRAND_TOKENS.map((b) => (
                        <MenuItem key={b.label} value={b.label}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: b.color, flexShrink: 0 }}
                            />
                            {b.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText>Select your preferred Brand Color</FormHelperText>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%", mt: "auto" }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  textTransform: "none",
                  bgcolor: "background.primary",
                  borderColor: "#A9ACB1",
                  color: "text.primary",
                  borderRadius: "12px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  px: 2,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#DCDCDC", borderColor: "#A9ACB1", boxShadow: "none" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleGenerate}
                startIcon={
                  <Box sx={{ position: "relative", width: 20, height: 20, overflow: "hidden", display: "flex", alignItems: "center" }}>
                    <Box sx={{
                      position: "absolute", top: 0, left: 0, lineHeight: 0,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                      transform: dialogButtonHovered ? "translateY(-100%)" : "translateY(0)",
                      opacity: dialogButtonHovered ? 0 : 1,
                    }}>
                      <Sparkle size={20} color="white" />
                    </Box>
                    <Box sx={{
                      position: "absolute", top: 0, left: 0, lineHeight: 0,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                      transform: dialogButtonHovered ? "translateY(0)" : "translateY(100%)",
                      opacity: dialogButtonHovered ? 1 : 0,
                    }}>
                      <Plus size={20} color="white" />
                    </Box>
                  </Box>
                }
                onMouseEnter={() => setDialogButtonHovered(true)}
                onMouseLeave={() => setDialogButtonHovered(false)}
                sx={{
                  textTransform: "none",
                  bgcolor: "#1C2333",
                  color: "white",
                  borderRadius: "12px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  px: 4,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1C2333", boxShadow: "none" },
                }}
              >
                Generate Prompt
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
