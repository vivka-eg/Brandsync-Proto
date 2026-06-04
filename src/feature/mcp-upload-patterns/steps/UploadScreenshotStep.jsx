"use client";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Monitor, DeviceTablet, DeviceMobile } from "phosphor-react";
import PatternDropzone from "../PatternDropzone";

const DEVICES = [
  { key: "desktop", label: "Desktop", Icon: Monitor, optional: false },
  { key: "tablet", label: "Tablet (Optional)", Icon: DeviceTablet, optional: true },
  { key: "mobile", label: "Mobile (Optional)", Icon: DeviceMobile, optional: true },
];

const IMAGE_ACCEPT = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "image/svg+xml": [".svg"],
};

export default function UploadScreenshotStep({
  screenshots,
  activeDevice,
  onDeviceChange,
  onFile,
  onClear,
}) {
  return (
    <Box>
      {/* Device tabs */}
      <Tabs
        value={activeDevice}
        onChange={(_, val) => onDeviceChange(val)}
        sx={{
          mb: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 44,
          "& .MuiTabs-indicator": { bgcolor: "text.primary" },
          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: 44,
            color: "text.secondary",
            fontWeight: 400,
            fontSize: "0.875rem",
          },
          "& .Mui-selected": {
            color: "text.primary !important",
            fontWeight: 700,
          },
        }}
      >
        {DEVICES.map(({ key, label, Icon }) => (
          <Tab
            key={key}
            value={key}
            label={label}
            icon={<Icon size={18} weight={activeDevice === key ? "bold" : "regular"} />}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {/* Dropzone for active device */}
      <PatternDropzone
        accept={IMAGE_ACCEPT}
        label="Drag & drop Screenshot here"
        file={screenshots[activeDevice]}
        onFile={(fileObj) => onFile(activeDevice, fileObj)}
        onClear={() => onClear(activeDevice)}
        optional={DEVICES.find((d) => d.key === activeDevice)?.optional ?? false}
      />
    </Box>
  );
}
