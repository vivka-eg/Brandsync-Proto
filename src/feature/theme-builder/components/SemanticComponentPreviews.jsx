"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Cancel,
  Close,
  Description,
  Search,
  Download,
  Folder,
  Warning,
  Info,
  Dashboard,
  BarChart,
  ArrowBack,
} from "@mui/icons-material";
import {
  CaretLeftIcon,
  ChartLineIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  Eye,
  File,
  FileText,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  WarningCircleIcon,
  WarningDiamondIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr";

// Success Component Preview
export const SuccessComponentPreview = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "4fr 3fr 1fr" },
        gap: "24px",
        p: "16px",
        pt: 0,
      }}
    >
      {/* File Uploads */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: "16px",
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: "16px",
            border: "1px solid #E5E7EB",
            borderColor: "neutral.border",
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "neutral.container",
              borderRadius: 1,
              padding: "24px",
            }}
          >
            {" "}
            <FileText size={32} weight="duotone" color="#6B7280" />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}
            >
              Rhino.png
            </Typography>
            <Stack>
              <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
                3MB
              </Typography>
              <LinearProgress
                variant="determinate"
                value={98}
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "action.active",
                  },
                }}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "text.body",
                lineHeight: "24px",
              }}
            >
              98% uploaded
            </Typography>
          </Box>
          <Box sx={{ p: "12px" }}>
            <Close
              sx={{ color: "action.active", fontSize: 24, cursor: "pointer" }}
            />
          </Box>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: "16px",
            border: "1px solid #E5E7EB",
            borderColor: "neutral.border",
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "neutral.container",
              borderRadius: 1,
              padding: "24px",
            }}
          ></Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}
            >
              Stag.png
            </Typography>
            <Stack>
              <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
                3MB
              </Typography>
            </Stack>

            <Stack direction="row" gap="4px">
              {" "}
              <CheckCircleIcon size={24} color={theme.palette.success.main} />
              <Typography
                sx={{
                  fontSize: "16px",
                  // fontWeight: 500,
                  color: "success.main",
                  lineHeight: "24px",
                }}
              >
                File uploaded successfully
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ p: "12px" }}>
            <Close
              sx={{ color: "action.active", fontSize: 24, cursor: "pointer" }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Payment Status */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon size={48} color={theme.palette.success.main} />
          </Box>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Payment Complete
          </Typography>
        </Paper>
      </Box>

      {/* Icon Bar */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "90px",
            pt: "24px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={"BrandSync_logomark.svg"}
                alt="EG Brandsync"
                width={44}
                height={44}
              />
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: 1,
              border: "1px solid",
              borderColor: "neutral.containerHovered",
              bgcolor: "neutral.container",
              height: 44,
              width: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MagnifyingGlassIcon size={24} />
          </Box>
          <Box
            sx={{
              p: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <DownloadSimpleIcon size={24} format="stroke" />
              <CheckCircleIcon
                size={20}
                color={theme.palette.success.main}
                style={{
                  position: "absolute",
                  top: -8,
                  right: 4,
                  // background: theme.palette.success.background,
                }}
                weight="fill"
              />
            </Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              Downloads
            </Typography>
          </Box>
          <Box
            sx={{
              p: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <File size={24} format="stroke" />
            </Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              Files
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

// Error Component Preview
export const ErrorComponentPreview = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
        gap: "24px",
        p: "16px",
        pt: 0,
      }}
    >
      {/* File Uploads */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: "16px",
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: "16px",
            border: "1px solid #E5E7EB",
            borderColor: "neutral.border",
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "neutral.container",
              borderRadius: 1,
              padding: "24px",
            }}
          >
            {" "}
            <FileText size={32} weight="duotone" color="#6B7280" />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}
            >
              Rhino.png
            </Typography>
            <Stack>
              <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
                3MB
              </Typography>
              <LinearProgress
                variant="determinate"
                value={98}
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "action.active",
                  },
                }}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "text.body",
                lineHeight: "24px",
              }}
            >
              98% uploaded
            </Typography>
          </Box>
          <Box sx={{ p: "12px" }}>
            <Close
              sx={{ color: "action.active", fontSize: 24, cursor: "pointer" }}
            />
          </Box>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: "16px",
            border: "1px solid #E5E7EB",
            borderColor: "neutral.border",
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "neutral.container",
              borderRadius: 1,
              padding: "24px",
            }}
          ></Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}
            >
              Stag.png
            </Typography>
            <Stack>
              <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
                3MB
              </Typography>
            </Stack>

            <Stack direction="row" gap="4px">
              {" "}
              <XCircleIcon size={24} color={"#6A0300"} />
              <Typography
                sx={{
                  fontSize: "16px",
                  // fontWeight: 500,
                  color: "error.icons",
                  lineHeight: "24px",
                }}
              >
                File upload failed
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ p: "12px" }}>
            <Close
              sx={{ color: "action.active", fontSize: 24, cursor: "pointer" }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Payment Status */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircleIcon size={48} color={theme.palette.error.main} />
          </Box>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Payment Failed
          </Typography>
        </Paper>
      </Box>

      {/* Form Fields */}
      <Box sx={{ height: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#111827",
                mb: 0.5,
              }}
            >
              * Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="sas@gmal.com"
              error
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#B60400",
                  },
                },
              }}
            />
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <WarningCircleIcon size={18} color={"#6A0300"} format="stroke" />
              <Typography
                sx={{ fontSize: "0.75rem", color: "#6A0300", fontWeight: 500 }}
              >
                Wrong email ID
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#111827",
                mb: 0.5,
              }}
            >
              * Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              value="........"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small">
                      <Eye size={20} color={"#232323"} format="stroke" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

