"use client";
import { Box, Container, Typography } from "@mui/material";

function ComingSoon({ pageName }) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "text.primary",
          }}
        >
          Coming Soon
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
          }}
        >
          {pageName} features are under development
        </Typography>
      </Box>
    </Container>
  );
}

export default ComingSoon;
