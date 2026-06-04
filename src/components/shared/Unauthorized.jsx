"use client";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowLeft, HouseSimple } from "phosphor-react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Stop from "../../../public/lottie/stop.json";

function UnauthorizedPage() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}15 0%, 
          ${theme.palette.secondary.main}15 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: 480,
            position: "relative",
          }}
        >
          <Box
            sx={{
              padding: { xs: 3, sm: 4 },
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Decorative Elements */}
            <Box
              sx={{
                position: "absolute",
                top: -30,
                left: -30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: `linear-gradient(45deg, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
                zIndex: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Lottie Animation */}
              <Box
                sx={{
                  width: { xs: 160, sm: 200 },
                  height: { xs: 120, sm: 150 },
                  margin: "0 auto",
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <Lottie
                  animationData={Stop}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>

              {/* Error Code */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", sm: "4rem" },
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: { xs: 1, sm: 2 },
                  lineHeight: 1,
                }}
              >
                403
              </Typography>

              {/* Main Title */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  marginBottom: { xs: 1, sm: 2 },
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Access Denied
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  marginBottom: { xs: 3, sm: 4 },
                  lineHeight: 1.5,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  px: { xs: 1, sm: 2 },
                }}
              >
                You don't have permission to access this page.
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<HouseSimple size={18} weight="duotone" />}
                  onClick={handleGoHome}
                  sx={{
                    borderRadius: 3,
                    padding: { xs: "10px 20px", sm: "12px 24px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    minWidth: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Go Home
                </Button>

                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<ArrowLeft size={18} weight="duotone" />}
                  onClick={handleGoBack}
                  sx={{
                    borderRadius: 3,
                    padding: { xs: "10px 20px", sm: "12px 24px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                    borderWidth: 2,
                    minWidth: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Go Back
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default UnauthorizedPage;