import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Trash, Sparkle } from "@phosphor-icons/react";
import PhotoMetadataForm from "./PhotoMetadataForm";
import BulkActions from "./BulkActions";

export default function PhotoDetailsSection({
  uploadedFiles,
  selectedFileIndex,
  filesMetadata,
  onUpdateMetadata,
  onAddTag,
  onRemoveTag,
  onClearAllTags,
  onAutoSuggestTags,
  onAnalyzeWithAI,
  aiLoading,
  aiError,
  existingTags,
  onApplyToAll,
  applyToAll,
  onRemoveFile,
  onStepChange,
  onBulkAnalyzeWithAI,
  onBulkCategoryAssign,
  bulkAiLoading,
  processingCount,
  bulkCategoryValue,
  onBulkCategoryChange,
  categories = [],
}) {
  const currentFile = uploadedFiles[selectedFileIndex];
  const currentMetadata = filesMetadata[selectedFileIndex];

  if (!currentFile) return null;

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        overflowY: "auto",
      }}
    >
      {uploadedFiles.length > 1 && (
        <BulkActions
          onAnalyzeAll={onBulkAnalyzeWithAI}
          onCategoryAssign={onBulkCategoryAssign}
          bulkAiLoading={bulkAiLoading}
          processingCount={processingCount}
          totalCount={uploadedFiles.length}
          categoryValue={bulkCategoryValue}
          onCategoryChange={onBulkCategoryChange}
          categories={categories}
        />
      )}

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
          src={currentFile.preview}
          alt="Preview"
          sx={{
            width: { xs: "100%", sm: 240 },
            height: { xs: 180, sm: 160 },
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
              Image {selectedFileIndex + 1} of {uploadedFiles.length}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Sparkle size={16} weight="fill" />}
                onClick={onAnalyzeWithAI}
                disabled={aiLoading}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {aiLoading ? "Analyzing..." : "AI Analysis"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Trash size={16} />}
                onClick={() => {
                  if (uploadedFiles.length === 1) {
                    onRemoveFile(selectedFileIndex);
                    onStepChange(0);
                  } else {
                    onRemoveFile(selectedFileIndex);
                  }
                }}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentFile.name}
          </Typography>
        </Box>
      </Box>

      <PhotoMetadataForm
        metadata={currentMetadata}
        onUpdate={onUpdateMetadata}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onClearAllTags={onClearAllTags}
        onAutoSuggestTags={onAutoSuggestTags}
        onAnalyzeWithAI={onAnalyzeWithAI}
        aiLoading={aiLoading}
        aiError={aiError}
        existingTags={existingTags}
        showApplyToAll={uploadedFiles.length > 1}
        onApplyToAll={onApplyToAll}
        applyToAll={applyToAll}
        categories={categories}
        businessUnitId={currentMetadata?.businessUnitId || ""}
      />
    </Box>
  );
}
