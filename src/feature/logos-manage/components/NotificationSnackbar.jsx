import React from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * Snackbar component for displaying notifications
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the snackbar is open
 * @param {string} props.message - Notification message
 * @param {('success'|'error'|'warning'|'info')} props.severity - Notification severity
 * @param {Function} props.onClose - Callback for closing the snackbar
 */
const NotificationSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
