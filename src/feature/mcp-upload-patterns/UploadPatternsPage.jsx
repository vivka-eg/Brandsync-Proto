"use client";
import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { uploadComponent, updateComponent } from "@/api/mcp/admin/components";
import { getComponent } from "@/api/mcp/client/components";
import { useMcpCategories } from "@/context/mcp/McpCategoriesContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatternStepper from "./PatternStepper";
import UploadScreenshotStep from "./steps/UploadScreenshotStep";
import UploadCodeStep from "./steps/UploadCodeStep";
import UploadPromptStep from "./steps/UploadPromptStep";
import ReviewStep from "./steps/ReviewStep";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";

export default function UploadPatternsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUser } = useMCPAuthContext();
  const paramComponentId = searchParams.get("id");
  const isEditMode = paramComponentId ? true : false;

  const [activeStep, setActiveStep] = useState(0);
  const [componentId, setComponentId] = useState(null);

  // Step 1
  const [screenshots, setScreenshots] = useState({
    desktop: null,
    tablet: null,
    mobile: null,
  });
  const [activeDevice, setActiveDevice] = useState("desktop");

  // Step 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setBusinessUnitId] = useState("");
  const { categories } = useMcpCategories();
  const [selectedTags, setSelectedTags] = useState([]);

  // Step 3
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  const groupedCategories = useMemo(() => {
    const parents = categories.filter((c) => c.parentId === null);
    return parents
      .map((parent) => ({
        parent,
        subcategories: categories.filter((c) => c.parentId === parent.id),
      }))
      .filter(({ subcategories }) => subcategories.length > 0);
  }, [categories]);

  // Pre-populate fields from existing component in edit mode
  // tags is already an array per API spec
  // zipFile and screenshot are S3 URLs; file: null marks them as "existing, not new"
  // On submit, only fields with a real File object get sent to the update API
  useEffect(() => {
    if (!isEditMode) return;
    getComponent(paramComponentId).then((res) => {
      const d = res.data;
      if (d.id) setComponentId(d.id);
      if (d.title) setTitle(d.title);
      if (d.description) setDescription(d.description);
      if (d.category?.id) setBusinessUnitId(d.category.id);
      if (d.prompt) setPrompt(d.prompt);
      if (d.tags?.length) setSelectedTags(d.tags);
      if (d.screenshots?.length) {
        const find = (platform) => {
          const match = d.screenshots.find((s) => s.platform === platform);
          return match
            ? {
                url: match.url,
                name: `${platform.toLowerCase()}-screenshot`,
                size: 0,
                file: null,
              }
            : null;
        };
        setScreenshots({
          desktop: find("DESKTOP"),
          tablet: find("TABLET"),
          mobile: find("MOBILE"),
        });
      }
    });
  }, [paramComponentId, isEditMode]);

  // Validation per step
  // Tablet and mobile screenshots are optional; only desktop is required
  const isStepValid = (step) => {
    if (step === 0) return isEditMode || screenshots.desktop !== null;
    if (step === 1) return Boolean(title && description && categoryId);
    if (step === 2) return prompt.trim() !== "";
    if (step === 3) return true;
    return false;
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleContinue = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleCancel = () => {
    router.push("/mcp/patterns");
  };

  const handleScreenshotFile = (device, fileObj) => {
    setScreenshots((prev) => ({ ...prev, [device]: fileObj }));
  };

  const handleScreenshotClear = (device) => {
    setScreenshots((prev) => ({ ...prev, [device]: null }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || submitSuccess) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isEditMode) {
        await updateComponent(componentId, {
          title,
          description,
          prompt,
          categoryId,
          tags: selectedTags.join(","),
          ...(screenshots.desktop?.file ? { screenshotDesktop: screenshots.desktop.file } : {}),
          ...(screenshots.tablet?.file ? { screenshotTablet: screenshots.tablet.file } : {}),
          ...(screenshots.mobile?.file ? { screenshotMobile: screenshots.mobile.file } : {}),
        });
      } else {
        await uploadComponent({
          componentName: title,
          title,
          description,
          prompt,
          categoryId,
          tags: selectedTags.join(","),
          screenshotDesktop: screenshots.desktop.file,
          ...(screenshots.tablet?.file ? { screenshotTablet: screenshots.tablet.file } : {}),
          ...(screenshots.mobile?.file ? { screenshotMobile: screenshots.mobile.file } : {}),
        });
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/mcp/patterns");
      }, 2000);
    } catch (error) {
      setSubmitError(
        error.response?.data?.error ||
          `${isEditMode ? "Update" : "Upload"} failed. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardSx = {
    bgcolor: "background.paper",
    border: "2px solid",
    borderColor: "divider",
    borderRadius: 2,
    p: 3,
  };

  const stepContent = [
    <UploadScreenshotStep
      key="step-0"
      screenshots={screenshots}
      activeDevice={activeDevice}
      onDeviceChange={setActiveDevice}
      onFile={handleScreenshotFile}
      onClear={handleScreenshotClear}
    />,
    <UploadCodeStep
      key="step-1"
      title={title}
      onTitleChange={setTitle}
      description={description}
      onDescriptionChange={setDescription}
      categoryId={categoryId}
      onCategoryChange={setBusinessUnitId}
      categories={groupedCategories}
      tags={selectedTags}
      onTagsChange={setSelectedTags}
    />,
    <UploadPromptStep key="step-2" prompt={prompt} onChange={setPrompt} />,
    <ReviewStep
      key="step-3"
      screenshots={screenshots}
      activeDevice={activeDevice}
      onDeviceChange={setActiveDevice}
      tags={selectedTags}
      prompt={prompt}
      title={title}
      description={description}
      category={categories.find((b) => b.id === categoryId)?.name ?? ""}
    />,
  ];

  if (isUser) notFound();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          bgcolor: "background.default",
          // marginTop: 10,
        }}
      >
        <Container maxWidth="lg">
          {/* Page title + subtitle */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {isEditMode ? "Update Page Pattern" : "Upload Page Patterns"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? `Editing: ${title}`
                : "Add HTML & CSS Patterns of UI Patterns"}
            </Typography>
          </Box>

          {/* Success alert */}
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {isEditMode
                ? "Pattern updated successfully! Redirecting..."
                : "Pattern uploaded successfully! Redirecting..."}
            </Alert>
          )}

          {/* Error alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          {/* Stepper */}
          <PatternStepper activeStep={activeStep} />

          {/* Animated step content */}
          <Box sx={{ mb: 3, position: "relative", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {stepContent[activeStep]}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Navigation footer */}
          <Box sx={cardSx}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              {/* Left button */}
              {activeStep === 0 ? (
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ borderRadius: 1 }}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  sx={{ borderRadius: 1 }}
                >
                  Back
                </Button>
              )}

              {/* Right button */}
              {activeStep === 3 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isStepValid(3) || isSubmitting || submitSuccess}
                  sx={{
                    bgcolor: "#111",
                    color: "white",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#333" },
                    "&:disabled": { bgcolor: "action.disabledBackground" },
                  }}
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating…"
                      : "Submitting…"
                    : isEditMode
                      ? "Update"
                      : "Submit"}
                </Button>
              ) : activeStep === 2 ? (
                <Button
                  variant="contained"
                  onClick={handleContinue}
                  disabled={!isStepValid(activeStep)}
                  sx={{
                    bgcolor: "#111",
                    color: "white",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#333" },
                    "&:disabled": { bgcolor: "action.disabledBackground" },
                  }}
                >
                  Continue →
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleContinue}
                  disabled={!isStepValid(activeStep)}
                  sx={{ borderRadius: 1 }}
                >
                  Continue →
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}
