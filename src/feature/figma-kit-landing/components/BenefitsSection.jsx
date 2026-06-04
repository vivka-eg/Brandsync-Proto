"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { zoomInView, withDelay } from "@/utils/animations";
import BenefitRow from "./BenefitRow";
import PrototypingImage from "./PrototypingImage";
import ComponentsImage from "./ComponentsImage";
import ColorGroupsImage from "./ColorGroupsImage";
import AccessibilityImage from "./AccessibilityImage";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const BenefitImageBox = ({ background, children }) => (
  <Box
    sx={{
      width: "500px",
      height: "497px",
      "@media (max-width: 1600px)": { width: "420px", height: "415px" },
      background,
      borderRadius: "16px",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: "-2px 2px 16.3px 0 rgba(0,0,0,0.12)",
    }}
  >
    {children}
  </Box>
);

const benefits = [
  {
    imageFirst: true,
    badge: "Prototyping",
    badgeColor: "#EEF2FF",
    badgeTextColor: "#4361EE",
    title: "Prototype in minutes, not hours",
    description: "Skip the setup and go straight to ideas",
    bullets: [
      "Pre-built variants and interactive states ready to drag in",
      "No rebuilding base components from scratch",
      "Get designs in front of stakeholders same day",
    ],
    imageBg: "linear-gradient(135deg, rgba(122, 166, 242, 0.35) 0%, rgba(122, 166, 242, 0.12) 100%)",
    image: <PrototypingImage />,
  },
  {
    imageFirst: false,
    badge: "Components",
    badgeColor: "#EEF2FF",
    badgeTextColor: "#4361EE",
    title: "Ship full products without building from scratch",
    description:
      "30+ components covering every UI pattern you need; from buttons to data tables to navigation systems.",
    bullets: [
      "Every common UI pattern already designed and tested",
      "Consistent quality across every component",
      "Junior designers work at senior output level",
    ],
    imageBg: "linear-gradient(135deg, rgba(122, 166, 242, 0.35) 0%, rgba(122, 166, 242, 0.12) 100%)",
    image: <ComponentsImage />,
  },
  {
    imageFirst: true,
    badge: "Brand Colors",
    badgeColor: "#EEF2FF",
    badgeTextColor: "#4361EE",
    title: "A color system that works across every product you design",
    description:
      "14 tokens covering primary, neutral, and semantic colors; enough to theme anything without inventing new values each time.",
    bullets: [
      "Primary and neutral scales that stay consistent across every screen",
      "Semantic colors for success, warning, error and info already defined",
      "Switch themes or rebrand without touching a single component",
    ],
    imageBg: "linear-gradient(135deg, rgba(122, 166, 242, 0.35) 0%, rgba(122, 166, 242, 0.12) 100%)",
    image: <ColorGroupsImage />,
  },
  {
    imageFirst: false,
    badge: "Accessibility",
    badgeColor: "#EEF2FF",
    badgeTextColor: "#4361EE",
    title: "Accessibility handled before you think about it",
    description: "Every component passes WCAG 2.1 AA before it reaches you",
    bullets: [
      "4.5:1 contrast ratio on every component",
      "Focus states, ARIA labels, and touch targets built in",
      "Zero compliance conversations at review time",
    ],
    imageBg: "linear-gradient(135deg, rgba(122, 166, 242, 0.35) 0%, rgba(122, 166, 242, 0.12) 100%)",
    image: <AccessibilityImage />,
  },
];

export default function BenefitsSection() {
  return (
    <Box sx={{ py: 10, "@media (max-width: 1600px)": { py: 7 } }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <MotionBox
          {...zoomInView}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "#EEF2FF",
            borderRadius: "6px",
            px: 1.75,
            py: 0.5,
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#4361EE" }}>
            Benefits
          </Typography>
        </MotionBox>

        <MotionTypography
          component="h2"
          {...withDelay(zoomInView, 0.1)}
          sx={{
            fontFamily: "Roboto",
            fontSize: "2.75rem",
            "@media (max-width: 1600px)": { fontSize: "2.25rem" },
            fontWeight: 700,
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000",
          }}
        >
          Not Just Components.
          <br />
          A System Built to Last.
        </MotionTypography>
      </Box>

      {benefits.map((b, i) => (
        <Box key={i}>
          <BenefitRow
            imageFirst={b.imageFirst}
            badge={b.badge}
            badgeColor={b.badgeColor}
            badgeTextColor={b.badgeTextColor}
            title={b.title}
            description={b.description}
            bullets={b.bullets}
            image={
              <BenefitImageBox background={b.imageBg}>
                {b.image}
              </BenefitImageBox>
            }
          />
        </Box>
      ))}
    </Box>
  );
}
