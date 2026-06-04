import colorPaletteShades from "brandsync-tokens/themebuilder.json";
import { typographyData, getColorShades } from "../constants";

export const generateExportCode = (selectedColor, format) => {
  const palette = colorPaletteShades[selectedColor];
  if (!palette) return "";

  const semanticTokens = getColorShades(selectedColor);

  switch (format) {
    case "css":
      return generateCSS(selectedColor, colorPaletteShades, semanticTokens);
    case "scss":
      return generateSCSS(selectedColor, colorPaletteShades, semanticTokens);
    case "json":
      return generateJSON(selectedColor, colorPaletteShades, semanticTokens);
    case "js":
      return generateJS(selectedColor, colorPaletteShades, semanticTokens);
    default:
      return "";
  }
};

const generateTypographyCSS = (typography, indent = "  ") => {
  let css = "";

  css += `\n${indent}/* Display */\n`;
  typography.display.forEach((item) => {
    const name = item.name.toLowerCase().replace(/\s+/g, "-");
    css += `${indent}--font-${name}-size: ${item.fontSize}px;\n`;
    css += `${indent}--font-${name}-line-height: ${item.lineHeight}px;\n`;
    css += `${indent}--font-${name}-spacing: ${item.paragraphSpacing}px;\n`;
  });

  css += `\n${indent}/* Headings */\n`;
  typography.headings.forEach((item) => {
    css += `${indent}--font-${item.name}-size: ${item.fontSize}px;\n`;
    css += `${indent}--font-${item.name}-line-height: ${item.lineHeight}px;\n`;
    css += `${indent}--font-${item.name}-spacing: ${item.paragraphSpacing}px;\n`;
  });

  css += `\n${indent}/* Body */\n`;
  typography.body.forEach((item) => {
    const name = `body-${item.name}`;
    css += `${indent}--font-${name}-size: ${item.fontSize}px;\n`;
    css += `${indent}--font-${name}-line-height: ${item.lineHeight}px;\n`;
    css += `${indent}--font-${name}-spacing: ${item.paragraphSpacing}px;\n`;
  });

  css += `\n${indent}/* Caption */\n`;
  typography.caption.forEach((item) => {
    const name = `caption-${item.name}`;
    css += `${indent}--font-${name}-size: ${item.fontSize}px;\n`;
    css += `${indent}--font-${name}-line-height: ${item.lineHeight}px;\n`;
    css += `${indent}--font-${name}-spacing: ${item.paragraphSpacing}px;\n`;
  });

  return css;
};

