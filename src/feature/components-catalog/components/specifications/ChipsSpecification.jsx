"use client";
import { Box, Radio, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import DeviceTypes from "@/components/shared/DeviceTabs";
import Image from "next/image";
import LazyImage from "@/components/shared/LazyImage";
import MeasurementsPanel from "./MeasurementsPanel";
import Dropdown from "./Dropdown";
import { getStrapiURL } from "@/strapi/utils";
import CustomSwitch from "@/components/shared/CustomSwitch";
import RadioOptionSelector from "./RadioOptionSelector";

function useSizeFilterToggleButtonsValues(Specification) {
  // Checking if Specification has size, filter categories, and toggle/radio options :
  const hasSizeValue = useMemo(
    () => Specification.SpecificationSizePresent,
    [Specification]
  );
  const hasFilterCategories = useMemo(
    () => Specification.SpecificationFilterPresent,
    [Specification]
  );
  const isToggle = useMemo(
    () => Specification.ToggleButtonPresent,
    [Specification]
  );
  const isRadio = useMemo(
    () => Specification.RadioButtonPresent,
    [Specification]
  );
  const isToggleRadio = isToggle || isRadio;

  // Extracting values from Specification for size, filter categories, and toggle/radio options
  const [sizeValues, setSizeValues] = useState([
    ...new Set(
      Specification.SpecificationElement[0].Measurements.map((item) =>
        item.SizeValue?.trim()
      )
    ),
  ]);

  const filterCategories = hasFilterCategories
    ? [
        ...new Set(
          Specification.SpecificationElement.map((item) =>
            item.DropdownValue?.trim()
          )
        ),
      ]
    : null;

  const [toggleButtonsValues, setToggleButtonsValues] = useState(
    isToggleRadio
      ? [
          ...new Set(
            Specification.SpecificationElement[0].Measurements.map((item) =>
              item.RadioOrToggleOptions?.trim()
            ).filter((item) => item)
          ),
        ]
      : null
  );

  // console.log(sizeValues, filterCategories, toggleButtonsValues);

  // states used to manage the selected values :
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
    // 0 0 0
    if (!hasSizeValue && !hasFilterCategories && !isToggleRadio) {
      const measurement = Specification.SpecificationElement[0].Measurements[0];
      setMeasurements(measurement);
    }
    // 0 0 1
    else if (!hasSizeValue && !hasFilterCategories && isToggleRadio) {
      const measurement =
        Specification.SpecificationElement[0].Measurements.find(
          (item) => item.RadioOrToggleOptions.trim() === toggleButtonValue
        );
      setMeasurements(measurement);
    }
    // 0 1 0
    else if (!hasSizeValue && hasFilterCategories && !isToggleRadio) {
      const measurement = Specification.SpecificationElement.find(
        (item) => item.DropdownValue.trim() === filterCategory
      )?.Measurements[0];
      setMeasurements(measurement);
    }

    // 0 1 1
    else if (!hasSizeValue && hasFilterCategories && isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.DropdownValue.trim() === filterCategory
      );

      const measurement = measurementResult1?.Measurements.find(
        (item) => item.RadioOrToggleOptions.trim() === toggleButtonValue
      );

      setMeasurements(measurement);
    }

    // 1 0 0
    else if (hasSizeValue && !hasFilterCategories && !isToggleRadio) {
      const measurement =
        Specification.SpecificationElement[0].Measurements.find(
          (item) => item.SizeValue.trim() === sizeValue
        );
      setMeasurements(measurement);
    }

    // 1 0 1
    else if (hasSizeValue && !hasFilterCategories && isToggleRadio) {
      // console.log("This-----");

      const measurement = Specification.SpecificationElement[0].find(
        (item) =>
          item.SizeValue.trim() === sizeValue &&
          item.RadioOrToggleOptions.trim() === toggleButtonValue
      );

      setMeasurements(measurement);
    }

    // 1 1 0
    else if (hasSizeValue && hasFilterCategories && !isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.DropdownValue.trim() === filterCategory
      );
      const measurement = measurementResult1.Measurements.find(
        (item) => item.SizeValue.trim() === sizeValue
      );
      setMeasurements(measurement);
    }

    // 1 1 1
    else if (hasSizeValue && hasFilterCategories && isToggleRadio) {
      const measurementResult1 = Specification.SpecificationElement.find(
        (item) => item.DropdownValue.trim() === filterCategory
      );
      const measurement = measurementResult1.Measurements.find(
        (item) =>
          item.SizeValue.trim() === sizeValue &&
          item.RadioOrToggleOptions.trim() === toggleButtonValue
      );
      setMeasurements(measurement);
    }
  }, [sizeValue, filterCategory, toggleButtonValue]);

  useEffect(() => {
    const selectedSpecificationElement =
      Specification.SpecificationElement.find(
        ({ DropdownValue }) => DropdownValue.trim() === filterCategory
      );
    const sizeValues = selectedSpecificationElement
      ? [
          ...new Set(
            selectedSpecificationElement.Measurements.map((item) =>
              item.SizeValue.trim()
            )
          ),
        ]
      : [];

    const toggleButtonsValues = selectedSpecificationElement
      ? [
          ...new Set(
            selectedSpecificationElement.Measurements.map((item) =>
              item.RadioOrToggleOptions?.trim()
            )
          ),
        ]
      : [];

    setSizeValues(sizeValues);
    setSizeValue(sizeValues[0]);
    setToggleButtonsValues(toggleButtonsValues);
    setToggleButtonValue(toggleButtonsValues[0]);
  }, [filterCategory]);

  return {
    hasSizeValue,
    hasFilterCategories,
    isToggleRadio,
    isToggle,
    isRadio,
    sizeValues,
    filterCategories,
    toggleButtonsValues,
    sizeValue,
    setSizeValue,
    filterCategory,
    setFilterCategory,
    toggleButtonValue,
    setToggleButtonValue,
    measurements,
    setMeasurements,
    handleToggle,
  };
}

function ChipsSpecification({ Specification }) {
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
    sizeValue,
    setSizeValue,
    filterCategory,
    setFilterCategory,
    toggleButtonValue,
    setToggleButtonValue,
    measurements,
    handleToggle,
  } = useSizeFilterToggleButtonsValues(Specification);

  if (!measurements) return null;

  return (
    <div>
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
      <Stack
        direction={"row"}
        marginTop={2}
        sx={{
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
                // borderTop: 1,
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
                ,
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

        {/* right part (text) */}
        <Box
          sx={{ width: "50%", "@media (max-width: 700px)": { width: "100%" } }}
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
              width={200}
              label="Choose the filter category"
              sx={{ width: "200px" }}
            />
          )}

          {measurements && (
            <MeasurementsPanel measurements={measurements.MeasureElements} />
          )}
        </Box>
      </Stack>
    </div>
  );
}

export default ChipsSpecification;
