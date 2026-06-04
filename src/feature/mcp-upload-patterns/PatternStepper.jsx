"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Check } from "phosphor-react";

const STEPS = [
  "Upload Screenshot",
  "Upload Code",
  "Upload Prompt & Details",
  "Review & Submit",
];

export default function PatternStepper({ activeStep }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {STEPS.map((label, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isLast = index === STEPS.length - 1;

          return (
            <Box
              key={label}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flex: isLast ? "0 0 auto" : 1,
              }}
            >
              {/* Step circle + label */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 80,
                }}
              >
                {/* Circle */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    ...(isCompleted && {
                      bgcolor: "text.primary",
                      border: "none",
                    }),
                    ...(isActive && {
                      bgcolor: "text.primary",
                      border: "none",
                    }),
                    ...(!isCompleted && !isActive && {
                      bgcolor: "transparent",
                      border: "2px solid",
                      borderColor: "grey.300",
                    }),
                  }}
                >
                  {isCompleted && (
                    <Check
                      size={12}
                      weight="bold"
                      color="white"
                    />
                  )}
                  {isActive && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "white",
                      }}
                    />
                  )}
                </Box>

                {/* Label */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "text.primary" : "text.secondary",
                    textAlign: "center",
                    lineHeight: 1.3,
                    maxWidth: 80,
                  }}
                >
                  {label}
                </Typography>
              </Box>

              {/* Connector line */}
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mt: "13px",
                    bgcolor: isCompleted ? "text.primary" : "grey.300",
                    mx: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
