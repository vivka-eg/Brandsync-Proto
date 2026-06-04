"use client";
import { Box, Typography, Container } from "@mui/material";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoleSection from "./role-based/RoleSection";
import { animateTextZoomIn } from "@/utils/animations";

const RoleBasedSection = () => {
  const titlePillRef = useRef(null);
  const bigTitleWrapperRef = useRef(null);
  const bigTitleFillBoxRef = useRef(null);
  const logoRef = useRef(null);
  const fourInOneTitleRef = useRef(null);
  const sectionsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titlePill = titlePillRef.current;
    if (!titlePill) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titlePill,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Initial state
    gsap.set(titlePill, {
      opacity: 0,
      y: -8,
    });

    tl.to(titlePill, {
      opacity: 1,
      y: 0,
      duration: 0.5,
    })
      .to(titlePill, {
        x: -3,
        duration: 0.05,
        ease: "none",
      })
      .to(titlePill, {
        x: 3,
        duration: 0.05,
        ease: "none",
      })
      .to(titlePill, {
        x: -2,
        duration: 0.05,
        ease: "none",
      })
      .to(titlePill, {
        x: 2,
        duration: 0.05,
        ease: "none",
      })
      .to(titlePill, {
        x: 0,
        duration: 0.1,
        ease: "power2.out",
      });

    const imgAnimations = [];
    const textAnimations = [];

    const zoomImgs = gsap.utils.toArray('[data-card="img"]');
    const zoomAnimations = zoomImgs.map((img) =>
      gsap.fromTo(
        img,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            end: "top 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )
    );

    const flashAnimations = [];

    return () => {
      tl.kill();
      imgAnimations.forEach((a) => a.kill());
      textAnimations.forEach((a) => a.kill());
      flashAnimations.forEach((a) => a.kill());
      zoomAnimations.forEach((a) => a.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    if (!bigTitleWrapperRef.current || !bigTitleFillBoxRef.current) return;

    gsap.set(bigTitleFillBoxRef.current, { clipPath: "inset(0 100% 0 0)" });

    const anim = gsap.to(bigTitleFillBoxRef.current, {
      clipPath: "inset(0 0% 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: bigTitleWrapperRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });

    return () => anim.kill();
  }, []);

  useEffect(() => {
    if (!logoRef.current || !bigTitleWrapperRef.current) return;

    const anim = gsap.fromTo(
      logoRef.current,
      { scale: 1 },
      {
        scale: 1.4,
        ease: "none",
        scrollTrigger: {
          trigger: bigTitleWrapperRef.current,
          start: "top 95%",
          end: "top 40%",
          scrub: true,
        },
      }
    );

    return () => anim.kill();
  }, []);

  useEffect(() => {
    if (!fourInOneTitleRef.current) return;

    const anim = animateTextZoomIn(gsap, fourInOneTitleRef.current);

    return () => anim?.kill();
  }, []);

  // Animate each role-based section on scroll
  useEffect(() => {
    if (!sectionsRef.current) return;

    const sectionElements = gsap.utils.toArray(".role-section");

    sectionElements.forEach((section, index) => {
      const isReversed = index % 2 === 1;

      // Get text and visualization elements
      const textContent = section.querySelector(".section-text");
      const visualization = section.querySelector(".section-visualization");

      // Get individual text elements
      const pill = textContent?.querySelector(".section-pill");
      const heading = textContent?.querySelector(".section-heading");
      const body = textContent?.querySelector(".section-body");
      const bullets = textContent?.querySelectorAll(".section-bullet");
      const buttons = textContent?.querySelectorAll(".section-button");

      // Set initial states
      if (pill) {
        gsap.set(pill, {
          opacity: 0,
          x: isReversed ? 50 : -50,
        });
      }

      if (body) {
        gsap.set(body, {
          opacity: 0,
          y: 20,
        });
      }

      if (bullets) {
        gsap.set(bullets, {
          opacity: 0,
          x: -20,
        });
      }

      if (buttons) {
        gsap.set(buttons, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          visibility: "visible",
        });
      }

      if (visualization) {
        gsap.set(visualization, {
          opacity: 0,
          scale: 0.9,
          x: isReversed ? -50 : 50,
        });
      }

      // Create timeline for this section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate elements in sequence
      if (pill) {
        tl.to(
          pill,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        );
      }

      // Zoom animation for heading
      if (heading) {
        gsap.set(heading, {
          opacity: 0,
          scale: 1.2,
        });

        tl.to(
          heading,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          0.2
        );
      }

      if (body) {
        tl.to(
          body,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          0.3
        );
      }

      if (bullets && bullets.length > 0) {
        tl.to(
          bullets,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.4
        );
      }

      if (buttons && buttons.length > 0) {
        tl.to(
          buttons,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
            clearProps: "transform",
          },
          0.65
        );
      }

      if (visualization) {
        tl.to(
          visualization,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: "back.out(1.2)",
          },
          0.25
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars.trigger &&
          sectionElements.includes(trigger.vars.trigger)
        ) {
          trigger.kill();
        }
      });
    };
  }, []);

  const sections = [
    {
      pill: "Developers",
      heading: "Everything developers need, ready to build",
      body: "No more second-guessing or starting from scratch. Every component comes with clear guidance to help you build beautifully, together.",
      bullets: [
        "See how each component is structured",
        "Access clear specs and usage guidelines.",
        "Bake accessibility into every build.",
        "Apply best practices for consistent UI.",
      ],
      image: "/images/illustration_bg.svg",
      useCustomVisualization: true,
      buttonText: "Read Documentation",
      buttonLink: "/design-system",
    },
    {
      pill: "Designers",
      heading: "Figma UI Kit for Designers",
      body: "Use ready-to-go, reliable components with clear guidance at every step.",
      bullets: [
        "Built on atomic design principles",
        "Powered by design tokens",
        "Ready to go with a Figma UI kit",
      ],
      image: "/images/illustration_bg.svg",
      useCustomVisualization: true,
      visualizationType: "designTokens",
      buttons: [
        // {
        //   text: "Read Documentation",
        //   link: "/design-system/for-designers",
        //   isExternal: false,
        // },
        {
          text: "Read More",
          link: "/figma-kit",
          isExternal: false,
        },
      ],
    },
    {
      pill: "AI & MCP",
      heading: "AI and design that work as one via MCP",
      body: "Where AI meets design systems, in real time. With MCP-connected tokens, components, and smart prompt guardrails, AI becomes a true design partner.",
      bullets: [
        "Generate brand-specific designs with AI",
        "Stay consistent with built‑in governance and prompt templates.",
      ],
      image: "/images/illustration_bg.svg",
      useCustomVisualization: true,
      visualizationType: "aiMCP",
      buttons: [
        {
          text: "Learn More",
          link: "/mcp",
          isExternal: false,
        },
      ],
    },
    {
      pill: "Theme Builder",
      heading: "Generate themes on the fly",
      body: "Create product themes by choosing a primary color.",
      bullets: [
        "Interactive color picker",
        "Auto-generated color palettes",
        "Export as CSS, JSON, or Figma tokens",
      ],
      image: "/images/illustration_bg.svg",
      useCustomVisualization: true,
      visualizationType: "themeBuilder",
      buttons: [
        {
          text: "Build Your Custom Theme",
          link: "/theme-builder",
          isExternal: false,
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Box
            component="img"
            src="/brandsync_logo.svg"
            alt="BrandSync logo"
            ref={logoRef}
            sx={{
              height: { xs: 60, md: 80 },
              width: "auto",
              mx: "auto",
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            ref={fourInOneTitleRef}
            sx={{
              fontSize: { xs: "2rem", sm: "3.5rem", md: "4rem", lg: "4.5rem" },
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            One System - Multiple Solutions
          </Typography>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            maxWidth: 900,
            mx: "auto",
            mt: -1,
            mb: { xs: 6, md: 10 },
            color: "#475569",
            lineHeight: 1.7,
            fontSize: { xs: "1.5rem", md: "1.155rem" },
          }}
        >
BrandSync gives every EG product, team, and business unit the autonomy to move fast while ensuring they're all building with the same foundations, guiding principles, and standards. <br/> <strong> Minimum disruption. No brand drift. Just automatic alignment.</strong>
        </Typography>
        <Box ref={sectionsRef}>
          {sections.map((s, idx) => (
            <RoleSection
              key={s.heading}
              section={s}
              index={idx}
              titlePillRef={idx === 0 ? titlePillRef : undefined}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default RoleBasedSection;
