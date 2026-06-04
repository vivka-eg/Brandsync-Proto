import { useState, useCallback } from "react";

const MAX_FILES = 5;

export function usePhotoUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesMetadata, setFilesMetadata] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [uploadLimitError, setUploadLimitError] = useState(null);

  const processFiles = useCallback(async (files, defaultCategory = []) => {
    setUploadLimitError(null);

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const currentCount = uploadedFiles.length;
    const availableSlots = MAX_FILES - currentCount;

    if (availableSlots <= 0) {
      setUploadLimitError(
        `Maximum ${MAX_FILES} photos allowed per upload. Please remove some photos first.`
      );
      return;
    }

    if (imageFiles.length > availableSlots) {
      setUploadLimitError(
        `Only ${availableSlots} more photo${
          availableSlots !== 1 ? "s" : ""
        } can be added. Maximum ${MAX_FILES} photos per upload.`
      );
      imageFiles.splice(availableSlots);
    }

    const newFiles = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    const newMetadata = imageFiles.map((file) => ({
      title: "",
      description: "",
      businessUnitId: "",
      category: defaultCategory.length > 0 ? [...defaultCategory] : [],
      tags: [],
      newTag: "",
      containsPeople: null,
      orientation: null,
      dimensions: null,
      gender: null,
      ethnicity: null,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles.slice(0, availableSlots)]);
    setFilesMetadata((prev) => [...prev, ...newMetadata.slice(0, availableSlots)]);
  }, [uploadedFiles.length]);

  const handleRemoveFile = useCallback((index) => {
    setUploadedFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
    setFilesMetadata((prev) => prev.filter((_, i) => i !== index));
    setSelectedFileIndex((prev) => {
      if (prev >= index && prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const updateMetadata = useCallback((index, field, value) => {
    setFilesMetadata((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const clearUploadLimitError = useCallback(() => {
    setUploadLimitError(null);
  }, []);

  return {
    uploadedFiles,
    filesMetadata,
    selectedFileIndex,
    uploadLimitError,
    processFiles,
    handleRemoveFile,
    updateMetadata,
    setSelectedFileIndex,
    setFilesMetadata,
    clearUploadLimitError,
    MAX_FILES,
  };
}
