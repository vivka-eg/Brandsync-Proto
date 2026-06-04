"use client";
import PaletteRow from "./PaletteRow";

const PalettesTab = ({ primaryColors, selectedColor, onColorClick }) => {
  return (
    <>
      {/* Primary Palette */}
      <PaletteRow
        label="Primary Palette"
        colors={primaryColors}
        onColorClick={onColorClick}
        animationKey={`${selectedColor}-primary`}
      />
    </>
  );
};

export default PalettesTab;
