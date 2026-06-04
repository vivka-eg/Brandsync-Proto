"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Sparkle } from "phosphor-react";
import {
  Box,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import Image from "next/image";
import CustomTextField from "@/components/shared/CustomTextField";
import DropdownChip from "@/components/shared/DropdownChip";
import { useIconsUploadContext } from "../context/IconsUploadContext";
import Dropdown from "@/components/shared/Dropdown";
import ChipSelectAutocomplete from "@/components/shared/ChipSelectAutocomplete";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";

async function fetchIconMetadata(file) {
  const res = await fetch("/api/ai/icon-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name }),
  });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  return res.json(); // { name, tags }
}

const EachIconDetail = ({ icon, selectedIcons, setSelectedIcons, index }) => {
  const { setIcons, icons } = useIconsUploadContext();
  const { categories, iconTypes } = useIconTypesAndCategoryContext();
  const [aiLoading, setAiLoading] = useState(false);
  const calledRef = useRef(false);

  const runAI = useCallback(async () => {
    if (!icon.file || aiLoading) return;
    setAiLoading(true);
    try {
      const { name, tags } = await fetchIconMetadata(icon.file);
      setIcons((prev) => {
        const updated = [...prev];
        if (name) updated[index].name = name;
        if (tags?.length) updated[index].tags = tags;
        return updated;
      });
    } catch (err) {
      console.error("[EachIconDetail] AI error:", err);
    } finally {
      setAiLoading(false);
    }
  }, [icon.file, index, setIcons, aiLoading]);

  // Auto-run once on mount
  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      runAI();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIconSelectChange = (e) => {
    if (e.target.checked) {
      setSelectedIcons([...selectedIcons, index]);
    } else {
      setSelectedIcons(selectedIcons.filter((i) => i !== index));
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        border: "1px solid",
        borderColor: icon.error.categories || icon.error.iconType || icon.error.tags
          ? "error.main"
          : "divider",
        borderRadius: "12px",
        p: 1.5,
        width: "100%",
        opacity: aiLoading ? 0.75 : 1,
        transition: "opacity 0.2s, border-color 0.2s",
      }}
    >
      {/* Checkbox */}
      <Box sx={{ pt: "6px", flexShrink: 0 }}>
        <CustomCheckbox
          checked={selectedIcons.includes(index)}
          onChange={handleIconSelectChange}
        />
      </Box>

      {/* Icon preview */}
      <Box
        sx={{
          width: 44,
          height: 44,
          bgcolor: "neutral.light",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: "2px",
        }}
      >
        <Image src={icon.url} width={24} height={24} alt="" />
      </Box>

      {/* All fields in a single row */}
      <Stack direction="row" spacing={1} flex={1} minWidth={0} alignItems="flex-start">
        {/* Title */}
        <Box sx={{ flex: "0 0 180px" }}>
          <CustomTextField
            value={icon.name.includes(".") ? icon.name.split(".")[0] : icon.name}
            label="Title"
            helperText=""
            onChange={(e) => {
              setIcons((prev) => {
                const updated = [...prev];
                updated[index].name = e.target.value;
                return updated;
              });
            }}
          />
        </Box>

        {/* Categories */}
        <DropdownChip
          categories={categories}
          label="Categories"
          value={icon.categories}
          onChange={(newValue) => {
            setIcons((prev) => {
              const updated = [...prev];
              updated[index].categories = newValue;
              return updated;
            });
          }}
          error={icon.error.categories}
          required
          errorMsg="At least one category is required"
          sx={{ flex: 1 }}
        />

        {/* Icon Type */}
        <Dropdown
          values={iconTypes.map((each) => ({ label: each.label, value: each.id }))}
          selectedValue={icon.iconType ? icon.iconType.id : ""}
          onChange={(e) => {
            setIcons((prev) => {
              const updated = [...prev];
              const selectedType = iconTypes.find((t) => t.id === e.target.value);
              updated[index].iconType = selectedType || null;
              return updated;
            });
          }}
          label="Icon Type"
          error={icon.error.iconType}
          required
          errorMsg="Icon type is required"
          sx={{ flex: 1, m: 0 }}
        />

        {/* Tags */}
        <Box sx={{ flex: 1.5 }}>
          <ChipSelectAutocomplete
            label="Tags"
            value={icon.tags}
            onChange={(newValue) => {
              setIcons((prev) => {
                const updated = [...prev];
                updated[index].tags = newValue;
                return updated;
              });
            }}
            placeholder="Type and press Enter…"
            error={icon.error.tags}
            required
            errorMsg="At least one tag is required"
          />
        </Box>

        {/* AI button */}
        <Tooltip title={aiLoading ? "Identifying icon…" : "Auto-fill with AI"}>
          <Box
            onClick={aiLoading ? undefined : runAI}
            sx={{
              mt: "22px",
              height: "42px",
              width: "42px",
              flexShrink: 0,
              bgcolor: "neutral.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              cursor: aiLoading ? "not-allowed" : "pointer",
              "&:hover": { bgcolor: aiLoading ? "neutral.light" : "action.hover" },
              transition: "background-color 0.15s",
            }}
          >
            {aiLoading ? (
              <CircularProgress size={18} thickness={4} />
            ) : (
              <Sparkle size={20} weight="bold" />
            )}
          </Box>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default EachIconDetail;
