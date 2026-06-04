import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SectionHeading({ title, body }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "28px", fontWeight: 700, lineHeight: "40px", color: "#121212", mb: 0.5 }}>
        {title}
      </Typography>
      {body && (
        <Typography sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}>
          {body}
        </Typography>
      )}
    </Box>
  );
}
