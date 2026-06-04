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
import ImagePlaceholder from "./components/ImagePlaceholder";
import MediaPlaceholder from "./components/MediaPlaceholder";
import PageNav from "./components/PageNav";
import Image from "next/image";
import LazyImage from "@/components/shared/LazyImage";

export default function HandoffToDevelopmentContent() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        <PageHeader
          current="From Handoff to Development"
          title="From Handoff to Development"
          subtitle="Your flow is approved. BrandSync packages everything your developers need to build, and the pipeline keeps learning from what ships."
        />

        {/* <MediaPlaceholder
          type="video"
          title="Video demo · From Handoff to Development"
          description="Walkthrough of the BrandSync handoff package and how developers consume it"
          dimensions="1112 × 626"
          height={626}
        /> */}

        <SectionHeading
          title="What happens after approval"
          body="When you approve the FigJam flow, BrandSync MCP compiles everything into a single handoff package: flows, component requirements, token specifications, open-question resolutions, dependencies, and next steps. This package is what development consumes. It is the contract between design intent and implementation, and it is versioned alongside your Jira ticket so any revision regenerates the downstream artifacts."
        />

        <Divider />

        <SectionHeading
          title="The handoff package"
          body="Four things go to development. The first three are reference artifacts: how the feature should look and behave, which components to use, and which tokens to apply. The fourth is the machine-readable version of all of them, so tooling downstream can read the handoff without a human translating it."
        />

        <SubSection
          title="Flows and screens"
          body="The approved FigJam board, linked directly. Every screen, every state, every transition is visible at the same level of detail developers used during review, so nothing is lost in translation."
        />

        <SubSection
          title="Component requirements"
          body="Every BrandSync component the flow needs, with instance counts and the states each screen uses. Developers know exactly which components to pull and which variants to instantiate before they write a line of code."
        />

        <SubSection
          title="Token specifications"
          body="Every token the feature should reference, resolved from the live design system at the moment of handoff. No pixel values, no hex codes, no guessing. If a token does not exist, BrandSync flags it as a gap for the design-system team rather than inventing one."
        />

        <Stack spacing={3}>
          <SubSection
            title="Structured data"
            body="The same information in JSON. Machine-readable, version-controlled, and consumable by downstream tooling. This is what gets fed into Claude, into Claude Code, and into any other automation attached to the pipeline."
          />
          <CodeBlock
            title="handoff.json"
            lines={[
              "{",
              '  "project": "Auth System",',
              '  "screens": [',
              "    {",
              '      "name": "LoginScreen",',
              '      "components": ["Form", "Input", "Button"],',
              '      "states": ["default", "loading", "error"],',
              '      "tokens": [',
              '        "color-primary",',
              '        "space-md",',
              '        "font-body"',
              "      ]",
              "    }",
              "  ],",
              '  "openQuestions": [',
              '    { "q": "Social login?", "a": "Yes (Google, GitHub)" },',
              '    { "q": "Reset link TTL?", "a": "24 hours" }',
              "  ]",
              "}",
            ]}
          />
        </Stack>

        <Divider />

        <SectionHeading
          title="The developer's role"
          body="Four stages. Each one assumes the previous one happened. If a question surfaces at any stage, BrandSync Brain usually has the answer without a context switch to Slack or Figma."
        />

        <DataTable rows={DEVELOPER_STAGES} />

        <SectionHeading
          title="Open questions and decisions"
          body="Every question BrandSync flagged during flow generation comes into the handoff with its resolution attached. If the team decided yes, the implementation knows to include it. If no, the feature ships without it, and the decision is recorded so nobody has to re-litigate it six months later."
        />

        <CodeBlock
          title="Question to decision"
          lines={[
            "Q: Should we support social login?",
            "Decision: Yes, Google and GitHub.",
            "Implementation: Add Social Login Button component.",
            " ",
            "Q: What is the reset link timeout?",
            "Decision: 24 hours.",
            'Implementation: Token "auth-reset-ttl" set to 86400s.',
            " ",
            "Q: Password strength indicator on signup?",
            "Decision: No, deferred to post-launch review.",
            "Implementation: Not included in this handoff.",
          ]}
        />

        <SectionHeading
          title="Token requirements and consistency"
          body="Tokens are the reason BrandSync-shipped features stay consistent without constant policing. The rule is straightforward: never hardcode a colour, a spacing, or a typography value. Pull everything from the token system, so when the design system changes, every feature inherits the change without touching the code."
        />

        <CodeBlock
          title="Hardcode versus token"
          lines={[
            "// ✗ Wrong",
            'backgroundColor: "#534AB7"',
            'padding: "16px"',
            'fontSize: "14px"',
            " ",
            "// ✓ Right",
            'backgroundColor: "var(--color-primary)"',
            'padding: "var(--space-md)"',
            'fontSize: "var(--font-body)"',
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
            Using BrandSync Brain
          </Typography>
          <Typography
            sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}
          >
            BrandSync Brain is the AI knowledge assistant that sits beside the
            handoff. It knows every token, every component, every pattern, and
            every guideline. Ask it in plain language, inside Claude or Claude
            Code, and it answers from the live design system. It is reachable
            via the{" "}
            <Typography
              component="span"
              sx={{
                fontFamily: "'Roboto Mono', monospace",
                color: "#0066ae",
                fontSize: "16px",
              }}
            >
              brandsync_brain
            </Typography>{" "}
            tool, so the same agent that reads your handoff can also ask
            follow-up questions without a separate round trip.
          </Typography>
        </Box>

        <DataTable rows={BRAIN_CAPABILITIES} />

        <SectionHeading
          title="Code generation with Claude"
          body="Once the handoff is loaded, Claude can produce production-ready code directly. The handoff is the context. The approved flow is the spec. Components and tokens are resolved. Claude generates framework-native code that uses the right components with the right tokens the first time, which means code review stops being a design-system audit and goes back to being about logic and architecture."
        />

        <SectionHeading
          title="After development"
          body="Shipping is not the end of the pipeline. BrandSync tracks which components got used, which tokens were applied, and which gaps the build exposed. The design-system team sees what is actually in the wild, which makes the next version of the system better informed than the last. Every shipped feature is a data point about what the system does well and where it needs to grow."
        />

        <Divider />

        <SectionHeading
          title="Troubleshooting development"
          body="Three issues come up often enough to name. If the problem is something else, the handoff usually has the answer in its JSON, and BrandSync Brain can help interpret it."
        />

        <DataTable rows={TROUBLESHOOTING} />

        <SectionHeading
          title="End-to-end summary"
          body="The full journey on one page. Every step feeds the next, and every output can be regenerated from the input without manual effort. This is the loop that makes BrandSync worth using: tight inputs, consistent outputs, and a system that gets smarter every time someone ships."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/end-to-end-pipeline.png"
            alt="End-to-end summary"
            width={1200}
            height={600}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <SectionHeading
          title="Key takeaways"
          body="What each role gets out of the pipeline. Different benefits, one workflow."
        />

        <DataTable rows={KEY_TAKEAWAYS} />

        <SectionHeading
          title="Next steps and support"
          body="You have completed the three-page walkthrough. From here, the rest of the documentation goes deeper on the foundations: how tokens are structured, how patterns are encoded, which frameworks are supported, and how to set things up for your team. If something breaks or behaves unexpectedly, the design-system team is your best first stop."
        />

        <Divider />

        <PageNav
          prev={{
            href: "/mcp/how-it-works/understanding-figjam",
            label: "Previous",
          }}
          next={{
            href: "/mcp/how-it-works/brandsync-foundations",
            label: "Brandsync Foundations",
          }}
        />
      </Stack>
    </Box>
  );
}