// Warning Component Preview
export const WarningComponentPreview = () => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([0]); // Elisa is selected by default

  const rows = [
    { id: 0, name: "Elisa", email: "elisa@eg.dk" },
    { id: 1, name: "Matilda", email: "mat@eg.dk" },
  ];

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = selectedRows.length === rows.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 0fr 2fr" },
        gap: "24px",
        p: "16px",
        pt: 0,
      }}
    >
      {/* Warning Card */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "neutral.border",
            borderRadius: "16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box sx={{}}>
            <WarningDiamondIcon size={64} color={theme.palette.warning.main} />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            This can&apos;t be undone.
          </Typography>
        </Paper>
      </Box>

      {/* User Profile */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 2,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#F59E0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  S
                </Typography>
              </Box>
            }
          >
            <Avatar sx={{ width: 64, height: 64, bgcolor: "#E5E7EB" }} />
          </Badge>
        </Box>
      </Box>

      {/* Table/List */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{ height: "72px", backgroundColor: "neutral.container" }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Checkbox
                      sx={{
                        height: "24px",
                        width: "24px",
                        "&.Mui-checked": { color: theme.palette.warning.main },
                        "&.MuiCheckbox-indeterminate": { color: theme.palette.warning.main },
                      }}
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                    />
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      Name
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  States
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Email
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <TableRow key={row.id} sx={{ height: "72px" }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Checkbox
                          sx={{
                            height: "24px",
                            width: "24px",
                            "&.Mui-checked": { color: theme.palette.warning.main },
                          }}
                          checked={isChecked}
                          onChange={() => toggleRow(row.id)}
                        />
                        <Typography
                          sx={{ fontSize: "16px", color: "text.secondary" }}
                        >
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isChecked ? "Pending" : "Inactive"}
                        size="small"
                        sx={{
                          backgroundColor: isChecked ? "#FEF3C7" : "#F3F4F6",
                          color: isChecked ? "#92400E" : "#6B7280",
                          fontSize: "0.75rem",
                          height: 20,
                          width: isChecked ? "auto" : "70px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "16px", color: "text.secondary" }}
                      >
                        {row.email}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

// Information Component Preview
export const InformationComponentPreview = () => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);

  const rows = [
    { id: 0, name: "Elisa", email: "elisa@eg.dk", status: "New Joinee" },
    { id: 1, name: "Matilda", email: "mat@eg.dk", status: "Inactive" },
  ];

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = selectedRows.length === rows.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        gap: 2,
        p: "16px",
        pt: 0,
      }}
    >
      {/* Information Card */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "neutral.border",
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InfoIcon size={64} color="#255581" />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            New updates are available.
          </Typography>
        </Paper>
      </Box>

      {/* Sidebar Menu */}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: "24px 16px 0 32px",
            borderRight: "2px solid",
            borderColor: "neutral.border",
            borderRadius: 0,
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              component="img"
              src="/brandsync_logo.svg"
              alt="EG BrandSync"
              sx={{
                height: 44,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                lineHeight: "24px",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Main Menu
            </Typography>
            <Box
              sx={{
                p: "12px",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <CaretLeftIcon size={20} color="action.active" format="stroke" />
            </Box>
          </Box>
          <List sx={{ p: 0, width: "100%" }}>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <SquaresFourIcon
                  size={24}
                  color={theme.palette.primary.main}
                  fontWeight={"bold"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontSize: "16px",
                  color: "text.primary",
                }}
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ChartLineIcon
                  size={24}
                  color={theme.palette.primary.main}
                  fontWeight="bold"
                />
              </ListItemIcon>
              <ListItemText
                primary="Statistics"
                primaryTypographyProps={{
                  fontSize: "16px",
                  color: "text.primary",
                }}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Box>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{ height: "72px", backgroundColor: "neutral.container" }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Checkbox
                      sx={{
                        height: "24px",
                        width: "24px",
                        "&.Mui-checked": { color: theme.palette.info.main },
                        "&.MuiCheckbox-indeterminate": { color: theme.palette.info.main },
                      }}
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                    />
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      Name
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  States
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Email
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <TableRow key={row.id} sx={{ height: "72px" }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Checkbox
                          sx={{
                            height: "24px",
                            width: "24px",
                            "&.Mui-checked": { color: theme.palette.info.main },
                          }}
                          checked={isChecked}
                          onChange={() => toggleRow(row.id)}
                        />
                        <Typography
                          sx={{ fontSize: "16px", color: "text.secondary" }}
                        >
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          backgroundColor: row.status === "New Joinee" ? "#D9E7F2" : "#F3F4F6",
                          color: row.status === "New Joinee" ? "#255581" : "#6B7280",
                          fontSize: "0.75rem",
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "16px", color: "text.secondary" }}
                      >
                        {row.email}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

// Neutrals Component Preview (simpler, basic components)
export const NeutralsComponentPreview = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        gap: 2,
        p: "16px",
        pt: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid #E5E7EB",
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#111827",
            mb: 1,
          }}
        >
          Card Title
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#6B7280" }}>
          This is a neutral card component using gray tones.
        </Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid #E5E7EB",
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#111827",
            mb: 1,
          }}
        >
          Card Title
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#6B7280" }}>
          Neutral components provide structure and hierarchy.
        </Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid #E5E7EB",
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#111827",
            mb: 1,
          }}
        >
          Card Title
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#6B7280" }}>
          They work well with all semantic colors.
        </Typography>
      </Paper>
    </Box>
  );
};
