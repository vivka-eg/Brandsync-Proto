"use client";
import React, { useState } from "react";
import { UPLOAD_ICONS_TABS } from "@/constants/assets";
import { Box, Stack, Typography, Button, CircularProgress } from "@mui/material";
import IconsUploadStepper from "./IconsUploadStepper";
import UploadIcons from "./UploadIcons";
import IconDetails from "./IconDetails";
import ReviewAndUpload from "./ReviewAndUpload";
import CustomIconButton from "@/components/shared/IconButton";
import { ArrowRight, ArrowLeft, UploadSimple } from "phosphor-react";
import { useIconsUploadContext } from "../context/IconsUploadContext";
import { useRouter } from "next/navigation";

function IconsUpload() {
  const [activeStep, setActiveStep] = useState(0);
  const { uploadIconsToBackend, icons, setIcons, successfulUpload, isUploading, uploadProgress } =
    useIconsUploadContext();
  const router = useRouter();

  // Validation rules configuration
  const VALIDATION_RULES = {
    iconType: (icon) => !!icon.iconType,
    categories: (icon) => icon.categories.length > 0,
    tags: (icon) => icon.tags.length > 0,
  };

  // Step configuration
  const STEP_CONFIG = {
    0: { requiresFileSelection: true },
    1: { requiresValidation: true },
  };

  // Validate a single icon against all rules
  const validateIcon = (icon) => {
    const errors = {};
    let hasError = false;

    Object.entries(VALIDATION_RULES).forEach(([field, validator]) => {
      const isValid = validator(icon);
      errors[field] = !isValid;
      if (!isValid) hasError = true;
    });

    return { errors, hasError };
  };

  // Validate all icons and update their error states
  const validateAllIcons = () => {
    const updatedIcons = icons.map((icon) => {
      const { errors } = validateIcon(icon);
      return {
        ...icon,
        error: { ...icon.error, ...errors },
      };
    });

    const hasAnyError = updatedIcons.some((icon) =>
      Object.values(icon.error).some((error) => error === true)
    );

    setIcons(updatedIcons);
    return !hasAnyError;
  };

  // Handle step-specific logic before proceeding
  const handleStepValidation = (step) => {
    const stepConfig = STEP_CONFIG[step];

    if (stepConfig?.requiresFileSelection && icons.length === 0) {
      return false;
    }

    if (stepConfig?.requiresValidation) {
      return validateAllIcons();
    }

    return true;
  };

  // Check if we can proceed to next step
  const canProceedToNextStep = () => {
    return activeStep < UPLOAD_ICONS_TABS.length - 1;
  };

  // Main navigation handler
  const handleNext = () => {
    const isValid = handleStepValidation(activeStep);

    if (isValid && canProceedToNextStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const getCurrentSection = () => {
    if (activeStep === 0) return <UploadIcons />;
    if (activeStep === 1) return <IconDetails />;
    if (activeStep === 2) return <ReviewAndUpload />;
    return UPLOAD_ICONS_TABS[3];
  };

  return (
    <Stack spacing="32px">
      <Typography variant="h5" fontWeight={700}>
        Add Icons
      </Typography>
      <IconsUploadStepper activeStep={activeStep} />
      {getCurrentSection()}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {!successfulUpload && (
          <Stack direction="row" spacing={2}>
            {activeStep > 0 && (
              <CustomIconButton
                text="Back"
                onClick={() => setActiveStep(activeStep - 1)}
                Icon={ArrowLeft}
                startIcon
                variant="secondary"
                disabled={isUploading}
              />
            )}
            {activeStep < UPLOAD_ICONS_TABS.length - 1 && (
              <CustomIconButton
                text="Next"
                onClick={handleNext}
                Icon={ArrowRight}
                disabled={activeStep === 0 && icons.length === 0}
              />
            )}
            {activeStep === UPLOAD_ICONS_TABS.length - 1 && (
              isUploading ? (
                <Button
                  variant="contained"
                  disableElevation
                  disabled
                  startIcon={<CircularProgress size={16} color="inherit" />}
                  sx={{ textTransform: "none", borderRadius: "8px", px: 2 }}
                >
                  {uploadProgress.total > 1
                    ? `Uploading ${uploadProgress.current} / ${uploadProgress.total}…`
                    : "Uploading…"}
                </Button>
              ) : (
                <CustomIconButton
                  text="Upload"
                  onClick={uploadIconsToBackend}
                  Icon={UploadSimple}
                />
              )
            )}
          </Stack>
        )}
      </Stack>
      <Box sx={{ height: "100px" }}></Box>
    </Stack>
  );
}

export default IconsUpload;
