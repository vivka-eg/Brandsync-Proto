"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

export default function UploadPromptStep({ prompt, onChange }) {
  return (
    <Box>
      {/* Label */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
        <Typography component="span" sx={{ color: "error.main", fontWeight: 700 }}>
          *
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          Insert Prompt here
        </Typography>
      </Box>

      {/* Multiline text field */}
      <TextField
        fullWidth
        multiline
        minRows={10}
        placeholder="Insert your prompt here"
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "monospace",
            fontSize: "0.875rem",
          },
        }}
      />

      <FormHelperText sx={{ mt: 1, mx: 0 }}>Supportive text</FormHelperText>
    </Box>
  );
}
