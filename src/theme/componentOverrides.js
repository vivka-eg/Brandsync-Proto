export const componentOverrides = {
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: "#1053BD",
        textDecorationColor: "#1053BD",
        "&.Mui-focusVisible": {
          outline: "none",
          border: `2px solid ${theme.palette.action.active}`,
          borderRadius: "4px",
        },
      }),
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
    styleOverrides: {
      tooltip: {
        padding: "8px",
        backgroundColor: "#40474A",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "20px",
      },
      arrow: {
        color: "#40474A",
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-selected": {
          color: theme.palette.action.active,
          borderBottom: `2px solid ${theme.palette.action.active}`,
          fontWeight: "600",
        },
        "&:hover": {
          borderBottom: `2px solid ${theme.palette.neutral.border}`,
        },
        "&:focus-visible": {
          outline: `1px solid ${theme.palette.action.active}`,
          outlineOffset: "-1px",
        },
        textTransform: "capitalize",
        color: "text.disabled",
        lineHeight: "24px",
        marginRight: "8px",
        fontSize: "16px",
      }),
    },
  },
  MuiRadio: {
    defaultProps: {
      disableRipple: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
        "&.Mui-focusVisible": {
          border: `2px solid ${theme.palette.action.active}`,
          borderRadius: "50%",
        },
        ":hover": {
          backgroundColor: theme.palette.neutral.containerHovered,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:focus-visible": {
          outline: "none",
          border: `2px solid ${theme.palette.primary.main}`,
          backgroundColor: "transparent",
          borderRadius: theme.shape.borderRadius,
          zIndex: 1,
        },
      }),
      expandIconWrapper: () => ({
        color: "rgba(0, 0, 0, 0.54)",
        transition: "transform 0.2s ease-in-out",
        "&.Mui-expanded": {
          transform: "rotate(180deg)",
        },
        width: 64,
        height: 64,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }),
      content: {
        margin: 0,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-focusVisible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }),
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        bodySm: "p",
        bodyMd: "p",
        bodyLg: "p",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Click / active state; border only, no extra ring
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.neutral.border,
        },
        "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.neutral.border,
        },
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-focusVisible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }),
    },
  },
};
