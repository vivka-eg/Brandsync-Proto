"use client";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getColorShades } from "../constants";

const TokenRow = ({ token, lightColor, lightLabel, darkColor, darkLabel }) => {
  return (
    <TableRow sx={{ height: 72 }}>
      {/* Semantic Token */}
      <TableCell sx={{ borderBottom: "none" }}>
        <Typography
          sx={{
            fontSize: "1rem",
            color: "text.primary",
            // fontFamily: "monospace",
            lineHeight: 1.5,
          }}
        >
          {token}
        </Typography>
      </TableCell>

      {/* Light Mode */}
      <TableCell sx={{ borderBottom: "none" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              backgroundColor: lightColor,
              // border: "1px solid #E5E7EB",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "text.primary",
            }}
          >
            {lightLabel}
          </Typography>
        </Box>
      </TableCell>

      {/* Dark Mode */}
      <TableCell
        sx={{ padding: 0, borderBottom: "none", backgroundColor: "#1E232B" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",

            py: 2,
            px: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              backgroundColor: darkColor,
              // border: "1px solid #374151",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "#ffff",
            }}
          >
            {darkLabel}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const TokenSection = ({ title, description, tokens, colorName }) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 1,
          fontSize: "1.5rem",
          lineHeight: "2rem",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: "#6B7280",
          mb: 3,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          // border: "1px solid #E5E7EB",
          borderRadius: 4,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F9FAFB", height: 72 }}>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Semantic Token
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Light Mode
                </Typography>
              </TableCell>
              <TableCell sx={{ padding: 0, borderBottom: "none" }}>
                <Box
                  sx={{
                    py: 2,
                    px: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Dark Mode
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TokenRow
                key={index}
                token={token.token}
                lightColor={token.lightColor}
                lightLabel={token.lightLabel}
                darkColor={token.darkColor}
                darkLabel={token.darkLabel}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const generateTokens = (category, categoryData, colorName = null) => {
  const tokens = [];
  const capitalizedColor = colorName
    ? colorName.charAt(0).toUpperCase() + colorName.slice(1)
    : null;

  // Handle categories with light/dark structure
  if (categoryData.light && categoryData.dark) {
    Object.keys(categoryData.light).forEach((state) => {
      if (categoryData.dark[state]) {
        const lightData = categoryData.light[state];
        const darkData = categoryData.dark[state];

        tokens.push({
          token: `color.${category}.${state}`,
          lightColor: lightData.color,
          lightLabel: colorName
            ? `Product Colors ${capitalizedColor} ${lightData.shade}`
            : `${category} ${lightData.shade}`,
          darkColor: darkData.color,
          darkLabel: colorName
            ? `Product Colors ${capitalizedColor} ${darkData.shade}`
            : `${category} ${darkData.shade}`,
        });
      }
    });
  }

  return tokens;
};

const TokenPreview = ({ selectedColor }) => {
  const colorShades = getColorShades(selectedColor);

  // Generate sections dynamically from getColorShades data
  const sections = Object.entries(colorShades)
    .filter(([_, data]) => data.description && data.light)
    .map(([category, data]) => {
      const tokens = generateTokens(
        category,
        data,
        category === "primary" ? selectedColor : null
      );

      return {
        key: category,
        title: category.charAt(0).toUpperCase() + category.slice(1),
        description: data.description,
        tokens,
      };
    });

  return (
    <Box>
      {sections.map((section) => (
        <TokenSection
          key={section.key}
          title={section.title}
          description={section.description}
          tokens={section.tokens}
          colorName={selectedColor}
        />
      ))}
    </Box>
  );
};

export default TokenPreview;
