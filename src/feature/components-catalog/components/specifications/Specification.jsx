"use client";
import { Box, Radio, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeviceTypes from "@/components/shared/DeviceTabs";
import Image from "next/image";
import LazyImage from "@/components/shared/LazyImage";
import MeasurementsPanel from "./MeasurementsPanel";
import Dropdown from "@/components/shared/Dropdown";
import { getStrapiURL } from "@/strapi/utils";
import CustomSwitch from "@/components/shared/CustomSwitch";
import RadioOptionSelector from "./RadioOptionSelector";

function getSizeFilterToggleButtonsValues(Specification) {
  const hasSizeValue = Specification.SpecificationSizePresent;
  const hasFilterCategories = Specification.SpecificationFilterPresent;
  const isToggle = Specification.ToggleButtonPresent;
  const isRadio = Specification.RadioButtonPresent;
  const isToggleRadio = isToggle || isRadio;

  const sizeValues = hasSizeValue
    ? Specification.SpecificationElement.map((item) => item.SizeValue)
    : null;

  const filterCategories = hasFilterCategories
    ? [
        ...new Set(
          Specification.SpecificationElement[0].Measurements.map(
            (item) => item.FilterCategories
          )
        ),
      ]
    : null;

  const toggleButtonsValues = isToggleRadio
    ? [
        ...new Set(
          Specification.SpecificationElement[0].Measurements.map(
            (item) => item.RadioOrToggleOptions
          )
        ),
      ]
    : null;

  return {
    hasSizeValue,
    hasFilterCategories,
    isToggleRadio,
    isToggle,
    isRadio,
    sizeValues,
    filterCategories,
    toggleButtonsValues,
  };
}

function SpecificationCard({ Specification }) {
  // Early return if Specification is null or doesn't have SpecificationElement
  if (
    !Specification ||
    !Specification.SpecificationElement ||
    Specification.SpecificationElement.length === 0
  ) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No specification data available
        </Typography>
      </Box>
    );
  }

  const {
    sizeValues,
    filterCategories,
    toggleButtonsValues,
    hasSizeValue,
    hasFilterCategories,
    isToggleRadio,
    isToggle,
    isRadio,
  } = getSizeFilterToggleButtonsValues(Specification);

  const [sizeValue, setSizeValue] = useState(sizeValues ? sizeValues[0] : null);

  const [filterCategory, setFilterCategory] = useState(
    filterCategories ? filterCategories[0] : null
  );

  const [toggleButtonValue, setToggleButtonValue] = useState(
    toggleButtonsValues ? toggleButtonsValues[0] : null
  );

  const [measurements, setMeasurements] = useState();

  // toggler for switch options :
  const handleToggle = (side, value, enabled) => {
    if (side === "left") {
      if (!enabled) {
        setToggleButtonValue(toggleButtonsValues[2]);
      } else {
        setToggleButtonValue(toggleButtonsValues[0]);
      }
    }

    if (side === "right") {
      if (!enabled) {
        setToggleButtonValue(toggleButtonsValues[2]);
      } else {
        setToggleButtonValue(toggleButtonsValues[1]);
      }
    }
  };

  useEffect(() => {
    let measurement = null;

    // 0 0 0
    if (!hasSizeValue && !hasFilterCategories && !isToggleRadio) {
      measurement = Specification.SpecificationElement[0]?.Measurements?.[0];
    }
    // 0 0 1
    else if (!hasSizeValue && !hasFilterCategories && isToggleRadio) {
      measurement =
        Specification.SpecificationElement[0]?.Measurements?.find(
          (item) => item.RadioOrToggleOptions === toggleButtonValue
        );
    }
    // 0 1 0
    else if (!hasSizeValue && hasFilterCategories && !isToggleRadio) {
      measurement =
        Specification.SpecificationElement[0]?.Measurements?.find(
          (item) => item.FilterCategories === filterCategory
        );
    }

    // 0 1 1
    else if (!hasSizeValue && hasFilterCategories && isToggleRadio) {
      measurement =
        Specification.SpecificationElement[0]?.Measurements?.find(
          (item) =>
            item.FilterCategories === filterCategory &&
            item.RadioOrToggleOptions === toggleButtonValue
        );
    }

    // 1 0 0
    else if (hasSizeValue && !hasFilterCategories && !isToggleRadio) {
      const specElement = Specification.SpecificationElement.find(
        (item) => item.SizeValue === sizeValue
      );
      measurement = specElement?.Measurements?.[0];
    }

    // 1 0 1
    else if (hasSizeValue && !hasFilterCategories && isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.SizeValue === sizeValue
      );
      measurement = measurementResult1?.Measurements?.find(
        (item) => item.RadioOrToggleOptions === toggleButtonValue
      );
    }

    // 1 1 0
    else if (hasSizeValue && hasFilterCategories && !isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.SizeValue === sizeValue
      );
      measurement = measurementResult1?.Measurements?.find(
        (item) => item.FilterCategories === filterCategory
      );
    }

    // 1 1 1
    else if (hasSizeValue && hasFilterCategories && isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.SizeValue === sizeValue
      );
      measurement = measurementResult1?.Measurements?.find(
        (item) =>
          item.FilterCategories === filterCategory &&
          item.RadioOrToggleOptions === toggleButtonValue
      );
    }

    setMeasurements(measurement);
  }, [sizeValue, filterCategory, toggleButtonValue]);

  return (
    <Box>
      {/* title */}
      <Typography variant="h5" fontWeight={600} color="text.primary">
        Measurements
      </Typography>

      {/* tabs and dropdown */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          marginTop: 2,
          borderColor: "divider",
          paddingBottom: 1,
        }}
      >
        {/* tabs */}
        {hasSizeValue && (
          <DeviceTypes
            active={sizeValue}
            setActive={setSizeValue}
            deviceTypes={sizeValues.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        )}
      </Box>

      {/* content */}
      {/* content */}
      {!measurements ? (
        <Box sx={{ p: 3, textAlign: "center", mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No measurement data available for the selected options. Please try a different combination.
          </Typography>
        </Box>
      ) : (
        <Stack
          direction={"row"}
          marginTop={2}
          sx={{
            position: "relative",
            minHeight: "100vh", // Add minimum height
            alignItems: "flex-start", // Align items to top
            gap: 2,
            "@media (max-width: 700px)": {
              flexDirection: "column",
            },
          }}
        >
          {/* left part (image) */}
          <Box
            sx={{ width: "50%", "@media (max-width: 700px)": { width: "100%" } }}
          >
            <Box sx={{ width: "100%" }}>
              <LazyImage
                src={getStrapiURL(measurements?.Image)}
                alt="Specification"
                width={100}
                height={100}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
          {isToggle && (
            <Stack
              direction={"row"}
              spacing={2}
              padding={2}
              paddingLeft={0}
              sx={{
                borderColor: "divider",
              }}
            >
              {[
                {
                  value: toggleButtonsValues[0],
                  side: "left",
                },
                {
                  value: toggleButtonsValues[1],
                  side: "right",
                },
              ].map((item, index) => (
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems="center"
                  key={index}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.value}
                  </Typography>
                  <CustomSwitch
                    checked={item.value === toggleButtonValue}
                    onChange={(e) => {
                      handleToggle(item.side, item.value, e.target.checked);
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          )}
          {isRadio && (
            <RadioOptionSelector
              radioButtonsValues={toggleButtonsValues}
              radioButtonValue={toggleButtonValue}
              setRadioButtonValue={setToggleButtonValue}
            />
          )}
        </Box>

        {/* right part (text) - Fixed sticky positioning */}
        <Box
          sx={{
            width: "50%",
            position: "sticky",
            top: "20px", // Add some offset from top
            alignSelf: "flex-start", // Important for sticky to work in flex
            maxHeight: "calc(100vh - 40px)", // Prevent overflow
            overflowY: "auto", // Add scroll if content is too tall
            "@media (max-width: 700px)": { width: "100%" },
          }}
        >
          {/* dropdown */}
          {hasFilterCategories && (
            <Dropdown
              values={filterCategories.map((item) => ({
                label: item,
                value: item,
              }))}
              selectedValue={filterCategory}
              onChange={(e) => {
                // console.log("Selected Value:", e);
                setFilterCategory(e.target.value);
              }}
              label="Choose the filter category"
              sx={{ width: "200px" }}
            />
          )}

          {measurements && (
            <MeasurementsPanel measurements={measurements.MeasureElements} />
          )}
        </Box>
      </Stack>
      )}
    </Box>
  );
}

export default SpecificationCard;
