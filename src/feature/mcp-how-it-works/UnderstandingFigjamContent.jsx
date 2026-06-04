"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PageHeader from "./components/PageHeader";
import SectionHeading from "./components/SectionHeading";
import SubSection from "./components/SubSection";
import DataTable from "./components/DataTable";
import PageNav from "./components/PageNav";
import MediaPlaceholder from "@/feature/mcp-how-it-works/components/MediaPlaceholder";
import LazyImage from "@/components/shared/LazyImage";

export default function UnderstandingFigjamContent() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>

        <PageHeader
          current="Understanding Your FigJam Flow"
          title="Understanding Your FigJam Flow"
          subtitle="Review the flow BrandSync generated. Edit it, approve it, or flag ambiguities. The board is your starting point, not the final design."
        />

        {/* <MediaPlaceholder
          type="video"
          title="Video demo · Understanding FigJam Flow"
          description="Walkthrough of writing a BrandSync-ready Jira ticket from scratch"
          dimensions="1112 × 626"
          height={626}
        /> */}

        <SectionHeading
          title="What BrandSync generated for you"
          body="The moment your Jira ticket lands in the pipeline, BrandSync MCP creates a FigJam board with your complete flow. Every screen, transition, decision point, and edge case is laid out visually, not as a final design, but as the working surface your team reviews, edits, and approves. It's yours from the second it's generated: the board lives in your workspace, carries your permissions, and can be edited like any other FigJam file."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/Full-flow.jpg"
            alt="Full generated FigJam board: overview"
            width={1112}
            height={626}
            style={{ width: "100%", height: 400 }}
          />
        </Box>

        <Divider />

        <SectionHeading
          title="Reading your flow diagram"
          body="The generated board uses four element types. Knowing what each one means makes reviewing the flow fast and disagreements specific, so you can point at a shape and say exactly what needs to change."
        />

        <SubSection
          title="Screens"
          body="Each box is one screen or one state of a screen. The label tells you what's being displayed. Size and colour are not meaningful; only the label and its connections matter."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/Screens.jpg"
            alt="Screens: FigJam board snippet"
            width={1112}
            height={695}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <SubSection
          title="Transitions"
          body="Arrows connect screens in the order a user moves through them. Arrow direction is the flow direction. Labels on arrows describe the condition that triggers the transition: what the user did, or what the system decided."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/Transitions.jpg"
            alt="Transitions: labeled arrows between screens"
            width={1112}
            height={695}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <SubSection
          title="Decision points"
          body="Where the flow branches based on a condition. Usually drawn as a diamond or as a screen with two outgoing arrows. Both the happy path and the error path are shown; if only one is present, the flow is incomplete."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/Decision-points.jpg"
            alt="Decision point: branching flow"
            width={1112}
            height={695}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <SubSection
          title="Terminal states"
          body="The end points of a flow. Success terminals represent a completed journey; error terminals represent flows the user couldn't complete. Every entry screen should lead to at least one terminal. If it doesn't, something is missing."
        />

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/EnD-states.jpg"
            alt="End states: success and error endings"
            width={1112}
            height={695}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <Divider />

        <SectionHeading
          title="Reviewing your flow"
          body="Three checks in order. Do them every time. Skipping any one of them tends to produce a handoff that needs rework later."
        />

        <DataTable rows={REVIEW_CHECKS} />

        <SectionHeading
          title="Editing your flow"
          body="You own the board. Most edits happen directly in FigJam, but some require going back to Jira and regenerating. The rule is: fix details in FigJam, fix intent in Jira."
        />

        <Divider />

        {/* Custom section — body contains inline JSX code span */}
        <Box>
          <Typography sx={{ fontSize: "28px", fontWeight: 700, lineHeight: "40px", color: "#121212", mb: 0.5 }}>
            Open questions BrandSync flagged
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}>
            Anywhere your Jira ticket was ambiguous, BrandSync surfaces a question rather than guessing.
            These appear on the board as{" "}
            <Typography component="span" sx={{ fontFamily: "'Roboto Mono', monospace", color: "#0066ae", fontSize: "16px" }}>
              question nodes
            </Typography>
            {" "}and in the structured handoff data. Resolve each one before marking the flow approved,
            because an unresolved question becomes implementation rework later.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <LazyImage
            src="/mcp/how-it-works/Open-questions.jpg"
            alt="Open-question nodes on the board"
            width={1112}
            height={695}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <SectionHeading
          title="Who reviews your flow"
          body="The review group depends on the feature, but there are four roles that almost always belong in the conversation. Each one is looking for something different."
        />

        <DataTable rows={REVIEWERS} />

        <SectionHeading
          title="Sharing your flow"
          body="Share the FigJam link with anyone who needs context. Developers get it automatically via the handoff package; design-system maintainers want to see which components were identified so they can spot usage patterns; adjacent teams benefit when your flow touches their surfaces. FigJam permissions carry over, so access control is the same as any other board in your workspace."
        />

        <SectionHeading
          title="What happens to your approved flow"
          body="Approval flips the flow from a working document into a reference document. It becomes the implementation spec for development, the reference for code review, the user-journey documentation for QA, and the basis for future handoffs that touch the same feature. Every artifact BrandSync generates downstream, from the component list to the token requirements to the structured handoff JSON, is derived from the approved flow, not the draft."
        />

        <Divider />

        <SectionHeading
          title="Troubleshooting flow issues"
          body="The three most common issues, and what to do about each. If none of these fit, the Jira ticket is usually the real source of the problem. Re-read it with fresh eyes and check whether it matches what you meant to ask for."
        />

        <DataTable rows={TROUBLESHOOTING} />

        <Divider />

        <PageNav
          prev={{ href: "/mcp/how-it-works/working-with-jira", label: "Previous" }}
          next={{ href: "/mcp/how-it-works/handoff-to-development", label: "Next: Handoff to Development" }}
        />

      </Stack>
    </Box>
  );
}

