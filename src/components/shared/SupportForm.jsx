"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PaperPlaneTilt,
  BookOpen,
  Question,
  RocketLaunch,
  MapTrifold,
  CheckCircle,
} from "phosphor-react";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const helpTopicOptions = [
  "Integration of EG Brandsync into your product",
  "Figma Design Kit",
  "Logo usage & guidelines",
  "Color palettes & theming",
  "Component library",
  "Digital Assets",
  "Brand guidelines",
  "Technical implementation",
  "Other",
];

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    businessUnit: "",
    helpTopic: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [issueKey, setIssueKey] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const description = `
*Support Request from BrandSync*

*Name:* ${formData.name}
*Business Unit:* ${formData.businessUnit}
*Help topic:* ${formData.helpTopic}

*Message:*
${formData.message}
      `.trim();

      const summary = `${formData.helpTopic} (User: ${formData.name})`;

      const apiFormData = new FormData();
      apiFormData.append('summary', summary);
      apiFormData.append('description', description);
      apiFormData.append('priority', 'Medium');
      apiFormData.append('assignee', 'Support'); 
      apiFormData.append('userEmail', formData.name);

      // Call the API
      const response = await fetch('/api/support/create', {
        method: 'POST',
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create support ticket');
      }

      // console.log('JIRA issue created:', result);
      setIssueKey(result.issueKey);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setFormData({ name: "", businessUnit: "", helpTopic: "", message: "" });
    setIsSubmitted(false);
    setIssueKey("");
    setError(null);
  };

  const helpResources = [
    {
      icon: <RocketLaunch size={32} weight="duotone" />,
      title: "Quick Start Guide",
      description: "Get up and running with BrandSync in minutes",
      link: "/design-system/quick-start-guide",
      color: "#9c27b0",
    },
    {
      icon: <MapTrifold size={32} weight="duotone" />,
      title: "Implementation Planner",
      description: "Plan your brand implementation journey step by step",
      link: "/design-system/implementation-planner",
      color: "#ed6c02",
    },
    {
      icon: <BookOpen size={32} weight="duotone" />,
      title: "Documentation",
      description: "Explore our comprehensive guides and best practices",
      link: "/design-system",
      color: "#1976d2",
    },
    {
      icon: <Question size={32} weight="duotone" />,
      title: "FAQ",
      description: "Find quick answers to common questions",
      link: "/faqs",
      color: "#2e7d32",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 6, md: 10 },
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            mb={2}
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#212529",
            }}
          >
            Need Help?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "#6c757d",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            We're here to help you get the most out of BrandSync. Explore our resources below or reach out directly.
          </Typography>
        </MotionBox>

        {/* Help Resources - Inline Cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mb: 8,
            flexWrap: "wrap",
          }}
        >
          {helpResources.map((resource, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              component="a"
              href={resource.link}
              sx={{
                textDecoration: "none",
                borderRadius: 3,
                border: "1px solid rgba(100, 149, 237, 0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                flex: { xs: "1 1 100%", sm: "1 1 200px" },
                maxWidth: { xs: "100%", sm: "240px" },
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(100, 149, 237, 0.2)",
                  borderColor: resource.color,
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    color: "#212529",
                    mb: 1.5,
                  }}
                >
                  {resource.icon}
                </Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  mb={1}
                  sx={{ color: "#212529" }}
                >
                  {resource.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    lineHeight: 1.5,
                    fontSize: "0.8rem",
                  }}
                >
                  {resource.description}
                </Typography>
              </CardContent>
            </MotionCard>
          ))}
        </Box>

        {/* Contact Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{
            bgcolor: "rgba(25, 118, 210, 0.05)",
            borderRadius: 4,
            p: { xs: 2, sm: 4, md: 6 },
            textAlign: "center",
            border: "1px solid rgba(25, 118, 210, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={4}
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#212529",
            }}
          >
            Still Need Assistance?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              maxWidth: "900px",
              mx: "auto",
              alignItems: "stretch",
            }}
          >
            {/* Left side - Message */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#1976d2",
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 2,
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  lineHeight: 1.3,
                }}
              >
                We're here to help!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  lineHeight: 1.7,
                }}
              >
                Whether you're just getting started or need guidance on advanced implementation, our team is ready to support you every step of the way.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.85,
                  lineHeight: 1.7,
                  mb: 2,
                }}
              >
                We typically respond within 24-48 hours. For urgent matters, please mention it in your message.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.85,
                  fontStyle: "italic",
                }}
              >
                "Together, we build better experiences."
              </Typography>
            </Box>

            {/* Right side - Form */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#fff",
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                border: "1px solid rgba(100, 149, 237, 0.2)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {isSubmitted ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CheckCircle size={64} weight="duotone" color="#2e7d32" />
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: "#212529", mt: 2, mb: 1 }}
                  >
                    Thank You!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#6c757d", mb: 1 }}
                  >
                    Your message has been sent successfully. We'll get back to you soon.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleSendAnother}
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#1565c0",
                        bgcolor: "rgba(25, 118, 210, 0.05)",
                      },
                    }}
                  >
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <PaperPlaneTilt size={32} weight="duotone" color="#1976d2" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6c757d",
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    Send us a message and we'll get back to you
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    sx={{ mb: 2 }}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Business Unit"
                    name="businessUnit"
                    value={formData.businessUnit}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    sx={{ mb: 2 }}
                    size="small"
                  />
                  <FormControl fullWidth size="small" sx={{ mb: 2 }} required>
                    <InputLabel>What do you need help with?</InputLabel>
                    <Select
                      name="helpTopic"
                      value={formData.helpTopic}
                      onChange={handleChange}
                      label="What do you need help with?"
                      disabled={isSubmitting}
                      sx={{
                        textAlign: "left",
                        "& .MuiSelect-select": {
                          textAlign: "left",
                        },
                      }}
                    >
                      {helpTopicOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#1976d2",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#1565c0",
                      },
                      "&:disabled": {
                        bgcolor: "#ccc",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default SupportForm;