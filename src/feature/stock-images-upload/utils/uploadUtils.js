import { uploadDigitalAsset } from "@/api/assets/digital-assets";

export const uploadPhotosSequentially = async (
  uploadedFiles,
  filesMetadata,
  setUploadProgress
) => {
  const initialProgress = {};
  uploadedFiles.forEach((_, index) => {
    initialProgress[index] = { status: "pending", progress: 0 };
  });
  setUploadProgress(initialProgress);

  let allSuccess = true;

  for (let index = 0; index < uploadedFiles.length; index++) {
    const fileObj = uploadedFiles[index];
    const metadata = filesMetadata[index];

    setUploadProgress((prev) => ({
      ...prev,
      [index]: { status: "uploading", progress: 10 },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress((prev) => ({
        ...prev,
        [index]: { status: "uploading", progress: 30 },
      }));

      const result = await uploadDigitalAsset({
        file: fileObj.file,
        title: metadata.title,
        description: metadata.description,
        businessUnitId: metadata.businessUnitId,
        category: metadata.category,
        tags: metadata.tags || [],
        containsPeople: metadata.containsPeople,
        orientation: metadata.orientation,
        dimensions: metadata.dimensions,
        gender: metadata.gender,
        ethnicity: metadata.ethnicity,
      });

      setUploadProgress((prev) => ({
        ...prev,
        [index]: { status: "uploading", progress: 80 },
      }));

      if (!result.success) {
        const errorMsg = result.details?.error?.details?.errors
          ? JSON.stringify(result.details.error.details.errors)
          : result.error;
        throw new Error(errorMsg);
      }

      setUploadProgress((prev) => ({
        ...prev,
        [index]: { status: "success", progress: 100 },
      }));
    } catch (error) {
      allSuccess = false;
      setUploadProgress((prev) => ({
        ...prev,
        [index]: { status: "error", progress: 0, error: error.message },
      }));
    }

    if (index < uploadedFiles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return allSuccess;
};

export const isStepValid = (step, files, metadata) => {
  if (step === 0) {
    return files.length > 0;
  }

  if (step === 1) {
    return metadata.every(
      (m) =>
        m.title?.trim() &&
        m.description?.trim() &&
        Array.isArray(m.category) && m.category.length > 0 &&
        typeof m.containsPeople === 'boolean' &&
        m.orientation !== null && m.orientation !== "" &&
        m.gender !== null && m.gender !== "" &&
        m.ethnicity !== null && m.ethnicity !== ""
    );
  }

  return true;
};
