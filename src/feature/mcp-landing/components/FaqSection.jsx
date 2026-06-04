"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FaqAccordionItem from "@/components/shared/FaqAccordionItem";
import SectionBadge from "./SectionBadge";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const FAQS = [
  {
    question: "How much time does BrandSync MCP actually save?",
    answer:
      "Teams report moving from manual flowchart creation and scattered requirements (2-4 hours) to structured, actionable handoffs in 2-10 minutes depending on complexity. More importantly, developers receive complete context immediately no back-and-forth questions. Typical time savings: 3-5 hours per feature, with faster development cycles.",
  },
  {
    question: "What if the generated flows don't match our requirements?",
    answer:
      "BrandSync MCP generates flows as starting points, not final outputs. You review the generated FigJam board and can edit directly add screens, adjust transitions, refine components. If the system misunderstood, update your Jira requirements for clarity and regenerate. Human review is built into the workflow.",
  },
  {
    question: "Will BrandSync MCP replace designers or product managers?",
    answer:
      "No. BrandSync automates flowchart creation and component identification not design thinking or strategy. Designers still make UX decisions, write clear requirements, and review generated flows. PMs still own the requirements and user stories. BrandSync eliminates repetitive diagram creation so teams focus on strategy, not mechanics.",
  },
  {
    question: "What happens when requirements don't fit standard patterns?",
    answer:
      "BrandSync handles the 80% that follows standard patterns (login, forms, tables, dashboards, etc.). For truly unusual flows, the system flags them as \"open questions\" for your team to discuss. You can then adjust the requirement, request a new pattern, or build manually. Leverage is the goal, not forcing everything through automation.",
  },
  {
    question: "How long does it take for a team to get productive with BrandSync MCP?",
    answer:
      "Most teams submit their first ticket and see generated flows within the first day. Real time savings appear in week one when developers receive complete handoffs instead of asking clarifying questions. Full team fluency takes about 2-3 weeks. Templates, examples, and role-specific guides accelerate adoption.",
  },
  {
    question: "What if our requirements are unclear or ambiguous?",
    answer:
      "BrandSync will process any ticket, but unclear requirements lead to incomplete flows. The system automatically flags ambiguities as \"open questions\" (e.g., \"Should we support social login?\" or \"What's the timeout duration?\"). These surface for your team to discuss before development starts preventing surprises later. Better requirements equal better flows.",
  },
  {
    question: "How does BrandSync MCP fit into our existing design and development workflow?",
    answer:
      "BrandSync is non-invasive. It sits alongside your existing tools Jira, Figma, FigJam, your design system, development workflows. No new tools to learn. No framework changes. No restructuring. It reads from Jira, generates FigJam boards, and outputs structured handoff data. Everything integrates with what you're already using.",
  },
  {
    question: "What happens when the design system changes?",
    answer:
      "Design system changes are the source of truth. BrandSync automatically reflects new components, updated tokens, and modified patterns in all future generations. For existing flows, you can regenerate with updated system data if needed. The system maintains version history, so you can track what changed and when.",
  },
  {
    question: "Can I use BrandSync MCP to fix UI issues or add features to an existing project?",
    answer:
      "Yes. BrandSync works for new features and existing product updates. Submit a Jira ticket for the feature or fix, BrandSync generates flows and components, then integrate the code into your existing project. No need to rebuild. It slots into what you already have.",
  },
  {
    question: "Are there any specific frontend frameworks that we need to use to work with BrandSync MCP?",
    answer:
      "No. BrandSync is framework-agnostic and supports React, Vue, Angular, Svelte, Flutter, .NET MAUI, .NET WPF, and HTML/CSS. When you submit a requirement, specify your framework and BrandSync generates idiomatic code for that platform. No tech stack changes needed.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 8 },
      }}
    >
      <Stack spacing={10} alignItems="center" sx={{ maxWidth: 1280, mx: "auto", width: "100%" }}>

        {/* Section header */}
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 768, width: "100%", textAlign: "center" }}>
          <MotionBox
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <SectionBadge>Frequently Asked Questions</SectionBadge>
          </MotionBox>
          <MotionTypography
            component="h2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
          >
            Questions About BrandSync MCP?
          </MotionTypography>
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            sx={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.5, color: "text.secondary" }}
          >
            Get clarity on time savings, workflow changes, design system integration, and how your team will work with the pipeline.
          </MotionTypography>
        </Stack>

        {/* Accordion list — items stagger in as the section scrolls into view */}
        <Stack spacing={3} sx={{ maxWidth: 1000, width: "100%" }}>
          {FAQS.map((faq, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              <FaqAccordionItem
                question={faq.question}
                answer={faq.answer}
                expanded={openIndex === i}
                onChange={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </MotionBox>
          ))}
        </Stack>

      </Stack>
    </Box>
  );
}
