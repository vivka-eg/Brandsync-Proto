"use client";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  MagnifyingGlass,
  Gear,
  Bell,
  SquaresFour,
  Cube,
  Users,
  ChartLine,
  TrendUp,
  TrendDown,
  Package,
  Timer,
  List,
} from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";
import colorPalettes from "brandsync-tokens/themebuilder.json";
import GenericLogo from "./GenericLogo";

// Reusable Metric Card Component
const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendText,
  trendUp,
  isDarkMode,
  neutralColorPalette,
  isMobile,
  theme,
}) => (
  <Box
    sx={{
      bgcolor: isDarkMode ? neutralColorPalette[900] : "#F3F4F6",
      borderRadius: "16px",
      py: "32px",
      px: "12px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Icon */}
    <Box
      sx={{
        position: "absolute",
        right: 16,
        top: 16,
        width: 56,
        height: 56,
        borderRadius: "12px",
        bgcolor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={28} color={iconColor} weight="fill" />
    </Box>

    {/* Content */}
    <Typography
      sx={{
        fontSize: "16px",
        color: isDarkMode ? neutralColorPalette[400] : "text.secondary",
        mb: 1,
        fontWeight: 400,
        lineHeight: "24px",
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontSize: isMobile ? "28px" : "32px",
        fontWeight: 700,
        color: isDarkMode ? "#FFFFFF" : "text.primary",
        mb: 1.5,
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {trendUp ? (
        <TrendUp
          size={16}
          color={theme.palette.success.default}
          weight="bold"
        />
      ) : (
        <TrendDown size={16} color={theme.palette.error.main} weight="bold" />
      )}
      <Typography
        sx={{
          fontSize: "13px",
          color: trendUp ? "success.default" : "error.main",
          fontWeight: 600,
        }}
      >
        {trend}
      </Typography>
      <Typography
        sx={{
          fontSize: "13px",
          color: isDarkMode ? neutralColorPalette[400] : "text.secondary",
          ml: 0.5,
        }}
      >
        {trendText}
      </Typography>
    </Box>
  </Box>
);

function DashboardPreview({
  device = "desktop",
  mode = "light",
  primaryColor,
  selectedColor,
  firstMatchingLogo,
}) {
  const theme = useTheme();
  const primaryColorPalette =
    colorPalettes[selectedColor]?.shades || colorPalettes["blue"]?.shades;
  const neutralColorPalette = colorPalettes["neutral"].shades;
  const isDarkMode = mode === "dark";

  // Determine container width based on device
  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "400px";
      case "tablet":
        return "600px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const showSidebar = device === "desktop";

  const navigationItems = [
    { label: "Dashboard", icon: SquaresFour, active: true },
    { label: "Product", icon: Cube, active: false },
    { label: "Customer", icon: Users, active: false },
    { label: "Sales", icon: ChartLine, active: false },
  ];

  const metricsData = [
    {
      title: "Total User",
      value: "40,689",
      icon: Users,
      iconColor: "#3B82F6",
      iconBg: "#DBEAFE",
      trend: "+8.5%",
      trendText: "Up from yesterday",
      trendUp: true,
    },
    {
      title: "Total Order",
      value: "10,290",
      icon: Package,
      iconColor: "#F59E0B",
      iconBg: "#FEF3C7",
      trend: "+13.5%",
      trendText: "Up from last week",
      trendUp: true,
    },
    {
      title: "Total Sales",
      value: "$8,000",
      icon: TrendUp,
      iconColor: "#10B981",
      iconBg: "#D1FAE5",
      trend: "-13.5%",
      trendText: "Down from last week",
      trendUp: false,
    },
    {
      title: "Completed Order",
      value: "4560",
      icon: Timer,
      iconColor: "#EF4444",
      iconBg: "#FEE2E2",
      trend: "+15%",
      trendText: "Up from last week",
      trendUp: true,
    },
  ];

  // Chart axis labels
  const yAxisLabels = ["100%", "80%", "60%", "40%", "20%"];
  const xAxisLabels = [
    "5k",
    "10k",
    "15k",
    "20k",
    "25k",
    "30k",
    "35k",
    "40k",
    "45k",
    "50k",
  ];

  return (
    <Box
      sx={{
        width: getDeviceWidth(),
        maxWidth: "1400px",
        margin: "0 auto",
        // bgcolor: mode === "dark" ? "background.default" : "#F5F6FA",
        minHeight: "700px",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        border: "7px solid",
        borderColor: "neutral.border",
      }}
    >
      {/* Sidebar - Desktop Only */}
      {showSidebar && (
        <Box
          sx={{
            width: "96px",
            bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
            borderRight: "1px solid",
            borderColor: isDarkMode
              ? neutralColorPalette[800]
              : "neutral.border",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            gap: 4,
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <GenericLogo selectedColor={selectedColor} mode={mode} />
          </Box>

          {/* Search Icon */}
          <IconButton
            sx={{
              padding: "12px",
              borderRadius: "12px",
              color: "text.secondary",
              backgroundColor: "neutral.container",
              border: "1px solid",
              borderColor: "neutral.border",
            }}
          >
            <MagnifyingGlass size={24} />
          </IconButton>

          {/* Navigation Items */}
          <Stack spacing={2} sx={{ width: "100%", px: 1 }}>
            {navigationItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: item.active
                    ? isDarkMode
                      ? neutralColorPalette[800]
                      : "#F3F4F6"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: isDarkMode ? neutralColorPalette[800] : "#F9FAFB",
                  },
                }}
              >
                <item.icon
                  size={24}
                  weight={item.active ? "fill" : "regular"}
                  color={
                    isDarkMode
                      ? neutralColorPalette[50]
                      : neutralColorPalette[900]
                  }
                />
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: item.active ? 600 : 400,
                    color: isDarkMode ? "#fff" : "text.primary",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: isDarkMode ? neutralColorPalette[950] : "#FFFFFF",
            px: isMobile ? 2 : 4,
            py: 2,
            borderBottom: "1px solid",
            borderColor: isDarkMode
              ? neutralColorPalette[800]
              : "neutral.border",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left side - Hamburger menu for mobile/tablet */}
          {!showSidebar && (
            <IconButton
              size="small"
              sx={{
                color: isDarkMode ? "#FFFFFF" : "text.primary",
              }}
            >
              <List size={24} weight="bold" />
            </IconButton>
          )}

          {/* Right Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 1.5 : 2,
              marginLeft: "auto",
            }}
          >
            <IconButton size="small">
              <Gear
                size={24}
                color={
                  isDarkMode
                    ? neutralColorPalette[700]
                    : neutralColorPalette[300]
                }
              />
            </IconButton>
            <IconButton size="small">
              <Bell
                size={24}
                color={
                  isDarkMode
                    ? neutralColorPalette[700]
                    : neutralColorPalette[300]
                }
              />
            </IconButton>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: primaryColor || "primary.main",
              }}
            >
              U
            </Avatar>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box
          sx={{
            flex: 1,
            p: isMobile ? 2 : 4,
            overflowY: "auto",
            bgcolor: isDarkMode ? neutralColorPalette[950] : "#Fff",
          }}
        >
          {/* Metrics Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "1fr 1fr"
                  : "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 3,
              mb: 4,
            }}
          >
            {metricsData.map((metric, index) => (
              <MetricCard
                key={index}
                {...metric}
                isDarkMode={isDarkMode}
                neutralColorPalette={neutralColorPalette}
                isMobile={isMobile}
                theme={theme}
              />
            ))}
          </Box>

          {/* Sales Analytics Chart */}
          <Box
            sx={{
              bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
              borderRadius: "16px",
              p: isMobile ? 2 : 4,
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: isDarkMode ? "#FFFFFF" : "text.primary",
                mb: 4,
              }}
            >
              Sales Analytics
            </Typography>

            {/* Chart Area */}
            <Box
              sx={{
                position: "relative",
                height: "300px",
                width: "100%",
              }}
            >
              {/* Y-axis labels */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 40,
                  width: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {yAxisLabels.map((label) => (
                  <Typography
                    key={label}
                    sx={{
                      fontSize: "12px",
                      color: isDarkMode
                        ? neutralColorPalette[400]
                        : "text.secondary",
                      textAlign: "right",
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>

              {/* Chart */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50px",
                  right: 0,
                  top: 0,
                  bottom: 40,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="196"
                  viewBox="0 0 845 196"
                  fill="none"
                >
                  <path
                    d="M0.72168 195.448L7.10472 173.021L29.2471 172.091L44.7245 163.973L60.9054 163.527L72.697 151.59L83.068 120.557L89.8539 109.454L107.472 132.614L121.913 136.138L132.479 129.415L145.032 99.3099L181.783 159.87L196.833 133.987L214.088 146.979L223.388 127.171L225.202 117.668L239.209 107.963L246.443 94.7742L254.437 113.197L253.114 125.293L260.49 127.083L266.212 121.698L281.126 0.0913086L295.05 148.237L307.43 132.302V123.202L318.013 113.798L322.968 106.59L332.087 95.7487L353.765 107.053L364.557 113.197L373.268 109.22L388.463 127.096L410.565 91.9617L417.031 111.121L430.889 124.376L444.324 120.131L450.598 111.119L460.643 107.048L461.908 99.3099L473.37 80.2851L490.197 85.6883L495.424 70.6135L518.402 179.705L534.852 157.523L556.53 155.971L582.506 171.715L592.598 110.303L605.258 113.759L611.216 106.542L614.572 108.847L620.87 108.144L624.468 111.249L634.466 113.275L634.644 120.146L646.594 124.503L661.526 123.539L662.31 112.036L674.722 34.4479L677.279 67.6221L690.401 77.9915L723.23 56.7866L741.488 71.8647H754.098L772.362 91.9617L797.14 95.7487H824.863L833.343 80.2851L852.769 104.474L868.899 125.293L889.85 85.6883C889.85 85.6883 909.023 100.342 911.226 99.3099C913.428 98.2781 931.752 82.0973 931.752 82.0973L949.524 94.7742L970.766 106.59L988.41 95.7487L996.722 85.6883H994.336H995.616"
                    stroke={primaryColor || theme.palette.primary.main}
                    strokeWidth="1.5"
                  />
                </svg>
              </Box>

              {/* X-axis labels */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50px",
                  right: 0,
                  bottom: 0,
                  height: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {xAxisLabels.map((label, index) => (
                  <Typography
                    key={label}
                    sx={{
                      fontSize: "11px",
                      color: isDarkMode
                        ? neutralColorPalette[400]
                        : "text.secondary",
                      display: isMobile && index % 2 !== 0 ? "none" : "block",
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPreview;
