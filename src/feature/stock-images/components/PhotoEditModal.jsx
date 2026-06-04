"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Autocomplete,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { X, Plus, Sparkle } from "@phosphor-icons/react";
import { calculateOrientation } from "@/utils/imageUtils";
import { useStockImageCategories } from "@/hooks/useStockImageCategories";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";

const normalizeCategory = (value) => {
  if (!value) return "";
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
};

export default function PhotoEditModal({ open, onClose, photo, onSave }) {
  const { categories } = useStockImageCategories();
  const { businessUnits } = useBusinessUnits();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: [],
    tags: [],
    newTag: "",
    containsPeople: null,
    orientation: null,
    gender: null,
    ethnicity: null,
    businessUnitId: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    if (photo) {
      let categoryValue = [];
      if (Array.isArray(photo.category)) {
        categoryValue = photo.category;
      } else if (photo.category) {
        categoryValue = [normalizeCategory(photo.category)];
      }

      setFormData({
        title: photo.title || "",
        description: photo.description || "",
        category: categoryValue,
        tags: photo.tags || [],
        newTag: "",
        containsPeople: photo.containsPeople !== undefined ? photo.containsPeople : null,
        orientation: photo.orientation || null,
        gender: photo.gender || null,
        ethnicity: photo.ethnicity || null,
        businessUnitId: (photo.businessUnitId && !["general", "other", "all", "null"].includes(String(photo.businessUnitId).toLowerCase())) ? photo.businessUnitId : "",
      });
    }
  }, [photo]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const tag = formData.newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleClearAllTags = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [],
    }));
  };

  const prepareImageUrlForAnalysis = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const maxDimension = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

        resolve({
          imageDataUrl: dataUrl,
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });
  };

  const handleAnalyzeWithAI = async () => {
    const imageUrl = photo.fullImage || photo.thumbnail;
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const proxiedUrl = imageUrl.includes("s3.eu-central-1.amazonaws.com")
        ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
        : imageUrl;

      const { imageDataUrl, dimensions } = await prepareImageUrlForAnalysis(proxiedUrl);

      const response = await fetch("/api/ai/image-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "AI analysis failed");
      }

      const data = await response.json();
      const orientation = calculateOrientation(dimensions.width, dimensions.height);

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        tags: Array.from(new Set([...prev.tags, ...(data.tags || [])])),
        containsPeople: data.containsPeople ?? prev.containsPeople,
        orientation: orientation,
        gender: data.gender ?? prev.gender,
        ethnicity: data.ethnicity ?? prev.ethnicity,
      }));
    } catch (error) {
      setAiError(error.message || "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    const updatedPhoto = {
      ...photo,
      title: formData.title,
      description: formData.description,
      businessUnitId: formData.businessUnitId,
      category: formData.category,
      tags: formData.tags,
      containsPeople: formData.containsPeople,
      orientation: formData.orientation,
      gender: formData.gender,
      ethnicity: formData.ethnicity,
    };
    onSave(updatedPhoto);
  };

  const isValid = formData.title.trim() !== "" &&
                  formData.description.trim() !== "" &&
                  Array.isArray(formData.category) && formData.category.length > 0 &&
                  typeof formData.containsPeople === 'boolean' &&
                  formData.orientation !== null && formData.orientation !== "" &&
                  formData.gender !== null && formData.gender !== "" &&
                  formData.ethnicity !== null && formData.ethnicity !== "";

  if (!photo) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "95vw",
          maxWidth: 800,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          outline: "none",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Image Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={24} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={photo.thumbnail || photo.fullImage}
              alt={photo.title}
              sx={{
                width: { xs: "100%", sm: 200 },
                height: { xs: 180, sm: 150 },
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {photo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Update the details for this image
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Sparkle size={16} weight="fill" />}
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {isAnalyzing ? "Analyzing..." : "AI Analysis"}
              </Button>
            </Box>
          </Box>

          {aiError && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "error.lighter",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              <Typography variant="body2" color="error.main">
                {aiError}
              </Typography>
            </Box>
          )}

          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter a descriptive title"
              helperText="A clear, searchable title for this image"
            />

            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what's in this image"
              helperText="Help users understand what this image shows"
            />

            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.label}
              value={
                Array.isArray(formData.category)
                  ? categories.filter((cat) => formData.category.includes(cat.id))
                  : []
              }
              onChange={(event, newValue) => {
                handleChange("category", newValue.map((v) => v.id));
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
              value={businessUnits.find((bu) => bu.id === formData.businessUnitId) || null}
              onChange={(event, newValue) => {
                handleChange("businessUnitId", newValue ? newValue.id : "");
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
                  formData.containsPeople === null || formData.containsPeople === undefined
                    ? ""
                    : formData.containsPeople === true
                    ? "yes"
                    : "no"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "yes") {
                    handleChange("containsPeople", true);
                  } else if (value === "no") {
                    handleChange("containsPeople", false);
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
                value={formData.orientation || ""}
                onChange={(e) => handleChange("orientation", e.target.value)}
                label="Orientation"
              >
                <MenuItem value="Portrait">Portrait</MenuItem>
                <MenuItem value="Landscape">Landscape</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
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
                value={formData.ethnicity || ""}
                onChange={(e) => handleChange("ethnicity", e.target.value)}
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Tags
              </Typography>
              {formData.tags.length > 0 && (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{ borderRadius: 1.5 }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={handleClearAllTags}
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
                  options={[]}
                  value={formData.newTag}
                  onChange={(e, value) => handleChange("newTag", value || "")}
                  onInputChange={(e, value) => handleChange("newTag", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Type a tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                  )}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  sx={{ minWidth: "auto", px: 2 }}
                >
                  <Plus size={20} />
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Type and press Enter to add.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isValid}
            sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
