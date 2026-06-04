"use client";
import useDashboard from "../hooks/useDashboard";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const DownloadTrends = ({ downloadTrends }) => {
  const theme = useTheme();
  
  // Smart date formatter based on data range
  const getDateFormatter = (dates) => {
    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);
    const daysDiff = (sortedDates[sortedDates.length - 1] - sortedDates[0]) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 7) {
      // Show day and month for week view
      return (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric' 
      });
    } else if (daysDiff <= 31) {
      // Show month and day for month view
      return (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      // Show month and year for longer periods
      return (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
    }
  };

  const formatDate = getDateFormatter(downloadTrends.map(trend => trend.date));

  const state = {
    series: [
      {
        name: "Downloads",
        data: downloadTrends.map((trend) => trend.downloads),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        background: "transparent",
        // Add padding to prevent cutoff
        offsetX: 0,
        offsetY: 0,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: [theme.palette.primary.main],
      },
      colors: [theme.palette.primary.main],
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: [theme.palette.primary.light],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      title: {
        text: "Download Trends",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "600",
          color: theme.palette.text.primary,
        },
      },
      grid: {
        show: true,
        borderColor: theme.palette.divider,
        strokeDashArray: 2,
        position: "back",
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 30,
          bottom: 10,
          left: 30,
        },
      },
      xaxis: {
        type: 'category',
        categories: downloadTrends.map((trend) => trend.date),
        labels: {
          // show: true,
          rotate: downloadTrends.length > 7 ? -45 : 0,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: true,
          maxHeight: downloadTrends.length > 7 ? 80 : 40,
          style: {
            colors: theme.palette.text.secondary,
            fontSize: "11px",
            fontWeight: 400,
          },
          offsetY: downloadTrends.length > 7 ? 10 : 0,
          // Ensure first and last labels are always shown
          formatter: function (value, timestamp, opts) {
            return value;
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.divider,
        },
        axisTicks: {
          show: true,
          color: theme.palette.divider,
          height: 6,
        },
        // Force show all ticks
        tickAmount: downloadTrends.length - 1,
        min: 0,
        max: downloadTrends.length - 1,
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: theme.palette.mode,
        style: {
          fontSize: "12px",
        },
        x: {
          show: true,
          formatter: function(val, opts) {
            const index = opts.dataPointIndex;
            const originalDate = downloadTrends[index]?.date;
            if (originalDate) {
              return new Date(originalDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
            return val;
          },
        },
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " downloads";
          },
        },
      },
      markers: {
        size: 6,
        colors: [theme.palette.primary.main],
        strokeColors: theme.palette.background.paper,
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

const CategoryWiseIconsPerformanceChart = ({ categoryStats }) => {
  const theme = useTheme();
  
  const maxY = useMemo(() => {
    if (!categoryStats || categoryStats.length === 0) return 10;
    const maxIcons = Math.max(...categoryStats.map((stat) => stat.icons));
    return Math.ceil((maxIcons + 10) / 10) * 10; // round to nearest 10
  }, [categoryStats]);

  // Create gradient colors based on MUI theme
  const gradientColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        distributed: true, // This makes each bar a different color
      },
    },
    dataLabels: { 
      enabled: false 
    },
    colors: gradientColors,
    fill: {
      type: "gradient",
      gradient: {
        shade: theme.palette.mode === "dark" ? "dark" : "light",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: gradientColors.map(color => 
          theme.palette.mode === "dark" 
            ? theme.palette.grey[800] 
            : theme.palette.grey[100]
        ),
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.6,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: categoryStats.map((stat) => stat.category),
      labels: { 
        show: true,
        rotate: -45,
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "11px",
        },
      },
      axisBorder: { 
        show: true,
        color: theme.palette.divider,
      },
      axisTicks: { 
        show: true,
        color: theme.palette.divider,
      },
    },
    yaxis: {
      min: 0,
      max: maxY,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "12px",
        },
        formatter: function (val) {
          return Math.floor(val);
        },
      },
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return val + " icons";
        },
      },
    },
    title: {
      text: "Category Wise Icons Performance",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: theme.palette.text.primary,
      },
    },
    legend: {
      show: false, // Hide legend since we're using distributed colors
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.1,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "lighten",
          value: 0.2,
        },
      },
    },
  };

  const series = [
    {
      name: "Icons",
      data: categoryStats.map((stat) => stat.icons),
    },
  ];

  return (
    <Card>
      <CardContent>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

// Rest of your components remain the same...
const TopDownloadedIcons = ({ topDownloaded }) => {
  // Sort the array in descending order of downloads and take top 15
  const top15 = [...topDownloaded]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, topDownloaded.length > 15 ? 15 : topDownloaded.length);

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="subtitle2">
          Top Downloaded Icons
        </Typography>

        <List dense>
          {top15.map((icon, index) => (
            <React.Fragment key={icon.name}>
              <ListItem>
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{`${index + 1}. ${icon.name}`}</span>
                      <span style={{ fontWeight: 500 }}>{icon.downloads}</span>
                    </div>
                  }
                />
              </ListItem>
              {index < top15.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => {
  return (
    <Stack gap={4}>
      {/* Stats section */}
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {[1, 2, 3, 4].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ flexGrow: 1 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  <Skeleton width="100%" />
                </Typography>
                <Typography variant="h4">
                  <Skeleton width="40%" />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={3}>
        <Stack flex={2} gap={3}>
          {/* Download Trends Skeleton */}
          <Card sx={{ height: 300 }}>
            <CardContent>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="rectangular" height={220} sx={{ mt: 2 }} />
            </CardContent>
          </Card>

          {/* Category-wise Icons Performance Chart Skeleton */}
          <Card sx={{ height: 300 }}>
            <CardContent>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="rectangular" height={220} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Stack>

        {/* Top Downloaded Icons Skeleton */}
        <Box flex={1}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
              {[...Array(15)].map((_, idx) => (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  key={idx}
                  sx={{ mb: 1 }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </Box>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <div style={{ height: "100px" }} />
    </Stack>
  );
};

function Dashboard() {
  const { stats, topDownloaded, downloadTrends, categoryStats, isLoading } =
    useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Stack gap={4}>
      {/* stats section */}
      <Grid container spacing={3} >
        {[
          { label: "Total Icons", value: stats.totalIcons },
          { label: "Total Downloads", value: stats.totalDownloads },
          { label: "Active Users", value: stats.activeUsers },
          { label: "Published Icons", value: stats.publishedIcons },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} style={{ flexGrow: 1 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h4">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={3}>
        <Stack flex={2} gap={3}>
          {/* download trends */}
          <DownloadTrends downloadTrends={downloadTrends} />

          {/* category wise downloads */}
          <CategoryWiseIconsPerformanceChart categoryStats={categoryStats} />
        </Stack>
        <Box sx={{ flex: 1 }}>
          <TopDownloadedIcons topDownloaded={topDownloaded} />
        </Box>
      </Stack>

      <div style={{ height: "100px" }}></div>
    </Stack>
  );
}

export default Dashboard;