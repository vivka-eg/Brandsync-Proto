"use client";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";
import AIMCPVisualization from "./AIMCPVisualization";
import DesignTokenVisualization from "./DesignTokenVisualization";
import ThemeBuilderVisualization from "./ThemeBuilderVisualization";
import RotatingIconsVisualization from "./RotatingIconsVisualization";

const RoleSection = ({ section, index, titlePillRef }) => {
  const renderVisualization = () => {
    if (!section.useCustomVisualization) {
      return (
        <Box sx={{ position: "relative", borderRadius: 4 }} data-card="container">
          {/* Glow */}
          <Box
            sx={{
              position: "absolute",
              inset: -16,
              background: "radial-gradient(600px 200px at 50% 20%, rgba(59,130,246,0.22), transparent)",
              filter: "blur(30px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          {/* Image frame */}
          <Box
            sx={{
              position: "relative",
              transformStyle: "preserve-3d",
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(99,102,241,0.28)",
              boxShadow: "0 8px 24px rgba(17,24,39,0.15), 0 4px 12px rgba(59,130,246,0.12)",
              zIndex: 1,
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <Box
              component="img"
              src={section.image}
              alt={`${section.pill} visual`}
              data-card="img"
              sx={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "cover",
                opacity: 1,
              }}
            />
          </Box>
        </Box>
      );
    }

    switch (section.visualizationType) {
      case "designTokens":
        return <DesignTokenVisualization />;
      case "aiMCP":
        return <AIMCPVisualization />;
      case "themeBuilder":
        return <ThemeBuilderVisualization />;
      default:
        return <RotatingIconsVisualization />;
    }
  };

  return (
    <Box
      className="role-section"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: index % 2 === 1 ? "row-reverse" : "row" },
        alignItems: "center",
        gap: { xs: 6, md: 10 },
        mb: { xs: 8, md: 12 },
      }}
    >
      {/* Left copy */}
      <Box className="section-text" sx={{ flex: 1 }} data-parallax="text">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Box
            className="section-pill"
            ref={index === 0 ? titlePillRef : undefined}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              background: "#e6f0ff",
              color: "#1d4ed8",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {section.pill}
          </Box>
        </Box>

        <Typography
          className="section-heading"
          variant="h2"
          fontWeight={800}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            lineHeight: 1.2,
            color: "#111827",
            mb: 2,
          }}
        >
          {section.heading}
        </Typography>

        <Typography
          className="section-body"
          sx={{ color: "#475569", lineHeight: 1.8, mb: 2, maxWidth: 540 }}
        >
          {section.body}
        </Typography>

        <Box sx={{ display: "grid", gap: 1.5, mb: 3 }}>
          {section.bullets.map((text) => (
            <Box
              key={text}
              className="section-bullet"
              sx={{ display: "flex", alignItems: "center", gap: 1, color: "#334155" }}
            >
              <CheckCircleIcon sx={{ color: "#2563eb" }} fontSize="small" />
              <Typography sx={{ color: "#334155" }}>{text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Multiple buttons support */}
        {section.buttons && section.buttons.length > 0 && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {section.buttons.map((button, idx) => (
              button.isExternal ? (
                <Button
                  key={idx}
                  className="section-button"
                  component="a"
                  href={button.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#424242",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: "8px",
                    textTransform: "none",
                    willChange: "transform, opacity",
                    "&:hover": {
                      borderColor: "#424242",
                      backgroundColor: "rgba(66, 66, 66, 0.04)",
                    },
                  }}
                >
                  {button.text}
                </Button>
              ) : (
                <Button
                  key={idx}
                  className="section-button"
                  component={Link}
                  href={button.link}
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#424242",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: "8px",
                    textTransform: "none",
                    willChange: "transform, opacity",
                    "&:hover": {
                      borderColor: "#424242",
                      backgroundColor: "rgba(66, 66, 66, 0.04)",
                    },
                  }}
                >
                  {button.text}
                </Button>
              )
            ))}
          </Box>
        )}

        {/* Single button support (backwards compatibility) */}
        {section.buttonText && section.buttonLink && !section.buttons && (
          section.isExternal ? (
            <Button
              className="section-button"
              component="a"
              href={section.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#424242",
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderRadius: "8px",
                textTransform: "none",
                willChange: "transform, opacity",
                "&:hover": {
                  borderColor: "#424242",
                  backgroundColor: "rgba(66, 66, 66, 0.04)",
                },
              }}
            >
              {section.buttonText}
            </Button>
          ) : (
            <Button
              className="section-button"
              component={Link}
              href={section.buttonLink}
              variant="outlined"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#424242",
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderRadius: "8px",
                textTransform: "none",
                willChange: "transform, opacity",
                "&:hover": {
                  borderColor: "#424242",
                  backgroundColor: "rgba(66, 66, 66, 0.04)",
                },
              }}
            >
              {section.buttonText}
            </Button>
          )
        )}
      </Box>

      {/* Right visualization */}
      <Box className="section-visualization" sx={{ flex: 1, width: "100%" }} data-parallax="img">
        {renderVisualization()}
      </Box>
    </Box>
  );
};

export default RoleSection;

