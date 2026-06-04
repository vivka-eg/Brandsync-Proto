"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  IconButton,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowLeft, ArrowRight, Check, CheckCircle, Info, UploadSimple, X } from "phosphor-react";
import { motion, AnimatePresence } from "motion/react";
import { useDropzone } from "react-dropzone";
import LogoVariantUploader from "./LogoVariantUploader";
import ZipUploadDropzone from "./ZipUploadDropzone";
import LogoSizeAdjuster from "./LogoSizeAdjuster";
import LogoUploadPreview from "./LogoUploadPreview";
import { uploadLogoAndSizes, updateLogoAndSizes } from "@/api/design-system/logo-upload";
import { getProductLogoByIdRaw } from "@/api/design-system/product-logos";
import { notFound, useSearchParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/AuthContext";

const COLOR_PALETTES = [
  "purple",
  "cobalt",
  "blue",
  "steel",
  "teal",
  "jade",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "magenta",
  "maroon",
  "violet",
];

const steps = [
  "Basic Info",
  "Upload Logos",
  "Adjust Sizes",
  "Upload Bundle",
  "Upload PPT/CVI",
  "Review",
];

function LogoUploadPage() {
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssets, setExistingAssets] = useState(null);

  // Basic Info
  const [logoName, setLogoName] = useState("");
  const [colorPalette, setColorPalette] = useState("");

  // Logo variants - each variant has horizontal and vertical versions
  const [logoVariants, setLogoVariants] = useState({
    light: {
      horizontal: null,
      vertical: null,
    },
    dark: {
      horizontal: null,
      vertical: null,
    },
    negative: {
      horizontal: null,
      vertical: null,
    },
  });

  // Universal sizes - applied to ALL variants
  const [logoSizes, setLogoSizes] = useState({
    headerSize: { width: "auto", height: 32 },
    drawerSize: { width: "auto", height: 36 },
    splashHorizontalSize: { width: "auto", height: 90 },
    splashVerticalSize: { width: "auto", height: 180 },
  });

  // Icon/Logo for sidebar
  const [sidebarLogo, setSidebarLogo] = useState(null);

  // ZIP bundle
  const [zipFile, setZipFile] = useState(null);

  // PPT/CVI files
  const [pptFile, setPptFile] = useState(null);
  const [cviFile, setCviFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  // Load existing logo data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      setIsLoading(true);
      getProductLogoByIdRaw(editId)
        .then((logoData) => {
          // console.log("Loaded logo data:", logoData);

          // Set basic info
          setLogoName(logoData.name || "");
          setColorPalette(logoData.colorPalette || "");

          // Set existing assets for tracking (use the raw asset IDs from Strapi)
          setExistingAssets({
            logo: logoData.rawAssetIds?.logo || null,
            bundle: logoData.rawAssetIds?.bundle || null,
            powerpoint: logoData.rawAssetIds?.powerpoint || null,
            cvi: logoData.rawAssetIds?.cvi || null,
            lightLogo: {
              horizontal: logoData.rawAssetIds?.lightLogo?.horizontal || null,
              vertical: logoData.rawAssetIds?.lightLogo?.vertical || null,
            },
            darkLogo: {
              horizontal: logoData.rawAssetIds?.darkLogo?.horizontal || null,
              vertical: logoData.rawAssetIds?.darkLogo?.vertical || null,
            },
            negativeLogo: {
              horizontal: logoData.rawAssetIds?.negativeLogo?.horizontal || null,
              vertical: logoData.rawAssetIds?.negativeLogo?.vertical || null,
            },
          });

          // Set logo variants with URLs (not files)
          setLogoVariants({
            light: {
              horizontal: logoData.assets?.light?.horizontal
                ? { url: logoData.assets.light.horizontal, name: "Light Horizontal (existing)", isExisting: true }
                : null,
              vertical: logoData.assets?.light?.vertical
                ? { url: logoData.assets.light.vertical, name: "Light Vertical (existing)", isExisting: true }
                : null,
            },
            dark: {
              horizontal: logoData.assets?.dark?.horizontal
                ? { url: logoData.assets.dark.horizontal, name: "Dark Horizontal (existing)", isExisting: true }
                : null,
              vertical: logoData.assets?.dark?.vertical
                ? { url: logoData.assets.dark.vertical, name: "Dark Vertical (existing)", isExisting: true }
                : null,
            },
            negative: {
              horizontal: logoData.assets?.negative?.horizontal
                ? { url: logoData.assets.negative.horizontal, name: "Negative Horizontal (existing)", isExisting: true }
                : null,
              vertical: logoData.assets?.negative?.vertical
                ? { url: logoData.assets.negative.vertical, name: "Negative Vertical (existing)", isExisting: true }
                : null,
            },
          });

          // Set sidebar logo
          if (logoData.assets?.logo) {
            setSidebarLogo({
              url: logoData.assets.logo,
              name: "Logo (existing)",
              isExisting: true,
            });
          }

          // Set logo sizes
          if (logoData.sizes) {
            setLogoSizes({
              headerSize: logoData.sizes.headerSizes || { width: "auto", height: 32 },
              drawerSize: logoData.sizes.drawerSizes || { width: "auto", height: 36 },
              splashHorizontalSize: logoData.sizes.horizontalSizes || { width: "auto", height: 90 },
              splashVerticalSize: logoData.sizes.verticalSizes || { width: "auto", height: 180 },
            });
          }

          // Set bundle/zip file if exists
          if (logoData.assets?.bundleURL) {
            setZipFile({
              url: logoData.assets.bundleURL,
              name: "Bundle (existing)",
              isExisting: true,
            });
          }

          // Set PPT/CVI if exists
          if (logoData.assets?.powerpointURL) {
            setPptFile({
              url: logoData.assets.powerpointURL,
              name: "PowerPoint (existing)",
              isExisting: true,
            });
          }

          if (logoData.assets?.cviURL) {
            setCviFile({
              url: logoData.assets.cviURL,
              name: "CVI (existing)",
              isExisting: true,
            });
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading logo:", error);
          setSnackbar({
            open: true,
            message: "Failed to load logo data",
            severity: "error",
          });
          setIsLoading(false);
        });
    }
  }, [isEditMode, editId]);

  const handleLogoUpload = useCallback((variant, orientation, file) => {
    setLogoVariants((prev) => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [orientation]: file
          ? {
              file,
              url: URL.createObjectURL(file),
              name: file.name,
            }
          : null,
      },
    }));
  }, []);

  // Size changes apply universally to all variants
  const handleSizeChange = useCallback((mockupType, size) => {
    setLogoSizes((prev) => ({
      ...prev,
      [`${mockupType}Size`]: size,
    }));
  }, []);

  const handleNext = () => {
    if (activeStep === 0 && (!logoName || !colorPalette)) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }
    if (activeStep === 1) {
      if (
        !logoVariants.light.horizontal ||
        !logoVariants.light.vertical ||
        !logoVariants.dark.horizontal ||
        !logoVariants.dark.vertical ||
        !logoVariants.negative.horizontal ||
        !logoVariants.negative.vertical
      ) {
        setSnackbar({
          open: true,
          message: "Please upload all logo variants",
          severity: "error",
        });
        return;
      }
    }
    if (activeStep === 3 && !zipFile) {
      setSnackbar({
        open: true,
        message: "Please upload a ZIP bundle",
        severity: "error",
      });
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    setIsUploading(true);

    const submitAction = isEditMode
      ? updateLogoAndSizes(
          editId,
          logoName,
          colorPalette,
          sidebarLogo,
          logoSizes,
          logoVariants,
          zipFile,
          existingAssets,
          pptFile,
          cviFile
        )
      : uploadLogoAndSizes(
          logoName,
          colorPalette,
          sidebarLogo?.file,
          logoSizes,
          logoVariants,
          zipFile,
          pptFile,
          cviFile
        );

    submitAction
      .then((response) => {
        setIsUploading(false);
        // console.log(isEditMode ? "Update response:" : "Upload response:", response);
        setSnackbar({
          open: true,
          message: isEditMode ? "Logo updated successfully" : "Logo configuration saved",
          severity: "success",
        });
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push("/logos/manage");
        }, 1500);
      })
      .catch((error) => {
        setIsUploading(false);
        console.error(isEditMode ? "Update error:" : "Upload error:", error);
        const backendError = error.response?.data?.error || error.message;
        setSnackbar({
          open: true,
          message: backendError || (isEditMode ? "Error updating logo" : "Error saving logo configuration"),
          severity: "error",
        });
      });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoStep
            logoName={logoName}
            setLogoName={setLogoName}
            colorPalette={colorPalette}
            setColorPalette={setColorPalette}
          />
        );
      case 1:
        return (
          <UploadLogosStep
            logoVariants={logoVariants}
            onLogoUpload={handleLogoUpload}
            sidebarLogo={sidebarLogo}
            setSidebarLogo={setSidebarLogo}
            colorPalette={colorPalette}
          />
        );
      case 2:
        return (
          <AdjustSizesStep
            logoVariants={logoVariants}
            logoSizes={logoSizes}
            onSizeChange={handleSizeChange}
            logoName={logoName}
            colorPalette={colorPalette}
            sidebarLogo={sidebarLogo}
          />
        );
      case 3:
        return <UploadBundleStep zipFile={zipFile} setZipFile={setZipFile} />;
      case 4:
        return (
          <UploadPptCviStep
            pptFile={pptFile}
            setPptFile={setPptFile}
            cviFile={cviFile}
            setCviFile={setCviFile}
          />
        );
      case 5:
        return (
          <ReviewStep
            logoName={logoName}
            colorPalette={colorPalette}
            logoVariants={logoVariants}
            logoSizes={logoSizes}
            sidebarLogo={sidebarLogo}
            zipFile={zipFile}
            pptFile={pptFile}
            cviFile={cviFile}
          />
        );
      default:
        return null;
    }
  };

  if (!isAdmin && !isSuperAdmin) {
    notFound();
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 4,
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? "Edit Logo" : "Upload New Logo"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode
            ? "Update the product logo configuration and variants."
            : "Add a new product logo to the design system with all required variants and configurations."}
        </Typography>
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Loading logo data...</Typography>
        </Box>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontWeight: activeStep === index ? 600 : 400,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              p: 4,
              minHeight: 400,
            }}
          >
            {renderStepContent()}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowLeft size={18} />}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<Check size={18} />}
            sx={{
              textTransform: "none",
              bgcolor: "#111",
              "&:hover": { bgcolor: "#333" },
            }}
            disabled={isUploading}
          >
            {isUploading ? (isEditMode ? "Updating..." : "Uploading...") : (isEditMode ? "Update Logo" : "Save Logo")}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowRight size={18} />}
            sx={{
              textTransform: "none",
              bgcolor: "#111",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Continue
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Step 1: Basic Info
export function BasicInfoStep({
  logoName,
  setLogoName,
  colorPalette,
  setColorPalette,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Logo Information
      </Typography>

      <Alert
        severity="info"
        icon={<Info size={20} />}
        sx={{
          mb: 3,
          bgcolor: "#F0F9FF",
          border: "1px solid #BAE6FD",
          "& .MuiAlert-message": { color: "#0369A1" },
        }}
      >
        Enter the product name and select a color palette that matches the brand
        identity.
      </Alert>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 500 }}
      >
        <TextField
          label="Logo/Product Name"
          value={logoName}
          onChange={(e) => setLogoName(e.target.value)}
          placeholder="e.g., EG Ajour"
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <FormControl fullWidth required>
          <InputLabel>Color Palette</InputLabel>
          <Select
            value={colorPalette}
            label="Color Palette"
            onChange={(e) => setColorPalette(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {COLOR_PALETTES.map((palette) => (
              <MenuItem key={palette} value={palette}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      bgcolor: getPaletteColor(palette),
                    }}
                  />
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {palette}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

// Step 2: Upload Logos
export function UploadLogosStep({
  logoVariants,
  onLogoUpload,
  sidebarLogo,
  setSidebarLogo,
  colorPalette,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Upload Logo Variants
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Upload both horizontal and vertical versions for each logo variant
        (Light, Dark, Negative).
      </Typography>

      {/* Sidebar/Icon Logo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Sidebar Icon Logo
        </Typography>
        <LogoVariantUploader
          label="Icon Logo (for sidebar display)"
          file={sidebarLogo}
          onUpload={(file) =>
            setSidebarLogo(
              file
                ? { file, url: URL.createObjectURL(file), name: file.name }
                : null
            )
          }
          accept={{ "image/svg+xml": [] }}
          singleUpload
          variant="dark"
          colorPalette={colorPalette}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Light Variant */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Light Variant (White Text)
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Horizontal"
              file={logoVariants.light.horizontal}
              onUpload={(file) => onLogoUpload("light", "horizontal", file)}
              accept={{ "image/svg+xml": [] }}
              variant="light"
              colorPalette={colorPalette}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Vertical"
              file={logoVariants.light.vertical}
              onUpload={(file) => onLogoUpload("light", "vertical", file)}
              accept={{ "image/svg+xml": [] }}
              variant="light"
              colorPalette={colorPalette}
            />
          </Box>
        </Box>
      </Box>

      {/* Dark Variant */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Dark Variant (With Stroke)
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Horizontal"
              file={logoVariants.dark.horizontal}
              onUpload={(file) => onLogoUpload("dark", "horizontal", file)}
              accept={{ "image/svg+xml": [] }}
              variant="dark"
              colorPalette={colorPalette}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Vertical"
              file={logoVariants.dark.vertical}
              onUpload={(file) => onLogoUpload("dark", "vertical", file)}
              accept={{ "image/svg+xml": [] }}
              variant="dark"
              colorPalette={colorPalette}
            />
          </Box>
        </Box>
      </Box>

      {/* Negative Variant */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Negative Variant
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Horizontal"
              file={logoVariants.negative.horizontal}
              onUpload={(file) => onLogoUpload("negative", "horizontal", file)}
              accept={{ "image/svg+xml": [] }}
              variant="negative"
              colorPalette={colorPalette}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LogoVariantUploader
              label="Vertical"
              file={logoVariants.negative.vertical}
              onUpload={(file) => onLogoUpload("negative", "vertical", file)}
              accept={{ "image/svg+xml": [] }}
              variant="negative"
              colorPalette={colorPalette}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Step 3: Adjust Sizes
export function AdjustSizesStep({
  logoVariants,
  logoSizes,
  onSizeChange,
  logoName,
  colorPalette,
  sidebarLogo,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Adjust Logo Sizes & Preview Variant
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Fine-tune how your logos appear in different screen mockups. Size
        adjustments apply universally to all logo variants.
      </Typography>

      <LogoSizeAdjuster
        logoVariants={logoVariants}
        logoSizes={logoSizes}
        onSizeChange={onSizeChange}
        logoName={logoName}
        colorPalette={colorPalette}
        sidebarLogo={sidebarLogo}
      />
    </Box>
  );
}

// Step 4: Upload Bundle
export function UploadBundleStep({ zipFile, setZipFile }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Upload Logo Bundle
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Upload a ZIP file containing all logo assets for download.
      </Typography>

      <Alert
        severity="info"
        icon={<Info size={20} />}
        sx={{
          mb: 3,
          bgcolor: "#F0F9FF",
          border: "1px solid #BAE6FD",
          "& .MuiAlert-message": { color: "#0369A1" },
        }}
      >
        The ZIP bundle should contain all logo variants in various formats (SVG,
        PNG, etc.) for users to download.
      </Alert>

      <ZipUploadDropzone zipFile={zipFile} setZipFile={setZipFile} />
    </Box>
  );
}

// Step 5: Upload PPT/CVI
export function UploadPptCviStep({ pptFile, setPptFile, cviFile, setCviFile }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={1}>
        Upload PPT / CVI
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Upload PowerPoint templates and Corporate Visual Identity documents for
        this logo.
      </Typography>

      <Alert
        severity="info"
        icon={<Info size={20} />}
        sx={{
          mb: 3,
          bgcolor: "#F0F9FF",
          border: "1px solid #BAE6FD",
          "& .MuiAlert-message": { color: "#0369A1" },
        }}
      >
        Upload the PowerPoint template (.pptx) and CVI document (.pdf, .pptx)
        for brand usage.
      </Alert>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            PowerPoint Template
          </Typography>
          <PptCviDropzone
            file={pptFile}
            setFile={setPptFile}
            accept={{
              "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
              "application/vnd.ms-powerpoint": [".ppt"],
            }}
            label="Drag and drop your PowerPoint template"
            description=".ppt / .pptx file"
            fileType="ppt"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            CVI Document
          </Typography>
          <PptCviDropzone
            file={cviFile}
            setFile={setCviFile}
            accept={{
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
              "application/vnd.ms-powerpoint": [".ppt"],
            }}
            label="Drag and drop your CVI document"
            description=".pdf / .ppt / .pptx file"
            fileType="cvi"
          />
        </Box>
      </Box>
    </Box>
  );
}

function PptCviDropzone({ file, setFile, accept, label, description, fileType }) {
  const [isPressed, setIsPressed] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile({ file: f, name: f.name, size: f.size });
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isPdf = fileType === "cvi";

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 2,
        border: `2px dashed ${file ? "#86EFAC" : isDragActive ? "#9CA3AF" : "#E5E7EB"}`,
        bgcolor: file ? "#F0FDF4" : isPressed ? "#F3F4F6" : isDragActive ? "#E5E7EB" : "#FAFAFA",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        position: "relative",
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          borderColor: file ? "#86EFAC" : "#9CA3AF",
          bgcolor: file ? "#F0FDF4" : "#F3F4F6",
        },
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 400 }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <CheckCircle size={28} color="#16A34A" weight="duotone" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#16A34A", mb: 1 }}>
              <CheckCircle size={16} weight="fill" />
              <Typography variant="body1" fontWeight={600}>
                {file.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatFileSize(file.size)}
            </Typography>
            <IconButton
              onClick={handleRemove}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "#fff",
                border: "1px solid #E5E7EB",
                "&:hover": { bgcolor: "#FEE2E2", borderColor: "#FECACA" },
              }}
            >
              <X size={16} />
            </IconButton>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <UploadSimple size={28} color="#6B7280" />
            </Box>
            {isDragActive ? (
              <Typography variant="body1" color="text.secondary">
                Drop the file here
              </Typography>
            ) : (
              <>
                <Typography variant="body1" fontWeight={500} mb={0.5}>
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  {description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#6B7280" }}>
                  <UploadSimple size={16} />
                  <Typography variant="body2">or click to browse</Typography>
                </Box>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// Step 6: Review
export function ReviewStep({
  logoName,
  colorPalette,
  logoVariants,
  logoSizes,
  sidebarLogo,
  zipFile,
  pptFile,
  cviFile,
}) {
  const getUploadedCount = () => {
    let count = 0;
    Object.values(logoVariants).forEach((variant) => {
      if (variant.horizontal) count++;
      if (variant.vertical) count++;
    });
    return count;
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Review & Confirm
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left: Summary */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: "#F9FAFB",
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Logo Name
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={3}>
              {logoName || "Not specified"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Color Palette
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  bgcolor: getPaletteColor(colorPalette),
                }}
              />
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ textTransform: "capitalize" }}
              >
                {colorPalette || "Not selected"}
              </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Logo Variants Uploaded
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={3}>
              {getUploadedCount()} / 6 variants
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Sidebar Icon
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={3}>
              {sidebarLogo ? sidebarLogo.name : "Not uploaded"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              ZIP Bundle
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={3}>
              {zipFile ? zipFile.name : "Not uploaded"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              PowerPoint Template
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={3}>
              {pptFile ? pptFile.name : "Not uploaded"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              CVI Document
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {cviFile ? cviFile.name : "Not uploaded"}
            </Typography>
          </Box>
        </Box>

        {/* Right: Preview */}
        <Box sx={{ flex: 1 }}>
          <LogoUploadPreview
            logoVariants={logoVariants}
            logoSizes={logoSizes}
            logoName={logoName}
            colorPalette={colorPalette}
            sidebarLogo={sidebarLogo}
          />
        </Box>
      </Box>
    </Box>
  );
}

// Helper function to get palette color
export function getPaletteColor(palette) {
  const colors = {
    purple: "#7C3AED",
    cobalt: "#1E40AF",
    blue: "#2563EB",
    steel: "#475569",
    teal: "#0D9488",
    jade: "#059669",
    green: "#16A34A",
    lime: "#65A30D",
    yellow: "#CA8A04",
    amber: "#D97706",
    orange: "#EA580C",
    magenta: "#DB2777",
    maroon: "#BE185D",
    violet: "#8B5CF6",
  };
  return colors[palette] || "#6B7280";
}

export default LogoUploadPage;
