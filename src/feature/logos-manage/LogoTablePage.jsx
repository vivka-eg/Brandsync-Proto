"use client";
import React from "react";
import {
  Box,
  Typography,
  TablePagination,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { notFound, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/AuthContext";
import styles from "./logoTable.module.css";

// Custom hooks
import { useLogos } from "./hooks/useLogos";
import { useDeleteDialog } from "./hooks/useDeleteDialog";
import { useNotification } from "./hooks/useNotification";

// Components
import MobileLogoCard from "./components/MobileLogoCard";
import MobileLoadingSkeleton from "./components/MobileLoadingSkeleton";
import LogoTableRow from "./components/LogoTableRow";
import TableLoadingSkeleton from "./components/TableLoadingSkeleton";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import NotificationSnackbar from "./components/NotificationSnackbar";
import SearchBar from "./components/SearchBar";

const LogoTablePage = () => {
  const { isAdmin, isSuperAdmin } = useAuthContext();
  // const isAdmin = false;
  // const isSuperAdmin = false;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();



  // Custom hooks for business logic
  const {
    logos,
    loading,
    page,
    rowsPerPage,
    totalCount,
    searchQuery,
    debouncedSearchQuery,
    sortField,
    sortOrder,
    fetchLogos,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleRequestSort,
  } = useLogos();

  const { snackbar, showSuccess, showError, handleSnackbarClose } =
    useNotification();

  const {
    deleteDialogOpen,
    logoToDelete,
    deleting,
    handleDeleteClick,
    handleDeleteConfirm: confirmDelete,
    handleDeleteCancel,
  } = useDeleteDialog(
    (message) => {
      showSuccess(message);
      fetchLogos(page, rowsPerPage, debouncedSearchQuery);
    },
    (message) => {
      showError(message);
    }
  );

  // Navigation handler
  const handleEdit = (logoId) => {
    router.push(`/logos/upload?edit=${logoId}`);
  };

  // Permission check
  if (!isAdmin && !isSuperAdmin) {
    notFound();
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            Product Logos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view all product logos
            {!loading && totalCount > 0 && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({totalCount} {totalCount === 1 ? "logo" : "logos"})
              </Typography>
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUploadOutlinedIcon />}
          onClick={() => router.push("/logos/upload")}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Upload
        </Button>
      </Box>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search logos by name..."
      />

      {/* Content - Mobile or Desktop */}
      {isMobile ? (
        // Mobile view - Card layout
        <Box>
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <MobileLoadingSkeleton key={index} />
            ))
          ) : logos.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {debouncedSearchQuery
                  ? `No logos found matching "${debouncedSearchQuery}"`
                  : "No logos found"}
              </Typography>
            </Box>
          ) : (
            logos.map((logo) => (
              <MobileLogoCard
                key={logo.id}
                logo={logo}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                showDeleteButton={isSuperAdmin}
              />
            ))
          )}
        </Box>
      ) : (
        // Desktop/Tablet view - BrandSync table
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>
                  <button
                    className={`${styles.sortBtn}${sortField === 'Name' ? ` ${styles.active}` : ''}`}
                    onClick={() => handleRequestSort('Name')}
                  >
                    Name
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>
                  </button>
                </th>
                {!isTablet && <th>Logo</th>}
                <th>Vertical (Black)</th>
                <th>Horizontal (Black)</th>
                {!isTablet && (
                  <th>
                    <button
                      className={`${styles.sortBtn}${sortField === 'ColorPalette' ? ` ${styles.active}` : ''}`}
                      onClick={() => handleRequestSort('ColorPalette')}
                    >
                      Color Palette
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>
                    </button>
                  </th>
                )}
                <th style={{ textAlign: "center" }}>PPT</th>
                <th style={{ textAlign: "center" }}>CVI</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableLoadingSkeleton key={index} isTablet={isTablet} />
                ))
              ) : logos.length === 0 ? (
                <tr>
                  <td colSpan={isTablet ? 6 : 8} className={styles.emptyCell}>
                    {debouncedSearchQuery
                      ? `No logos found matching "${debouncedSearchQuery}"`
                      : "No logos found"}
                  </td>
                </tr>
              ) : (
                logos.map((logo) => (
                  <LogoTableRow
                    key={logo.id}
                    logo={logo}
                    isTablet={isTablet}
                    isAdmin={isAdmin}
                    isSuperAdmin={isSuperAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            ".MuiTablePagination-toolbar": {
              flexWrap: { xs: "wrap", sm: "nowrap" },
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        logoToDelete={logoToDelete}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={handleDeleteCancel}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default LogoTablePage;
