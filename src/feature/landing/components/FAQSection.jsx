"use client";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getLandingPageFAQs } from "@/data/faqData";
import { zoomInView, withDelay, animateTextZoomIn } from "@/utils/animations";
import FaqAccordionItem from "@/components/shared/FaqAccordionItem";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const faqs = getLandingPageFAQs();

  // Zoom animation for title and subtitle
  useEffect(() => {
    const titleAnim = animateTextZoomIn(gsap, titleRef.current);
    const subtitleAnim = animateTextZoomIn(gsap, subtitleRef.current, { delay: 0.1 });

    return () => {
      titleAnim?.kill();
      subtitleAnim?.kill();
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        bgcolor: "#FFFFFF",
        overflow: "hidden",
      }}
    >

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            ref={titleRef}
            variant="h2"
            fontWeight={800}
            mb={2}
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
              color: "#212529",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            ref={subtitleRef}
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#6c757d",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Everything you need to know about BrandSync
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "900px", mx: "auto" }}>
          {faqs.map((faq, index) => (
            <MotionBox key={index} {...withDelay(zoomInView, index * 0.08)}>
              <FaqAccordionItem
                question={faq.question}
                answer={faq.answer}
                expanded={openIndex === index}
                onChange={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </MotionBox>
          ))}
        </Box>

        {faqs.length >= 4 && (
          <MotionBox
            {...withDelay(zoomInView, 0.4)}
            sx={{ display: "flex", justifyContent: "center", mt: 4 }}
          >
            <Link href="/faqs" style={{ textDecoration: "none" }}>
              <Box
                component="button"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#000000",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": {
                    bgcolor: "#1a1a1a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                See All FAQs
                
              </Box>
            </Link>
          </MotionBox>
        )}
      </Container>
    </Box>
  );
};

export default FAQSection;
