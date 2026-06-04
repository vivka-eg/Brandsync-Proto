import { useState, useCallback } from "react";
import { prepareImageForAnalysis, calculateOrientation } from "@/utils/imageUtils";

export function useAIAnalysis() {
  const [aiLoading, setAiLoading] = useState({});
  const [aiError, setAiError] = useState({});
  const [bulkAiLoading, setBulkAiLoading] = useState(false);

  const analyzeWithAI = useCallback(async (file, index) => {
    if (!file) return null;

    setAiLoading((prev) => ({ ...prev, [index]: true }));
    setAiError((prev) => ({ ...prev, [index]: null }));

    try {
      const { imageDataUrl, dimensions } = await prepareImageForAnalysis(file);

      const response = await fetch("/api/ai/image-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || "AI analysis failed"
        );
      }

      const data = await response.json();

      const orientation = calculateOrientation(dimensions.width, dimensions.height);

      return {
        title: data.title || null,
        description: data.description || "",
        tags: data.tags || [],
        containsPeople: data.containsPeople ?? null,
        orientation: orientation,
        dimensions: dimensions,
        gender: data.gender ?? null,
        ethnicity: data.ethnicity ?? null,
      };
    } catch (error) {
      setAiError((prev) => ({ ...prev, [index]: error.message }));
      return null;
    } finally {
      setAiLoading((prev) => ({ ...prev, [index]: false }));
    }
  }, []);

  const bulkAnalyzeWithAI = useCallback(
    async (uploadedFiles, filesMetadata, setFilesMetadata) => {
      if (uploadedFiles.length === 0) return;

      setBulkAiLoading(true);
      setAiError({});

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]?.file;
        if (!file) continue;

        setAiLoading((prev) => ({ ...prev, [i]: true }));

        try {
          const { imageDataUrl, dimensions } = await prepareImageForAnalysis(
            file
          );

          const response = await fetch("/api/ai/image-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageDataUrl }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.details || errorData.error || "AI analysis failed"
            );
          }

          const data = await response.json();

          const orientation = calculateOrientation(dimensions.width, dimensions.height);

          setFilesMetadata((prev) => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              title:
                updated[i].title || data.title || "",
              description: updated[i].description || data.description || "",
              tags: Array.from(
                new Set([...updated[i].tags, ...(data.tags || [])])
              ),
              containsPeople: data.containsPeople ?? null,
              orientation: orientation,
              dimensions: dimensions,
              gender: data.gender ?? null,
              ethnicity: data.ethnicity ?? null,
            };
            return updated;
          });
        } catch (error) {
          setAiError((prev) => ({ ...prev, [i]: error.message }));
        } finally {
          setAiLoading((prev) => ({ ...prev, [i]: false }));
        }

        if (i < uploadedFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      setBulkAiLoading(false);
    },
    []
  );

  return {
    aiLoading,
    aiError,
    bulkAiLoading,
    analyzeWithAI,
    bulkAnalyzeWithAI,
  };
}
