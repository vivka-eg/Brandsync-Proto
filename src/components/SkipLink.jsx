"use client";
import Link from "@mui/material/Link";

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      underline="none"
      sx={{
        position: "absolute",
        top: "-40px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "black",
        color: "white",
        p: "8px 16px",
        zIndex: 9999,
        transition: "top 0.2s ease",
        "&:focus": {
          top: 3,
        },
      }}
    >
      Skip to main content
    </Link>
  );
}
