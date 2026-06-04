"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  IconButton,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Search, Tune, MoreVert } from "@mui/icons-material";
import themebuilderTokens from "brandsync-tokens/themebuilder.json";

const DataTable = ({ primaryColor }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRows, setSelectedRows] = useState([1, 3]);

  const rows = [
    {
      id: 0,
      name: "Elisa",
      email: "elisa@eg.dk",
      status: "Inactive",
      lastActive: "11/12/2025",
    },
    {
      id: 1,
      name: "Matilda",
      email: "mat@eg.dk",
      status: "Inactive",
      lastActive: "11/12/2025",
    },
    {
      id: 2,
      name: "Joseph",
      email: "jo@eg.dk",
      status: "Inactive",
      lastActive: "11/11/2025",
    },
    {
      id: 3,
      name: "Marian",
      email: "marian@eg.dk",
      status: "Inactive",
      lastActive: "11/11/2025",
    },
    {
      id: 4,
      name: "Ann",
      email: "annhat@eg.dk",
      status: "Inactive",
      lastActive: "11/08/2025",
    },
    {
      id: 5,
      name: "Miley",
      email: "miley@eg.dk",
      status: "Inactive",
      lastActive: "11/07/2025",
    },
  ];

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
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
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < rows.length;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2,
            },
            "& .Mui-selected": {
              color: primaryColor,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: primaryColor,
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Search"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "15px",
                color: "text.primary",
                bgcolor: "#FBFBFB",
                "& fieldset": {
                  borderColor: themebuilderTokens.neutral.shades["200"],
                },
                "&:hover fieldset": {
                  borderWidth: "1.5px",
                  borderColor: primaryColor,
                },
                // "&.Mui-focused fieldset": {
                //   borderColor: primaryColor,
                //   borderWidth: "2px",
                // },
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 25, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            size="small"
            sx={{ border: "1px solid #E5E7EB", borderRadius: 1.5 }}
          >
            <Tune sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      <Typography
        sx={{
          px: 2,
          py: 1,
          fontSize: "1rem",
          color: "text.primary",
          mt: "24px",
          mb: "16px",
        }}
      >
        Showing rows 1-10 out of 100
      </Typography>

      <TableContainer sx={{ borderRadius: "12px 12px 0 0" }}>
        <Table size="small" sx={{ borderRadius: "12px 12px 0 0" }}>
          <TableHead sx={{ borderRadius: "12px 12px 0 0" }}>
            <TableRow
              sx={{
                height: "72px",
                backgroundColor: "neutral.container",
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Checkbox
                    sx={{
                      height: "24px",
                      width: "24px",
                      "&.Mui-checked": { color: primaryColor },
                      "&.MuiCheckbox-indeterminate": { color: primaryColor },
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
                  px: 2,
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
            {rows.map((row) => (
              <TableRow sx={{ height: "72px" }} key={row.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Checkbox
                      sx={{
                        height: "24px",
                        width: "24px",
                        "&.Mui-checked": { color: primaryColor },
                      }}
                      checked={selectedRows.includes(row.id)}
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
                      backgroundColor: "#EAEAEB",
                      color: "text.primary",
                      fontSize: "0.75rem",
                      px: "2px",
                      py: "8px",
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;
