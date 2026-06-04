import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button as MuiButton,
  IconButton,
} from "@mui/material";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import theme from "@/theme/theme";

function DataDisplay({ themeTab }) {
  const bgColor = themeTab === 0 ? "#EAEAEB" : "#1D1B20";
  const textColor = themeTab === 0 ? "#121212" : "#EEF1F1";
  const labelColor = themeTab === 0 ? "#636970" : "#A2AAB2";
  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 5;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSlideChange = (slide) => {
    if (slide >= 1 && slide <= totalSlides) {
      setCurrentSlide(slide);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Stack spacing={3}>
      {/* Card */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Card
        </Typography>
        <Box
          sx={{
            maxWidth: { xs: "100%", sm: 479 },
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: themeTab === 0 ? "#FFFFFF" : "#2A2D35",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Card Image */}
          <Box
            component="img"
            src="/theme-preview/card-preview.svg"
            alt="Card preview"
            sx={{
              width: "100%",
              height: { xs: 180, sm: 311 },
              objectFit: "cover",
              mb: -1,
            }}
          />

          {/* Card Content */}
          <Box sx={{ p: 2, backgroundColor: themeTab === 0 ? "#EAEAEB" : "#1E1E1E" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 1, color: themeTab === 0 ? "#121212" : "#FFFFFF" }}
            >
              Header
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: themeTab === 0 ? "#121212" : "#FFFFFF",
                lineHeight: "24px",
                fontWeight: 400,
              }}
            >
              Sunset Towers is a premium commercial space located in the heart
              of the city. It offers flexible office layouts, modern amenities,
              and 24/7 security.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <MuiButton
                sx={{
                  textTransform: "none",
                  color: textColor,
                  fontWeight: 500,
                  width: "48px",
                  pt: "10px",
                  pb: "10px",
                  pr: "10px",
                  pl: "10px",
                }}
              >
                Label
              </MuiButton>
              <MuiButton
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: primaryColor,
                  color: primaryColor,
                  fontWeight: 500,
                  width: "48px",
                  borderRadius: 2,
                  pt: "10px",
                  pb: "10px",
                  pr: "10px",
                  pl: "10px",
                }}
              >
                Label
              </MuiButton>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Pagination */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor, lineHeight: "24px" }}
        >
          Pagination
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              width: 32,
              height: 32,
              color: labelColor,
              "&.Mui-disabled": {
                color: themeTab === 0 ? "#E8EAED" : "#3A3F4A",
              },
            }}
          >
            <CaretLeft size={16} weight="bold" />
          </IconButton>

          {[1, 2, 3].map((page) => (
            <Box
              key={page}
              onClick={() => handlePageChange(page)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                backgroundColor: currentPage === page ? primaryColor : "transparent",
                color: currentPage === page ? "#FFFFFF" : textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: currentPage === page ? 600 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: currentPage === page ? primaryColor : (themeTab === 0 ? "#F5F5F5" : "#3A3F4A"),
                },
              }}
            >
              {page}
            </Box>
          ))}

          <IconButton
            size="small"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === 3}
            sx={{
              width: 32,
              height: 32,
              color: labelColor,
              "&.Mui-disabled": {
                color: themeTab === 0 ? "#E8EAED" : "#3A3F4A",
              },
            }}
          >
            <CaretRight size={16} weight="bold" />
          </IconButton>
        </Stack>
      </Box>

      {/* Progress Stepper */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Progress Stepper
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "90px",
                border: "1.5px solid #7F8389",
                backgroundColor: "transparent",
              }}
            />
            <Box sx={{ flex: 1, height: 2, backgroundColor: "#7F8389" }} />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "90px",
                border: "1.5px solid #7F8389ED",
                backgroundColor: "transparent",
              }}
            />
            <Box sx={{ flex: 1, height: 2, backgroundColor: "#7F8389" }} />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "90px",
                border: "1.5px solid #7F8389ED",
                backgroundColor: "transparent",
              }}
            />
            <Box sx={{ flex: 1, height: 2, backgroundColor: "#7F8389" }} />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "90px",
                border: "1.5px solid #7F8389",
                backgroundColor: "transparent",
              }}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="caption" fontWeight={600} color={textColor}>
                Name
              </Typography>
              <Typography variant="caption" display="block" color={labelColor}>
                Description
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} color={textColor}>
                Name
              </Typography>
              <Typography variant="caption" display="block" color={labelColor}>
                Description
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} color={textColor}>
                Name
              </Typography>
              <Typography variant="caption" display="block" color={labelColor}>
                Description
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} color={textColor}>
                Name
              </Typography>
              <Typography variant="caption" display="block" color={labelColor}>
                Description
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Switch (Carousel) */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Switch
        </Typography>
        <Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 2,
              overflowX: { xs: "auto", sm: "visible" },
              pb: { xs: 1, sm: 0 },
              "&::-webkit-scrollbar": { height: "4px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
            }}
          >
            {[1, 2, 3].map((item) => {
              let slotNumber;
              if (currentSlide <= 3) {
                slotNumber = item;
              } else {
                // For slides 4 and 5, show slots 3, 4, 5
                slotNumber = item + 2;
              }

              return (
                <Box
                  key={item}
                  sx={{
                    width: { xs: 160, sm: "auto" },
                    minWidth: { xs: 160, sm: 0 },
                    maxWidth: { sm: 225 },
                    flex: { xs: "0 0 auto", sm: 1 },
                    height: 100,
                    border: "2px dashed " + primaryColor,
                    borderRadius: "8px",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: themeTab === 0 ? "#FFFFFF" : "#1E1E1E",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mb: 0.5, color: themeTab === 0 ? "#000000" : "#FFFFFF", fontSize: "14px" }}
                  >
                    slot {slotNumber}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={themeTab === 0 ? "#000000" : "#FFFFFF"}
                    sx={{ fontSize: "12px", lineHeight: 1.4 }}
                  >
                    This slot can be replaced with a card or an image
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={handlePrevSlide}
              sx={{
                width: 32,
                height: 32,
                color: textColor,
                "&:hover": {
                  backgroundColor: themeTab === 0 ? "#F5F5F5" : "#3A3F4A",
                },
              }}
            >
              <CaretLeft size={16} weight="bold" />
            </IconButton>

            {[1, 2, 3, 4, 5].map((num) => (
              <Box
                key={num}
                onClick={() => handleSlideChange(num)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "4px",
                  backgroundColor: currentSlide === num ? primaryColor : "transparent",
                  color: currentSlide === num ? "#FFFFFF" : textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: currentSlide === num ? 600 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: currentSlide === num ? primaryColor : (themeTab === 0 ? "#F5F5F5" : "#3A3F4A"),
                  },
                }}
              >
                {num}
              </Box>
            ))}

            <IconButton
              size="small"
              onClick={handleNextSlide}
              sx={{
                width: 32,
                height: 32,
                color: textColor,
                "&:hover": {
                  backgroundColor: themeTab === 0 ? "#F5F5F5" : "#3A3F4A",
                },
              }}
            >
              <CaretRight size={16} weight="bold" />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default DataDisplay;
