"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Autocomplete,
  Alert,
} from "@mui/material";
import { Plus, Sparkle, User, Ruler } from "@phosphor-icons/react";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";

export default function PhotoMetadataForm({
  metadata,
  onUpdate,
  onAddTag,
  onRemoveTag,
  onClearAllTags,
  onAutoSuggestTags,
  onAnalyzeWithAI,
  aiLoading,
  aiError,
  existingTags = [],
  showApplyToAll = false,
  onApplyToAll,
  applyToAll = false,
  categories = [],
  businessUnitId = "",
}) {
  const { businessUnits } = useBusinessUnits();

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        fullWidth
        required
        value={metadata?.title || ""}
        onChange={(e) => onUpdate("title", e.target.value)}
        placeholder="Enter a descriptive title"
        helperText="A clear, searchable title for this image"
      />

      <TextField
        label="Description"
        fullWidth
        required
        multiline
        rows={3}
        value={metadata?.description || ""}
        onChange={(e) => onUpdate("description", e.target.value)}
        placeholder="Describe what's in this image"
        helperText="Help users understand what this image shows"
      />

      <Autocomplete
        multiple
        options={categories}
        getOptionLabel={(option) => option.label}
        value={
          Array.isArray(metadata?.category)
            ? categories.filter((cat) => metadata.category.includes(cat.id))
            : []
        }
        onChange={(event, newValue) => {
          onUpdate("category", newValue.map((v) => v.id));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Category"
            required
            placeholder="Search or select categories"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.label}
                {...tagProps}
                sx={{ borderRadius: 1.5 }}
              />
            );
          })
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <Autocomplete
        options={businessUnits}
        getOptionLabel={(option) => option.name}
        value={businessUnits.find((bu) => bu.id === businessUnitId) || null}
        onChange={(event, newValue) => {
          onUpdate("businessUnitId", newValue ? newValue.id : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Assign to Product"
            placeholder="Search or select a business unit"
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      <FormControl fullWidth required>
        <InputLabel>Classification</InputLabel>
        <Select
          value={
            metadata?.containsPeople === null || metadata?.containsPeople === undefined
              ? ""
              : metadata?.containsPeople === true
                ? "yes"
                : "no"
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === "yes") {
              onUpdate("containsPeople", true);
            } else if (value === "no") {
              onUpdate("containsPeople", false);
            }
          }}
          label="Classification"
        >
          <MenuItem value="yes">Contains People</MenuItem>
          <MenuItem value="no">No People</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Orientation</InputLabel>
        <Select
          value={metadata?.orientation || ""}
          onChange={(e) => onUpdate("orientation", e.target.value)}
          label="Orientation"
        >
          <MenuItem value="Portrait">Portrait</MenuItem>
          <MenuItem value="Landscape">Landscape</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Gender</InputLabel>
        <Select
          value={metadata?.gender || ""}
          onChange={(e) => onUpdate("gender", e.target.value)}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Multiple">Multiple</MenuItem>
          <MenuItem value="None">None</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Ethnicity</InputLabel>
        <Select
          value={metadata?.ethnicity || ""}
          onChange={(e) => onUpdate("ethnicity", e.target.value)}
          label="Ethnicity"
        >
          <MenuItem value="Asian">Asian</MenuItem>
          <MenuItem value="African">African</MenuItem>
          <MenuItem value="American">American</MenuItem>
          <MenuItem value="European">European</MenuItem>
          <MenuItem value="Multiple">Multiple</MenuItem>
          <MenuItem value="None">None</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Tags
          </Typography>
        </Box>

        {aiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {aiError}
          </Alert>
        )}

        {metadata?.tags?.length > 0 && (
          <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
              {metadata.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => onRemoveTag(tag)}
                  sx={{ borderRadius: 1.5 }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Button
                variant="text"
                size="small"
                color="error"
                onClick={onClearAllTags}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Clear all tags
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", gap: 1 }}>
          <Autocomplete
            freeSolo
            options={existingTags.filter((tag) => !metadata?.tags?.includes(tag))}
            value={metadata?.newTag || ""}
            onChange={(e, value) => onUpdate("newTag", value || "")}
            onInputChange={(e, value) => onUpdate("newTag", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Type a tag and press Enter"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddTag();
                  }
                }}
              />
            )}
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            onClick={onAddTag}
            sx={{ minWidth: "auto", px: 2 }}
          >
            <Plus size={20} />
          </Button>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Type and press Enter to add.
        </Typography>
      </Box>

      {metadata?.dimensions && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Image Metadata
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {metadata?.dimensions && (
              <Chip
                icon={<Ruler size={16} />}
                label={`${metadata.dimensions.width} × ${metadata.dimensions.height} px`}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1.5 }}
              />
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
