"use client";
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { X, CheckCircle, Warning, Info, XCircle } from "phosphor-react";
import Lottie from "lottie-react";

function Toast({
  open = false,
  onClose,
  message,
  title,
  type = "info", // 'success', 'error', 'warning', 'info'
  duration = 6000,
  position = { vertical: "bottom", horizontal: "right" },
  showIcon = true,
  showCloseButton = true,
  /** Public URL to a Lottie JSON (e.g. `/animations/foo.json`); replaces the severity icon when set. */
  lottiePath,
  action,
  /** Outlined + paper background reads as a white/light card in both themes. */
  variant = "outlined",
}) {
  const getIcon = () => {
    const iconProps = { size: 20, weight: "fill" };

    switch (type) {
      case "success":
        return <CheckCircle {...iconProps} />;
      case "error":
        return <XCircle {...iconProps} />;
      case "warning":
        return <Warning {...iconProps} />;
      case "info":
      default:
        return <Info {...iconProps} />;
    }
  };

  const renderIcon = () => {
    if (!showIcon) return false;
    if (lottiePath) {
      return (
        <Box
          aria-hidden
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Lottie
            path={lottiePath}
            loop
            autoplay
            style={{ width: 32, height: 32 }}
          />
        </Box>
      );
    }
    return getIcon();
  };

  const showActionSlot = Boolean(action) || showCloseButton;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
      sx={{
        "& .MuiSnackbarContent-root": {
          padding: 0,
        },
      }}
    >
      <Alert
        severity={type}
        variant={variant}
        icon={renderIcon()}
        action={
          showActionSlot ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {action}
              {showCloseButton && (
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: (t) => alpha(t.palette.action.active, 0.08),
                    },
                  }}
                >
                  <X size={16} weight="bold" />
                </IconButton>
              )}
            </Box>
          ) : null
        }
        sx={{
          alignItems: "center",
          borderRadius: "6px",
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 8px 28px rgba(0,0,0,0.45)"
              : "0 8px 32px rgba(0, 0, 0, 0.12)",
          bgcolor: (t) => (t.palette.mode === "light" ? "#ffffff" : t.palette.grey[900]),
          color: "text.primary",
          borderColor: "divider",
          minWidth: "320px",
          maxWidth: "500px",
          py: 1.25,
          "& .MuiAlert-message": {
            padding: title ? "4px 0" : "2px 0",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
          "& .MuiAlert-icon": {
            marginRight: "12px",
            padding: 0,
            alignSelf: "center",
          },
          "& .MuiAlert-action": {
            marginRight: "8px",
            padding: 0,
            alignSelf: "center",
          },
        }}
      >
        {title && (
          <AlertTitle
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            {title}
          </AlertTitle>
        )}
        <Typography
          variant="body1"
          component="div"
          sx={{
            fontSize: "16px",
            lineHeight: 1.45,
            color: "inherit",
          }}
        >
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

export default Toast;