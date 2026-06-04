import { promises as fs } from "fs";
import path from "path";
import {
  evaluateColor,
  evaluateColorCustom,
} from "@/utils/design-system/color-palette/color-compliance";
import { isColorDark } from "@/utils/design-system/color-palette/luminance.js";
import { NextResponse } from "next/server";

/**
 * POST /api/palettes/generate
 * Generates accessible palette info and writes it to /data/color-palettes.json
 */
export async function POST(request) {
  
  // return NextResponse.json(
  //   { message: "Palette generation is disabled in hosted environment." },
  //   { status: 403 }
  // );

  try {
    // Read the input palettes :
    const inputFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "color-palettes-input.json"
    );
    const fileContents = await fs.readFile(inputFilePath, "utf8");
    const inputPalettes = JSON.parse(fileContents || "{}");

    // Generate accessibility data for each color
    let generatedData = {};

    const colorKeys = Object.keys(inputPalettes);

    colorKeys.forEach((colorName) => {
      // evaluate each color in the palette
      const colorNames = Object.keys(inputPalettes[colorName].shades);
      const colorValues = Object.values(inputPalettes[colorName].shades);
      colorNames.reverse();
      colorValues.reverse();

      // evaluate colors compliance:
      const evaluatedColors = colorValues.map((color, index) => ({
        name: colorName + "-" + colorNames[index],
        ...evaluateColor(color),
      }));

      generatedData[colorName] = {
        primaryColor: inputPalettes[colorName].shades[600],
        primaryColorDark: inputPalettes[colorName].shades[400],
      };

      //   assign evaluated colors to primarySection :
      generatedData[colorName].primarySection = evaluatedColors;

      //   initialize accessibleCombinations object :
      generatedData[colorName].accessibleCombinations = {
        primaryOnWhiteBackground: [],
        primaryOnBlackBackground: [],
        primaryOnPrimaryBackground: [],
      };

      const pushColorData = (
        key,
        complainceLevel,
        colorData,
        background,
        isDarkerColor
      ) => {
        generatedData[colorName].accessibleCombinations[key].push({
          name: colorData.name,
          color: colorData.color,
          background: background,
          compliance: complainceLevel,
          isDarkerColor,
        });
      };

      generatedData[colorName].primarySection.forEach((colorData) => {
        // check for white AA or AAA compliance :
        if (colorData.white.large.AAA && colorData.white.body.AAA) {
          pushColorData(
            "primaryOnWhiteBackground",
            "AAA",
            colorData,
            "#FFFFFF",
            false
          );
        } else if (colorData.white.large.AA && colorData.white.body.AA) {
          pushColorData(
            "primaryOnWhiteBackground",
            "AA",
            colorData,
            "#FFFFFF",
            false
          );
        }

        // check for black AA or AAA compliance :
        if (colorData.black.large.AAA && colorData.black.body.AAA) {
          pushColorData(
            "primaryOnBlackBackground",
            "AAA",
            colorData,
            "#000000",
            true
          );
        } else if (colorData.black.large.AA && colorData.black.body.AA) {
          pushColorData(
            "primaryOnBlackBackground",
            "AA",
            colorData,
            "#000000",
            true
          );
        }
      });

      // check for primary on primary background compliance :

      // generate color complaince for the primary color on its own background:
      for (let i = 0; i < colorValues.length; i++) {
        for (let j = i + 1; j < colorValues.length; j++) {
          const fgColor = colorValues[i];
          const bgColor = colorValues[j];
          const colorCompliance = evaluateColorCustom(fgColor, bgColor);
          const isDarkerColor = isColorDark(bgColor);

          if (colorCompliance.large.AAA && colorCompliance.body.AAA) {
            pushColorData(
              "primaryOnPrimaryBackground",
              "AAA",
              {
                name: `${colorName}-${colorNames[i]} on ${colorName}-${colorNames[j]}`,
                color: fgColor,
              },
              bgColor,
              isDarkerColor
            );
          } else if (colorCompliance.large.AA && colorCompliance.body.AA) {
            pushColorData(
              "primaryOnPrimaryBackground",
              "AA",
              {
                name: `${colorName}-${colorNames[i]} on ${colorName}-${colorNames[j]}`,
                color: fgColor,
              },
              bgColor,
              isDarkerColor
            );
          }
        }
      }
    });

    // put the data into the output file :
    const outputFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "color-palettes.json"
    );
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(generatedData, null, 2),
      "utf8"
    );

    return Response.json({
      success: true,
      message: "Palette data saved.",
      data: inputPalettes,
    });
  } catch (err) {
    return new Response("Failed to generate palettes.", { status: 500 });
  }
}
