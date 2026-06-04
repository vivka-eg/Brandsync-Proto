import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palettes";
import { typography } from "./typography";
import { componentOverrides } from "./componentOverrides";

export const createAppTheme = (mode) => {
  const palette = mode === "light" ? lightPalette : darkPalette;

  return createTheme({
    palette,
    typography,
    components: componentOverrides,
  });
};
