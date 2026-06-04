"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Monitor,
  DeviceTablet,
  DeviceMobile,
} from "phosphor-react";

const DEVICES = [
  { key: "desktop", label: "Desktop", Icon: Monitor },
  { key: "tablet", label: "Tablet", Icon: DeviceTablet },
  { key: "mobile", label: "Mobile", Icon: DeviceMobile },
];

function BrowserMockup({ screenshot }) {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        overflow: "hidden",
        p: 3,
        bgcolor: "neutral.light",
      }}
    >
      {screenshot ? (
        <Box
          component="img"
          src={screenshot.url}
          alt="Screenshot preview"
          sx={{
            width: "100%",
            display: "block",
            maxHeight: 400,
            objectFit: "contain",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 260,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            No screenshot uploaded
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function ReadField({ label, value, multiline, rows }) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={value || ""}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        inputProps={{ readOnly: true }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "action.hover",
            "& fieldset": { borderColor: "divider" },
            "&:hover fieldset": { borderColor: "divider" },
            "&.Mui-focused fieldset": {
              borderColor: "divider",
              borderWidth: 1,
            },
          },
        }}
      />
    </Box>
  );
}

export default function ReviewStep({
  screenshots,
  activeDevice,
  onDeviceChange,
  tags,
  prompt,
  title,
  description,
  category,
}) {
  const cardSx = {
    bgcolor: "background.paper",
    border: "2px solid",
    borderColor: "#CBD3D6",
    borderRadius: 2,
    p: 3,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" fontWeight={700}>
        Review
      </Typography>

      {/* Card 1; UI Screenshot */}
      <Box sx={cardSx}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          UI Screenshot
        </Typography>

        <Tabs
          value={activeDevice}
          onChange={(_, val) => onDeviceChange(val)}
          sx={{
            mb: 2,
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

        <BrowserMockup screenshot={screenshots[activeDevice]} />
      </Box>

      {/* Card 2; Details (read-only) */}
      <Box sx={cardSx}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
          Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          <ReadField label="Title" value={title} />
          <ReadField
            label="Description"
            value={description}
            multiline
            rows={3}
          />
          <ReadField label="Category" value={category} />

          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                px: 1.5,
                py: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                minHeight: 40,
                bgcolor: "action.hover",
              }}
            >
              {tags && tags.length > 0 ? (
                tags.map((tag) => <Chip key={tag} label={tag} size="small" />)
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ alignSelf: "center" }}
                >
                  No tags
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Card 3; Prompt */}
      <Box sx={cardSx}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Prompt
        </Typography>
        <Box sx={{ bgcolor: "#111", borderRadius: 2, p: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.7,
            }}
          >
            {prompt || "No prompt entered."}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
