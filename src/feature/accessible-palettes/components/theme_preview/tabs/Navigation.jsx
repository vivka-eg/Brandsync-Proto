import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import { CaretRight, Star } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function Navigation({ themeTab }) {
  const textColor = themeTab === 0 ? "#121212" : "#EEF1F1";
  const labelColor = themeTab === 0 ? "#636970" : "#A2AAB2";

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedInlineTab, setSelectedInlineTab] = useState(0);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(1);

  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;

  return (
    <Stack spacing={4}>
      {/* Menu */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Menu
        </Typography>

        <Box
          sx={{
            width: 220,
            backgroundColor: themeTab === 0 ? "#EAEAEB" : "#1E1E1E",
            borderRadius: "12px",
            overflow: "hidden", // ensures rounded corners apply to children
            padding: "4px", // space so highlight radius is visible
          }}
        >
          <List sx={{ p: 0 }}>
            <ListItem
              sx={{
                px: 2,
                py: 1,
                backgroundColor: themeTab === 0 ? "#EAEAEB" : "#1E1E1E",
                borderBottom: `1px solid ${
                  themeTab === 0 ? "#C4C4C4" : "#3A3A3A"
                }`,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  color: themeTab === 0 ? "#545962" : "#A2AAB2",
                  fontSize: "14px",
                }}
              >
                Header
              </Typography>
            </ListItem>

            {[...Array(7)].map((_, index) => {
              const isSelected = selectedMenuIndex === index;

              return (
                <ListItemButton
                  key={index}
                  onClick={() => setSelectedMenuIndex(index)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    marginY: isSelected ? "4px" : "0px",
                    borderRadius: "8px",
                    backgroundColor: isSelected
                      ? themeTab === 0
                        ? "#A9ACB1"
                        : "#29303B"
                      : "transparent",

                    "&:hover": {
                      backgroundColor: themeTab === 0 ? "#C7C9CC" : "#4A4F55",
                    },
                  }}
                >
                  <ListItemText
                    primary="Menu item"
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: textColor,
                    }}
                  />
                  <CaretRight size={16} color={labelColor} weight="bold" />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Box>

      {/* Tabs */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Tabs
        </Typography>

        <Box sx={{ borderBottom: "1px solid #E8EAED" }}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{
              minHeight: 48,
              "& .MuiTabs-indicator": {
                height: 2,
                backgroundColor: primaryColor,
              },
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                color: "#636970",
                "&.Mui-selected": {
                  color: primaryColor,
                },
              },
            }}
          >
            <Tab
              icon={<Star size={20} weight="regular" />}
              iconPosition="start"
              label="Tab"
              sx={{ "& .MuiTab-iconWrapper": { marginRight: 1 } }}
            />
            <Tab
              icon={<Star size={20} weight="regular" />}
              iconPosition="start"
              label="Tab"
              sx={{ "& .MuiTab-iconWrapper": { marginRight: 1 } }}
            />
            <Tab
              icon={<Star size={20} weight="regular" />}
              iconPosition="start"
              label="Tab"
              sx={{ "& .MuiTab-iconWrapper": { marginRight: 1 } }}
            />
          </Tabs>
        </Box>
      </Box>

      {/* Inline Tabs */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ mb: 2, color: textColor }}
        >
          Inline Tabs
        </Typography>

        <Box
          sx={{
            display: "flex",
            width: "fit-content",
            maxWidth: "100%",
            flexWrap: "wrap",
            backgroundColor: themeTab === 1 ? "#2A2A2A" : "#EAEAEB",
            borderRadius: "24px",
            padding: "4px",
            boxShadow:
              themeTab === 1 ? "0 0 0 1px #3A3A3A inset" : "none",
          }}
        >
          {["Tab", "Tab", "Tab"].map((label, index) => {
            const isSelected = selectedInlineTab === index;

            return (
              <Box
                key={index}
                onClick={() => setSelectedInlineTab(index)}
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  borderRadius: "20px",
                  transition: "all 0.2s ease",

                  backgroundColor: isSelected ? primaryColor : "transparent",

                  color: isSelected
                    ? themeTab === 1
                      ? "#000"
                      : "#fff"
                    : themeTab === 1
                    ? "#C2C3C4"
                    : "#121212",

                  "&:hover": !isSelected && {
                    backgroundColor:
                      themeTab === 1
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.06)",
                  },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}

export default Navigation;
