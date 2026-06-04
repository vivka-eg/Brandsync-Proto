"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Stack, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { Home, ArrowBack, Search, Palette, DesignServices, Image, TextFields, CloudUpload, Extension, MenuBook, Map, Build, HelpOutline, SupportAgent } from "@mui/icons-material";
import { motion } from "framer-motion";

// Lottie Animation Component
const LottieAnimation = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let lottie;
    
    // Dynamically import lottie-web to avoid SSR issues
    const loadLottie = async () => {
      try {
        const lottieModule = await import('lottie-web');
        lottie = lottieModule.default;
        
        if (containerRef.current && !animationRef.current) {
          console.log('Loading 404 Lottie animation from:', '/lottie/404-page-not-found.json');
          
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/404-page-not-found.json',
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid meet'
            }
          });

          // Handle animation events
          animationRef.current.addEventListener('DOMLoaded', () => {
            console.log('404 Lottie animation loaded successfully');
            setIsLoaded(true);
          });

          animationRef.current.addEventListener('data_ready', () => {
            console.log('404 Lottie animation data ready');
            setIsLoaded(true);
          });

          animationRef.current.addEventListener('error', (error) => {
            console.error('404 Lottie animation error:', error);
            setHasError(true);
          });

          // Fallback timeout in case events don't fire
          setTimeout(() => {
            if (!isLoaded && !hasError) {
              console.log('404 Lottie animation loaded via timeout fallback');
              setIsLoaded(true);
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
        setHasError(true);
      }
    };

    loadLottie();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [isLoaded, hasError]);

  // Fallback animation using CSS if Lottie fails
  if (hasError) {
    return (
      <Box
        sx={{
          width: { xs: 300, sm: 400, md: 500 },
          height: { xs: 200, sm: 300, md: 400 },
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
          color: 'primary.main',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(0)',
            },
            '40%': {
              transform: 'translateY(-30px)',
            },
            '60%': {
              transform: 'translateY(-15px)',
            },
          },
        }}
      >
        🤖
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: { xs: 300, sm: 400, md: 500 },
        height: { xs: 200, sm: 300, md: 400 },
        maxWidth: '100%',
        margin: '0 auto',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    />
  );
};

// Animated components
const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);

export default function NotFound() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ height: '100%' }}>
        <MotionBox
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* Lottie Animation */}
        <MotionBox variants={itemVariants}>
          <LottieAnimation />
        </MotionBox>
       
        {/* Main Message */}
        <MotionTypography
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
          }}
          variants={itemVariants}
        >
          Oops! Page Not Found
        </MotionTypography>

        {/* Description */}
        <MotionTypography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' },
            color: 'text.secondary',
            maxWidth: 600,
            mb: 4,
            lineHeight: 1.6,
          }}
          variants={itemVariants}
        >
          The page you&apos;re looking for seems to have wandered off into the digital void. 
          Don&apos;t worry though – our design system is still here to help you find your way back!
        </MotionTypography>

        {/* Action Buttons */}
        <MotionBox variants={itemVariants}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <MotionButton
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => router.push('/')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Go Home
            </MotionButton>

            <MotionButton
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Go Back
            </MotionButton>

            <MotionButton
              variant="text"
              size="large"
              startIcon={<Search />}
              onClick={() => router.push('/design-system')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Browse Design System
            </MotionButton>
          </Stack>
        </MotionBox>

        {/* Helpful Links */}
        <MotionBox
          variants={itemVariants}
          sx={{ mt: 6, width: '100%', maxWidth: 700 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Looking for something specific? Try these sections:
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
              gap: 1.5,
            }}
          >
            {[
              { label: 'Design System', path: '/design-system', icon: <DesignServices fontSize="small" /> },
              { label: 'Components', path: '/design-system/components', icon: <Extension fontSize="small" /> },
              { label: 'Brand Guidelines', path: '/brand-guideline', icon: <MenuBook fontSize="small" /> },
              { label: 'Logos', path: '/logos', icon: <TextFields fontSize="small" /> },
              { label: 'Digital Assets', path: '/digital-assets', icon: <Image fontSize="small" /> },
              { label: 'Theme Builder', path: '/theme-builder', icon: <Palette fontSize="small" /> },
              { label: 'Accessibility', path: '/design-system/accessibility', icon: <Search fontSize="small" /> },
              { label: 'Roadmap', path: '/roadmap', icon: <Map fontSize="small" /> },
              { label: 'Figma Kit', path: '/figma-kit', icon: <Build fontSize="small" /> },
              { label: 'FAQs', path: '/faqs', icon: <HelpOutline fontSize="small" /> },
              { label: 'Support', path: '/support', icon: <SupportAgent fontSize="small" /> },
              { label: 'Sitemap', path: '/sitemap', icon: <CloudUpload fontSize="small" /> },
            ].map((link) => (
              <Button
                key={link.label}
                variant="outlined"
                size="small"
                startIcon={link.icon}
                onClick={() => router.push(link.path)}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  color: 'text.primary',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderColor: 'primary.main',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </MotionBox>

        {/* Footer Message */}
        <MotionBox
          variants={itemVariants}
          sx={{ 
            mt: 8,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            maxWidth: 500,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            💡 <strong>Pro tip:</strong> Use our search feature in the header to quickly find 
            components, guidelines, and documentation across the entire design system.
          </Typography>
        </MotionBox>
      </MotionBox>
    </Container>
    </Box>
  );
}