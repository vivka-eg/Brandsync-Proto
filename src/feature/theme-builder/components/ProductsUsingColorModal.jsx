"use client";
import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Link from "next/link";
import { getStrapiURL } from "@/strapi/utils";

function ProductsUsingColorModal({
  open,
  onClose,
  selectedColor,
  matchingLogos,
}) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="products-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "800px" },
          maxHeight: "85vh",
          bgcolor: "#FFFFFF",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box>
            <Typography
              id="products-modal-title"
              variant="h6"
              sx={{ fontWeight: 600, color: "#111827" }}
            >
              Products using {selectedColor} palette
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
              {matchingLogos.length} product
              {matchingLogos.length !== 1 ? "s" : ""} found
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#6B7280",
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <Tooltip title="Close">
              <Close />
            </Tooltip>
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {matchingLogos.length > 0 ? (
            <Grid container spacing={2}>
              {matchingLogos.map((logo) => (
                <Grid item xs={6} sm={4} md={3} key={logo.id}>
                  {/* <Link
                    href={`/logos?product=${encodeURIComponent(logo.Name)}`}
                    style={{ textDecoration: "none" }}
                  > */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#F9FAFB",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        borderColor: "#3B82F6",
                        backgroundColor: "#EFF6FF",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                      },
                    }}
                  >
                    {/* Logo Preview */}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 2,
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <Box
                        component="img"
                        src={getStrapiURL(logo.Assets.Logo)}
                        alt={logo.Name}
                        sx={{
                          maxWidth: 40,
                          maxHeight: 40,
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    {/* Logo Name */}
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#374151",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {logo.name}
                    </Typography>
                  </Paper>
                  {/* </Link> */}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
              }}
            >
              <Typography sx={{ color: "#6B7280", fontSize: "0.95rem" }}>
                No products currently use the {selectedColor} color palette.
              </Typography>
              <Link
                href="/logos"
                style={{
                  color: "#3B82F6",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  marginTop: "12px",
                  display: "inline-block",
                }}
              >
                Browse all products →
              </Link>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
            textAlign: "center",
          }}
        >
          <Link
            href="/logos"
            style={{
              color: "#3B82F6",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all EG product logos →
          </Link>
        </Box>
      </Box>
    </Modal>
  );
}

export default ProductsUsingColorModal;
