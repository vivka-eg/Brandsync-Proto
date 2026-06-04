import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function DataTableRow({ left, right, isMonospace }) {
  const rightLines = Array.isArray(right) ? right : [right];
  return (
    <Box sx={{ border: "0.5px solid #e5e5e3", display: "flex", justifyContent: "space-between", px: 2, py: 1.5 }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", pt: "1px" }}>
        <Typography
          sx={{
            fontFamily: isMonospace ? "'Roboto Mono', monospace" : undefined,
            fontWeight: 500,
            fontSize: "16px",
            color: "#0066ae",
            whiteSpace: "nowrap",
            lineHeight: "21px",
          }}
        >
          {left}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        {rightLines.map((line, i) => (
          <Typography key={i} sx={{ fontSize: "14px", color: "text.body", lineHeight: "21px" }}>
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function DataTable({ rows, isMonospace }) {
  return (
    <Box sx={{ bgcolor: "#f9fafb", overflow: "hidden" }}>
      {rows.map((row) => (
        <DataTableRow key={row.left} left={row.left} right={row.right} isMonospace={isMonospace} />
      ))}
    </Box>
  );
}
