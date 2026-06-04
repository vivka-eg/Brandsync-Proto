import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer }) {
  return (
    <Accordion
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px !important",
        "&:before": { display: "none" },
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        sx={{
          px: 3,
          py: 2,
          "& .MuiAccordionSummary-content": {
            my: 0,
          },
        }}
      >
        <Typography variant="body1" fontWeight={600} color="text.primary">
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
