"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { MagnifyingGlass, Plus } from "phosphor-react";

export default function PatternHeroSection({ search, onSearchChange, canManage, onUpload }) {
  return (
    <>
      {/* Big hero */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 2, md: 3 },
          pb: { xs: 1, md: 2 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              mb: 2,
              color: "text.primary",
              fontFamily: "Roboto, sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              lineHeight: "48px",
              textAlign: "center",
            }}
          >
            Generate production-ready UI
            <br />
            for your framework in minutes
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 6,
              maxWidth: 520,
              mx: "auto",
              color: "text.body",
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            Generate product UI aligned to your framework and BrandSync tokens;
            in minutes. Powered by BrandSync MCP. Just install and connect
          </Typography>
        </Container>
      </Box>

      {/* Upload button */}
      {canManage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Plus size={16} />}
            onClick={onUpload}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2.5,
              py: 1,
              boxShadow: "none",
            }}
          >
            Upload Pattern
          </Button>
        </Box>
      )}

      {/* Patterns search section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "15px 12px",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
          borderRadius: "17px",
          bgcolor: "#F4F5F5",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "14.44px" }}>
          <Typography
            sx={{
              color: "text.primary",
              textAlign: "center",
              fontFamily: "Roboto, sans-serif",
              fontSize: "21.667px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "25.278px",
            }}
          >
            Brandsync UI Patterns
          </Typography>
          <Typography
            sx={{
              color: "text.body",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14.445px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21.667px",
            }}
          >
            Find Dashboard UI Patterns below
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            px: 1.5,
            py: 0.75,
            bgcolor: "background.paper",
            width: "100%",
          }}
        >
          <Box component="span" sx={{ color: "text.body", lineHeight: 0 }}>
            <MagnifyingGlass size={16} color="currentColor" />
          </Box>
          <InputBase
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            sx={{
              flex: 1,
              fontFamily: "Roboto, sans-serif",
              fontSize: "14.282px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21.423px",
              color: "text.body",
              "& ::placeholder": { color: "text.body", opacity: 1 },
            }}
            inputProps={{ "aria-label": "Search patterns" }}
          />
        </Box>
      </Box>
    </>
  );
}