const DEVELOPER_STAGES = [
  {
    left: "1. Review the package",
    right:
      "Read the flow diagram, understand all screens and states, note the component list, and check the token specifications. The package is the single source of context for the entire feature.",
  },
  {
    left: "2. Ask questions",
    right:
      "Anything the package does not answer goes to BrandSync Brain: component APIs, token meaning, pattern guidance. Instant answers, no context switch, no waiting on a designer.",
  },
  {
    left: "3. Build",
    right:
      "Use the identified components. Apply the specified tokens. Follow the flow. Code written against the handoff is system-compliant by default, not by review.",
  },
  {
    left: "4. Review and ship",
    right:
      "Submit for code review as usual. Reviewers check whether the code matches the flow and the tokens are used correctly. Ship once approved.",
  },
];

const BRAIN_CAPABILITIES = [
  {
    left: "Component specs",
    right:
      '"What is the Button component API?" returns anatomy, states, props, and token usage. No digging through Storybook, no Slack pings.',
  },
  {
    left: "Token names",
    right:
      '"What spacing token should I use for form gaps?" returns "space-md for input gaps, space-lg for section padding" with the exact token path.',
  },
  {
    left: "Code generation",
    right:
      '"Generate a login form using BrandSync components" returns framework-native code with correct tokens, correct components, and correct states.',
  },
];

const TROUBLESHOOTING = [
  {
    left: "Component spec unclear",
    right:
      "Ask BrandSync Brain for the full component details. If the spec itself is ambiguous, check the open-questions section of the handoff for a decision that might resolve it.",
  },
  {
    left: "Token name seems wrong",
    right:
      "Ask BrandSync Brain to verify the token exists. If it does not, the handoff may be stale relative to the design system. Regenerate the handoff to pick up the current token set.",
  },
  {
    left: "Flow does not match what you are building",
    right:
      "Re-read the flow in FigJam. If it genuinely differs from the Jira ticket, update the ticket and regenerate. The flow is the source of truth for the build, not your memory of the requirements.",
  },
];

const KEY_TAKEAWAYS = [
  {
    left: "Designers and PMs",
    right:
      "Clear Jira requirements produce clear flows. Approved flows are ready for development. No ambiguity means no rework later.",
  },
  {
    left: "Developers",
    right:
      "A complete handoff answers most questions before they are asked. BrandSync Brain handles the rest. Generated code is production-ready, not a mockup.",
  },
  {
    left: "Teams",
    right:
      "The design system becomes the source of truth. Consistency is guaranteed by default, not by review. Every shipped feature makes the next one faster.",
  },
];
