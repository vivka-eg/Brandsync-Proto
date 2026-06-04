"use client";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Lottie from "lottie-react";
import databaseAnimation from "../../../../public/lottie/Database.json";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const FeatureCard = ({ title, description, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      const icon = cardRef.current.querySelector('.feature-icon');
      
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: index * 0.15,
        }
      );

      // Icon animation
      if (icon) {
        gsap.fromTo(
          icon,
          {
            scale: 0,
            rotation: -180,
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.15 + 0.3,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Hover effect with GSAP
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          y: -8,
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out",
        });
        if (icon) {
          gsap.to(icon, {
            scale: 1.15,
            rotation: 8,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      };

      cardRef.current.addEventListener("mouseenter", handleMouseEnter);
      cardRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener("mouseenter", handleMouseEnter);
          cardRef.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }
  }, [index]);

  return (
    <Box
      ref={cardRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(100, 149, 237, 0.1)",
        willChange: "transform",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "flex-start",
        }}
      >
        <Box
          className="feature-icon"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15) 0%, rgba(135, 206, 250, 0.15) 100%)",
            border: "1px solid rgba(100, 149, 237, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 28, color: "#1976d2" }} />
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "#212529",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "#6c757d",
          lineHeight: 1.8,
          fontSize: { xs: "0.95rem", md: "1rem" },
          ml: { xs: 0, sm: 8 },
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

