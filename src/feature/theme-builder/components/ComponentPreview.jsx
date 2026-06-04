"use client";
import React from "react";
import { Box, Paper, Radio, Stack, Typography } from "@mui/material";
import LoginForm from "./component-previews/LoginForm";
import CookieSettings from "./component-previews/CookieSettings";
import InviteMembers from "./component-previews/InviteMembers";
import DataTable from "./component-previews/DataTable";

function ComponentPreview({ primaryColor = "#3B82F6" }) {
  return (
    <Box
      key={primaryColor}
      sx={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          animation: "shimmerComponents 0.8s ease-out forwards",
          pointerEvents: "none",
          zIndex: 10,
        },
        "@keyframes shimmerComponents": {
          "0%": {
            left: "-100%",
          },
          "100%": {
            left: "100%",
          },
        },
      }}
    >
      {/* Component Preview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#6B7280",
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
          }}
        >
          Component Preview
        </Typography>

        {/* Buttons & Chips Row */}
        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <ButtonStates primaryColor={primaryColor} />
          <ChipsSection primaryColor={primaryColor} />
        </Box> */}

        {/* Color Application */}
        {/* <Box>
          <ColorWeightSection primaryColor={primaryColor} />
        </Box> */}
      </Box>

      {/* Application Screens Section */}
      <Box>
        {/* Login, Cookie, Invite Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LoginForm primaryColor={primaryColor} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CookieSettings primaryColor={primaryColor} />
            <Stack gap={2}>
              <InviteMembers primaryColor={primaryColor} />
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 4,
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: `${primaryColor}08`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Radio
                    checked
                    sx={{
                      "&.Mui-checked": {
                        color: primaryColor, // checked color
                      },
                      p: 0,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                      Starter Plan
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "#6B7280" }}>
                      For small businesses
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>

        {/* Data Table */}
        <Box sx={{ mb: 3 }}>
          <DataTable primaryColor={primaryColor} />
        </Box>

        {/* Stepper Form */}
        {/* <Box sx={{ mb: 3 }}>
          <StepperForm primaryColor={primaryColor} />
        </Box> */}

        {/* Chat - Full Width */}
        {/* <Box sx={{ mb: 3 }}>
          <ChatMessaging primaryColor={primaryColor} />
        </Box> */}

        {/* Empty State & Error Page Row */}
        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <EmptyState primaryColor={primaryColor} />
          <ErrorPage primaryColor={primaryColor} />
        </Box> */}
      </Box>
    </Box>
  );
}

export default ComponentPreview;