const generateCSS = (colorName, allColors, semanticTokens) => {
  let css = `:root {\n  /* Primary Palette - ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} */\n`;

  // Primary colors
  Object.entries(allColors[colorName].shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --primary-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Neutrals
  css += `\n  /* Neutrals */\n`;
  Object.entries(allColors.neutral.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --neutral-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Success
  css += `\n  /* Success */\n`;
  Object.entries(allColors.success.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --success-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Error
  css += `\n  /* Error */\n`;
  Object.entries(allColors.error.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --error-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Warning
  css += `\n  /* Warning */\n`;
  Object.entries(allColors.warning.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --warning-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Information
  css += `\n  /* Information */\n`;
  Object.entries(allColors.information.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    css += `  --information-${shade}: ${color};${isBase ? " /* Base */" : ""}\n`;
  });

  // Semantic Tokens - Light Mode
  css += `\n  /* Semantic Tokens - Light Mode */\n`;
  Object.entries(semanticTokens).forEach(([category, data]) => {
    if (data.light) {
      css += `\n  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */\n`;
      Object.entries(data.light).forEach(([state, value]) => {
        // Determine the color variable name based on category
        let colorVar;
        if (category === 'primary') {
          colorVar = `--primary-${value.shade}`;
        } else if (category === 'neutrals') {
          colorVar = `--neutral-${value.shade}`;
        } else if (category === 'success') {
          colorVar = `--success-${value.shade}`;
        } else if (category === 'error') {
          colorVar = `--error-${value.shade}`;
        } else if (category === 'warning') {
          colorVar = `--warning-${value.shade}`;
        } else if (category === 'information') {
          colorVar = `--information-${value.shade}`;
        }
        css += `  --color-${category}-${state}: var(${colorVar}); /* ${category} ${value.shade} */\n`;
      });
    }
  });

  // Typography - Desktop (Base/Default)
  css += `\n  /* Typography - Desktop (Default) */\n`;
  css += generateTypographyCSS(typographyData.desktop);

  css += `}\n\n`;

  // Typography - Tablet (Media Query)
  css += `/* Typography - Tablet */\n`;
  css += `@media (max-width: 1023px) {\n`;
  css += `  :root {`;
  css += generateTypographyCSS(typographyData.tablet, "    ");
  css += `  }\n`;
  css += `}\n\n`;

  // Typography - Mobile (Media Query)
  css += `/* Typography - Mobile */\n`;
  css += `@media (max-width: 767px) {\n`;
  css += `  :root {`;
  css += generateTypographyCSS(typographyData.mobile, "    ");
  css += `  }\n`;
  css += `}\n\n`;

  // Dark Mode Semantic Tokens
  css += `.dark {\n`;
  css += `  /* Semantic Tokens - Dark Mode */\n`;
  Object.entries(semanticTokens).forEach(([category, data]) => {
    if (data.dark) {
      css += `\n  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */\n`;
      Object.entries(data.dark).forEach(([state, value]) => {
        // Determine the color variable name based on category
        let colorVar;
        if (category === 'primary') {
          colorVar = `--primary-${value.shade}`;
        } else if (category === 'neutrals') {
          colorVar = `--neutral-${value.shade}`;
        } else if (category === 'success') {
          colorVar = `--success-${value.shade}`;
        } else if (category === 'error') {
          colorVar = `--error-${value.shade}`;
        } else if (category === 'warning') {
          colorVar = `--warning-${value.shade}`;
        } else if (category === 'information') {
          colorVar = `--information-${value.shade}`;
        }
        css += `  --color-${category}-${state}: var(${colorVar}); /* ${category} ${value.shade} */\n`;
      });
    }
  });
  css += `}`;

  return css;
};

const generateTypographySCSS = (typography, viewport) => {
  let scss = "";

  scss += `\n// Display\n`;
  typography.display.forEach((item) => {
    const name = item.name.toLowerCase().replace(/\s+/g, "-");
    scss += `$font-${name}-size-${viewport}: ${item.fontSize}px;\n`;
    scss += `$font-${name}-line-height-${viewport}: ${item.lineHeight}px;\n`;
    scss += `$font-${name}-spacing-${viewport}: ${item.paragraphSpacing}px;\n`;
  });

  scss += `\n// Headings\n`;
  typography.headings.forEach((item) => {
    scss += `$font-${item.name}-size-${viewport}: ${item.fontSize}px;\n`;
    scss += `$font-${item.name}-line-height-${viewport}: ${item.lineHeight}px;\n`;
    scss += `$font-${item.name}-spacing-${viewport}: ${item.paragraphSpacing}px;\n`;
  });

  scss += `\n// Body\n`;
  typography.body.forEach((item) => {
    const name = `body-${item.name}`;
    scss += `$font-${name}-size-${viewport}: ${item.fontSize}px;\n`;
    scss += `$font-${name}-line-height-${viewport}: ${item.lineHeight}px;\n`;
    scss += `$font-${name}-spacing-${viewport}: ${item.paragraphSpacing}px;\n`;
  });

  scss += `\n// Caption\n`;
  typography.caption.forEach((item) => {
    const name = `caption-${item.name}`;
    scss += `$font-${name}-size-${viewport}: ${item.fontSize}px;\n`;
    scss += `$font-${name}-line-height-${viewport}: ${item.lineHeight}px;\n`;
    scss += `$font-${name}-spacing-${viewport}: ${item.paragraphSpacing}px;\n`;
  });

  return scss;
};

const generateSCSS = (colorName, allColors, semanticTokens) => {
  let scss = `// Primary Palette - ${colorName.charAt(0).toUpperCase() + colorName.slice(1)}\n`;

  // Primary colors
  Object.entries(allColors[colorName].shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$primary-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Neutrals
  scss += `\n// Neutrals\n`;
  Object.entries(allColors.neutral.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$neutral-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Success
  scss += `\n// Success\n`;
  Object.entries(allColors.success.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$success-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Error
  scss += `\n// Error\n`;
  Object.entries(allColors.error.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$error-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Warning
  scss += `\n// Warning\n`;
  Object.entries(allColors.warning.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$warning-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Information
  scss += `\n// Information\n`;
  Object.entries(allColors.information.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    scss += `$information-${shade}: ${color};${isBase ? " // Base" : ""}\n`;
  });

  // Semantic Tokens - Light Mode
  scss += `\n// Semantic Tokens - Light Mode\n`;
  Object.entries(semanticTokens).forEach(([category, data]) => {
    if (data.light) {
      scss += `\n// ${category.charAt(0).toUpperCase() + category.slice(1)} - Light\n`;
      Object.entries(data.light).forEach(([state, value]) => {
        // Determine the color variable name based on category
        let colorVar;
        if (category === 'primary') {
          colorVar = `$primary-${value.shade}`;
        } else if (category === 'neutrals') {
          colorVar = `$neutral-${value.shade}`;
        } else if (category === 'success') {
          colorVar = `$success-${value.shade}`;
        } else if (category === 'error') {
          colorVar = `$error-${value.shade}`;
        } else if (category === 'warning') {
          colorVar = `$warning-${value.shade}`;
        } else if (category === 'information') {
          colorVar = `$information-${value.shade}`;
        }
        scss += `$color-${category}-${state}-light: ${colorVar}; // ${category} ${value.shade}\n`;
      });
    }
  });

  // Semantic Tokens - Dark Mode
  scss += `\n// Semantic Tokens - Dark Mode\n`;
  Object.entries(semanticTokens).forEach(([category, data]) => {
    if (data.dark) {
      scss += `\n// ${category.charAt(0).toUpperCase() + category.slice(1)} - Dark\n`;
      Object.entries(data.dark).forEach(([state, value]) => {
        // Determine the color variable name based on category
        let colorVar;
        if (category === 'primary') {
          colorVar = `$primary-${value.shade}`;
        } else if (category === 'neutrals') {
          colorVar = `$neutral-${value.shade}`;
        } else if (category === 'success') {
          colorVar = `$success-${value.shade}`;
        } else if (category === 'error') {
          colorVar = `$error-${value.shade}`;
        } else if (category === 'warning') {
          colorVar = `$warning-${value.shade}`;
        } else if (category === 'information') {
          colorVar = `$information-${value.shade}`;
        }
        scss += `$color-${category}-${state}-dark: ${colorVar}; // ${category} ${value.shade}\n`;
      });
    }
  });

  // Typography - All Viewports
  scss += `\n// Typography - Mobile\n`;
  scss += generateTypographySCSS(typographyData.mobile, "mobile");

  scss += `\n// Typography - Tablet\n`;
  scss += generateTypographySCSS(typographyData.tablet, "tablet");

  scss += `\n// Typography - Desktop\n`;
  scss += generateTypographySCSS(typographyData.desktop, "desktop");

  return scss;
};

const generateJSON = (colorName, allColors, semanticTokens) => {
  const data = {
    theme: colorName,
    baseShade: "600",
    colors: {
      primary: {},
      neutrals: {},
      success: {},
      error: {},
      warning: {},
      information: {},
    },
    semanticTokens: {
      light: {},
      dark: {},
    },
    typography: {
      mobile: {
        display: {},
        headings: {},
        body: {},
        caption: {},
      },
      tablet: {
        display: {},
        headings: {},
        body: {},
        caption: {},
      },
      desktop: {
        display: {},
        headings: {},
        body: {},
        caption: {},
      },
    },
  };

  // Primary colors
  data.colors.primary = allColors[colorName].shades;

  // Neutrals
  data.colors.neutrals = allColors.neutral.shades;

  // Success
  data.colors.success = allColors.success.shades;

  // Error
  data.colors.error = allColors.error.shades;

  // Warning
  data.colors.warning = allColors.warning.shades;

  // Information
  data.colors.information = allColors.information.shades;

  // Add semantic tokens
  Object.entries(semanticTokens).forEach(([category, categoryData]) => {
    if (categoryData.light) {
      data.semanticTokens.light[category] = {};
      Object.entries(categoryData.light).forEach(([state, value]) => {
        data.semanticTokens.light[category][state] = {
          color: value.color,
          shade: value.shade,
        };
      });
    }
    if (categoryData.dark) {
      data.semanticTokens.dark[category] = {};
      Object.entries(categoryData.dark).forEach(([state, value]) => {
        data.semanticTokens.dark[category][state] = {
          color: value.color,
          shade: value.shade,
        };
      });
    }
  });

  // Typography for all viewports
  ['mobile', 'tablet', 'desktop'].forEach((viewport) => {
    const typography = typographyData[viewport];

    typography.display.forEach((item) => {
      const name = item.name.toLowerCase().replace(/\s+/g, "-");
      data.typography[viewport].display[name] = {
        fontSize: item.fontSize,
        lineHeight: item.lineHeight,
        paragraphSpacing: item.paragraphSpacing,
        fontWeight: item.fontWeight,
        fontFamily: item.fontFamily,
      };
    });

    typography.headings.forEach((item) => {
      data.typography[viewport].headings[item.name] = {
        fontSize: item.fontSize,
        lineHeight: item.lineHeight,
        paragraphSpacing: item.paragraphSpacing,
        fontWeight: item.fontWeight,
        fontFamily: item.fontFamily,
      };
    });

    typography.body.forEach((item) => {
      data.typography[viewport].body[item.name] = {
        fontSize: item.fontSize,
        lineHeight: item.lineHeight,
        paragraphSpacing: item.paragraphSpacing,
        fontWeight: item.fontWeight,
        fontFamily: item.fontFamily,
      };
    });

    typography.caption.forEach((item) => {
      data.typography[viewport].caption[item.name] = {
        fontSize: item.fontSize,
        lineHeight: item.lineHeight,
        paragraphSpacing: item.paragraphSpacing,
        fontWeight: item.fontWeight,
        fontFamily: item.fontFamily,
      };
    });
  });

  return JSON.stringify(data, null, 2);
};

const generateJS = (colorName, allColors, semanticTokens) => {
  let js = `// ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Theme\n// Base shade: 600\n\n`;

  js += `export const ${colorName}Theme = {\n`;

  js += `  colors: {\n`;
  js += `    primary: {\n`;
  Object.entries(allColors[colorName].shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;

  js += `    neutrals: {\n`;
  Object.entries(allColors.neutral.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;

  js += `    success: {\n`;
  Object.entries(allColors.success.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;

  js += `    error: {\n`;
  Object.entries(allColors.error.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;

  js += `    warning: {\n`;
  Object.entries(allColors.warning.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;

  js += `    information: {\n`;
  Object.entries(allColors.information.shades).forEach(([shade, color]) => {
    const isBase = shade === "600";
    js += `      "${shade}": "${color}",${isBase ? " // Base" : ""}\n`;
  });
  js += `    },\n`;
  js += `  },\n`;

  // Semantic Tokens
  js += `  semanticTokens: {\n`;
  js += `    light: {\n`;
  Object.entries(semanticTokens).forEach(([category, categoryData]) => {
    if (categoryData.light) {
      js += `      ${category}: {\n`;
      Object.entries(categoryData.light).forEach(([state, value]) => {
        js += `        "${state}": { color: "${value.color}", shade: ${value.shade} }, // ${category} ${value.shade}\n`;
      });
      js += `      },\n`;
    }
  });
  js += `    },\n`;
  js += `    dark: {\n`;
  Object.entries(semanticTokens).forEach(([category, categoryData]) => {
    if (categoryData.dark) {
      js += `      ${category}: {\n`;
      Object.entries(categoryData.dark).forEach(([state, value]) => {
        js += `        "${state}": { color: "${value.color}", shade: ${value.shade} }, // ${category} ${value.shade}\n`;
      });
      js += `      },\n`;
    }
  });
  js += `    },\n`;
  js += `  },\n`;

  // Typography for all viewports
  js += `  typography: {\n`;
  ['mobile', 'tablet', 'desktop'].forEach((viewport) => {
    const typography = typographyData[viewport];
    js += `    ${viewport}: {\n`;

    js += `      display: {\n`;
    typography.display.forEach((item) => {
      const name = item.name.toLowerCase().replace(/\s+/g, "-");
      js += `        "${name}": { fontSize: ${item.fontSize}, lineHeight: ${item.lineHeight}, paragraphSpacing: ${item.paragraphSpacing}, fontWeight: "${item.fontWeight}", fontFamily: "${item.fontFamily}" },\n`;
    });
    js += `      },\n`;

    js += `      headings: {\n`;
    typography.headings.forEach((item) => {
      js += `        "${item.name}": { fontSize: ${item.fontSize}, lineHeight: ${item.lineHeight}, paragraphSpacing: ${item.paragraphSpacing}, fontWeight: "${item.fontWeight}", fontFamily: "${item.fontFamily}" },\n`;
    });
    js += `      },\n`;

    js += `      body: {\n`;
    typography.body.forEach((item) => {
      js += `        "${item.name}": { fontSize: ${item.fontSize}, lineHeight: ${item.lineHeight}, paragraphSpacing: ${item.paragraphSpacing}, fontWeight: "${item.fontWeight}", fontFamily: "${item.fontFamily}" },\n`;
    });
    js += `      },\n`;

    js += `      caption: {\n`;
    typography.caption.forEach((item) => {
      js += `        "${item.name}": { fontSize: ${item.fontSize}, lineHeight: ${item.lineHeight}, paragraphSpacing: ${item.paragraphSpacing}, fontWeight: "${item.fontWeight}", fontFamily: "${item.fontFamily}" },\n`;
    });
    js += `      },\n`;

    js += `    },\n`;
  });
  js += `  },\n`;

  js += `};\n`;
  return js;
};