const FeaturesSection = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const features = [
    {
      title: "Figma Kit",
      description: "Ready-to-use design components and assets for seamless design workflow.",
    },
    {
      title: "Design Token Management",
      description: "Keep identity aligned across all products.",
    },
    {
      title: "Centralized Documentation",
      description: "WCAG-compliant components and guidelines.",
    },
    {
      title: "Governance Framework",
      description: "Structured alignment for all teams.",
    },
    {
      title: "Version Control",
      description: "Always up-to-date design system evolution.",
    },
    {
      title: "Progressive Adoption",
      description: "Integrate with existing systems with Minimum disruption.",
    },
  ];

  useEffect(() => {
    // GSAP character-by-character animation for title
    if (titleRef.current) {
      // Get the text content - "Everything you need" should be on first line, "to design, build, and scale." on second
      const fullText = "Everything you need to design, build, and scale.";
      const firstLine = "Everything you need";
      const secondLine = "to design, build, and scale.";
      
      // Process first line
      const firstLineHTML = firstLine.split(' ')
        .map((word) => `<span class="word">${word.split('').map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}</span>`)
        .join(' ');
      
      // Process second line
      const secondLineHTML = secondLine.split(' ')
        .map((word) => `<span class="word">${word.split('').map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}</span>`)
        .join(' ');
      
      // Set the HTML with explicit line break
      titleRef.current.innerHTML = firstLineHTML + '<br />' + secondLineHTML;

      gsap.fromTo(
        titleRef.current.querySelectorAll('.char'),
        {
          opacity: 0,
          y: 60,
          scale: 0.5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: {
            amount: 0.8,
            from: "start",
          },
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // GSAP Animation for description
    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-100px", md: "-150px" },
          right: { xs: "-100px", md: "-200px" },
          width: { xs: "400px", md: "600px" },
          height: { xs: "400px", md: "600px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100, 149, 237, 0.15), rgba(135, 206, 250, 0.1), transparent)",
          filter: "blur(30px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-150px", md: "-200px" },
          left: { xs: "-100px", md: "-150px" },
          width: { xs: "500px", md: "700px" },
          height: { xs: "500px", md: "700px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100, 149, 237, 0.12), rgba(135, 206, 250, 0.08), transparent)",
          filter: "blur(30px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            ref={titleRef}
            variant="h2"
            fontWeight={800}
            mb={2}
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
              color: "#212529",
              whiteSpace: "normal",
              "& .char": {
                display: "inline-block",
              },
            }}
            component="div"
          >
            The infrastructure for design<br />consistency at scale
          </Typography>
          <Typography
            ref={descRef}
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#6c757d",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.8,
              mb: 6,
            }}
          >
            Figma Kit. Design tokens. Centralized docs. Version control. Everything EG needs to maintain a unified brand across 140+ products.
          </Typography>

          {/* Data Flow Visualization with Animated Border */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              mb: 8,
              p: { xs: 0.25, md: 0.375 },
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(100, 149, 237, 0.6), rgba(135, 206, 250, 0.6))",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "200px", md: "280px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                borderRadius: "20px",
              }}
            >
            {/* Left Input Sources */}
            <Box
              sx={{
                position: "absolute",
                left: { xs: "5%", md: "10%" },
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
              }}
            >
              {["Design Tokens", "Figma Kit", "Guidelines"].map((label, index) => (
                <Box
                  key={label}
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.75, md: 1 },
                    borderRadius: "24px",
                    border: "2px solid rgba(100, 149, 237, 0.3)",
                    backgroundColor: "rgba(100, 149, 237, 0.05)",
                    animation: `fadeInLeft 0.8s ease-out ${index * 0.2}s both`,
                    "@keyframes fadeInLeft": {
                      "0%": {
                        opacity: 0,
                        transform: "translateX(-30px)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      fontWeight: 600,
                      color: "#1976d2",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Animated Connection Lines from Left */}
            {[0, 1, 2].map((i) => (
              <Box
                key={`line-left-${i}`}
                sx={{
                  position: "absolute",
                  left: { xs: "25%", md: "30%" },
                  top: `${30 + i * 20}%`,
                  width: { xs: "15%", md: "15%" },
                  height: "2px",
                  background: "linear-gradient(to right, rgba(100, 149, 237, 0.6), rgba(100, 149, 237, 0.2))",
                  animation: `flowRight 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  "@keyframes flowRight": {
                    "0%": {
                      opacity: 0.3,
                      transform: "scaleX(0.5)",
                    },
                    "50%": {
                      opacity: 1,
                      transform: "scaleX(1)",
                    },
                    "100%": {
                      opacity: 0.3,
                      transform: "scaleX(0.5)",
                    },
                  },
                }}
              />
            ))}

            {/* Central Database/System */}
            <Box
              sx={{
                position: "relative",
                zIndex: 3,
                width: { xs: "180px", md: "240px" },
                height: { xs: "180px", md: "240px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lottie
                animationData={databaseAnimation}
                loop={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>

            {/* Right Output Features */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: "5%", md: "10%" },
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
              }}
            >
              {["Consistency", "Scalability", "Speed"].map((label, index) => (
                <Box
                  key={label}
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.75, md: 1 },
                    borderRadius: "24px",
                    border: "2px solid rgba(100, 149, 237, 0.3)",
                    backgroundColor: "rgba(100, 149, 237, 0.05)",
                    animation: `fadeInRight 0.8s ease-out ${index * 0.2 + 0.3}s both`,
                    "@keyframes fadeInRight": {
                      "0%": {
                        opacity: 0,
                        transform: "translateX(30px)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      fontWeight: 600,
                      color: "#1976d2",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Animated Connection Lines to Right */}
            {[0, 1, 2].map((i) => (
              <Box
                key={`line-right-${i}`}
                sx={{
                  position: "absolute",
                  right: { xs: "25%", md: "30%" },
                  top: `${30 + i * 20}%`,
                  width: { xs: "15%", md: "15%" },
                  height: "2px",
                  background: "linear-gradient(to left, rgba(100, 149, 237, 0.6), rgba(100, 149, 237, 0.2))",
                  animation: `flowLeft 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3 + 0.5}s`,
                  "@keyframes flowLeft": {
                    "0%": {
                      opacity: 0.3,
                      transform: "scaleX(0.5)",
                    },
                    "50%": {
                      opacity: 1,
                      transform: "scaleX(1)",
                    },
                    "100%": {
                      opacity: 0.3,
                      transform: "scaleX(0.5)",
                    },
                  },
                }}
              />
            ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
