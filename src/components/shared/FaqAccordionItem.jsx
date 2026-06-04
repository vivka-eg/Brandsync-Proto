"use client";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { CaretDown } from "phosphor-react";

/**
 * Single FAQ accordion item.
 *
 * @param {string}          question
 * @param {string|ReactNode} answer
 * @param {boolean}         expanded
 * @param {function}        onChange  - called when the item is toggled
 */
export default function FaqAccordionItem({
  question,
  answer,
  expanded,
  onChange,
}) {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid #dee2ed",
        borderRadius: "12px !important",
        bgcolor: expanded ? "rgba(237,240,250,0.5)" : "transparent",
        transition: "background-color 0.2s ease",
        "&:before": { display: "none" },
        overflow: "hidden",
      }}
    >
      <AccordionSummary
        expandIcon={<CaretDown size={20} weight="bold" />}
        sx={{
          px: 2,
          py: "20px",
          bgcolor: expanded ? "background.paper" : "transparent",
          transition: "background-color 0.2s ease",
          "& .MuiAccordionSummary-expandIconWrapper": {
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: 1.5,
            color: "text.primary",
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, py: 3 }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "text.secondary",
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
