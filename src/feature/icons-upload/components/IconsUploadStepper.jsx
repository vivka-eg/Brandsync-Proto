"use client";

import { Box, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { UPLOAD_ICONS_TABS as steps} from "@/constants/assets";

export default function CustomStepper({ activeStep = 0 }) {
  const getStepState = (index) => {
    if (index < activeStep) return "completed";
    if (index === activeStep) return "active";
    return "inactive";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const state = getStepState(index);

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                flex: isLast ? "none" : 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <StepIndicator state={state} />
                <Typography
                  sx={{
                    fontWeight: state !== "inactive" ? 600 : 400,
                    color:
                      state === "active" ? "action.active" : "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </Typography>
              </Stack>

              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    bgcolor: index < activeStep ? "action.active" : "divider",
                    mx: 2,
                    transition: "background-color 0.3s",
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

function StepIndicator({ state }) {
  const styles = {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  if (state === "completed") {
    return (
      <Box
        sx={{
          ...styles,
          borderColor: "action.active",
          bgcolor: "action.active",
        }}
      >
        <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
      </Box>
    );
  }

  if (state === "active") {
    return (
      <Box sx={{ ...styles, borderColor: "action.active" }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "action.active",
          }}
        />
      </Box>
    );
  }

  return <Box sx={{ ...styles, borderColor: "divider" }} />;
}
