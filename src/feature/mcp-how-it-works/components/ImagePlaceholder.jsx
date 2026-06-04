import Box from "@mui/material/Box";
import { Image as ImageIcon } from "phosphor-react";

export default function ImagePlaceholder() {
  return (
    <Box
      sx={{
        bgcolor: "#f7f7f5",
        border: "1.5px dashed #bcc1c9",
        borderRadius: "8px",
        height: "626px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ImageIcon size={40} color="#53585c" weight="thin" />
    </Box>
  );
}
