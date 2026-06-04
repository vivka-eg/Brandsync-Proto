import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CodeBlock({ title, lines }) {
  return (
    <Box sx={{ bgcolor: "#f7f7f5", borderRadius: "8px", p: 2, width: "100%" }}>
      <Typography sx={{ fontSize: "20px", fontWeight: 700, lineHeight: "32px", color: "#121212", mb: 1 }}>
        {title}
      </Typography>
      {lines.map((line, i) => (
        <Typography
          key={i}
          sx={{ fontFamily: "'Roboto Mono', monospace", fontSize: "16px", lineHeight: "24px", color: "text.primary", whiteSpace: "pre-wrap" }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
}
