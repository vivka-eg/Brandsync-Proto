export const prepareImageForAnalysis = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

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

      URL.revokeObjectURL(url);

      resolve({
        imageDataUrl: dataUrl,
        dimensions: { width: img.naturalWidth, height: img.naturalHeight },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

/**
 * Calculate orientation from image dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} "Portrait" or "Landscape"
 */
export const calculateOrientation = (width, height) => {
  if (!width || !height) return "Landscape"; // Default to Landscape if dimensions not available
  return height > width ? "Portrait" : "Landscape";
};

export const generateSmartSuggestions = (title, currentTags) => {
  const titleLower = title.toLowerCase();
  const suggestedTags = [];

  const keywords = {
    construction: [
      "construction",
      "building",
      "site",
      "crane",
      "worker",
      "drill",
    ],
    industrial: [
      "factory",
      "machine",
      "industrial",
      "manufacturing",
      "assembly",
    ],
    energy: ["solar", "wind", "power", "energy", "turbine", "electric"],
    healthcare: [
      "health",
      "medical",
      "hospital",
      "care",
      "patient",
      "nurse",
      "doctor",
    ],
    corporate: ["office", "business", "meeting", "corporate", "team"],
    safety: ["safety", "helmet", "hardhat", "protective", "gear"],
    worker: ["worker", "employee", "staff", "technician", "engineer"],
  };

  Object.entries(keywords).forEach(([tag, words]) => {
    if (words.some((word) => titleLower.includes(word))) {
      suggestedTags.push(tag);
    }
  });

  return suggestedTags.filter((tag) => !currentTags.includes(tag));
};
