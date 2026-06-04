import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Slider,
  Button as MuiButton,
} from "@mui/material";
import { EnvelopeSimple, UploadSimple } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function Input({ themeTab }) {
  const bgColor = themeTab === 0 ? "#EAEAEB" : "#1D1B20";
  const textColor = themeTab === 0 ? "#121212" : "#EEF1F1";
  const labelColor = themeTab === 0 ? "#636970" : "#A2AAB2";
  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;

  const [selectedRadio, setSelectedRadio] = useState("option1");
  const [sliderValue, setSliderValue] = useState(0);

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <Stack spacing={3}>
      {/* Input field */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 1, color: textColor }}
        >
          Input field
        </Typography>
        <Typography
          variant="caption"
          sx={{ mb: 1, display: "block", color: textColor, fontWeight: 600 }}
        >
          Text Input <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
        </Typography>
        <TextField
          placeholder="Placeholder"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <EnvelopeSimple
                size={20}
                color={themeTab === 0 ? "#232323" : "#A9ACB1"}
              />
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "232px" },
            "& .MuiOutlinedInput-root": {
              height: "40px",
              backgroundColor: themeTab === 0 ? "#FBFBFB" : "#2A2D35",
              color: textColor,
              borderRadius: 1,
              "& fieldset": {
                borderColor: themeTab === 0 ? "#E8EAED" : "#3A3F4A",
                borderRadius: 1,
              },
              "&:hover fieldset": {
                borderColor: primaryColor,
                borderWidth: "1.5px",
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor,
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "8px 12px",
              color: textColor,
              fontSize: "14px",
              "&::placeholder": {
                color: themeTab === 0 ? "#29303B" : "#A9ACB1",
                opacity: 1,
                fontSize: "14px",
              },
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ mt: 0.5, display: "block", color: labelColor }}
        >
          Supportive text
        </Typography>
      </Box>

      {/* Checkbox */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Checkbox
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Checkbox
            sx={{
              color: labelColor,
              "&.Mui-checked": { color: primaryColor },
              padding: 0,
            }}
          />
          <Typography variant="body2" color={textColor}>
            Label
          </Typography>
        </Stack>
      </Box>

      {/* Radio button */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Radio button
        </Typography>
        <RadioGroup value={selectedRadio} onChange={handleRadioChange}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Radio
                value="option1"
                sx={{
                  color: labelColor,
                  "&.Mui-checked": { color: primaryColor },
                  padding: 0,
                }}
              />
              <Typography variant="body2" color={textColor}>
                Option 1
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Radio
                value="option2"
                sx={{
                  color: labelColor,
                  "&.Mui-checked": { color: primaryColor },
                  padding: 0,
                }}
              />
              <Typography variant="body2" color={textColor}>
                Option 2
              </Typography>
            </Stack>
          </Stack>
        </RadioGroup>
      </Box>

      {/* Switch */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Switch
        </Typography>
        <Switch
          sx={{
            width: 52,
            height: 32,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: "4px",
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: "translateX(20px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                  backgroundColor: primaryColor,
                  opacity: 1,
                  border: 0,
                },
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 24,
              height: 24,
              backgroundColor: themeTab === 0 ? "#FBFBFB" : "#53585C",
            },
            "& .MuiSwitch-track": {
              borderRadius: 32 / 2,
              backgroundColor: themeTab === 0 ? "#D4D6D8" : "#232323",
              opacity: 1,
              transition: "background-color 300ms",
            },
          }}
        />
      </Box>

      {/* Slider */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Slider
        </Typography>
        <Box sx={{ maxWidth: 400 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600} color={textColor}>
              Label
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Box
              sx={{
                border: 1,
                borderColor: "#E8EAED",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                minWidth: 60,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color={textColor}>
                {sliderValue.toString().padStart(2, '0')}%
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ position: "relative" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                color={labelColor}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                00
              </Typography>
              <Box sx={{ flex: 1, px: 4 }}>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  min={0}
                  max={100}
                  sx={{
                    color: primaryColor,
                    "& .MuiSlider-thumb": {
                      backgroundColor: primaryColor,
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: primaryColor,
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: labelColor,
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color={labelColor}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                100
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* File Upload */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          File Upload
        </Typography>
        <Box
          sx={{
            width: "100%",
            border: "2px dashed",
            borderColor: themeTab === 0 ? "#A9ACB1" : "#29303B",
            borderRadius: "12px",
            padding: "24px",
            backgroundColor: themeTab === 0 ? bgColor : "#1E1E1E",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: themeTab === 0 ? "#A9ACB1" : "#21262F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UploadSimple size={32} color={themeTab === 0 ? "#121212" : "#EEF1F1"} />
          </Box>
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600} color={textColor}>
                Heading
              </Typography>
              <Typography variant="caption" color={labelColor}>
                Upload Guidelines
              </Typography>
            </Box>
            <MuiButton
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: themeTab === 0 ? "#A9ACB1" : "#53585C",
                color: textColor,
                fontWeight: 500,
                alignSelf: "flex-start",
                "&:hover": {
                  borderColor: themeTab === 0 ? "#E8EAED" : "#6B7278",
                },
              }}
            >
              Browse file
            </MuiButton>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default Input;
