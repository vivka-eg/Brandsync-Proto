import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Image as ImageIcon, PlayCircle } from "phosphor-react";

export default function MediaPlaceholder({
  type = "image",
  title,
  // description,
  // dimensions,
  height = "100%",
  minHeight,
}) {
  const isVideo = type === "video";

  return (
    <Box
      sx={{
        bgcolor: "#f7f7f5",
        border: "1.5px dashed #bcc1c9",
        borderRadius: "8px",
        width: "100%",
        height,
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Stack alignItems="center" spacing={1} sx={{ px: 4, textAlign: "center" }}>
        {isVideo ? (
          <PlayCircle size={48} color="#bcc1c9" weight="thin" />
        ) : (
          <ImageIcon size={40} color="#bcc1c9" weight="thin" />
        )}

        {title && (
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
              color: "#53585c",
            }}
          >
            {title}
          </Typography>
        )}

        {/* {description && (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#8b919b",
              maxWidth: 640,
            }}
          >
            {description}
          </Typography>
        )}

        {dimensions && (
          <Typography
            sx={{
              fontFamily: "'Roboto Mono', Consolas, monospace",
              fontSize: "12px",
              lineHeight: "16px",
              color: "#a8adb5",
            }}
          >
            {dimensions}
          </Typography>
        )} */}
      </Stack>
    </Box>
  );
}
