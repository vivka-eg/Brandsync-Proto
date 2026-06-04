"use client";

import {
  Box,
  Typography,
  Divider,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Top,
  Bottom,
  Left,
  Right,
  TopToBottom,
  LeftToRight,
} from "@/components/icons";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
 
const LabelValue = ({ label, value, isStrong = false, icon = null }) => {
  if (!value || label == "id") return null;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        mb: 1,
        width: "60%",
        "@media (max-width: 818px)": { width: "70%" },
        "@media (max-width: 724px)": { width: "80%" },
        "@media (max-width: 700px)": { width: "60%" },
        "@media (max-width: 486px)": { width: "90%" },
        "@media (max-width: 466px)": { width: "80%" },
      }}
    >
      <Stack direction="row" alignItems={"center"} spacing={1}>
        {icon && icon}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 16 }}
        >
          {label}
        </Typography>
      </Stack>
 
      <Typography
        variant="body2"
        sx={{
          fontSize: 16,
          fontWeight: isStrong ? 500 : 400,
          color: "text.body",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};
 
const Measurement = ({ Title, children, value = "" }) => {
  const theme = useTheme();
 
  if (!children) {
    return <LabelValue label={Title} value={value} isStrong />;
  }
 
  return (
    <>
      <Typography
        variant="subtitle2"
        color="text.disabled"
        sx={{ mb: "12px", fontSize: 16 }}
      >
        {Title}
      </Typography>
      <Stack
        sx={{
          borderLeft: `1px solid ${theme.palette.divider}`,
          pl: 1,
          mb: 1,
          ml: 1,
        }}
      >
        {children}
      </Stack>
    </>
  );
};
 
export default function MeasurementsPanel({ measurements }) {
  const theme = useTheme();
  const { register, onKeyDown } = useArrowKeyNavigation();

  // console.log("Measurements Panel:", measurements);
 
  const getIconForPadding = (key) => {
    switch (key.toLowerCase().trim()) {
      case "top":
        return <Top />;
      case "bottom":
        return <Bottom />;
      case "left":
        return <Left />;
      case "right":
        return <Right />;
      case "leftandright":
        return <LeftToRight />;
      case "topandbottom":
        return <TopToBottom />;
      default:
        return null;
    }
  };
 
  const getLabelForKeys = (key) => {
    switch (key.toLowerCase().trim()) {
      case "top":
        return "Top";
      case "bottom":
        return "Bottom";
      case "left":
        return "Left";
      case "right":
        return "Right";
      case "leftandright":
        return "Left and Right";
      case "topandbottom":
        return "Top and Bottom";
 
      case "lineheight":
        return "Line Height";
      default:
        return key;
    }
  };
 
  return (
    <Box
      sx={{
        borderRadius: 2,
        color: theme.palette.text.primary,
      }}
    >
      {measurements.map(({ Title, Padding, Size, TextElement, Gap }, index) => (
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderBottom: `1px solid ${theme.palette.neutral.border}`,
          }}
          key={index}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            ref={register(index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            <Typography
              color="text.body"
              sx={{ fontSize: 20, fontWeight: 600, lineHeight: "24px" }}
            >
              {Title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Size */}
            {Size &&
              (Size.Width || Size.Height) &&
              Object.entries(Size).length > 0 && (
                <Measurement Title="Size">
                  {Object.entries(Size).map(([key, value]) => (
                    <LabelValue key={key} label={key} value={value} isStrong />
                  ))}
                </Measurement>
              )}
 
            {/* Padding */}
            {Padding && Padding.length > 0 && (
              <Measurement Title="Padding">
                {Padding.map((PaddingItem, index) => (
                  <Stack key={index}>
                    {Object.entries(PaddingItem).map(([key, value]) => (
                      <LabelValue
                        key={key}
                        label={getLabelForKeys(key)}
                        value={value}
                        isStrong
                        icon={getIconForPadding(key)}
                      />
                    ))}
                  </Stack>
                ))}
              </Measurement>
            )}
 
            {/* TextElement */}
            {TextElement &&
              TextElement.length > 0 &&
              TextElement.map((textItem, index) => (
                <Measurement Title={textItem.TextItemName} key={index}>
                  {Object.entries(textItem).map(([key, value]) => {
                    if (key === "TextItemName") return null;
                    return (
                      <LabelValue
                        key={key}
                        label={getLabelForKeys(key)}
                        value={value}
                        isStrong
                      />
                    );
                  })}
                </Measurement>
              ))}
 
            {/* Gap */}
            {Gap && <Measurement Title="Gap" value={Gap}></Measurement>}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}