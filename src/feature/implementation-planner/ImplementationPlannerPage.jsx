"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack, Chip, Collapse, Button } from "@mui/material";
import {
  SquareLogo,
  TextT,
  GridNine,
  Palette,
  Keyboard,
  SpeakerLow,
  CaretDown,
  CaretUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import Link from "next/link";
import AnimatedOrb, {
  float,
  float2,
  float3,
  float4,
  float5,
} from "@/components/shared/AnimatedOrb";

// Difficulty badge component
const DifficultyBadge = ({ level }) => {
  const config = {
    easy: {
      label: "Easy",
      color: "#049155",
      bgColor: "#EEFFF6",
      borderColor: "#B2FFDD",
    },
    medium: {
      label: "Medium",
      color: "#B75006",
      bgColor: "#FFF9EC",
      borderColor: "#FFE1A5",
    },
    hard: {
      label: "Hard",
      color: "#C62828",
      bgColor: "#FFEBEE",
      borderColor: "#FFCDD2",
    },
  };

  const { label, color, bgColor, borderColor } = config[level];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: bgColor,
        color: color,
        border: `1px solid ${borderColor}`,
        fontWeight: 600,
        fontSize: "11px",
        height: "24px",
      }}
    />
  );
};

// Sprint estimate badge
const SprintBadge = ({ sprints }) => {
  return (
    <Chip
      icon={<Clock size={14} />}
      label={`${sprints} Sprint${sprints > 1 ? "s" : ""}`}
      size="small"
      sx={{
        bgcolor: "#EDF9FF",
        color: "#1053BD",
        border: "1px solid #BBDEFB",
        fontWeight: 500,
        fontSize: "11px",
        height: "24px",
        "& .MuiChip-icon": {
          color: "#1053BD",
        },
      }}
    />
  );
};

