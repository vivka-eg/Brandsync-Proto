import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { zoomInView, withDelay, animateTextZoomIn } from "@/utils/animations";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);

// Animated visualization components for each foundation type
const LogoPlacementVisual = ({ bg }) => (
  <Box
    sx={{
      height: 160,
      width: "100%",
      backgroundColor: bg,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    {/* Safe area guides */}
    <Box
      sx={{
        position: "absolute",
        inset: "20%",
        border: "2px dashed rgba(236, 72, 153, 0.3)",
        borderRadius: "8px",
        animation: "fadeInOut 3s ease-in-out infinite",
        "@keyframes fadeInOut": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
      }}
    />

    {/* Central logo placeholder */}
    <Box
      sx={{
        width: "60px",
        height: "60px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "white",
        boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
        animation: "pulse 2s ease-in-out infinite",
        "@keyframes pulse": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      B
    </Box>

    {/* Corner guides */}
    {[
      { top: "10%", left: "10%" },
      { top: "10%", right: "10%" },
      { bottom: "10%", left: "10%" },
      { bottom: "10%", right: "10%" },
    ].map((pos, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          width: "12px",
          height: "12px",
          ...pos,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "12px",
            height: "2px",
            backgroundColor: "rgba(236, 72, 153, 0.4)",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "2px",
            height: "12px",
            backgroundColor: "rgba(236, 72, 153, 0.4)",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
          },
        }}
      />
    ))}
  </Box>
);

const TypographyVisual = ({ bg }) => {
  const typeScale = [
    { size: "0.75rem", label: "12px", text: "Aa" },
    { size: "1rem", label: "16px", text: "Aa" },
    { size: "1.25rem", label: "20px", text: "Aa" },
    { size: "1.5rem", label: "24px", text: "Aa" },
    { size: "2rem", label: "32px", text: "Aa" },
  ];

  return (
    <Box
      sx={{
        height: 160,
        width: "100%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Connecting line showing progression */}
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          left: "15%",
          right: "15%",
          height: "2px",
          background: "linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 0.2))",
          animation: "lineGlow 3s ease-in-out infinite",
          "@keyframes lineGlow": {
            "0%, 100%": {
              opacity: 0.4,
            },
            "50%": {
              opacity: 1,
            },
          },
        }}
      />

      {/* Type scale items */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          width: "100%",
          px: 2,
          gap: 0.5,
        }}
      >
        {typeScale.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              animation: "scaleUp 4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes scaleUp": {
                "0%, 100%": {
                  transform: "translateY(0px)",
                  opacity: 0.6,
                },
                "20%": {
                  transform: "translateY(-8px)",
                  opacity: 1,
                },
              },
            }}
          >
            {/* Text sample */}
            <Typography
              sx={{
                fontSize: item.size,
                fontWeight: 700,
                color: "#f59e0b",
                lineHeight: 1,
              }}
            >
              {item.text}
            </Typography>

            {/* Size label */}
            <Box
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: "4px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "#f59e0b",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Typography>
            </Box>

            {/* Progress indicator dot */}
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                animation: "dotPulse 4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes dotPulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                    opacity: 0.4,
                  },
                  "20%": {
                    transform: "scale(1.5)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SpacingVisual = ({ bg }) => {
  const spacingScale = [
    { size: 4, width: "8px", height: "32px" },
    { size: 8, width: "12px", height: "40px" },
    { size: 16, width: "16px", height: "48px" },
    { size: 24, width: "20px", height: "56px" },
    { size: 32, width: "24px", height: "64px" },
  ];

  return (
    <Box
      sx={{
        height: 160,
        width: "100%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Baseline guide */}
      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          left: "15%",
          right: "15%",
          height: "1px",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          animation: "baselineGlow 3s ease-in-out infinite",
          "@keyframes baselineGlow": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 0.7 },
          },
        }}
      />

      {/* Spacing scale items */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          width: "100%",
          px: 2,
          gap: 1,
        }}
      >
        {spacingScale.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.75,
              animation: "growUp 4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes growUp": {
                "0%, 100%": {
                  transform: "translateY(0px) scaleY(1)",
                  opacity: 0.6,
                },
                "20%": {
                  transform: "translateY(-6px) scaleY(1.1)",
                  opacity: 1,
                },
              },
            }}
          >
            {/* Spacing block */}
            <Box
              sx={{
                width: item.width,
                height: item.height,
                borderRadius: "4px",
                backgroundColor: "#3b82f6",
                position: "relative",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "calc(100% + 8px)",
                  height: "calc(100% + 8px)",
                  border: "1px dashed rgba(59, 130, 246, 0.3)",
                  borderRadius: "6px",
                  animation: "borderPulse 4s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                },
                "@keyframes borderPulse": {
                  "0%, 100%": {
                    opacity: 0.2,
                  },
                  "20%": {
                    opacity: 0.8,
                  },
                },
              }}
            />

            {/* Size label */}
            <Box
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: "4px",
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "#3b82f6",
                  lineHeight: 1,
                }}
              >
                {item.size}px
              </Typography>
            </Box>

            {/* Progress indicator */}
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                animation: "spacingDotPulse 4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                "@keyframes spacingDotPulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                    opacity: 0.4,
                  },
                  "20%": {
                    transform: "scale(1.5)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const LayoutsVisual = ({ bg }) => (
  <Box
    sx={{
      height: 160,
      width: "100%",
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        width: "100%",
        maxWidth: "120px",
        animation: "gridTransform 4s ease-in-out infinite",
        "@keyframes gridTransform": {
          "0%, 100%": {
            gridTemplateColumns: "1fr 1fr",
          },
          "50%": {
            gridTemplateColumns: "1fr 1fr 1fr",
          },
        },
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          sx={{
            aspectRatio: "1",
            borderRadius: "4px",
            backgroundColor: "#10b981",
            opacity: 0.6,
            animation: "gridItemFade 4s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
            "@keyframes gridItemFade": {
              "0%, 100%": {
                opacity: 0.4,
                transform: "scale(0.95)",
              },
              "25%": {
                opacity: 0.8,
                transform: "scale(1)",
              },
            },
          }}
        />
      ))}
    </Box>

    {/* Grid lines overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: "10%",
        pointerEvents: "none",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          left: "50%",
          transform: "translateX(-50%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          top: "50%",
          transform: "translateY(-50%)",
        },
      }}
    />
  </Box>
);

const SectionWrapper = ({ title, description, children }) => {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const titleAnim = animateTextZoomIn(gsap, titleRef.current);
    const descAnim = animateTextZoomIn(gsap, descRef.current, { delay: 0.1 });

    return () => {
      titleAnim?.kill();
      descAnim?.kill();
    };
  }, [title, description]);

  return (
    <Box
      id="foundations-section"
      sx={{
        px: { xs: 2, md: 6 },
        py: 6,
        maxWidth: "1300px",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        ref={titleRef}
        variant="h2"
        fontWeight={700}
        mb={2}
        sx={{
          fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          ref={descRef}
          variant="body1"
          color="text.secondary"
          mb={5}
          sx={{
            fontSize: { xs: "1.125rem", md: "1.25rem", lg: "1.375rem" },
            lineHeight: 1.7,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
};

const FoundationCard = ({ title, description, bg, idx }) => {
  const router = useRouter();

  // Map each foundation to its animated visual component
  const visualComponents = {
    "Logo placement": LogoPlacementVisual,
    "Typography": TypographyVisual,
    "Spacing": SpacingVisual,
    "Layouts": LayoutsVisual,
  };

  const VisualComponent = visualComponents[title];

  // Convert title to URL slug (e.g., "Logo placement" -> "logo-placement")
  // Special case: "Layouts" -> "layout" (singular)
  const slug = title === "Layouts" 
    ? "layout" 
    : title.toLowerCase().replace(/\s+/g, '-');

  const handleCardClick = () => {
    router.push(`/design-system/foundation/${slug}`);
  };

  return (
    <MotionBox
      sx={{ width: "100%", borderRadius: 2 }}
      {...withDelay(zoomInView, idx * 0.15)}
    >
      <Card
        onClick={handleCardClick}
        sx={{
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
          boxShadow: "none",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {VisualComponent ? <VisualComponent bg={bg} /> : (
          <Box
            aria-hidden
            sx={{ height: 160, width: "100%", backgroundColor: bg }}
          />
        )}
        <CardContent sx={{ backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </MotionBox>
  );
};

export default function FoundationsSection() {
  const cards = [
    {
      title: "Logo placement",
      description:
        "Best practices for safe areas, minimum sizes, and brand lockups.",
      bg: "#FAECFB",
    },
    {
      title: "Typography",
      description:
        "Headline, body, and caption styles that scale across breakpoints.",
      bg: "#FFFBEB",
    },
    {
      title: "Spacing",
      description:
        "Scale and spacing rules for padding, gaps, and layout rhythm.",
      bg: "#EDF9FF",
    },
    {
      title: "Layouts",
      description:
        "Responsive grid systems and templates for consistent page structure.",
      bg: "#F0FDF4",
    },
  ];

  return (
    <SectionWrapper
      title="The Foundations"
      description={
        <>
          <strong>Logo placement</strong>, <strong>typography</strong>, <strong>spacing</strong>, and <strong>layout</strong> guidelines that keep every interface consistent, accessible, and easy to use.
        </>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        {cards.map((card, idx) => (
          <FoundationCard key={card.title} idx={idx} {...card} />
        ))}
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={2}
          sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
        >
          Ready to implement these foundations into your EG product?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            href="/design-system/quick-start-guide"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            View the Quick Start Guide
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/design-system/implementation-planner"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Implementation Planner
          </Button>
        </Box>
      </Box>
    </SectionWrapper>
  );
}


