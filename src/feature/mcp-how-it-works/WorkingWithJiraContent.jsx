"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PageHeader from "./components/PageHeader";
import SectionHeading from "./components/SectionHeading";
import SubSection from "./components/SubSection";
import CodeBlock from "./components/CodeBlock";
import DataTable from "./components/DataTable";
import McpVideoPlayer from "@/components/shared/McpVideoPlayer";
import PageNav from "./components/PageNav";

export default function WorkingWithJiraContent() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        <PageHeader
          current="Working with Jira"
          title="Getting Started with Jira"
          subtitle="Write clear requirements in Jira. BrandSync MCP reads them and starts the pipeline by generating flows, identifying components, and packaging the handoff."
        />

        <Stack>
          <Typography
            sx={{
              fontSize: "24px",
              lineHeight: "36px",
              fontWeight: 700,
              color: "text.primary",
              mb:1,
            }}
          >
            Video Demo
          </Typography>
          <McpVideoPlayer src="/mcp/videos/From%20Jira%20to%20BrandSync%20aligned%20UI%20code%20%F0%9F%9A%80.webm" poster="/mcp/videos/from-jira-thumbnail.jpg" />
        </Stack>

        <SectionHeading
          title="Why Jira is your starting point"
          body="BrandSync MCP reads Jira tickets automatically, with no special setup and no parallel tool to learn. Your requirements live where they already live, and the pipeline reacts to what you write there. Think of Jira as the source of truth. The quality of what BrandSync generates downstream is determined entirely by what goes in at this step."
        />

        <SectionHeading
          title="What to include in a ticket"
          body="Three elements together give BrandSync enough to generate a complete flow. Leave any of them out and the pipeline has to guess, and that guessing shows up as open questions, missing states, or an incomplete handoff. Each element answers a different question about what you're building."
        />

        <Stack spacing={3}>
          <SubSection
            title="Element 1: Feature overview"
            body="One sentence that describes what you're building. Tells BrandSync the big picture so every subsequent artifact is framed correctly."
          />
          <CodeBlock
            title="Feature overview"
            lines={[
              "Title: Password Reset Flow",
              "Description: Enable users to securely reset",
              "             forgotten passwords via email.",
            ]}
          />
        </Stack>

        <Stack spacing={3}>
          <SubSection
            title="Element 2: User stories"
            body={
              'Written from the user perspective in the "As a [user], I can [action] so that [benefit]" format. Stories define the flow and the journey, and each story typically maps to one or more screens.'
            }
          />
          <CodeBlock
            title="User stories"
            lines={[
              'As a user, I can click "Forgot Password"',
              "  and enter my email.",
              "As a user, I can receive a reset link",
              "  via email.",
              "As a user, I can set a new password",
              "  using the link.",
            ]}
          />
        </Stack>

        <Stack spacing={3}>
          <SubSection
            title="Element 3: Acceptance criteria"
            body="Specific, testable conditions that define success. Criteria tell BrandSync which states to generate, which edge cases to surface as open questions, and what the handoff needs to cover."
          />
          <CodeBlock
            title="Acceptance criteria"
            lines={[
              "Email input requires valid format.",
              "Reset link is valid for 24 hours.",
              "Expired link shows error message.",
              "Success state confirms password changed.",
              "Support desktop and mobile viewports.",
            ]}
          />
        </Stack>

        <Divider />

        <SectionHeading
          title="Good vs. bad requirements"
          body="The difference between a ticket that generates a complete handoff and one that comes back full of open questions is almost always specificity. A vague ticket forces BrandSync to guess at scope; a specific one lets it generate flows, components, and tokens with confidence."
        />

        <CodeBlock
          title="✗ Too vague"
          lines={[
            "Title: Add Password Reset",
            "Description: Users need to be able to reset",
            "             their password.",
            " ",
            "// No user stories, no criteria, no states.",
            "// BrandSync has to invent everything.",
          ]}
        />

        <CodeBlock
          title="✓ BrandSync-ready"
          lines={[
            "Title: Password Reset Flow",
            "Description: Enable users to securely reset",
            "             forgotten passwords.",
            " ",
            "User Stories:",
            "  - As a user with a forgotten password,",
            '      I can click "Forgot Password" to start.',
            "  - As a user, I can enter my email and",
            "      receive a reset link.",
            "  - As a user, I can click the link and",
            "      set a new password.",
            " ",
            "Acceptance Criteria:",
            "  - Email input requires valid format.",
            "  - Reset link valid for 24 hours.",
            "  - Expired link shows error message.",
            "  - Success state confirms password changed.",
            "  - Support desktop and mobile viewports.",
          ]}
        />

        <Divider />

        {/* Custom section — body contains inline JSX code span */}
        <Box>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "40px",
              color: "#121212",
              mb: 0.5,
            }}
          >
            What BrandSync reads from your ticket
          </Typography>
          <Typography
            sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}
          >
            Four fields are parsed automatically. Each one feeds a different
            part of the pipeline: flow generation, component identification, and
            the open-questions list. The same ticket is read by{" "}
            <Typography
              component="span"
              sx={{
                fontFamily: "'Roboto Mono', monospace",
                color: "#0066ae",
                fontSize: "16px",
              }}
            >
              parse_requirements
            </Typography>{" "}
            on every update, so edits to any of these fields regenerate the
            downstream artifacts.
          </Typography>
        </Box>

        <DataTable rows={TICKET_FIELDS} isMonospace />

        <SectionHeading
          title="Best practices"
          body="A handful of patterns separate tickets that produce clean handoffs from tickets that stall the pipeline. None of them require extra tooling; they're about how you describe what you want."
        />

        <DataTable rows={BEST_PRACTICES} />

        <Divider />

        <PageNav
          prev={{
            href: "/mcp/getting-started/framework-support",
            label: "Previous",
          }}
          next={{
            href: "/mcp/how-it-works/understanding-figjam",
            label: "Next: Understanding Figjam",
          }}
        />
      </Stack>
    </Box>
  );
}

const TICKET_FIELDS = [
  {
    left: "title",
    right:
      "Feature title and description. Sets the scope and the top-level framing for the generated FigJam board.",
  },
  {
    left: "user_stories",
    right:
      "User stories are parsed into the screens and transitions that form the generated flow diagram.",
  },
  {
    left: "acceptance_criteria",
    right:
      "Criteria feed state detection (loading, error, empty, success) and determine which edge cases become open questions.",
  },
  {
    left: "labels",
    right:
      "Labels and tags add context for categorization: framework hints, platform targets, and handoff routing.",
  },
];

const BEST_PRACTICES = [
  {
    left: "Be specific",
    right:
      'Describe user journeys in concrete terms. "Enter email" is actionable; "handle auth" is not.',
  },
  {
    left: "Cover edge cases",
    right:
      "Mention what happens when things go wrong, like expired links, invalid inputs, empty states, or rate limits.",
  },
  {
    left: "Note the viewports",
    right:
      "If responsive behavior matters, say so. BrandSync generates mobile/desktop variants only when asked.",
  },
  {
    left: "Write for humans",
    right:
      'Avoid design language ("beautiful button," "modern look"). Describe what the user does and what they see.',
  },
  {
    left: "One feature per ticket",
    right:
      "Keep scope tight. Epics with multiple features produce fragmented flows; split them into stories.",
  },
  {
    left: "Let tokens speak",
    right:
      "Don't specify hex colors or pixel values. BrandSync resolves these from the live token system.",
  },
];
