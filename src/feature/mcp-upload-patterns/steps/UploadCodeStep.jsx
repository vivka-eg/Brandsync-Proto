"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import Chip from "@mui/material/Chip";

function RequiredLabel({ children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
      <Typography component="span" sx={{ color: "error.main", lineHeight: 1 }}>
        *
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {children}
      </Typography>
    </Box>
  );
}

export default function UploadCodeStep({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  categoryId,
  onCategoryChange,
  categories,
  tags,
  onTagsChange,
}) {
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,$/, "");
      if (tag && !tags.includes(tag)) {
        onTagsChange([...tags, tag]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleTagDelete = (tagToDelete) => {
    onTagsChange(tags.filter((t) => t !== tagToDelete));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Details card */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
          Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Title */}
          <Box>
            <RequiredLabel>Title</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Dashboard UI"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </Box>

          {/* Description */}
          <Box>
            <RequiredLabel>Description</RequiredLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="Brief description of the UI pattern"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              helperText="Sentence length not more than 20 words"
              FormHelperTextProps={{ sx: { mx: 0 } }}
            />
          </Box>

          {/* Category */}
          <Box>
            <RequiredLabel>Category</RequiredLabel>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              renderValue={(val) => {
                if (!val) return <Typography color="text.disabled" variant="body2">Select a category</Typography>;
                const match = categories
                  .flatMap(({ subcategories }) => subcategories)
                  .find((sub) => sub.id === val);
                return match?.name ?? val;
              }}
            >
              {categories.flatMap(({ parent, subcategories }) => [
                <ListSubheader key={`header-${parent.id}`}>{parent.name}</ListSubheader>,
                ...subcategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name}
                    {sub.code && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {sub.code}
                      </Typography>
                    )}
                  </MenuItem>
                )),
              ])}
            </Select>
          </Box>

          {/* Tags; custom chip input */}
          <Box>
            <RequiredLabel>Tags</RequiredLabel>
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
                alignItems: "center",
                minHeight: 40,
                cursor: "text",
                transition: "border-color 0.2s",
                "&:focus-within": {
                  borderColor: "text.primary",
                  borderWidth: "2px",
                },
              }}
              onClick={() =>
                document.getElementById("tag-input")?.focus()
              }
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => handleTagDelete(tag)}
                  sx={{ height: 24 }}
                />
              ))}
              <Box
                component="input"
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Type and press Enter to add tags" : ""}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  border: "none",
                  outline: "none",
                  bgcolor: "transparent",
                  fontSize: "0.875rem",
                  color: "text.primary",
                  p: 0,
                  "&::placeholder": { color: "text.disabled" },
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Press Enter or comma to add a tag
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