// Implementation task card
const TaskCard = ({ task }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={2} alignItems="flex-start" flex={1}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                bgcolor: task.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {task.icon}
            </Box>
            <Stack flex={1}>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {task.title}
              </Typography>
              <Typography
                variant="bodyMd"
                color="text.secondary"
                sx={{ marginTop: 0.5 }}
              >
                {task.description}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <DifficultyBadge level={task.difficulty} />
            <SprintBadge sprints={task.sprints} />
          </Stack>
        </Stack>

        {task.subtasks && (
          <>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={
                expanded ? <CaretUp size={16} /> : <CaretDown size={16} />
              }
              sx={{
                color: "#1053BD",
                textTransform: "none",
                justifyContent: "flex-start",
                p: 0,
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              {expanded ? "Hide" : "Show"} subtasks ({task.subtasks.length})
            </Button>
            <Collapse in={expanded}>
              <Stack spacing={1.5} sx={{ pl: 7 }}>
                {task.subtasks.map((subtask, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#1053BD",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {subtask}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Collapse>
          </>
        )}

        {task.resources && (
          <Stack direction="row" spacing={2} sx={{ pl: 7 }}>
            {task.resources.map((resource, index) => (
              <Link key={index} href={resource.href}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1053BD",
                    textDecoration: "underline",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#0D47A1",
                    },
                  }}
                >
                  {resource.label}
                </Typography>
              </Link>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

// Sprint planning example card
const SprintPlanCard = ({ sprint }) => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              minWidth: 48,
              height: 48,
              minHeight: 48,
              borderRadius: "50%",
              bgcolor: sprint.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            {sprint.number}
          </Box>
          <Stack>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {sprint.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sprint.duration}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          {sprint.tasks.map((task, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                p: 1.5,
                bgcolor: "#F8F9FA",
                borderRadius: "8px",
              }}
            >
              <CheckCircle size={18} color="#049155" weight="fill" />
              <Typography variant="body2" color="text.primary" flex={1}>
                {task.name}
              </Typography>
              <DifficultyBadge level={task.difficulty} />
            </Stack>
          ))}
        </Stack>

        <Box
          sx={{
            p: 2,
            bgcolor: sprint.highlightBg,
            borderRadius: "8px",
            border: `1px solid ${sprint.highlightBorder}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Sprint Goal:</strong> {sprint.goal}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

// Category section
const CategorySection = ({ category, tasks }) => {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {category.title}
        </Typography>
        <Typography variant="bodyMd" color="text.secondary">
          {category.description}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>
    </Stack>
  );
};

export default function ImplementationPlannerPage() {
  const categories = [
    {
      id: "quick-wins",
      title: "Quick Wins",
      description: "Start here - high impact, low effort tasks",
    },
    {
      id: "foundation",
      title: "Design Foundations",
      description: "Core visual consistency requirements",
    },
    {
      id: "accessibility",
      title: "Accessibility Compliance",
      description: "WCAG requirements for inclusive design",
    },
  ];

  const tasks = {
    "quick-wins": [
      {
        id: "logo-placement",
        title: "Logo Placement",
        description:
          "Update logo placement in header, footer, and splash screens to follow BrandSync guidelines.",
        difficulty: "easy",
        sprints: 0.5,
        icon: <SquareLogo size={24} color="#049155" />,
        iconBg: "#EEFFF6",
        subtasks: [
          "Add correct logo assets from product logos",
          "Ensure proper placement in navigation header",
          "Update footer logo with correct variant",
          "Add splash screen logo if applicable",
        ],
        resources: [
          {
            label: "Logo Guidelines",
            href: "/design-system/foundation/logo-placement",
          },
          { label: "Download Logos", href: "/logos" },
        ],
      },
      {
        id: "color-palette",
        title: "Update Color Palette",
        description:
          "Replace existing colors with BrandSync-approved accessible color palette.",
        difficulty: "easy",
        sprints: 0.5,
        icon: <Palette size={24} color="#049155" />,
        iconBg: "#EEFFF6",
        subtasks: [
          "Audit current color usage",
          "Map existing colors to BrandSync palette",
          "Update primary and neutral colors",
          "Apply semantic colors (success, error, warning)",
        ],
        resources: [
          {
            label: "Accessible Palettes",
            href: "/design-system/accessible-palettes",
          },
        ],
      },
    ],
    foundation: [
      {
        id: "typography",
        title: "Typography System",
        description:
          "Implement consistent typography scale across headings, body text, and UI elements.",
        difficulty: "medium",
        sprints: 1,
        icon: <TextT size={24} color="#1053BD" />,
        iconBg: "#EDF9FF",
        subtasks: [
          "Install approved font family (if not already installed)",
          "Set up typography scale (h1-h6, body, caption)",
          "Apply consistent line heights",
          "Implement responsive font sizing",
          "Update component text styles",
        ],
        resources: [
          {
            label: "Typography Guide",
            href: "/design-system/foundation/typography",
          },
        ],
      },
      {
        id: "spacing",
        title: "Spacing & Grid System",
        description:
          "Apply consistent 8px grid-based spacing throughout your application.",
        difficulty: "medium",
        sprints: 1.5,
        icon: <GridNine size={24} color="#1053BD" />,
        iconBg: "#EDF9FF",
        subtasks: [
          "Audit current spacing values",
          "Create spacing tokens (4px, 8px, 16px, 24px, 32px, etc.)",
          "Update component margins and paddings",
          "Apply consistent grid layouts",
          "Test responsive breakpoints",
        ],
        resources: [
          {
            label: "Spacing Foundation",
            href: "/design-system/foundation/spacing",
          },
        ],
      },
    ],
    accessibility: [
      {
        id: "color-contrast",
        title: "Color Contrast Compliance",
        description:
          "Ensure all text and UI elements meet WCAG AA contrast requirements (4.5:1 for text, 3:1 for UI).",
        difficulty: "medium",
        sprints: 1,
        icon: <Palette size={24} color="#5B2F8F" />,
        iconBg: "#FFF7FF",
        subtasks: [
          "Run automated contrast checker",
          "Fix low-contrast text issues",
          "Update button and link colors",
          "Ensure icon visibility",
          "Test with color blindness simulators",
        ],
        resources: [
          {
            label: "Accessibility Guide",
            href: "/design-system/accessibility",
          },
        ],
      },
      {
        id: "keyboard-nav",
        title: "Keyboard Navigation",
        description:
          "Implement full keyboard support for all interactive elements.",
        difficulty: "hard",
        sprints: 2,
        icon: <Keyboard size={24} color="#5B2F8F" />,
        iconBg: "#FFF7FF",
        subtasks: [
          "Add visible focus indicators",
          "Ensure logical tab order",
          "Implement skip links",
          "Add keyboard shortcuts for common actions",
          "Test with keyboard-only navigation",
        ],
        resources: [
          {
            label: "Accessibility Guide",
            href: "/design-system/accessibility",
          },
        ],
      },
      {
        id: "screen-reader",
        title: "Screen Reader Support",
        description:
          "Add proper ARIA labels and semantic HTML for screen reader users.",
        difficulty: "hard",
        sprints: 2,
        icon: <SpeakerLow size={24} color="#5B2F8F" />,
        iconBg: "#FFF7FF",
        subtasks: [
          "Audit semantic HTML structure",
          "Add ARIA labels to interactive elements",
          "Implement live regions for dynamic content",
          "Add alt text to all images",
          "Test with screen readers (NVDA, VoiceOver)",
        ],
        resources: [
          {
            label: "Accessibility Guide",
            href: "/design-system/accessibility",
          },
        ],
      },
    ],
  };

  const sprintPlans = [
    {
      number: 1,
      title: "Foundation Sprint",
      duration: "2 weeks",
      color: "#049155",
      highlightBg: "#EEFFF6",
      highlightBorder: "#B2FFDD",
      tasks: [
        { name: "Update logo placement", difficulty: "easy" },
        { name: "Apply new color palette", difficulty: "easy" },
        { name: "Run accessibility audit", difficulty: "easy" },
      ],
      goal: "Establish visual identity basics and identify accessibility gaps",
    },
    {
      number: 2,
      title: "Typography & Spacing Sprint",
      duration: "7 weeks",
      color: "#1053BD",
      highlightBg: "#EDF9FF",
      highlightBorder: "#BBDEFB",
      tasks: [
        { name: "Implement typography system", difficulty: "medium" },
        { name: "Apply spacing tokens", difficulty: "medium" },
        { name: "Fix critical contrast issues", difficulty: "medium" },
      ],
      goal: "Achieve consistent visual hierarchy and layout structure",
    },
    {
      number: 3,
      title: "Accessibility Sprint",
      duration: "10 weeks",
      color: "#5B2F8F",
      highlightBg: "#FFF7FF",
      highlightBorder: "#F4E6FF",
      tasks: [
        { name: "Implement keyboard navigation", difficulty: "hard" },
        { name: "Add screen reader support", difficulty: "hard" },
        { name: "Final accessibility testing", difficulty: "medium" },
      ],
      goal: "Meet WCAG AA compliance for core user journeys",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        bgcolor: "background.default",
      }}
    >
      {/* Header Section */}
      <Stack
        sx={{
          minHeight: "400px",
          borderRadius: "12px",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 32px",
          position: "relative",
          overflow: "hidden",
          "@media (max-width: 600px)": {
            minHeight: "300px",
            padding: "48px 24px",
          },
        }}
      >
        {/* Animated Blue Orbs */}
        <AnimatedOrb
          width="350px"
          height="350px"
          color="rgba(84, 158, 255, 0.8)"
          blur="70px"
          position={{ top: "-150px", right: "-50px" }}
          animation={`${float} 8s ease-in-out infinite`}
        />
        <AnimatedOrb
          width="280px"
          height="280px"
          color="rgba(144, 202, 249, 0.75)"
          blur="60px"
          position={{ bottom: "-100px", left: "-50px" }}
          animation={`${float2} 10s ease-in-out infinite`}
        />
        <AnimatedOrb
          width="240px"
          height="240px"
          color="rgba(180, 216, 253, 0.7)"
          blur="55px"
          position={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animation={`${float3} 12s ease-in-out infinite`}
        />
        <AnimatedOrb
          width="220px"
          height="220px"
          color="rgba(100, 181, 246, 0.65)"
          blur="50px"
          position={{ top: "20%", left: "10%" }}
          animation={`${float4} 9s ease-in-out infinite`}
        />
        <AnimatedOrb
          width="200px"
          height="200px"
          color="rgba(66, 165, 245, 0.7)"
          blur="45px"
          position={{ bottom: "20%", right: "15%" }}
          animation={`${float5} 11s ease-in-out infinite`}
        />

        {/* Header Content */}
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            maxWidth: "800px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              color: "#1A1A1A",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Implementation Planner
          </Typography>
          <Typography
            variant="h6"
            fontWeight={400}
            sx={{
              color: "#53585C",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              maxWidth: "700px",
            }}
          >
            Plan your BrandSync adoption journey. Assess your product,
            prioritize tasks by difficulty, and follow our recommended sprint
            planning approach.
          </Typography>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Stack gap="64px">
        {/* Assessment Checklist */}
        <Stack gap={4}>
          <Stack gap={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Implementation Tasks
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Review the tasks below organized by category. Start with Quick
              Wins for immediate impact, then move to foundations and
              accessibility.
            </Typography>
          </Stack>

          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              tasks={tasks[category.id]}
            />
          ))}
        </Stack>

        {/* Sprint Planning Section */}
        <Stack gap={4}>
          <Stack gap={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Sample Sprint Plan
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Here's a recommended 6-week rollout plan. Adjust based on your
              team's capacity and current state.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {sprintPlans.map((sprint) => (
              <SprintPlanCard key={sprint.number} sprint={sprint} />
            ))}
          </Box>

          {/* Tips Box */}
          <Box
            sx={{
              bgcolor: "#FFFBF0",
              border: "1px solid #FFE082",
              borderRadius: "12px",
              p: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Sparkle size={24} color="#B75006" weight="fill" />
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Planning Tips
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  <Typography
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <strong>Start small:</strong> Quick wins build momentum and
                    demonstrate value early
                  </Typography>
                  <Typography
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <strong>Pair tasks:</strong> Combine easy and medium
                    difficulty tasks in each sprint
                  </Typography>
                  <Typography
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <strong>Buffer time:</strong> Leave 20% capacity for
                    unexpected issues
                  </Typography>
                  <Typography
                    component="li"
                    variant="body2"
                    color="text.secondary"
                  >
                    <strong>Test continuously:</strong> Validate changes with
                    real users throughout
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: "#F8F9FA",
            borderRadius: "16px",
            p: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Ready to get started?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500 }}
            >
              Check out our Quick Start Guide for a complete walkthrough, or
              jump straight to the resources you need.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Link href="/design-system/quick-start-guide">
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 4,
                    py: 2,
                    bgcolor: "#1A1A1A",
                    color: "#FFFFFF",
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#333333",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Quick Start Guide
                  <ArrowRight size={20} />
                </Box>
              </Link>
              <Link href="/logos">
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 4,
                    py: 2,
                    bgcolor: "#FFFFFF",
                    color: "#1A1A1A",
                    border: "2px solid #1A1A1A",
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#F5F5F5",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Download Logos
                </Box>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
