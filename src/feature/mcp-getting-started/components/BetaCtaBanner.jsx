import { MCP_BETA_ACCESS_FORM_URL } from "@/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function BetaCtaBanner({
  title,
  description,
  buttonText = "Request beta access",
  href = MCP_BETA_ACCESS_FORM_URL,
  show,
}) {

  if (!show) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        bgcolor: "#EDF0FA",
        borderRadius: "12px",
        p: "20px",
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>
      </Box>

      <Button
        {...(href ? { component: Link, href } : {})}
        variant="outlined"
        sx={{
          border: "1px solid #005591",
          color: "#005591",
          borderRadius: "8px",
          px: "20px",
          py: "10px",
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: "24px",
          textTransform: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          bgcolor: "transparent",
          "&:hover": {
            bgcolor: "rgba(0, 85, 145, 0.06)",
            border: "1px solid #005591",
          },
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {buttonText} <ArrowRightIcon size={16} weight="bold" />
      </Button>
    </Box>
  );
}
