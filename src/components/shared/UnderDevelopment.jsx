"use client";

import {
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { Wrench, Clock, Code } from "phosphor-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// You can use any of these Lottie animations (place in public/lottie/ folder)
// - construction.json
// - developer.json  
// - rocket.json
// - coming-soon.json

const UnderDevelopment = ({ 
  title = "Under Development",
  subtitle = "We're working hard to bring you something amazing!",
  description = "This page is currently under development. Please check back soon for updates.",
  animationData = null, // Pass your Lottie JSON data
  animationPath = "/lottie/under_construction.json", // Or path to Lottie file
  compact = false,
  showETA = false,
  eta = "Coming Soon"
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Default animation data if none provided
  const defaultAnimationData = {
    // Simple CSS animation fallback
    v: "5.7.1",
    fr: 30,
    ip: 0,
    op: 90,
    w: 400,
    h: 400,
    nm: "Construction",
    // ... you can add a simple Lottie animation here or use external file
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          py: 4,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.primary.main + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Wrench size={32} weight="duotone" />
              </Box>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {title}
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </motion.div>
          </Stack>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        // background: isDarkMode
        //   ? "linear-gradient(135deg, rgba(30, 41, 59, 0.1) 0%, rgba(15, 23, 42, 0.1) 100%)"
        //   : "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              backgroundColor: isDarkMode 
                ? "rgba(255, 255, 255, 0.02)" 
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
            }}
          >
            <Stack spacing={4} alignItems="center">
              {/* Lottie Animation */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    width: { xs: 200, md: 300 },
                    height: { xs: 200, md: 300 },
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {animationData || animationPath ? (
                    <Lottie
                      animationData={animationData}
                      path={!animationData ? animationPath : undefined}
                      loop={true}
                      autoplay={true}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    // Fallback CSS animation
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.palette.primary.main + "10",
                        borderRadius: 2,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <Code size={40} weight="duotone" />
                        </Box>
                      </motion.div>
                      
                      {/* Floating elements */}
                      <motion.div
                        animate={{
                          y: [-10, 10, -10],
                          x: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                        style={{
                          position: "absolute",
                          top: "20%",
                          right: "20%",
                        }}
                      >
                        <Wrench size={24} color={theme.palette.primary.main} weight="duotone" />
                      </motion.div>
                      
                      <motion.div
                        animate={{
                          y: [10, -10, 10],
                          x: [5, -5, 5],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                        style={{
                          position: "absolute",
                          bottom: "20%",
                          left: "20%",
                        }}
                      >
                        <Clock size={20} color={theme.palette.secondary.main} weight="duotone" />
                      </motion.div>
                    </Box>
                  )}
                </Box>
              </motion.div>

              {/* Content */}
              <Stack spacing={2} alignItems="center" maxWidth="600px">
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="text.primary"
                    sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {title}
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight={500}
                    sx={{ mb: 2 }}
                  >
                    {subtitle}
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6, maxWidth: "500px" }}
                  >
                    {description}
                  </Typography>
                </motion.div>

                {/* ETA Badge */}
                {showETA && (
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.main + "15",
                        border: `1px solid ${theme.palette.primary.main}30`,
                        mt: 2,
                      }}
                    >
                      <Clock size={16} color={theme.palette.primary.main} weight="bold" />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {eta}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Stack>

              {/* Progress Dots */}
              <motion.div variants={itemVariants}>
                <Stack direction="row" spacing={1}>
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: theme.palette.primary.main,
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UnderDevelopment;