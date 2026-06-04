"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const StepperForm = ({ primaryColor }) => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = ["Send Registration", "Instruction Received", "Send Ready for meter", "Report Completed"];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
          W67UVC
        </Typography>
        <Chip
          label="Instruction Received"
          size="small"
          sx={{
            backgroundColor: "#F3F4F6",
            color: "#374151",
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={index < activeStep}
            sx={{
              "& .MuiStepLabel-root .Mui-completed": {
                color: primaryColor,
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: primaryColor,
              },
              "& .MuiStepConnector-line": {
                borderColor: index < activeStep ? primaryColor : "#E5E7EB",
              },
            }}
          >
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  mt: 1,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography
        sx={{
          fontWeight: 600,
          color: "#111827",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Instructions
        <IconButton size="small">
          <Box
            component="span"
            sx={{
              fontSize: "1.25rem",
              transform: "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            &#8964;
          </Box>
        </IconButton>
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827", mb: 0.5 }}
        >
          <Box component="span" sx={{ color: "#EF4444" }}>*</Box> Registration Date
        </Typography>
        <TextField
          fullWidth
          defaultValue="11-11-2025"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarToday sx={{ fontSize: 18, color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827", mb: 0.5 }}
        >
          <Box component="span" sx={{ color: "#EF4444" }}>*</Box> Describe the problem
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          variant="text"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: primaryColor,
            color: primaryColor,
            "&:hover": {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}08`,
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default StepperForm;
