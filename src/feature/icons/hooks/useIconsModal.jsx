"use client";

import { useState } from "react";

function useIconsModal() {
  const [selectedColor, setSelectedColor] = useState("");
  const [size, setSize] = useState(120);
  const [stroke, setStroke] = useState(2);
  const [selectedFormat, setSelectedFormat] = useState("svg");
  const [svgContent, setSvgContent] = useState("");

  return {
    selectedColor,
    setSelectedColor,
    size,
    setSize,
    stroke,
    setStroke,
    selectedFormat,
    setSelectedFormat,
    svgContent,
    setSvgContent,
  };
}

export default useIconsModal;
