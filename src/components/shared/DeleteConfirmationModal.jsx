"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { X, Trash, Warning } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  itemPluralName = "",
  itemCount = 1,
  loading = false,
  destructive = true,
}) => {
  const getTitle = () => {
    if (itemCount > 1) {
      return `Delete ${itemCount} ${itemPluralName}`;
    }
    return itemName ? `Delete ${itemName}` : title;
  };

  const getMessage = () => {
    if (itemCount > 1) {
      return `Are you sure you want to delete ${itemCount} ${itemPluralName}? This action cannot be undone.`;
    }
    return itemName
      ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
      : message;
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { scale: 0.95, opacity: 0 },
            animate: {
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            },
            exit: {
              scale: 0.95,
              opacity: 0,
              transition: { duration: 0.2 },
            },
            sx: {
              borderRadius: 2,
              "& .MuiDialog-paper": {
                backgroundImage: "none",
              },
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          {/* Dialog Title */}
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 1,
              "& .MuiTypography-root": {
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontWeight: 600,
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: destructive ? "error.main" : "warning.main",
                  color: destructive
                    ? "error.contrastText"
                    : "warning.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": {
                    width: 20,
                    height: 20,
                  },
                }}
              >
                {destructive ? (
                  <Trash size={20} weight="bold" />
                ) : (
                  <Warning size={20} weight="bold" />
                )}
              </Box>
              <Typography variant="h6" component="span">
                {getTitle()}
              </Typography>
            </motion.div>

            <IconButton
              onClick={onClose}
              disabled={loading}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent sx={{ pb: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: itemCount > 1 ? 2 : 0, lineHeight: 1.6 }}
              >
                {getMessage()}
              </Typography>

              {/* Item Count Indicator */}
              {itemCount > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: "action.hover",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {itemPluralName
                        ? itemPluralName[0].toUpperCase() +
                          itemPluralName.slice(1)
                        : "Items"}{" "}
                      selected for deletion:
                    </Typography>
                    <Chip
                      label={itemCount}
                      size="small"
                      color={destructive ? "error" : "warning"}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </motion.div>
              )}
            </motion.div>
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ display: "flex", gap: 8, width: "100%" }}
            >
              <Button
                onClick={onClose}
                disabled={loading}
                variant="outlined"
                color="inherit"
                sx={{
                  flex: 1,
                  py: 1.25,
                  fontWeight: 500,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "text.secondary",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={onConfirm}
                disabled={loading}
                variant="contained"
                color={destructive ? "error" : "warning"}
                sx={{
                  flex: 1,
                  py: 1.25,
                  fontWeight: 600,
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: (theme) =>
                      `0 4px 12px ${
                        destructive
                          ? theme.palette.error.main
                          : theme.palette.warning.main
                      }40`,
                  },
                  transition: "all 0.2s ease",
                }}
                startIcon={
                  loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid currentColor",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <Trash size={18} weight="bold" />
                  )
                }
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
