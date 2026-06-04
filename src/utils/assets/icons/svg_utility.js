export function updateSVGColor(svgString, newColor) {
    const colorValue = newColor.startsWith("#") ? newColor : `#${newColor}`;

    // Helper function to check if we should skip this color
    const shouldSkipColor = (color) => {
      const cleanColor = color.trim().toLowerCase();
      return (
        cleanColor === "none" ||
        cleanColor === "transparent" ||
        cleanColor === "inherit" ||
        cleanColor === "currentcolor"
      );
    };

    let result = svgString;

    // Track what color properties exist in the SVG
    let hasExplicitFill = false;
    let hasExplicitStroke = false;

    // Check for existing color attributes
    const fillMatches = svgString.match(/fill\s*[:=]/gi);
    const strokeMatches = svgString.match(/stroke\s*[:=]/gi);
    const styleMatches = svgString.match(/style\s*=.*?(?:fill|stroke)\s*:/gi);

    hasExplicitFill = !!fillMatches;
    hasExplicitStroke = !!strokeMatches;
    const hasStyleColors = !!styleMatches;

    // 1. Handle inline style attributes
    result = result.replace(
      /style\s*=\s*["']([^"']*?)["']/gi,
      function (match, styleContent) {
        let newStyle = styleContent;

        // Update fill only if it exists and should be changed
        if (/fill\s*:/i.test(styleContent)) {
          newStyle = newStyle.replace(
            /fill\s*:\s*([^;]+)/gi,
            function (fillMatch, currentColor) {
              return shouldSkipColor(currentColor)
                ? fillMatch
                : `fill: ${colorValue}`;
            }
          );
        }

        // Update stroke only if it exists and should be changed
        if (/stroke\s*:/i.test(styleContent)) {
          newStyle = newStyle.replace(
            /stroke\s*:\s*([^;]+)/gi,
            function (strokeMatch, currentColor) {
              return shouldSkipColor(currentColor)
                ? strokeMatch
                : `stroke: ${colorValue}`;
            }
          );
        }

        return `style="${newStyle}"`;
      }
    );

    // 2. Handle direct fill attributes
    result = result.replace(
      /fill\s*=\s*["']([^"']+)["']/gi,
      function (match, currentColor) {
        return shouldSkipColor(currentColor) ? match : `fill="${colorValue}"`;
      }
    );

    // 3. Handle direct stroke attributes
    result = result.replace(
      /stroke\s*=\s*["']([^"']+)["']/gi,
      function (match, currentColor) {
        return shouldSkipColor(currentColor) ? match : `stroke="${colorValue}"`;
      }
    );

    // 4. Handle internal CSS
    result = result.replace(
      /<style[^>]*>([\s\S]*?)<\/style>/gi,
      function (match, cssContent) {
        let newCSS = cssContent;

        // Update fill in CSS only if it exists
        if (/fill\s*:/i.test(cssContent)) {
          newCSS = newCSS.replace(
            /fill\s*:\s*([^;}\s]+)/gi,
            function (fillMatch, currentColor) {
              return shouldSkipColor(currentColor)
                ? fillMatch
                : `fill: ${colorValue}`;
            }
          );
        }

        // Update stroke in CSS only if it exists
        if (/stroke\s*:/i.test(cssContent)) {
          newCSS = newCSS.replace(
            /stroke\s*:\s*([^;}\s]+)/gi,
            function (strokeMatch, currentColor) {
              return shouldSkipColor(currentColor)
                ? strokeMatch
                : `stroke: ${colorValue}`;
            }
          );
        }

        return match.replace(cssContent, newCSS);
      }
    );

    // **5. NEW: Handle SVGs with no color properties - Add fill attribute**
    const hasAnyColorProperties =
      hasExplicitFill || hasExplicitStroke || hasStyleColors;

    if (!hasAnyColorProperties) {
      // SVG has no color attributes at all - add fill to drawable elements
      result = result.replace(
        /<(path|circle|rect|ellipse|polygon|polyline|line)(\s[^>]*?)(\s*\/?>)/gi,
        function (match, elementType, attributes, closing) {
          // Check if this specific element already has any color attributes
          if (/(?:fill|stroke|style)\s*=/i.test(attributes)) {
            return match;
          }
          // Add fill attribute
          return `<${elementType}${attributes} fill="${colorValue}"${closing}`;
        }
      );
    }

    return result;
  }