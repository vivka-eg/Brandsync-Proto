"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { X, Calendar, Download, Eye } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const IconPreviewModal = ({
  open,
  onClose,
  icon = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  if (!icon) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED":
        return {
          bg: theme.palette.success.main,
          text: theme.palette.success.contrastText,
          lightBg: `${theme.palette.success.main}15`,
        };
      case "DRAFT":
        return {
          bg: theme.palette.warning.main,
          text: theme.palette.warning.contrastText,
          lightBg: `${theme.palette.warning.main}15`,
        };
      case "UNPUBLISHED":
        return {
          bg: theme.palette.error.main,
          text: theme.palette.error.contrastText,
          lightBg: `${theme.palette.error.main}15`,
        };
      default:
        return {
          bg: theme.palette.grey[500],
          text: theme.palette.grey[50],
          lightBg: `${theme.palette.grey[500]}15`,
        };
    }
  };

  const statusColors = getStatusColor(icon.status);

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            component: motion.div,
            initial: { scale: 0.9, opacity: 0, y: 20 },
            animate: { 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
            },
            exit: { 
              scale: 0.9, 
              opacity: 0, 
              y: 20,
              transition: { duration: 0.2 }
            },
            sx: {
              borderRadius: isMobile ? 0 : 4,
              background: isDarkMode
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: isDarkMode
                ? `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px ${theme.palette.divider}`
                : "0 24px 48px rgba(0,0,0,0.15)",
              backdropFilter: "blur(20px)",
              border: isDarkMode ? `1px solid ${theme.palette.divider}` : "none",
              overflow: "hidden",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: isDarkMode 
                ? "rgba(0, 0, 0, 0.8)" 
                : "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {/* Header */}
            <Box
              sx={{
                position: "relative",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: theme.palette.primary.contrastText,
                p: 3,
                pb: 4,
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </IconButton>

              {/* Icon Preview */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1,
                  }
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    "& svg": {
                      width: 40,
                      height: 40,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: icon.svg_content }}
                />
              </motion.div>

              {/* Icon Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.2 }
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textAlign="center"
                  sx={{ mb: 1 }}
                >
                  {icon.name}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{ opacity: 0.9 }}
                >
                  {icon.type} Icon
                </Typography>
              </motion.div>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
              {/* Status and Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.3 }
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mb: 3 }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={icon.status}
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: statusColors.bg,
                      },
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                  />

                  <Stack direction="row" spacing={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                      >
                        {icon.downloads || 0}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Download size={12} />
                        Downloads
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </motion.div>

              <Divider sx={{ my: 2 }} />

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.4 }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.primary"
                    sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 2,
                      }}
                    />
                    Categories
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {icon.categories?.length > 0 ? (
                      icon.categories.map((category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: 0.5 + index * 0.1 }
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Chip
                            label={category}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              backgroundColor: `${theme.palette.primary.main}08`,
                              borderColor: `${theme.palette.primary.main}30`,
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              "&:hover": {
                                backgroundColor: `${theme.palette.primary.main}15`,
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No categories assigned
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.5 }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.primary"
                    sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 2,
                      }}
                    />
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {icon.tags?.length > 0 ? (
                      icon.tags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: 0.6 + index * 0.1 }
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Chip
                            label={tag}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              backgroundColor: isDarkMode 
                                ? "rgba(255, 255, 255, 0.08)" 
                                : "rgba(0, 0, 0, 0.06)",
                              color: "text.secondary",
                              fontWeight: 400,
                              fontSize: "0.75rem",
                              "&:hover": {
                                backgroundColor: isDarkMode 
                                  ? "rgba(255, 255, 255, 0.12)" 
                                  : "rgba(0, 0, 0, 0.1)",
                                transform: "translateY(-1px)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tags assigned
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </motion.div>

              {/* Upload Date */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.6 }
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: isDarkMode 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(0, 0, 0, 0.03)",
                    border: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: `${theme.palette.info.main}15`,
                      color: theme.palette.info.main,
                    }}
                  >
                    <Calendar size={16} weight="duotone" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Upload Date
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {icon.uploadDate}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default IconPreviewModal;