"use client";
import { Box, Tooltip } from "@mui/material";

const ColorSwatch = ({ color, name, onClick }) => {
  const isBase = name?.includes("-600");
  const label = `${name}: ${color}${isBase ? " (Base)" : ""}`;

  return (
    <Tooltip title={label} placement="top" arrow>
      <Box
        role="button"
        aria-label={label}
        tabIndex={0}
        onClick={() => onClick?.(color, name)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(color, name); } }}
        sx={{
          flex: 1,
          minWidth: 0,
          height: 64,
          backgroundColor: color,
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            transform: "scaleY(1.15)",
            zIndex: 1,
          },
          "&:first-of-type": {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
          "&:last-of-type": {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          },
        }}
      >
        {isBase && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#111827",
              borderRadius: "50%",
              border: "2px solid #FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default ColorSwatch;
