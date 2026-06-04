import colorPalettes from "brandsync-tokens/themebuilder.json";

// Flatten each palette's shades to a flat object: { 50: "#...", 100: "#...", ... }
const p = Object.fromEntries(
  Object.entries(colorPalettes).map(([key, val]) => [key, val.shades])
);

export const lightPalette = {
  mode: "light",
  primary: {
    main: "#202121",
    light: "#ffffff",
  },
  secondary: {
    main: "#dc004e",
  },
  background: {
    default: "#ffffff",
    paper: "#FFFFFF",
    primary: "#EAEAEB",
    neutral: "#EEF1F1",
  },
  text: {
    primary: "#121212",
    secondary: "#6c757d",
    caption: "#636970",
    disabled: "#7F868F",
    body: "#53585C",
    error: "#6A0300",
    muted: "#545962",
    light: "#ffffff",
  },
  action: {
    active: "#29303B",
    pressed: "#000",
  },
  neutral: {
    main: "#53585C",
    light: "#FBFBFB",
    hover: "#A2AAB21F",
    border: "#DFE5E6",
    pressed: "#A2AAB2",
    container: "#EEF1F1",
    containerHovered: "#A2AAB23D",
    containerPressed: "#A2AAB252",
    icons: "#53585C",
  },
  icons: {
    muted: "#9CA3AF",
  },
  success: {
    main: "#0A7146",
    background: "#D7FFED",
    default: "#258752",
  },
  error: {
    main: "#AF0506",
    background: "#FFF0F0",
    icons: "#6A0300",
  },
  info: {
    main: "#1053BD",
    background: "#D8F0FF",
  },
  warning: {
    main: "#DA9B03",
  },
  // ── Brand color scales ─────────────────────────────────────────────────────
  purple: p.purple,
  cobalt: p.cobalt,
  blue: p.blue,
  steel: p.steel,
  teal: p.teal,
  jade: p.jade,
  green: p.green,
  lime: p.lime,
  yellow: p.yellow,
  amber: p.amber,
  orange: p.orange,
  magenta: p.magenta,
  maroon: p.maroon,
  violet: p.violet,
};

export const darkPalette = {
  mode: "dark",
  primary: {
    main: "#90caf9",
  },
  secondary: {
    main: "#f48fb1",
  },
  text: {
    caption: "#CBD3D6",
    disabled: "#7F868F",
    body: "#DFE5E6",
  },
  background: {
    default: "#121212",
    paper: "#121212",
    primary: "#101318",
    neutral: "#636970",
  },
  action: {
    active: "#545962",
  },
  neutral: {
    main: "#EEF1F1",
    light: "#53585C",
    hover: "#7F868F",
    border: "#636970",
    pressed: "#7F868F",
    container: "#636970",
  },
  success: {
    main: "#33F5A1",
    background: "#0A5D3C",
  },
  error: {
    main: "#FF595A",
    background: "#900C0D",
  },
  info: {
    main: "#89D6FF",
    background: "#144894",
  },
  // ── Brand color scales ─────────────────────────────────────────────────────
  purple: p.purple,
  cobalt: p.cobalt,
  blue: p.blue,
  steel: p.steel,
  teal: p.teal,
  jade: p.jade,
  green: p.green,
  lime: p.lime,
  yellow: p.yellow,
  amber: p.amber,
  orange: p.orange,
  magenta: p.magenta,
  maroon: p.maroon,
  violet: p.violet,
};
