"use client";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CustomSearch from "@/components/shared/CustomSearch";
import { useHomePageContext } from "../context/HomePageContext";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { useState } from "react";
import { CaretDown, Check, Funnel, GridFour, Palette, SortAscending, Square, SquaresFour } from "phosphor-react";
import { BRAND_COLOURS } from "@/constants/assets";

// ─── Density toggle ───────────────────────────────────────────────────────────

const DENSITY_OPTIONS = [
  { value: "compact",     Icon: SquaresFour, title: "Compact" },
  { value: "comfortable", Icon: GridFour,    title: "Comfortable" },
  { value: "spacious",    Icon: Square,      title: "Spacious" },
];

const DensityToggle = () => {
  const { density, setDensity } = useHomePageContext();
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={0.25}>
      {DENSITY_OPTIONS.map(({ value, Icon, title }) => (
        <Tooltip key={value} title={title} arrow placement="bottom">
          <Box
            component="button"
            onClick={() => setDensity(value)}
            aria-label={`${title} density`}
            aria-pressed={density === value}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              bgcolor: density === value ? "action.selected" : "transparent",
              color: density === value ? "text.primary" : "text.secondary",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: density === value ? "action.selected" : "action.hover",
              },
            }}
          >
            <Icon
              size={16}
              weight={density === value ? "bold" : "regular"}
              color={density === value ? theme.palette.text.primary : theme.palette.text.secondary}
            />
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
};

// ─── Colour picker ────────────────────────────────────────────────────────────

const ColourPicker = () => {
  const { previewColour, setPreviewColour } = useHomePageContext();
  const [anchor, setAnchor] = useState(null);

  const activeColour = BRAND_COLOURS.find((c) => c.key === previewColour);
  const label = activeColour ? activeColour.name : "Colour";

  return (
    <>
      <FilterChip
        icon={
          activeColour ? (
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: activeColour.hex, flexShrink: 0 }} />
          ) : (
            <Palette size={14} />
          )
        }
        label={label}
        active={!!activeColour}
        onClick={(e) => setAnchor(e.currentTarget)}
      />

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
      >
        <MenuItem
          onClick={() => { setPreviewColour(null); setAnchor(null); }}
          sx={{ gap: 1.5 }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1.5px solid",
              borderColor: "divider",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!previewColour && (
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "text.secondary" }} />
            )}
          </Box>
          <Typography variant="body2">Default</Typography>
          {!previewColour && <Check size={13} weight="bold" style={{ marginLeft: "auto", opacity: 0.5 }} />}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {BRAND_COLOURS.map(({ name, key, hex }) => (
          <MenuItem
            key={key}
            onClick={() => { setPreviewColour(key); setAnchor(null); }}
            sx={{ gap: 1.5 }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: hex,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2">{name}</Typography>
            {previewColour === key && <Check size={13} weight="bold" style={{ marginLeft: "auto", opacity: 0.5 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// ─── Filter chip (shared pattern) ─────────────────────────────────────────────

const FilterChip = ({ icon, label, active, onClick }) => (
  <Chip
    icon={icon}
    label={label}
    deleteIcon={<CaretDown size={14} weight="bold" />}
    onDelete={onClick}
    onClick={onClick}
    size="small"
    sx={{
      borderRadius: "6px",
      fontWeight: 500,
      height: 30,
      px: "4px",
      fontSize: "13px",
      bgcolor: active ? "action.active" : "transparent",
      color: active ? "white" : "text.secondary",
      border: "1px solid",
      borderColor: active ? "action.active" : "divider",
      "&:hover": { bgcolor: active ? "action.focus" : "action.hover" },
      "& .MuiChip-deleteIcon": { color: active ? "rgba(255,255,255,0.7)" : "text.disabled" },
      "& .MuiChip-icon": { color: active ? "white" : "text.secondary" },
    }}
  />
);

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "az",        label: "A–Z" },
  { value: "za",        label: "Z–A" },
  { value: "downloads", label: "Most downloaded" },
  { value: "newest",    label: "Newest" },
];

// ─── Main filter bar ──────────────────────────────────────────────────────────

const SearchFilterComponent = () => {
  const {
    searchValue,
    setSearchValue,
    isSearching,
    styles,
    setStyles,
    sortOrder,
    setSortOrder,
  } = useHomePageContext();
  const { iconTypes } = useIconTypesAndCategoryContext();
  const [styleMenuAnchor, setStyleMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);

  const styleOptions = iconTypes.map((t) => t.name);
  const styleLabel = styles.length === 0 ? "Style" : styles.length === 1 ? styles[0] : `${styles.length} styles`;

  const handleStyleToggle = (name) =>
    setStyles((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "A–Z";

  return (
    <Stack direction="row" alignItems="center" spacing={1}>

      {/* ── Finding controls ── */}
      <CustomSearch
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        isLoading={isSearching}
        sx={{ width: 240 }}
      />

      <FilterChip
        icon={<Funnel size={14} />}
        label={styleLabel}
        active={styles.length > 0}
        onClick={(e) => setStyleMenuAnchor(e.currentTarget)}
      />
      <Menu
        anchorEl={styleMenuAnchor}
        open={Boolean(styleMenuAnchor)}
        onClose={() => setStyleMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => setStyles([])} sx={{ gap: 1 }}>
          <Checkbox size="small" checked={styles.length === 0} disableRipple tabIndex={-1} sx={{ p: 0 }} />
          All
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {styleOptions.map((name) => (
          <MenuItem key={name} onClick={() => handleStyleToggle(name)} sx={{ gap: 1 }}>
            <Checkbox size="small" checked={styles.includes(name)} disableRipple tabIndex={-1} sx={{ p: 0 }} />
            {name}
          </MenuItem>
        ))}
      </Menu>

      <FilterChip
        icon={<SortAscending size={14} />}
        label={sortLabel}
        active={sortOrder !== "az"}
        onClick={(e) => setSortMenuAnchor(e.currentTarget)}
      />
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ mt: 1 }}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <MenuItem
            key={value}
            onClick={() => { setSortOrder(value); setSortMenuAnchor(null); }}
            sx={{ gap: 1, minWidth: 160 }}
          >
            <Check size={13} weight="bold" style={{ opacity: sortOrder === value ? 1 : 0, flexShrink: 0 }} />
            {label}
          </MenuItem>
        ))}
      </Menu>

      {/* ── Divider between finding and viewing ── */}
      <Box sx={{ width: "1px", height: 20, bgcolor: "divider", flexShrink: 0, mx: 0.5 }} />

      {/* ── Viewing controls ── */}
      <ColourPicker />
      <DensityToggle />
    </Stack>
  );
};

function FilterBar() {
  return <SearchFilterComponent />;
}

export default FilterBar;
