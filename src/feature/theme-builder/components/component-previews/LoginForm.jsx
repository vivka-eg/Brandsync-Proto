"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = ({ primaryColor }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const inputStyles = {
    // default border
    "& fieldset": {
      borderColor: "neutral.main",
    },

    // hover
    "&:hover fieldset": {
      borderColor: primaryColor,
    },

    // // focus
    // "&.Mui-focused fieldset": {
    //   borderColor: primaryColor,
    //   borderWidth: 2,
    // },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        minWidth: 360,
        height: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#111827", mb: 2.5 }}
      >
        Login
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "text.primary",
            mb: 0.5,
          }}
        >
        
          Email{" "}
            <Box component="span" sx={{ color: "text.error" }}>
            *
          </Box>
        </Typography>
        <TextField
          fullWidth
          placeholder="Eg: john@eg.dk"
          size="small"
          sx={{
            backgroundColor: "neutral.light",
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              ...inputStyles,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "text.primary",
            mb: 0.5,
          }}
        >
         
          Password {" "}
           <Box component="span" sx={{ color: "text.error" }}>
            *
          </Box>
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          defaultValue="password"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              ...inputStyles,
            },
            backgroundColor: "neutral.light",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              size="medium"
              sx={{
                // color: primaryColor, // unchecked
                "&.Mui-checked": {
                  color: primaryColor, // checked
                },
              }}
              disableRipple
              disableFocusRipple
            />
          }
          label={
            <Typography sx={{ fontSize: "0.875rem", color: "#374151", whiteSpace: "nowrap" }}>
              Remember Password
            </Typography>
          }
        />
        <Link
          href="#"
          sx={{
            fontSize: "0.875rem",
            color: primaryColor,
            textDecoration: "none",
            whiteSpace: "nowrap",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Forgot Password?
        </Link>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          mb: 1.5,
          p: "12px 16px",
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
          backgroundColor: primaryColor,
          "&:hover": {
            backgroundColor: primaryColor,
            opacity: 0.9,
          },
          "&:focus-visible": {
            outline: "2px solid " + primaryColor,
          },
        }}
        disableFocusRipple
      >
        Sign In
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          mb: 2.5,
          p: "12px 16px",
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
          borderColor: "#D1D5DB",
          color: "#374151",
          "&:hover": {
            borderColor: "#9CA3AF",
            backgroundColor: "#F9FAFB",
          },
          "&:focus-visible": {
            outline: "2px solid " + primaryColor,
          },
        }}
        disableFocusRipple
      >
        Sign In with SSO
      </Button>

      <Typography
        sx={{ textAlign: "center", fontSize: "0.875rem", color: "#6B7280" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="#"
          onClick={(e) => e.preventDefault()}
          sx={{
            color: primaryColor,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign Up
        </Link>
      </Typography>
    </Paper>
  );
};

export default LoginForm;
