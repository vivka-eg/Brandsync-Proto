"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import {
  Stack as StackIcon,
  GridNine,
  SquareLogo,
  TextT,
  PersonArmsSpread,
  Palette,
  Keyboard as KeyboardPhosphor,
  SpeakerLow,
  ArrowSquareOut,
  Target,
  FileText,
  ChatCircle,
  PaintBrushHousehold,
} from "@phosphor-icons/react";
import Link from "next/link";
import FaqAccordionItem from "@/components/shared/FaqAccordionItem";

import HeaderSection from "./components/HeaderSection";
import { getQuickStartFAQs } from "@/data/faqData";

export default function QuickStartGuidePage() {
  const [expandedFaq, setExpandedFaq] = React.useState(null);
  const quickStartFaqs = getQuickStartFAQs();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 1,
        bgcolor: "background.default",
        pb: "130px",
      }}
    >
      {/* Header Section */}
      <HeaderSection />

      {/* Main Content */}
      <Stack gap="64px">
        {/* What is BrandSync Section */}
        <Stack gap={2}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            What is BrandSync?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            BrandSync is our way of making sure all EG products feel like they belong to one family. Instead of every product doing its own thing, we're setting a few shared foundations so everything looks consistent, while still giving your team the freedom to build however you prefer.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            <strong>Core Principle:</strong> The foundations stay consistent, but your team still has full flexibility in how you apply them.
          </Typography>
        </Stack>

        {/* The Two Non-Negotiable Pillars Section */}
        <Stack gap={3}>
          <Stack gap={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              The Two Non-Negotiable Pillars
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              These are essential foundations that every product must meet as part of the BrandSync ecosystem.
            </Typography>
          </Stack>

          <Stack gap={3}>
            {/* Pillar 1 */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 4,
              }}
            >
              <Stack direction="row" spacing={2.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "12px",
                    bgcolor: "#0B66EA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <StackIcon size={32} color="#FFFFFF" />
                </Box>
                <Stack gap={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#1053BD",
                      bgcolor: "#D8F0FF",
                      border: "1px solid #BBDEFB",
                      px: 1,
                      borderRadius: "16px",
                      fontWeight: 500,
                      width: "fit-content",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Foundation 1
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="text.primary">
                    Platform-Agnostic Design Foundations
                  </Typography>
                </Stack>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5, lineHeight: 1.6 }}>
                These standards apply regardless of your tech stack or design tools:
              </Typography>

              <Stack spacing={3}>
                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EDF9FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <GridNine size={24} color="#1053BD" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Spacing and Grids
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Use consistent spacing so layouts feel balanced and are easy to scan.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EDF9FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SquareLogo size={24} color="#1053BD" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Logo Placement
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Follow the set rules for where logos go and how much padding they need.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EDF9FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <TextT size={24} color="#1053BD" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Typography
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Use the clear font sizes and hierarchy to keep text clear and consistent.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Pillar 2 */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 4,
              }}
            >
              <Stack direction="row" spacing={2.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "12px",
                    bgcolor: "#049155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PersonArmsSpread size={32} color="#FFFFFF" />
                </Box>
                <Stack gap={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#0A7146",
                      bgcolor: "#D7FFED",
                      border: "1px solid #C8E6C9",
                      px: 1,
                      borderRadius: "16px",
                      fontWeight: 500,
                      width: "fit-content",
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Foundation 2
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="text.primary">
                    Clear Accessibility Guidelines
                  </Typography>
                </Stack>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5, lineHeight: 1.6 }}>
                All products need to follow WCAG:
              </Typography>

              <Stack spacing={3}>
                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EEFFF6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Palette size={24} color="#0A7146" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Color Contrast
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Ensure clear, easy-to-read color contrast across all components by using our approved color palettes.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EEFFF6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <KeyboardPhosphor size={24} color="#0A7146" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Keyboard-friendly navigation
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Provide full support for people who prefer using a keyboard.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      bgcolor: "#EEFFF6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SpeakerLow size={24} color="#0A7146" />
                  </Box>
                  <Stack>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      Screen Reader Support
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Support screen readers with clear semantic HTML and ARIA labels.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Box
            sx={{
              bgcolor: "#FFFBF0",
              border: "1px solid #FFE082",
              borderRadius: "8px",
              p: 2.5,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              <strong>Keep Your Tools:</strong> Continue using your existing design systems or component libraries. We're providing a{" "}
              <Link href="/figma-kit" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                tokenized Figma kit
              </Link>
              , but adoption is optional as long as foundations are respected.
            </Typography>
          </Box>
        </Stack>

        {/* Getting Started: 5 Simple Steps Section */}
        <Stack gap={3}>
          <Stack gap={0.5}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Get Started in 5 Simple Steps
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              A clear, straight forward roadmap to BrandSync adoption
            </Typography>
          </Stack>

          <Stack gap={2}>
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    bgcolor: "#FFF7FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ArrowSquareOut size={32} color="#5B2F8F" />
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5B2F8F",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    STEP 1
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    Access the BrandSync Platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Head to our{" "}
                    <Link href="/design-system/components" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                      documentation portal
                    </Link>{" "}
                    to see all the guidelines in one spot, and check the foundational requirements your product needs to follow.
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    bgcolor: "#EDF9FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Target size={32} color="#1053BD" />
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#1053BD",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    STEP 2
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    Assess Your Current State
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Evaluate your product against the three pillars. Identify gaps in spacing, logo placement, accessibility compliance, and typography standards.
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    bgcolor: "#EEFFF6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <StackIcon size={32} color="#049155" />
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#049155",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    STEP 3
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    Choose Your Implementation Path
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    We know most developers aren't deep into Figma so we keep it simple:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Easy, straightforward documentation
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Quarterly updates so changes stay manageable
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Friendly support whenever you need it. We're here to support, not strictly enforce
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    bgcolor: "#FFF9EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={32} color="#B75006" />
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#B75006",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    STEP 4
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    Integrate into Your Roadmap
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Plan foundation implementation within your next 2-3 sprint cycles. Focus on mandatory elements first: logo placement, spacing rules, and accessibility fixes.
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                p: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    bgcolor: "#FBF4F8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ChatCircle size={32} color="#BE185F" />
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#BE185F",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    STEP 5
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    Connect with Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Reach out to the BrandSync team for guidance, clarification, or implementation support. We're here to help make this transition smooth.
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Implementation Planner CTA */}
        <Box
          sx={{
            bgcolor: "#EDF9FF",
            border: "1px solid #BBDEFB",
            borderRadius: "12px",
            p: 3,
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "#1053BD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Target size={24} color="#FFFFFF" />
              </Box>
              <Stack>
                <Typography variant="h6" fontWeight={600} color="#1053BD">
                  Use our Implementation Planner
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={400}>
                  Prioritize tasks by difficulty and plan your sprints with our interactive guide.
                </Typography>
              </Stack>
            </Stack>
            <Link href="/design-system/implementation-planner" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  bgcolor: "transparent",
                  color: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                Open Planner
              </Box>
            </Link>
          </Stack>
        </Box>

        {/* Key Principles to Remember Section */}
        <Stack gap={3}>
          <Stack gap={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Key Principles to Remember
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Keep these fundamental mindsets in mind throughout your BrandSync adoption journey
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              "@media (max-width: 900px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <Box
              sx={{
                bgcolor: "#EDF9FF",
                border: "1px solid #BBDEFB",
                borderRadius: "12px",
                p: 3,
                gridRow: "span 2",
                "@media (max-width: 900px)": {
                  gridRow: "auto",
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <SquareLogo size={32} color="#1053BD"  />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Foundations Are Mandatory, Implementation Is Flexible
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Mandatory placement rules, spacing requirements, and padding guidelines
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFF7FF",
                border: "1px solid #F4E6FF",
                borderRadius: "12px",
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={32} color="#5B2F8F" />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                    Basic Guidelines
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Simple, developer-focused documentation for spacing, grids, and typography
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#EEFFF6",
                border: "1px solid #B2FFDD",
                borderRadius: "12px",
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PersonArmsSpread size={32} color="#049155" />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                    Accessibility Tools
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    WCAG compliance checkers and{" "}
                    <Link href="/design-system/accessible-palettes" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                      color contrast validators
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFF9EC",
                border: "1px solid #FFE1A5",
                borderRadius: "12px",
                p: 3,
                gridColumn: "span 2",
                "@media (max-width: 900px)": {
                  gridColumn: "auto",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PaintBrushHousehold size={32} color="#B75006" />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                    Figma Kit (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    <Link href="/figma-kit" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                      Tokenized design kit
                    </Link>{" "}
                    for teams who want structured design system support
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* Frequently Asked Questions Section */}
        <Stack gap={3}>
          <Stack gap={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Quick answers to common questions
            </Typography>
          </Stack>

          <Stack gap={2}>
            {quickStartFaqs.map((faq, index) => (
              <FaqAccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                expanded={expandedFaq === index}
                onChange={() => setExpandedFaq(expandedFaq === index ? null : index)}
              />
            ))}
          </Stack>

          {/* More FAQs CTA */}
          <Box
            sx={{
              mt: 4,
              pt: 4,
              textAlign: "center",
              borderTop: "2px solid #E0E0E0",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                mb: 2,
                fontSize: { xs: "0.95rem", md: "1rem" },
              }}
            >
              Have more questions?
            </Typography>
            <Link href="/faqs">
              <Box
                sx={{
                  display: "inline-block",
                  px: 4,
                  py: 2,
                  bgcolor: "#000000",
                  color: "#FFFFFF",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#1a1a1a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                View All FAQs
              </Box>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
