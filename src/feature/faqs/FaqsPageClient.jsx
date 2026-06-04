"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { MagnifyingGlass, X } from "phosphor-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordionItem from "@/components/shared/FaqAccordionItem";
import { getAllFAQs, getFAQCategoryList } from "@/data/faqData";

const MotionBox = motion(Box);

const FaqsPageClient = () => {
  const [openKey, setOpenKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getFilteredFAQs = () => {
    let faqs = getAllFAQs();

    if (selectedCategory !== "all") {
      faqs = faqs.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      faqs = faqs.filter((faq) => {
        const getTextFromAnswer = (answer) => {
          if (typeof answer === "string") {
            return answer;
          }
          if (answer?.props?.children) {
            return React.Children.toArray(answer.props.children)
              .map((child) => {
                if (typeof child === "string") return child;
                if (child?.props?.children) {
                  if (typeof child.props.children === "string") {
                    return child.props.children;
                  }
                  if (Array.isArray(child.props.children)) {
                    return child.props.children
                      .map((c) => (typeof c === "string" ? c : ""))
                      .join("");
                  }
                }
                return "";
              })
              .join(" ");
          }
          return "";
        };

        const answerText = getTextFromAnswer(faq.answer).toLowerCase();
        const questionText = faq.question.toLowerCase();
        const categoryText = faq.categoryTitle.toLowerCase();

        return (
          questionText.includes(query) ||
          answerText.includes(query) ||
          categoryText.includes(query)
        );
      });
    }

    return faqs;
  };

  const filteredFAQs = getFilteredFAQs();

  const groupedFAQs = () => {
    const grouped = {};
    filteredFAQs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = {
          title: faq.categoryTitle,
          faqs: [],
        };
      }
      grouped[faq.category].faqs.push(faq);
    });
    return grouped;
  };

  const categories = getFAQCategoryList();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          position: "relative",
          py: { xs: 6, md: 10 },
          bgcolor: "#FFFFFF",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <Typography
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
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#6c757d",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Find answers to common questions about BrandSync
          </Typography>

          <Box sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by question, answer, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass
                      size={24}
                      color="#6c757d"
                      weight="bold"
                    />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <Box
                      component="button"
                      onClick={() => setSearchQuery("")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "none",
                        bgcolor: "rgba(0, 0, 0, 0.05)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <X size={16} color="#6c757d" weight="bold" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.3)",
                    },
                  },
                  "&.Mui-focused": {
                    bgcolor: "#FFFFFF",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.15)",
                  },
                },
              }}
            />
            {searchQuery && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#6c757d",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                Found {filteredFAQs.length} result
                {filteredFAQs.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              mb: 4,
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category.key}
                label={category.label}
                onClick={() => setSelectedCategory(category.key)}
                sx={{
                  px: 1,
                  py: 2.5,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  bgcolor:
                    selectedCategory === category.key
                      ? "#000000"
                      : "rgba(0, 0, 0, 0.05)",
                  color:
                    selectedCategory === category.key ? "#FFFFFF" : "#000000",
                  border:
                    selectedCategory === category.key
                      ? "none"
                      : "2px solid rgba(0, 0, 0, 0.2)",
                  boxShadow:
                    selectedCategory === category.key
                      ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                      : "none",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === category.key
                        ? "#1a1a1a"
                        : "rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      selectedCategory === category.key
                        ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
            ))}
          </Box>
        </MotionBox>

        {filteredFAQs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No FAQs found matching your search.
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedFAQs()).map(([categoryKey, category]) => (
            <Box key={categoryKey} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  color: "#212529",
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {category.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {category.faqs.map((faq, index) => {
                  const itemKey = `${categoryKey}-${index}`;
                  return (
                    <MotionBox
                      key={itemKey}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <FaqAccordionItem
                        question={faq.question}
                        answer={faq.answer}
                        expanded={openKey === itemKey}
                        onChange={() => setOpenKey(openKey === itemKey ? null : itemKey)}
                      />
                    </MotionBox>
                  );
                })}
              </Box>
            </Box>
          ))
        )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default FaqsPageClient;
