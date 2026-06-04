import Typography from "@mui/material/Typography";

export default function SectionHeading({ title }) {
  return (
    <Typography
      sx={{
        fontSize: "28px",
        fontWeight: 700,
        lineHeight: "40px",
        color: "text.primary",
        mb: 0.5,
      }}
    >
      {title}
    </Typography>
  );
}
