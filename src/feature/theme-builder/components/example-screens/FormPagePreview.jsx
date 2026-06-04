"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from "@mui/material";
import {
  MagnifyingGlass,
  Globe,
  ShieldCheck,
  Bell,
  DotsThree,
  CaretDown,
  List,
} from "@phosphor-icons/react";
import Image from "next/image";
import React, { useState } from "react";
import colorPalettes from "brandsync-tokens/themebuilder.json";
import GenericLogo from "./GenericLogo";

// Custom Stepper Icon
const CustomStepIcon = ({
  active,
  completed,
  icon,
  primaryColor,
  isDarkMode,
  neutralColorPalette,
}) => {
  const color = primaryColor || "#1976d2";
  const inactiveColor = isDarkMode
    ? neutralColorPalette[600]
    : neutralColorPalette[400];

  if (active) {
    // Radio button style: outer ring + inner filled circle
    return (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: color,
          }}
        />
      </Box>
    );
  }

  if (completed) {
    return (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "10px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ✓
      </Box>
    );
  }

  // Upcoming: outline ring only
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `2px solid ${inactiveColor}`,
        flexShrink: 0,
      }}
    />
  );
};

// Reusable Info Item Component
const InfoItem = ({ label, value, isDarkMode, neutralColorPalette }) => (
  <Box>
    <Typography
      sx={{
        fontSize: "14px",
        color: isDarkMode ? neutralColorPalette[400] : "text.secondary",
        mb: 0.5,
        fontWeight: 500,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "16px",
        color: isDarkMode ? "#FFFFFF" : "text.primary",
        fontWeight: 500,
      }}
    >
      {value}
    </Typography>
  </Box>
);

// Reusable Form Field Component
const FormTextField = ({
  label,
  required = false,
  multiline = false,
  rows,
  defaultValue,
  focused = false,
  isDarkMode,
  neutralColorPalette,
  errorColorPalette,
  primaryColor,
  theme,
}) => {
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: isDarkMode ? neutralColorPalette[800] : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "text.primary",
      "& fieldset": {
        borderColor: focused
          ? primaryColor || "primary.main"
          : isDarkMode
            ? neutralColorPalette[700]
            : neutralColorPalette[200],
        borderWidth: focused ? "2px" : "1px",
      },
      "&:not(.Mui-focused):hover fieldset": {
        borderColor: primaryColor || "primary.main",
        borderWidth: "1.5px",
      },
    },
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          mb: 1,
          mt: multiline ? 0 : 2,
          color: isDarkMode ? "#FFFFFF" : "text.primary",
        }}
      >
        {required && (
          <span
            style={{
              color: isDarkMode
                ? errorColorPalette[300]
                : theme.palette.text.error,
            }}
          >
            *{" "}
          </span>
        )}
        {label}
      </Typography>
      <TextField
        fullWidth
        defaultValue={defaultValue}
        multiline={multiline}
        rows={rows}
        variant="outlined"
        sx={inputStyles}
      />
    </Box>
  );
};

