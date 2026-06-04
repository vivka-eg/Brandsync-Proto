import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SubSection({ title, body }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "24px", fontWeight: 700, lineHeight: "36px", color: "text.primary", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}>
        {body}
      </Typography>
    </Box>
  );
}
