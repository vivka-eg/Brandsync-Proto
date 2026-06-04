import { useState } from "react";

/**
 * Custom hook for managing snackbar notifications
 *
 * @returns {{
 *   snackbar: Object,
 *   showNotification: Function,
 *   showSuccess: Function,
 *   showError: Function,
 *   handleSnackbarClose: Function
 * }}
 */
export const useNotification = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Shows a notification with custom message and severity
   * @param {string} message - Notification message
   * @param {('success'|'error'|'warning'|'info')} severity - Notification severity
   */
  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /**
   * Shows a success notification
   * @param {string} message - Success message
   */
  const showSuccess = (message) => {
    showNotification(message, "success");
  };

  /**
   * Shows an error notification
   * @param {string} message - Error message
   */
  const showError = (message) => {
    showNotification(message, "error");
  };

  /**
   * Closes the snackbar notification
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    snackbar,
    showNotification,
    showSuccess,
    showError,
    handleSnackbarClose,
  };
};
