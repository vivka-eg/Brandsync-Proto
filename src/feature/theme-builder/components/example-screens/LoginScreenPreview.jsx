"use client";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Link,
  useTheme,
} from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useState } from "react";
import colorPalettes from "brandsync-tokens/themebuilder.json";
import GenericLogo from "./GenericLogo";

// Reusable Input Field Component
const FormField = ({
  label,
  placeholder,
  type = "text",
  required = false,
  endAdornment,
  isDarkMode,
  neutralColorPalette,
  errorColorPalette,
  primaryColor,
  theme,
}) => {
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "15px",
      color: isDarkMode ? "#FFFFFF" : "text.primary",
      bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
      "& fieldset": {
        borderColor: isDarkMode
          ? neutralColorPalette[700]
          : neutralColorPalette[200],
      },
      "&:not(.Mui-focused):hover fieldset": {
        borderWidth: "1.5px",
        borderColor: primaryColor,
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
    },
  };

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "14px",
          mb: 1,
          color: !isDarkMode ? "text.primary" : "#fff",
        }}
      >
        {label}{" "}
        {required && (
          <span
            style={{
              color: isDarkMode
                ? errorColorPalette[300]
                : theme.palette.text.error,
            }}
          >
            *
          </span>
        )}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        type={type}
        variant="outlined"
        InputProps={endAdornment ? { endAdornment } : undefined}
        sx={inputStyles}
      />
    </Box>
  );
};

function LoginScreenPreview({
  device = "desktop",
  mode = "light",
  selectedColor,
  firstMatchingLogo,
}) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const primaryColorPalette = colorPalettes[selectedColor].shades;
  const neutralColorPalette = colorPalettes["neutral"].shades;
  const errorColorPalette = colorPalettes["error"].shades;
  const isDarkMode = mode === "dark";
  const primaryColor = isDarkMode
    ? primaryColorPalette[400]
    : primaryColorPalette[600];

  // Form fields configuration
  const formFields = [
    {
      label: "Name",
      placeholder: "John Doe",
      required: true,
    },
    {
      label: "Email",
      placeholder: "Eg: john@eg.dk",
      required: true,
    },
  ];

  // Buttons configuration
  const buttons = [
    {
      variant: "contained",
      text: "Sign In",
      bgcolor: primaryColor,
      color: isDarkMode ? "text.primary" : "#FFFFFF",
      extraCSS: {
        "&:hover": {
          bgcolor: isDarkMode
            ? primaryColorPalette[300]
            : primaryColorPalette[700],
          boxShadow: "none",
        },

        "&:active": {
          bgcolor: isDarkMode
            ? primaryColorPalette[200]
            : primaryColorPalette[800],
          boxShadow: "none",
        },

        "&:focus-visible": {
          bgcolor: isDarkMode
            ? primaryColorPalette[300]
            : primaryColorPalette[700],
          boxShadow: "none",
        },
      },
    },
    {
      variant: "outlined",
      text: "Sign In with SSO",
      borderColor: isDarkMode
        ? neutralColorPalette[500]
        : neutralColorPalette[300],
      color: isDarkMode ? "#fff" : "#1A1A1A",
      bgcolor: isDarkMode ? neutralColorPalette[800] : "neutral.container",
      extraCSS: {},
    },
  ];

  // Determine container width based on device
  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "400px";
      case "tablet":
        return "600px";
      case "desktop":
      default:
        return "100%";
    }
  };

  // Show image only on desktop
  const showImage = device === "desktop";

  return (
    <Box
      sx={{
        width: getDeviceWidth(),
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        bgcolor: mode === "dark" ? "background.paper" : "#FFFFFF",
        minHeight: device === "mobile" ? "auto" : "650px",
        border: "7px solid",
        borderColor: "neutral.border",
      }}
    >
      {/* Left Side - Image */}
      {showImage && (
        <Box
          sx={{
            flex: "0 0 45%",
            backgroundImage: `url('/theme-builder/example-screens/login-left.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding:
            device === "mobile"
              ? "20px 20px"
              : device === "tablet"
                ? "30px 30px"
                : "40px 40px",
          bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
          overflowY: "auto",
        }}
      >
        <Stack spacing={3}>
          {/* Logo */}
          <Box sx={{ mb: 1 }}>
            <GenericLogo selectedColor={selectedColor} mode={mode} />
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: device === "mobile" ? "30px" : "36px",
                lineHeight: 1.2,
                color: isDarkMode ? "#fff" : "text.primary",
                mb: 1.5,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              sx={{
                color: isDarkMode ? neutralColorPalette[200] : "#6B7280",
                fontSize: "16px",
                lineHeight: 1.5,
              }}
            >
              We're happy to have you back.
            </Typography>
          </Box>

          {/* Form Fields */}
          {formFields.map((field) => (
            <FormField
              key={field.label}
              {...field}
              isDarkMode={isDarkMode}
              neutralColorPalette={neutralColorPalette}
              errorColorPalette={errorColorPalette}
              primaryColor={primaryColor}
              theme={theme}
            />
          ))}

          {/* Password Field */}
          <FormField
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required={true}
            isDarkMode={isDarkMode}
            neutralColorPalette={neutralColorPalette}
            errorColorPalette={errorColorPalette}
            primaryColor={primaryColor}
            theme={theme}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{
                    color: mode === "dark" ? "text.secondary" : "#6B7280",
                  }}
                >
                  {showPassword ? (
                    <EyeSlash size={20} weight="regular" />
                  ) : (
                    <Eye size={20} weight="regular" />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Remember Password & Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: mode === "dark" ? "text.secondary" : "#D1D5DB",
                    "&.Mui-checked": {
                      color: primaryColor,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: !isDarkMode ? "text.primary" : "#fff",
                  }}
                >
                  Remember Password
                </Typography>
              }
            />
            <Link
              href="#"
              underline="always"
              sx={{
                color: primaryColor,
                fontSize: "14px",
                fontWeight: 500,
                textDecorationColor: primaryColor,
                // "&:hover": {
                //   color: "primary.dark",
                // },
                textUnderlineOffset: "6px",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Action Buttons */}
          {buttons.map((button, index) => (
            <Button
              disableRipple
              disableFocusRipple
              key={index}
              fullWidth
              variant={button.variant}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "16px",
                borderRadius: "8px",
                py: 1.75,
                mt: index === 0 ? 1 : 0,
                boxShadow: "none",
                bgcolor: button.bgcolor,
                color: button.color,
                borderColor: button.borderColor,
                ...button.extraCSS,
              }}
            >
              {button.text}
            </Button>
          ))}

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography
              component="span"
              sx={{
                fontSize: "14px",
                color: mode === "dark" ? "#DFE5E6" : "text.body",
              }}
            >
              Don't have an account?{" "}
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{
                fontSize: "14px",
                color: primaryColor,
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default LoginScreenPreview;
