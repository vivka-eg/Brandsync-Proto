"use client";

import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  DotsThreeVertical,
  PencilSimple,
  Trash,
  Copy,
} from "phosphor-react";

const IconActionsMenu = ({
  onEdit,
  onDelete,
  onCopy,
  iconData = null,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (callback) => (event) => {
    event.stopPropagation();
    handleClose();
    if (callback) {
      callback(iconData);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        size="small"
        sx={{
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: alpha(theme.palette.text.primary, 0.08),
            color: theme.palette.text.primary,
          },
        }}
      >
        <DotsThreeVertical size={16} weight="bold" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 140,
              borderRadius: 2,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              "& .MuiMenuItem-root": {
                fontSize: "0.875rem",
                minHeight: 36,
                px: 2,
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleAction(onEdit)}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <PencilSimple size={16} />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>

        <MenuItem onClick={handleAction(onCopy)}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Copy size={16} />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </MenuItem>

        <Divider />

        <MenuItem 
          onClick={handleAction(onDelete)}
          sx={{ 
            color: "error.main",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 28 }}>
            <Trash size={16} />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default IconActionsMenu;