const REVIEW_CHECKS = [
  { left: "1. Check accuracy", right: "Does the flow match what you intended to build in Jira? If a screen is there that you didn't ask for, either Jira was ambiguous or BrandSync interpreted it too liberally. Mark issues inline as FigJam comments." },
  { left: "2. Validate screen count", right: "Count the screens. Is that roughly what you expected for the feature? Too many screens often means an overloaded user story; too few usually means missing error states or empty states." },
  { left: "3. Inspect component identification", right: "Every screen has a list of components BrandSync thinks it needs. Check whether the components match your design system and flag any the system thinks are needed but you don't have yet." },
];

const REVIEWERS = [
  { left: "Requirements author", right: "Confirms the flow matches what they wrote. Usually the designer or PM who created the Jira ticket. They own the intent." },
  { left: "Product manager", right: "Validates scope and priorities. Catches cases where the flow technically matches the ticket but drifts from product goals." },
  { left: "Tech lead / architect", right: "Confirms feasibility. Flags flows that imply API work, integration changes, or platform constraints the team doesn't have capacity for." },
  { left: "Developer (optional)", right: "Early feedback on implementability. Not always required, but catches detail-level issues that save cycles downstream." },
];

const TROUBLESHOOTING = [
  { left: "Missing screens", right: "Check the Jira ticket first. Did you mention this screen, explicitly or implicitly? If yes, add detail and regenerate. If no, add it directly in FigJam and annotate why." },
  { left: "Unnecessary screens", right: "Delete the screen from FigJam, reconnect the transitions to skip it, and leave a comment explaining why. BrandSync tends to over-generate for ambiguous criteria." },
  { left: "Unclear transitions", right: "Click the arrow and read its label. If the label doesn't explain the condition, add a FigJam comment and tag the requirements author; the Jira ticket was probably underspecified." },
  { left: "Wrong component suggestions", right: "BrandSync matches based on the live component library. If it's suggesting something outdated or missing a newer component, ping the design-system team. This is usually their signal to update the MCP index." },
];