function FormPagePreview({
  device = "desktop",
  mode = "light",
  primaryColor,
  selectedColor,
  firstMatchingLogo,
}) {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState("confirmation");
  const primaryColorPalette =
    colorPalettes[selectedColor]?.shades || colorPalettes["blue"]?.shades;
  const neutralColorPalette = colorPalettes["neutral"].shades;
  const errorColorPalette = colorPalettes["error"].shades;
  const isDarkMode = mode === "dark";

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // Info grid data
  const infoItems = [
    { label: "Company", value: "GearForge" },
    { label: "Order Type", value: "New Installation" },
    { label: "Category", value: "Villa" },
    {
      label: "Address",
      value: "Keminmaa, Kemi-Tornio sub-region, Lapland, Finland",
    },
  ];

  // Header icons data
  const headerIcons = [
    { Icon: Globe, size: 24 },
    { Icon: ShieldCheck, size: 24 },
    { Icon: Bell, size: 24 },
  ];

  // Stepper steps data
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

  // Determine container width based on device
  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "400px";
      case "tablet":
        return "600px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const logoURL = !firstMatchingLogo.src
    ? "./BrandSync_logo.svg"
    : mode == "light"
      ? firstMatchingLogo.horizontal.dark
      : firstMatchingLogo.horizontal.light;

  return (
    <Box
      sx={{
        width: getDeviceWidth(),
        maxWidth: "1400px",
        margin: "0 auto",
        height: "800px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "7px solid",
        borderColor: "neutral.border",
        position: "relative",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
          px: isMobile ? 2 : 4,
          py: 2,
          borderBottom: "1px solid",
          borderColor: isDarkMode ? neutralColorPalette[800] : "neutral.border",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Logo and Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 1 : 3,
            flex: 1,
          }}
        >
          {/* Hamburger Menu for Mobile/Tablet or Logo for Desktop */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile || isTablet ? (
              <IconButton
                size="small"
                sx={{
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                }}
              >
                <List size={24} weight="bold" />
              </IconButton>
            ) : (
              <GenericLogo
                horizontal
                selectedColor={selectedColor}
                mode={mode}
              />
            )}
          </Box>

          {/* Search Bar */}
          {!isMobile && (
            <TextField
              placeholder="Search"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass
                      size={20}
                      color={isDarkMode ? neutralColorPalette[400] : "#9CA3AF"}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: "400px",
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  // bgcolor: isDarkMode ? neutralColorPalette[800] : "#F9FAFB",
                  "& fieldset": {
                    borderColor: isDarkMode
                      ? neutralColorPalette[700]
                      : neutralColorPalette[200],
                  },
                  "&:not(.Mui-focused):hover fieldset": {
                    borderColor: primaryColor,
                    borderWidth: "1.5px",
                  },
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                },
              }}
            />
          )}
        </Box>

        {/* Right Icons */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 2 }}
        >
          {headerIcons.map(({ Icon, size }, index) => (
            <IconButton key={index} size="small">
              <Icon size={size} color={theme.palette.text.secondary} />
            </IconButton>
          ))}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: primaryColor || "primary.main",
            }}
          >
            U
          </Avatar>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: isMobile ? 2 : 4,
          pb: isMobile ? "72px" : 4,
          bgcolor: isDarkMode ? neutralColorPalette[950] : "transparent",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#D1D5DB",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#9CA3AF" },
        }}
      >
        {/* Breadcrumb */}
        <Typography
          sx={{
            fontSize: "14px",
            color: isDarkMode ? neutralColorPalette[400] : "text.secondary",
            mb: 2,
          }}
        >
          Dashboard &gt; <span style={{ fontWeight: 600 }}>Form</span>
        </Typography>

        {/* Form Header */}
        <Box
          sx={{
            bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
            borderRadius: "12px",
            // p: isMobile ? 2 : 3,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Form ID and Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: 700,
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                  letterSpacing: "-0.02em",
                }}
              >
                W134578
              </Typography>
              <Chip
                label="Instruction Received"
                sx={{
                  bgcolor: "#DBEAFE",
                  color: "#1E40AF",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                position: isMobile ? "absolute" : "static",
                left: 0,
                bottom: 0,
                zIndex: isMobile ? 10 : "auto",
                bgcolor: isMobile
                  ? isDarkMode
                    ? neutralColorPalette[950]
                    : "#fff"
                  : "transparent",
                p: isMobile ? "12px" : 0,
                width: isMobile ? "100%" : "auto",
                justifyContent: "end",
                borderTop: isMobile ? "1px solid" : "",
                borderTopColor: isMobile ? "neutral.border" : "",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: "neutral.border",
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableRipple
                disableFocusRipple
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  bgcolor: isDarkMode
                    ? primaryColorPalette[500]
                    : primaryColor || "primary.main",
                  color: isDarkMode ? "text.primary" : "#FFFFFF",
                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[300]
                      : primaryColorPalette[700],
                    boxShadow: "none",
                  },

                  "&:active": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[200]
                      : primaryColorPalette[800],
                    boxShadow: "none",
                  },

                  "&:focus-visible": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[300]
                      : primaryColorPalette[700],
                    boxShadow: "none",
                  },
                }}
              >
                Submit
              </Button>

              <IconButton size="small">
                <DotsThree
                  size={24}
                  weight="bold"
                  color={
                    isDarkMode
                      ? neutralColorPalette[25]
                      : neutralColorPalette[900]
                  }
                />
              </IconButton>
            </Box>
          </Box>

          {/* Info Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr 1fr"
                : isTablet
                  ? "repeat(4, 1fr)"
                  : "repeat(4, 1fr)",
              gap: 3,
              mb: 4,
            }}
          >
            {infoItems.map((item, index) => (
              <InfoItem
                key={index}
                {...item}
                isDarkMode={isDarkMode}
                neutralColorPalette={neutralColorPalette}
              />
            ))}
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={1}
            alternativeLabel
            sx={{
              "& .MuiStepConnector-root.MuiStepConnector-alternativeLabel": {
                top: "8px",
              },
              "& .MuiStepConnector-line": {
                borderColor: primaryColor,
                borderTopWidth: "3px",
              },
              "& .MuiStepLabel-label": {
                fontSize: isMobile ? "12px" : "14px",
                lineHeight: isMobile ? "16px" : "20px",
                mt: 1,
                textAlign: "center",
                color: isDarkMode ? "#FFFFFF" : "text.primary",
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={index === 0}>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  StepIconProps={{
                    primaryColor,
                    isDarkMode,
                    neutralColorPalette,
                  }}
                >
                  {step}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Sections */}
        <Stack spacing={2}>
          {/* Ready for Confirmation Section */}
          <Accordion
            expanded={expandedSection === "confirmation"}
            onChange={handleAccordionChange("confirmation")}
            sx={{
              bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
              borderRadius: "12px !important",
              boxShadow: "none",
              border: "1px solid",
              borderColor: isDarkMode
                ? neutralColorPalette[500]
                : neutralColorPalette[300],
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <CaretDown
                  size={20}
                  weight="bold"
                  color={isDarkMode ? "#FFFFFF" : undefined}
                />
              }
              sx={{
                px: isMobile ? 2 : 3,
                py: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                }}
              >
                Ready for Confirmation
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: isMobile ? 2 : 3, pb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 3,
                }}
              >
                <Stack sx={{ flex: 1 }}>
                  {/* Name of package */}
                  <FormTextField
                    label="Name of package"
                    required={true}
                    defaultValue="Gears"
                    isDarkMode={isDarkMode}
                    neutralColorPalette={neutralColorPalette}
                    errorColorPalette={errorColorPalette}
                    primaryColor={primaryColor}
                    theme={theme}
                  />

                  {/* Is the package sealed */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        mb: 1,
                        mt: 2,
                        color: isDarkMode ? "#FFFFFF" : "text.primary",
                      }}
                    >
                      Is the package sealed?
                    </Typography>
                    <RadioGroup row sx={{ marginLeft: "10px", gap: 2 }}>

                      <FormControlLabel
                        value="yes"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: isDarkMode ? neutralColorPalette[400] : undefined,
                              '&.Mui-checked': {
                                color: primaryColor || 'primary.main',
                              },
                              '&:hover': {
                                bgcolor: 'transparent',
                              },
                            }}
                          />
                        }
                        label={
                          <span
                            style={{
                              color: isDarkMode ? "#FFFFFF" : undefined,
                            }}
                          >
                            Yes
                          </span>
                        }
                        sx={{ gap: 1 }}
                      />
                      <FormControlLabel
                        value="no"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: isDarkMode ? neutralColorPalette[400] : undefined,
                              '&.Mui-checked': {
                                color: primaryColor || 'primary.main',
                              },
                              '&:hover': {
                                bgcolor: 'transparent',
                              },
                            }}
                          />
                        }
                        label={
                          <span
                            style={{
                              color: isDarkMode ? "#FFFFFF" : undefined,
                            }}
                          >
                            No
                          </span>
                        }
                        sx={{ gap: 1 }}
                      />

                    </RadioGroup>
                  </Box>
                </Stack>
                {/* Package description */}
                <FormTextField
                  label="Package description"
                  required={true}
                  multiline={true}
                  rows={4}
                  // focused={true}
                  isDarkMode={isDarkMode}
                  neutralColorPalette={neutralColorPalette}
                  errorColorPalette={errorColorPalette}
                  primaryColor={primaryColor}
                  theme={theme}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Instructions Section */}
          <Accordion
            expanded={expandedSection === "instructions"}
            onChange={handleAccordionChange("instructions")}
            sx={{
              bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
              borderRadius: "12px !important",
              boxShadow: "none",
              border: "1px solid",
              borderColor: isDarkMode
                ? neutralColorPalette[500]
                : neutralColorPalette[300],
              // borderColor: "neutral.border",
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <CaretDown
                  size={20}
                  weight="bold"
                  color={isDarkMode ? "#FFFFFF" : undefined}
                />
              }
              sx={{
                px: isMobile ? 2 : 3,
                py: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: isDarkMode ? "#FFFFFF" : "text.primary",
                }}
              >
                Instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: isMobile ? 2 : 3, pb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 3,
                }}
              >
                <FormTextField
                  label="Service line"
                  required={true}
                  isDarkMode={isDarkMode}
                  neutralColorPalette={neutralColorPalette}
                  errorColorPalette={errorColorPalette}
                  primaryColor={primaryColor}
                  theme={theme}
                />
                <FormTextField
                  label="Created by"
                  required={true}
                  isDarkMode={isDarkMode}
                  neutralColorPalette={neutralColorPalette}
                  errorColorPalette={errorColorPalette}
                  primaryColor={primaryColor}
                  theme={theme}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box >
    </Box >
  );
}

export default FormPagePreview;
