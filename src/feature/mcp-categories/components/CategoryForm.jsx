"use client";

import { useEffect, useRef, useState } from "react";
import {
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ACCEPTED = ".png,.jpg,.jpeg,.gif,.webp,.svg";
const MAX_SIZE_MB = 10;

export default function CategoryForm({ form, onChange, parents, editingCategory }) {
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!form.thumbnail) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.thumbnail);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.thumbnail]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File exceeds ${MAX_SIZE_MB}MB limit.`);
      e.target.value = "";
      return;
    }
    setFileError(null);
    onChange("thumbnail", file);
  };

  const existingThumbnail = !form.thumbnail && editingCategory?.thumbnail?.url;
  const displayUrl = previewUrl || existingThumbnail || null;

  return (
    <Stack spacing={2.5} sx={{ pt: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Parent Category (leave empty for top-level)</InputLabel>
        <Select
          value={form.parentId}
          label="Parent Category (leave empty for top-level)"
          onChange={(e) => onChange("parentId", e.target.value)}
        >
          <MenuItem value="">
            <em>None (top-level category)</em>
          </MenuItem>
          {parents
            .filter((p) => p.id !== editingCategory?.id)
            .map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} ({p.code})
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        label="Code"
        size="small"
        required
        value={form.code}
        onChange={(e) => onChange("code", e.target.value.toUpperCase())}
        placeholder="e.g. UI-FORMS"
        helperText="Alphanumeric, hyphens and underscores only. Auto-uppercased."
        inputProps={{ style: { fontFamily: "monospace" } }}
      />

      <TextField
        label="Name"
        size="small"
        required
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="e.g. Forms"
      />

      <TextField
        label="Description"
        size="small"
        multiline
        minRows={2}
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Short description of this category"
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.active}
            onChange={(e) => onChange("active", e.target.checked)}
            size="small"
          />
        }
        label="Active"
      />

      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Thumbnail
        </Typography>
        {displayUrl && (
          <Box
            component="img"
            src={displayUrl}
            alt="Category thumbnail"
            sx={{
              display: "block",
              mb: 1.5,
              width: 80,
              height: 80,
              objectFit: "contain",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 0.5,
            }}
          />
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
          sx={{ textTransform: "none" }}
        >
          {displayUrl ? "Replace Thumbnail" : "Upload Thumbnail"}
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
          {form.thumbnail ? form.thumbnail.name : "PNG, JPG, GIF, WebP, SVG — max 10 MB"}
        </Typography>
        {fileError && (
          <Typography variant="caption" display="block" sx={{ color: "error.main", mt: 0.5 }}>
            {fileError}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
