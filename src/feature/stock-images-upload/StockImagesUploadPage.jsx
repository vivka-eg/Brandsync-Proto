"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useStockImageCategories } from "@/hooks/useStockImageCategories";
import UploadDropZone from "./components/UploadDropZone";
import UploadedFilesPreview from "./components/UploadedFilesPreview";
import ThumbnailSidebar from "./components/ThumbnailSidebar";
import PhotoDetailsSection from "./components/PhotoDetailsSection";
import ReviewPhotoCard from "./components/ReviewPhotoCard";
import UploadProgressSummary from "./components/UploadProgressSummary";
import { usePhotoUpload } from "./hooks/usePhotoUpload";
import { useAIAnalysis } from "./hooks/useAIAnalysis";
import { generateSmartSuggestions } from "@/utils/imageUtils";
import { uploadPhotosSequentially, isStepValid } from "./utils/uploadUtils";
import { useAuthContext } from "@/context/auth/AuthContext";
import { useAppEnv } from "@/hooks/useAppEnv";

const existingTags = [];
const steps = ["Upload Images", "Add Details", "Review & Submit"];

export default function StockImagesUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const [bulkCategoryValue, setBulkCategoryValue] = useState([]);
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const { isProd } = useAppEnv();
  const { categories } = useStockImageCategories();

  const {
    uploadedFiles,
    filesMetadata,
    selectedFileIndex,
    uploadLimitError,
    processFiles,
    handleRemoveFile,
    updateMetadata,
    setSelectedFileIndex,
    setFilesMetadata,
    clearUploadLimitError,
    MAX_FILES,
  } = usePhotoUpload();

  const {
    aiLoading,
    aiError,
    bulkAiLoading,
    analyzeWithAI,
    bulkAnalyzeWithAI,
  } = useAIAnalysis();

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files, bulkCategoryValue);
    },
    [processFiles, bulkCategoryValue],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(e.target.files, bulkCategoryValue);
    }
  };

  const handleAddTag = (index) => {
    const tag = filesMetadata[index].newTag.trim().toLowerCase();
    if (tag && !filesMetadata[index].tags.includes(tag)) {
      updateMetadata(index, "tags", [...filesMetadata[index].tags, tag]);
      updateMetadata(index, "newTag", "");
    }
  };

  const handleRemoveTag = (index, tagToRemove) => {
    updateMetadata(
      index,
      "tags",
      filesMetadata[index].tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleClearAllTags = (index) => {
    updateMetadata(index, "tags", []);
  };

  const handleApplyToAll = () => {
    const currentMeta = filesMetadata[selectedFileIndex];
    setFilesMetadata((prev) =>
      prev.map((meta, i) =>
        i === selectedFileIndex
          ? meta
          : {
              ...meta,
              category: currentMeta.category,
              tags: [...currentMeta.tags],
            },
      ),
    );
    setApplyToAll(true);
    setTimeout(() => setApplyToAll(false), 2000);
  };

  const handleGenerateSmartSuggestions = (index) => {
    const title = filesMetadata[index].title.toLowerCase();
    const currentTags = filesMetadata[index].tags;
    const newTags = generateSmartSuggestions(title, currentTags);

    if (newTags.length > 0) {
      updateMetadata(index, "tags", [...currentTags, ...newTags]);
    }
  };

  const handleAnalyzeWithAI = async (index) => {
    const file = uploadedFiles[index]?.file;
    if (!file) return;

    const result = await analyzeWithAI(file, index);

    if (result) {
      setFilesMetadata((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          title: result.title || updated[index].title,
          description: result.description || updated[index].description,
          tags: Array.from(new Set([...updated[index].tags, ...result.tags])),
          containsPeople: result.containsPeople,
          orientation: result.orientation,
          dimensions: result.dimensions,
          gender: result.gender,
          ethnicity: result.ethnicity,
        };
        return updated;
      });
    }
  };

  const handleBulkAnalyzeWithAI = () => {
    bulkAnalyzeWithAI(uploadedFiles, filesMetadata, setFilesMetadata);
  };

  const handleBulkCategoryAssign = (categories) => {
    const categoryArray = categories || [];
    setBulkCategoryValue(categoryArray);
    setFilesMetadata((prev) =>
      prev.map((meta) => ({
        ...meta,
        category: categoryArray,
      })),
    );
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    const allSuccess = await uploadPhotosSequentially(
      uploadedFiles,
      filesMetadata,
      setUploadProgress,
    );

    setIsUploading(false);

    if (allSuccess) {
      setUploadSuccess(true);
      setTimeout(() => {
        router.push("/digital-assets/stock-images");
      }, 2000);
    }
  };

  const renderUploadStep = () => (
    <Box>
      <UploadDropZone
        isDragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
        uploadedCount={uploadedFiles.length}
        maxFiles={MAX_FILES}
        uploadLimitError={uploadLimitError}
        onClearError={clearUploadLimitError}
      />

      <UploadedFilesPreview
        files={uploadedFiles}
        onRemove={handleRemoveFile}
        maxFiles={MAX_FILES}
      />
    </Box>
  );

  const renderDetailsStep = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        minHeight: "60vh",
      }}
    >
      <ThumbnailSidebar
        uploadedFiles={uploadedFiles}
        filesMetadata={filesMetadata}
        selectedFileIndex={selectedFileIndex}
        onSelectFile={setSelectedFileIndex}
        onRemoveFile={handleRemoveFile}
        onStepChange={setActiveStep}
      />

      <PhotoDetailsSection
        uploadedFiles={uploadedFiles}
        selectedFileIndex={selectedFileIndex}
        filesMetadata={filesMetadata}
        onUpdateMetadata={(field, value) =>
          updateMetadata(selectedFileIndex, field, value)
        }
        onAddTag={() => handleAddTag(selectedFileIndex)}
        onRemoveTag={(tag) => handleRemoveTag(selectedFileIndex, tag)}
        onClearAllTags={() => handleClearAllTags(selectedFileIndex)}
        onAutoSuggestTags={() =>
          handleGenerateSmartSuggestions(selectedFileIndex)
        }
        onAnalyzeWithAI={() => handleAnalyzeWithAI(selectedFileIndex)}
        aiLoading={aiLoading[selectedFileIndex]}
        aiError={aiError[selectedFileIndex]}
        existingTags={existingTags}
        onApplyToAll={handleApplyToAll}
        applyToAll={applyToAll}
        onRemoveFile={handleRemoveFile}
        onStepChange={setActiveStep}
        onBulkAnalyzeWithAI={handleBulkAnalyzeWithAI}
        onBulkCategoryAssign={handleBulkCategoryAssign}
        bulkAiLoading={bulkAiLoading}
        processingCount={
          uploadedFiles.filter((_, i) => aiLoading[i] == false).length
        }
        bulkCategoryValue={bulkCategoryValue}
        onBulkCategoryChange={setBulkCategoryValue}
        categories={categories}
      />
    </Box>
  );

  const renderReviewStep = () => (
    <Box>
      {uploadSuccess ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Upload Successful!
          </Typography>
          <Typography variant="body2">
            Your photos have been uploaded. Redirecting to the gallery...
          </Typography>
        </Alert>
      ) : isUploading ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Uploading photos...
          </Typography>
          <Typography variant="body2">
            Please wait while your photos are being uploaded.
          </Typography>
        </Alert>
      ) : Object.values(uploadProgress).some((p) => p.status === "error") ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Some uploads failed
          </Typography>
          <Typography variant="body2">
            Please check the errors below and try again.
          </Typography>
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Review your photos before uploading. You can go back to make changes.
        </Alert>
      )}

      <Grid container spacing={2}>
        {uploadedFiles.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ReviewPhotoCard
              file={file}
              metadata={filesMetadata[index]}
              progress={uploadProgress[index]}
              categories={categories}
            />
          </Grid>
        ))}
      </Grid>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Box>
  );

  if (!isAdmin && !isSuperAdmin) {
    notFound();
  }

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        py: { xs: 3, md: 5 },
        bgcolor: "background.default",
      }}
    >
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink
              component={Link}
              href="/digital-assets"
              underline="hover"
              color="inherit"
              sx={{ fontSize: "0.875rem" }}
            >
              Digital Assets
            </MuiLink>
            <MuiLink
              component={Link}
              href="/digital-assets/stock-images"
              underline="hover"
              color="inherit"
              sx={{ fontSize: "0.875rem" }}
            >
              Stock Images
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: "0.875rem" }}>
              Upload Stock Images
            </Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              Upload Stock Images
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add new stock images to the gallery with tags and categories
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 3,
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ mb: 4 }}>
            {activeStep === 0 && renderUploadStep()}
            {activeStep === 1 && renderDetailsStep()}
            {activeStep === 2 && renderReviewStep()}
          </Box>

          {isUploading && (
            <UploadProgressSummary
              uploadProgress={uploadProgress}
              totalFiles={uploadedFiles.length}
            />
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                if (activeStep === 0) {
                  router.push("/digital-assets/stock-images");
                } else {
                  handleBack();
                }
              }}
              startIcon={activeStep > 0 ? <ArrowLeft size={20} /> : null}
              sx={{ textTransform: "none" }}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              disabled={
                !isStepValid(activeStep, uploadedFiles, filesMetadata) ||
                isUploading ||
                uploadSuccess
              }
              endIcon={
                activeStep < steps.length - 1 ? <ArrowRight size={20} /> : null
              }
              sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
            >
              {activeStep === steps.length - 1 ? "Upload Photos" : "Continue"}
            </Button>
          </Box>
        </Container>
    </Box>
  );
}
