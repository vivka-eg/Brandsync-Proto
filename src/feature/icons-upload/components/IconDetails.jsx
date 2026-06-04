"use client";
import { useIconsUploadContext } from "../context/IconsUploadContext";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import EachIconDetail from "./EachIconDetail";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import DropdownChip from "@/components/shared/DropdownChip";
import Dropdown from "@/components/shared/Dropdown";
import CustomIconButton from "@/components/shared/IconButton";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { Sparkle } from "phosphor-react";
import { Box } from "@mui/material";

const AllIconsSelectionSection = ({ selectedIcons, setSelectedIcons }) => {
  const { icons, setIcons } = useIconsUploadContext();
  const { categories, iconTypes } = useIconTypesAndCategoryContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIconType, setSelectedIconType] = useState("");
  const [generatingTags, setGeneratingTags] = useState(false);

  const noneSelected = selectedIcons.length === 0;

  const handleCategoryChange = (newValue) => {
    setSelectedCategories(newValue);
    setIcons((prevIcons) =>
      prevIcons.map((icon, index) =>
        selectedIcons.includes(index) ? { ...icon, categories: newValue } : icon
      )
    );
  };

  const handleIconTypeChange = (e) => {
    const selectedType = iconTypes.find((type) => type.id === e.target.value);
    setSelectedIconType(selectedType);
    setIcons((prevIcons) =>
      prevIcons.map((icon, index) =>
        selectedIcons.includes(index) ? { ...icon, iconType: selectedType } : icon
      )
    );
  };

  const handleGenerateTags = async () => {
    if (noneSelected || generatingTags) return;
    setGeneratingTags(true);
    try {
      const results = await Promise.allSettled(
        selectedIcons.map(async (iconIndex) => {
          const icon = icons[iconIndex];
          const res = await fetch("/api/ai/icon-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: icon.file.name }),
          });
          if (!res.ok) throw new Error(`AI request failed (${res.status})`);
          return { iconIndex, ...(await res.json()) };
        })
      );

      setIcons((prev) => {
        const updated = [...prev];
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value.tags?.length) {
            updated[result.value.iconIndex] = {
              ...updated[result.value.iconIndex],
              tags: result.value.tags,
            };
          }
        });
        return updated;
      });
    } catch (err) {
      console.error("[GenerateTags] error:", err);
    } finally {
      setGeneratingTags(false);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      sx={{
        px: 2,
        py: 1,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      {/* Select all */}
      <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
        <CustomCheckbox
          checked={selectedIcons.length === icons.length && icons.length > 0}
          onChange={(e) => {
            setSelectedIcons(e.target.checked ? icons.map((_, i) => i) : []);
          }}
          indeterminate={
            selectedIcons.length > 0 && selectedIcons.length < icons.length
          }
        />
        <Typography variant="caption" fontWeight={500} color="text.secondary" noWrap>
          {noneSelected
            ? "Select to bulk-edit"
            : `${selectedIcons.length} / ${icons.length} selected`}
        </Typography>
      </Stack>

      {/* Divider */}
      <Box sx={{ width: "1px", height: 28, bgcolor: "divider", flexShrink: 0 }} />

      {/* Bulk fields — no labels, placeholders handle context */}
      <DropdownChip
        categories={categories}
        label=""
        value={selectedCategories}
        onChange={handleCategoryChange}
        disabled={noneSelected}
        sx={{ flex: 1, maxWidth: 280 }}
      />
      <Dropdown
        values={iconTypes.map((each) => ({ label: each.label, value: each.id }))}
        selectedValue={selectedIconType ? selectedIconType.id : ""}
        onChange={handleIconTypeChange}
        disabled={noneSelected}
        label={null}
        sx={{ flex: 1, maxWidth: 220, m: 0 }}
      />
      <CustomIconButton
        text={generatingTags ? "Generating…" : "Generate Tags"}
        Icon={Sparkle}
        variant="secondary"
        onClick={handleGenerateTags}
        disabled={noneSelected || generatingTags}
      />
    </Stack>
  );
};

function IconDetails() {
  const { icons } = useIconsUploadContext();
  const [selectedIcons, setSelectedIcons] = useState([]);

  return (
    <Stack spacing={2}>
      {/* header section to control all the icons together*/}
      <AllIconsSelectionSection
        selectedIcons={selectedIcons}
        setSelectedIcons={setSelectedIcons}
      />
      {/* icons details  */}
      <Stack spacing={2}>
        {icons.map((icon, index) => (
          <EachIconDetail
            key={index}
            icon={icon}
            selectedIcons={selectedIcons}
            setSelectedIcons={setSelectedIcons}
            index={index}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default IconDetails;
