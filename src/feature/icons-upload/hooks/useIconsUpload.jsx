"use client";

import { bulkPublishIcons, uploadIcons } from "@/api/icons/icons";
import { useToast } from "@/context/shared/ToastContext";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { clearIconsCache } from "@/feature/icons/hooks/useHomePageIcons";
import { useRouter } from "next/navigation";
import { useState } from "react";

function useIconsUpload() {
  const [icons, setIcons] = useState([]);
  const { setToast } = useToast();
  const { categories: allCategories, iconTypes: allIconTypes } = useIconTypesAndCategoryContext();
  const [successfulUpload, setSuccessfulUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const router = useRouter();

  const removeIconByIndex = (index) => {
    setIcons((prevIcons) => prevIcons.filter((_, i) => i !== index));
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadIconsToBackend = async () => {
    setIsUploading(true);
    setUploadProgress({ current: 0, total: icons.length });

    const uploadedIds = [];

    // Upload one icon at a time to avoid large payload failures
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      setUploadProgress({ current: i + 1, total: icons.length });

      let base64Content;
      try {
        base64Content = await toBase64(icon.file);
      } catch {
        setToast({
          open: true,
          type: "error",
          message: `Failed to read "${icon.name}".`,
          variant: "filled",
        });
        setIsUploading(false);
        return;
      }

      // Resolve numeric IDs from the fresh context lists (stored objects may lack numericId)
      const categoryIds = icon.categories
        .map((cat) => {
          const match = allCategories.find((c) => c.id === cat.id);
          return match?.numericId ?? cat.numericId;
        })
        .filter((id) => id != null)
        .join(",");

      const resolvedType = allIconTypes.find((t) => t.id === icon.iconType?.id);
      const typeId = String(resolvedType?.numericId ?? resolvedType?.id ?? icon.iconType?.numericId ?? icon.iconType?.id ?? "");

      if (!categoryIds) {
        setToast({
          open: true,
          type: "error",
          message: `"${icon.name}" is missing a category. Go back to step 2 and select a category.`,
          variant: "filled",
        });
        setIsUploading(false);
        return;
      }

      if (!typeId || typeId === "undefined") {
        setToast({
          open: true,
          type: "error",
          message: `"${icon.name}" is missing icon type. Go back to step 2 and fill in all fields.`,
          variant: "filled",
        });
        setIsUploading(false);
        return;
      }

      const payload = {
        files: [{ name: icon.file.name, content: base64Content }],
        tags: [icon.tags.join(",")],
        categories: [categoryIds],
        types: [typeId],
      };

      try {
        const data = await uploadIcons(payload, false);

        const iconId = data.documentIds?.[0] ?? data.id?.[0] ?? data.id;
        if (iconId) uploadedIds.push(iconId);
      } catch (err) {
        const errData = err?.response?.data;
        const message =
          (typeof errData === "string" ? errData : null) ||
          errData?.error?.message ||
          errData?.message ||
          (typeof errData?.error === "string" ? errData.error : null) ||
          err?.message ||
          "Upload failed";
        setToast({
          open: true,
          type: "error",
          message: `Failed to upload "${icon.name}": ${message}`,
          variant: "filled",
        });
        setIsUploading(false);
        return;
      }
    }

    setIcons(icons.map((icon, index) => ({ ...icon, id: uploadedIds[index] })));

    try {
      await bulkPublishIcons(uploadedIds, "PUBLISHED");
      clearIconsCache();
      setSuccessfulUpload(true);

      setToast({
        open: true,
        type: "success",
        message: `${uploadedIds.length} icon${uploadedIds.length !== 1 ? "s" : ""} uploaded & published successfully.`,
        variant: "filled",
      });

      setTimeout(() => {
        setToast({ open: false, type: "info", message: "Redirecting to dashboard...", variant: "filled" });
      }, 1000);

      setTimeout(() => {
        router.push("/digital-assets/icons/admin");
      }, 2000);
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Icons uploaded but failed to publish. Please try publishing manually.",
        variant: "filled",
      });
    }

    setIsUploading(false);
  };

  return {
    icons,
    setIcons,
    removeIconByIndex,
    uploadIconsToBackend,
    successfulUpload,
    isUploading,
    uploadProgress,
  };
}

export default useIconsUpload;
