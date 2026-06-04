"use client";

import { Button, useTheme } from "@mui/material";

const buttonColors = {
  light: {
    primary: {
      enabled: { bg: "#29303B", color: "#FFFFFF" },
      hover: { bg: "#344054" },
      focus: { outline: "2px solid #FFFFFF" },
      pressed: { bg: "#101828" },
      disabled: { bg: "#EAECF0", color: "#98A2B3" },
    },
    secondary: {
      enabled: {
        bg: "transparent",
        border: "1px solid #D0D5DD",
        color: "#344054",
      },
      hover: { bg: "#F2F4F7" },
      focus: { outline: "2px solid #101828" },
      pressed: { bg: "#EAECF0" },
      disabled: {
        bg: "transparent",
        border: "1px solid #D0D5DD",
        color: "#D0D5DD",
      },
    },
    destructive: {
      enabled: { bg: "#DC2626", color: "#FFFFFF" },
      hover: { bg: "#B91C1C" },
      focus: { outline: "2px solid #FCA5A5" },
      pressed: { bg: "#991B1B" },
      disabled: { bg: "#FECACA", color: "#F87171" },
    },
    destructiveSecondary: {
      enabled: {
        bg: "transparent",
        border: "1px solid #DC2626",
        color: "#DC2626",
      },
      hover: { bg: "#FEF2F2" },
      focus: { outline: "2px solid #FCA5A5" },
      pressed: { bg: "#FEE2E2" },
      disabled: {
        bg: "transparent",
        border: "1px solid #FECACA",
        color: "#F87171",
      },
    },
  },
  dark: {
    primary: {
      enabled: { bg: "#344054", color: "#FFFFFF" },
      hover: { bg: "#475467" },
      focus: { outline: "2px solid #FFFFFF" },
      pressed: { bg: "#1D2939" },
      disabled: { bg: "#475467", color: "#98A2B3" },
    },
    secondary: {
      enabled: {
        bg: "transparent",
        border: "1px solid #475467",
        color: "#F2F4F7",
      },
      hover: { bg: "#1D2939" },
      focus: { outline: "2px solid #F2F4F7" },
      pressed: { bg: "#101828" },
      disabled: {
        bg: "transparent",
        border: "1px solid #475467",
        color: "#475467",
      },
    },
    destructive: {
      enabled: { bg: "#DC2626", color: "#FFFFFF" },
      hover: { bg: "#EF4444" },
      focus: { outline: "2px solid #F87171" },
      pressed: { bg: "#B91C1C" },
      disabled: { bg: "#7F1D1D", color: "#991B1B" },
    },
    destructiveSecondary: {
      enabled: {
        bg: "transparent",
        border: "1px solid #DC2626",
        color: "#F87171",
      },
      hover: { bg: "#7F1D1D" },
      focus: { outline: "2px solid #F87171" },
      pressed: { bg: "#991B1B" },
      disabled: {
        bg: "transparent",
        border: "1px solid #7F1D1D",
        color: "#7F1D1D",
      },
    },
  },
};

function CustomIconButton({
  Icon,
  text,
  startIcon = true,
  variant = "primary", // 'primary', 'secondary', 'destructive', or 'destructiveSecondary'
  onClick,
  disabled = false,
  sx = {},
  onlyIcon = false,
  ...props
}) {
  const theme = useTheme();

  const colors = buttonColors[theme.palette.mode][variant];

  const styles = {
    textTransform: "none",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "16px",
    padding: "12px",
    paddingRight: onlyIcon ? "12px" : "24px",
    gap: "8px",
    minHeight: "48px",
    backgroundColor: disabled ? colors.disabled.bg : colors.enabled.bg,
    color: disabled ? colors.disabled.color : colors.enabled.color,
    border: disabled
      ? colors.disabled.border || "none"
      : colors.enabled.border || "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: disabled ? undefined : colors.hover.bg,
      transform: disabled ? "none" : "translateY(-1px)",
      boxShadow: disabled 
        ? "none" 
        : variant.includes("destructive")
        ? "0 4px 12px rgba(220, 38, 38, 0.25)"
        : "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    "&.Mui-focusVisible": {
      outline: disabled ? "none" : colors.focus.outline,
      outlineOffset: "2px",
    },
    "&:active": {
      backgroundColor: disabled ? undefined : colors.pressed.bg,
      transform: disabled ? "none" : "translateY(0)",
    },
    // Special styling for destructive variants
    ...(variant.includes("destructive") && {
      "&:hover": {
        backgroundColor: disabled ? undefined : colors.hover.bg,
        transform: disabled ? "none" : "translateY(-1px)",
        boxShadow: disabled 
          ? "none" 
          : "0 4px 12px rgba(220, 38, 38, 0.3)",
      },
    }),
    ...sx,
  };

  return (
    <Button
      startIcon={startIcon && !onlyIcon ? <Icon size="20px" /> : null}
      endIcon={!startIcon && !onlyIcon ? <Icon size="20px" /> : null}
      onClick={onClick}
      disabled={disabled}
      sx={styles}
      disableElevation
      focusRipple
      {...props}
    >
      {onlyIcon ? <Icon size="20px" /> : text}
    </Button>
  );
}

export default CustomIconButton;