import Link from "next/link";
import { Box } from "@mui/material";

const FIGMA_UI_KIT_LINK = "https://www.figma.com/design/zF98rGtaPpBjSc2PpPK5vo/EG-Brand-Sync-UI-Kit---v1.0?m=auto&node-id=7009-158749&t=C8HsxOYFCwqOGwCj-1";

export const faqCategories = {
  quickStart: {
    title: "Quick Start",
    faqs: [
      {
        question: "I already use a frontend framework, how can I use BrandSync?",
        answer: (
          <>
            BrandSync is framework-agnostic and designed to work with any
            frontend stack. You can continue using your existing framework
            (React, Vue, Angular, etc.) and simply apply our{" "}
            <Link href="/design-system">design foundations</Link> like spacing,
            typography, and logo placement guidelines. Our{" "}
            <Link href="/design-system/quick-start-guide">
              Quick Start Guide
            </Link>{" "}
            provides implementation examples for various frameworks.
          </>
        ),
      },
      {
        question: "Is the Figma kit mandatory for implementation?",
        answer: (
          <>
            No, the{" "}
            <Link href={FIGMA_UI_KIT_LINK}>
              Figma kit
            </Link>{" "}
            is optional. It&apos;s provided as a helpful resource for teams who
            want a structured design system, but you can implement BrandSync
            foundations using your existing tools and workflows. The mandatory
            requirements are the{" "}
            <Link href="/design-system">design foundations</Link> (spacing,
            typography, logo placement) and{" "}
            <Link href="/design-system/accessibility">
              accessibility guidelines
            </Link>
            , not the specific tools you use.
          </>
        ),
      },
      {
        question: "How long does it typically take to implement BrandSync?",
        answer: (
          <>
            Implementation time varies based on your product&apos;s current state
            and complexity. We recommend planning for 2-3 sprint cycles to
            implement the foundational requirements. Start with high-impact items
            like logo placement and critical accessibility fixes, then
            progressively address spacing and typography standards. Use our{" "}
            <Link href="/design-system/implementation-planner">
              Implementation Planner
            </Link>{" "}
            to get a personalized estimate.
          </>
        ),
      },
      {
        question:
          "What happens if my product doesn't meet all requirements immediately?",
        answer: (
          <>
            We understand that full compliance takes time. BrandSync is designed
            to be implemented progressively. Focus on the{" "}
            <Link href="/design-system">mandatory foundations</Link> first, then
            work through other requirements over time. Our{" "}
            <Link href="/support">team</Link> is here to support you throughout
            the journey, not to enforce strict deadlines. We value progress over
            perfection.
          </>
        ),
      },
      {
        question: "Who can I contact for help with implementation?",
        answer: (
          <>
            The BrandSync team is available to provide guidance and support
            throughout your implementation journey. You can reach out through our{" "}
            <Link href="/support">support channels</Link> for clarification on
            guidelines, help with specific implementation challenges, or general
            questions about the system. We&apos;re here to make your transition
            as smooth as possible.
          </>
        ),
      },
    ],
  },
  general: {
    title: "General Information",
    faqs: [
      {
        question: "Who maintains BrandSync?",
        answer: (
          <>
            BrandSync is reviewed and governed by the{" "}
            <Link href="/governance">EG UX Expert Panel</Link>, consisting of
            UI Designers, UX Researchers, and Product Managers across EG. The
            core documentation is maintained by the BrandSync team in the
            <Link href="https://egonline.sharepoint.com/sites/intranet/SitePages/UX-and-UI.aspx">
              {" "}
              Technology Integration & Transformation
            </Link>{" "}
            Department.
          </>
        ),
      },
      {
        question: "How often is BrandSync updated?",
        answer: (
          <>
            Components are reviewed and updated through weekly Tuesday meetings
            during the release cycle. See our{" "}
            <Link href="/governance">Governance</Link> page for more details on
            the review process.
          </>
        ),
      },
      {
        question: "Which products must use BrandSync?",
        answer: (
          <>
            BrandSync is being rolled out across EG&apos;s full product
            portfolio. With 140 plus products, we&apos;re taking a phased
            approach. If you&apos;re unsure about your product&apos;s timeline,
            reach out to the <Link href="/support">BrandSync Support team</Link> or your
            business unit&apos;s design lead.
          </>
        ),
      },
      {
        question:
          "Is BrandSync mandatory for new features or only new products?",
        answer: (
          <>
            <Box sx={{ mb: 1 }}>
              BrandSync applies to both new products and new features in
              existing ones.
            </Box>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <strong>New products:</strong> Build in BrandSync foundations
                from the start
              </li>
              <li>
                <strong>Existing products:</strong> Review against{" "}
                <Link href="/design-system">
                  BrandSync foundations
                </Link>{" "}
                (logo placement, spacing, accessibility)
              </li>
            </Box>
            <Box sx={{ mt: 1 }}>
              Follow the 5-step process on the{" "}
              <Link href="/design-system/quick-start-guide">
                Quick Start page
              </Link>{" "}
              and adopt updates gradually as you release new screens or
              features.
            </Box>
          </>
        ),
      },
    ],
  },
  governance: {
    title: "Governance & Changes",
    faqs: [
      {
        question: "How do I propose changes or new components?",
        answer: (
          <>
            All component proposals go through the UX Expert Panel governance
            process. You can submit requests through our{" "}
            <Link href="/support"> Support Form</Link>.
          </>
        ),
      },
      {
        question:
          "What happens if my use case is not covered by existing components?",
        answer: (
          <>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <li>
                First, check if existing components can be adapted or combined
                to meet your needs
              </li>
              <li>
                If not, document your use case and reach out to the{" "}
                <Link href="/support">BrandSync Support team</Link>
              </li>
              <li>
                We&apos;ll evaluate whether this represents a gap that should be
                filled with a new standard component or if it&apos;s a
                product-specific need
              </li>
            </Box>
            <Box sx={{ mt: 1 }}>
              This feedback is valuable for evolving BrandSync to serve the
              entire portfolio.
            </Box>
          </>
        ),
      },
    ],
  },
  features: {
    title: "Features & Capabilities",
    faqs: [
      {
        question: "Can I create themes for different products?",
        answer: (
          <>
            Yes, the theme builder (launching January 2026) allows you to
            generate brand-specific themes while maintaining{" "}
            <Link href="/design-system">foundation</Link> consistency.
          </>
        ),
      },
      {
        question: "Where can I find accessibility documentation?",
        answer: (
          <>
            Each component includes accessibility specifications, keyboard
            navigation patterns, and ARIA requirements in its documentation.
            Please refer to the{" "}
            <Link href="/design-system/accessibility">Accessibility</Link> page
            for more information.
          </>
        ),
      },
      {
        question:
          "Where can I find the Figma libraries and how do I get access?",
        answer: (
          <>
            <Box sx={{ mb: 1 }}>
              Figma libraries are publicly available through the EG{" "}
              <Link href={FIGMA_UI_KIT_LINK}>
                Figma workspace
              </Link>
              . If you need to install Figma or get a license, raise a request
              on ServiceNow or contact IT Support.
            </Box>
            <Box sx={{ mb: 1 }}>The libraries include:</Box>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Component specifications</li>
              <li>Usage guidelines</li>
              <li>Build kits for experimentation</li>
            </Box>
            <Box sx={{ mt: 1 }}>
              Make sure your Figma account is connected to the EG organization
              to see the shared libraries.
            </Box>
          </>
        ),
      },
    ],
  },
  migration: {
    title: "Migration & Implementation",
    faqs: [
      {
        question: "How do I migrate my existing product to BrandSync?",
        answer: (
          <>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <li>
                Match BrandSync components to the UI elements you already have
              </li>
              <li>
                Update gradually, screen by screen or feature by feature
                (don&apos;t try to redo everything at once)
              </li>
              <li>
                Use the{" "}
                <Link href={FIGMA_UI_KIT_LINK}>
                  Figma kit
                </Link>{" "}
                as a visual guide for how components should look and behave
              </li>
              <li>
                Focus first on the essentials:{" "}
                <Link href="/design-system">
                  spacing, logo placement, and accessibility
                </Link>
              </li>
              <li>
                Begin with high-visibility screens or ones already planned for
                updates
              </li>
            </Box>
            <Box sx={{ mt: 1 }}>
              We&apos;re putting together detailed migration guides with
              examples. If you want early access or need help with a specific
              use case, <Link href="/support">just reach out</Link>.
            </Box>
          </>
        ),
      },
      {
        question: "How do I migrate an existing screen to BrandSync components?",
        answer: (
          <>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <li>
                Identify which BrandSync components map to your current UI
                elements
              </li>
              <li>
                Work screen-by-screen or feature-by-feature rather than
                attempting a complete overhaul
              </li>
              <li>
                Use the{" "}
                <Link href={FIGMA_UI_KIT_LINK}>
                  Figma build kits
                </Link>{" "}
                as visual references for component usage
              </li>
              <li>
                Focus first on high-visibility screens or those due for updates
                anyway
              </li>
            </Box>
            <Box sx={{ mt: 1 }}>
              We&apos;re developing migration guides with specific
              examples; reach out through our{" "}
              <Link href="/support">support channels</Link> if you need early
              access or have specific migration questions.
            </Box>
          </>
        ),
      },
      {
        question: "What happens to our current design system?",
        answer: (
          <>
            <Box sx={{ mb: 1 }}>
              You can keep using your current design system or framework, but
              you&apos;ll need to align it with BrandSync&apos;s foundational
              standards:
            </Box>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Logo placement</li>
              <li>Colors</li>
              <li>Typography</li>
              <li>Spacing</li>
              <li>Accessibility</li>
            </Box>
            <Box sx={{ mt: 1 }}>
              Your product-specific components can stay as they are, as long as
              they don&apos;t conflict with these core requirements.
            </Box>
          </>
        ),
      },
      {
        question: "How long does migration typically take?",
        answer: (
          <>
            To migrate your existing product to EG BrandSync Design System, it
            typically takes 2-3 sprint cycles depending on the complexity of the
            product. Use our{" "}
            <Link href="/design-system/implementation-planner">
              Implementation Planner
            </Link>{" "}
            to get a personalized estimate for your project.
          </>
        ),
      },
      {
        question: "Is there a migration support program?",
        answer: (
          <>
            <Box sx={{ mb: 1 }}>
              The BrandSync team is available to provide guidance and support
              throughout your implementation journey. You can reach out through
              our <Link href="/support">support channels</Link> for:
            </Box>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Clarification on guidelines</li>
              <li>Help with specific implementation challenges</li>
              <li>General questions about the system</li>
            </Box>
            <Box sx={{ mt: 1 }}>
              We&apos;re here to make your transition as smooth as possible.
            </Box>
          </>
        ),
      },
    ],
  },
  implementation: {
    title: "Technical Implementation",
    faqs: [
      {
        question: "Is there a code library (React/Flutter/etc.) for BrandSync?",
        answer: (
          <>
            We&apos;re currently developing code implementations alongside the
            design system. The initial focus is on establishing{" "}
            <Link href="/design-system">
              foundational design elements
            </Link>{" "}
            and tokens.
          </>
        ),
      },
      {
        question: "How do I consume design tokens in code?",
        answer: (
          <>
            Design tokens will be available through our token distribution
            system once the technical pipeline is established. We&apos;re
            working on documentation that will cover token implementation for
            each supported platform. In the meantime, the{" "}
            <Link href={FIGMA_UI_KIT_LINK}>
              Figma libraries
            </Link>{" "}
            contain token specifications that can guide initial implementation.
            More detailed integration guides are coming as we finalize the
            distribution approach.
          </>
        ),
      },
      {
        question:
          "How do BrandSync tokens sync to our code repositories (e.g., via CI, token pipeline)?",
        answer: (
          <>
            We&apos;re establishing the technical infrastructure for token
            distribution. The implementation approach will depend on our various
            platforms and existing build systems. Documentation on the token
            pipeline, including CI integration, will be provided as this
            infrastructure comes online. This is a priority area of development
            given our large app portfolio.{" "}
            <Link href="/support">Contact us</Link> for updates on availability.
          </>
        ),
      },
    ],
  },
  support: {
    title: "Support & Training",
    faqs: [
      {
        question: "Who can help my team adopt BrandSync?",
        answer: (
          <>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <strong>Design questions:</strong> Contact your business
                unit&apos;s design representative or reach out directly to the{" "}
                <Link href="/support">BrandSync Support team</Link>
              </li>
              <li>
                <strong>Technical implementation:</strong> Coordinate with your
                development leads who are working with the BrandSync technical
                resources
              </li>
            </Box>
          </>
        ),
      },
      {
        question: "Are there trainings, office hours, or recorded demos?",
        answer: (
          <>
            <Box sx={{ mb: 1 }}>
              We&apos;re developing training materials and planning support
              sessions as BrandSync rolls out. Given the scale of adoption
              across our apps, we&apos;re creating resources that teams can
              access on their own timeline.
            </Box>
            <Box sx={{ mb: 1 }}>
              <strong>Available now:</strong>
            </Box>
            <Box component="ul" sx={{ pl: 2, m: 0, mb: 1 }}>
              <li>
                <Link href="/design-system/quick-start-guide">
                  Quick Start Guide
                </Link>{" "}
                - overview of the essentials
              </li>
            </Box>
            <Box sx={{ mb: 1 }}>
              <strong>Coming soon:</strong>
            </Box>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Training sessions</li>
              <li>Office hours</li>
              <li>Demo recordings</li>
            </Box>
            <Box sx={{ mt: 1 }}>
              If your team has specific training needs,{" "}
              <Link href="/support">let us know</Link> so we can prioritize
              accordingly.
            </Box>
          </>
        ),
      },
    ],
  },
};

export const getAllFAQs = () => {
  const allFAQs = [];
  Object.entries(faqCategories).forEach(([categoryKey, category]) => {
    category.faqs.forEach((faq) => {
      allFAQs.push({
        ...faq,
        category: categoryKey,
        categoryTitle: category.title,
      });
    });
  });
  return allFAQs;
};

export const getLandingPageFAQs = () => {
  return faqCategories.general.faqs.slice(0, 4);
};

export const getQuickStartFAQs = () => {
  return faqCategories.quickStart.faqs;
};

export const getFAQCategoryList = () => {
  return [
    { key: "all", label: "All FAQs" },
    ...Object.entries(faqCategories).map(([key, value]) => ({
      key,
      label: value.title,
    })),
  ];
};
