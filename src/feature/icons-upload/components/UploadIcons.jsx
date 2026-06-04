"use client";
import SvgUploadDropzone from "./SvgUploadDropzone";
import {
  Stack,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  useTheme,
} from "@mui/material";

import { Trash } from "phosphor-react";
import Image from "next/image";
import { useIconsUploadContext } from "../context/IconsUploadContext";
import { formatBytes } from "@/utils/assets";

const FileCard = ({ icon, index }) => {
  const { removeIconByIndex } = useIconsUploadContext();
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: "1 1 300px",
        maxWidth: "calc(50% - 8px)",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" minWidth={0}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            bgcolor: "neutral.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Image src={icon.url} width={20} height={20} alt="" />
        </Box>
        <Box minWidth={0}>
          <Typography
            fontWeight={600}
            fontSize={14}
            noWrap
            title={icon.name}
          >
            {icon.name}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {formatBytes(icon.size)}
          </Typography>
        </Box>
      </Stack>

      <IconButton
        size="small"
        aria-label="Remove file"
        onClick={() => {
          removeIconByIndex(index);
          URL.revokeObjectURL(icon.url);
        }}
        sx={{ ml: 1, flexShrink: 0 }}
      >
        <Trash size={18} color={theme.palette.text.secondary} />
      </IconButton>
    </Paper>
  );
};

function UploadIcons() {
  const { icons, setIcons } = useIconsUploadContext();

  const clearAll = () => {
    icons.forEach((icon) => URL.revokeObjectURL(icon.url));
    setIcons([]);
  };

  return (
    <Stack spacing={3}>
      <SvgUploadDropzone setIcons={setIcons} />

      {icons.length > 0 && (
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2" color="text.secondary">
              {icons.length} file{icons.length !== 1 ? "s" : ""} selected
            </Typography>
            <Button
              size="small"
              color="error"
              variant="text"
              onClick={clearAll}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Clear all
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {icons.map((icon, index) => (
              <FileCard key={index} icon={icon} index={index} />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default UploadIcons;
