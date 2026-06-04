"use client";
import CustomSearch from "@/components/shared/CustomSearch";
import Dropdown from "@/components/shared/Dropdown";
import DropdownChip from "@/components/shared/DropdownChip";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { Box, Popover, Stack } from "@mui/material";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Skeleton,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import {
  CloudArrowDown,
  CloudArrowUp,
  Eye,
  EyeSlash,
  Trash,
  Plus,
} from "phosphor-react";
import {
  IconsContextProvider,
  useIconsContext,
} from "../../context/IconsContext";
import { CustomChip } from "@/constants";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import CustomIconButton from "@/components/shared/IconButton";
import IconActionsMenu from "./IconActionsMenu";
import IconPreviewModal from "./IconPreviewModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import CustomPagination from "@/components/shared/CustomPagination";

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const CompactChipsDisplay = ({
  items,
  maxVisible = 1,
  type = "categories",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const visibleItems = items.slice(0, maxVisible);
  const hiddenItems = items.slice(maxVisible);
  const hasHiddenItems = hiddenItems.length > 0;

  const handleMouseEnter = (event) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setAnchorEl(null), 150);
    setHoverTimeout(timeout);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
  };

  const handlePopoverMouseLeave = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {visibleItems.map((item, i) => (
        <CustomChip
          variant="default"
          key={i}
          label={item}
          sx={{ fontSize: "0.75rem" }}
        />
      ))}

      {hasHiddenItems && (
        <>
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.06)",
              color: "text.secondary",
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Plus size={12} weight="bold" />
          </Box>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            disableRestoreFocus
            sx={{
              pointerEvents: "none",
              "& .MuiPopover-paper": {
                pointerEvents: "auto",
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid",
                borderColor: "divider",
                maxWidth: 320,
              },
            }}
            PaperProps={{
              onMouseEnter: handlePopoverMouseEnter,
              onMouseLeave: handlePopoverMouseLeave,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  mb: 1,
                  display: "block",
                }}
              >
                +{hiddenItems.length} more {type}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {hiddenItems.map((item, i) => (
                  <CustomChip
                    variant="default"
                    key={i}
                    label={item}
                    sx={{ fontSize: "0.7rem", height: "26px" }}
                  />
                ))}
              </Stack>
            </Box>
          </Popover>
        </>
      )}
    </Stack>
  );
};

const SkeletonTable = ({ rows = 10 }) => {
  const skeletonRows = Array.from({ length: rows });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="rectangular" width={24} height={24} /></TableCell>
          <TableCell>Icon</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Categories</TableCell>
          <TableCell>Tags</TableCell>
          <TableCell>Downloads</TableCell>
          <TableCell>Publish Status</TableCell>
          <TableCell>Upload Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {skeletonRows.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={36} height={36} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={50} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={50} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
              </Stack>
            </TableCell>
            <TableCell><Skeleton variant="text" width={40} /></TableCell>
            <TableCell><Skeleton variant="text" width={40} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TopBar = () => {
  const { categories, iconTypes } = useIconTypesAndCategoryContext();
  const {
    categoriesSelected,
    setCategoriesSelected,
    selectedIconType,
    setSelectedIconType,
    selectedStatus,
    setSelectedStatus,
    searchValue,
    setSearchValue,
  } = useIconsContext();

  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Unpublished", value: "UNPUBLISHED" },
  ];

  return (
    <Stack direction="row" spacing={2} alignItems="flex-end">
      <CustomSearch value={searchValue} onChange={setSearchValue} />
      <DropdownChip
        categories={categories}
        value={categoriesSelected}
        onChange={(newValue) => setCategoriesSelected(newValue)}
        label="Categories"
        sx={{ flex: 1 }}
      />
      <Dropdown
        values={[
          { label: "All", value: "ALL" },
          ...iconTypes.map((each) => ({ label: each.label, value: each.id })),
        ]}
        selectedValue={selectedIconType ? selectedIconType.value : {}}
        onChange={(e) => {
          let selectedType = iconTypes.find((type) => type.id === e.target.value);
          if (!selectedType) selectedType = { label: "All", id: "ALL" };
          setSelectedIconType({ label: selectedType.label, value: selectedType.id });
        }}
        sx={{ flex: 1 }}
        label="Select Icon Type"
      />
      <Dropdown
        values={statusOptions}
        selectedValue={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        sx={{ flex: 1 }}
        label="Status"
      />
    </Stack>
  );
};

const MultipleSelectActions = () => {
  const { selectedIcons, handleToggleIconsPublishStatus, handleDeleteIcons } =
    useIconsContext();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (selectedIcons.length === 0) return null;

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 2 }}>
      <CustomIconButton
        variant="primary"
        Icon={CloudArrowUp}
        text="Published Selected"
        onClick={() => handleToggleIconsPublishStatus(selectedIcons, "PUBLISHED")}
      />
      <CustomIconButton
        variant="secondary"
        Icon={CloudArrowDown}
        text="Unpublished Selected"
        onClick={() => handleToggleIconsPublishStatus(selectedIcons, "UNPUBLISHED")}
      />
      <CustomIconButton
        variant="destructive"
        Icon={Trash}
        text="Delete Selected"
        onClick={() => setOpenDeleteModal(true)}
      />
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          handleDeleteIcons(selectedIcons);
          setOpenDeleteModal(false);
        }}
        itemCount={selectedIcons.length}
        itemName="icon"
        itemPluralName="icons"
      />
    </Stack>
  );
};

const TableFooter = () => {
  const { page, setPage, totalPages, totalIcons, limit, setLimit } = useIconsContext();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", px: 1 }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          size="small"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          sx={{
            fontSize: 14,
            "& .MuiSelect-select": { py: "4px", px: "8px" },
          }}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>
        <Typography variant="body2" color="text.secondary">
          {totalIcons} total
        </Typography>
      </Stack>

      <CustomPagination
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
      />
    </Stack>
  );
};

// Sortable column header cell
const SortableCell = ({ field, label, sortField, sortOrder, onSort, sx }) => (
  <TableCell sx={sx}>
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortOrder : "asc"}
      onClick={() => onSort(field)}
    >
      {label}
    </TableSortLabel>
  </TableCell>
);

function IconTable() {
  const {
    selectedIcons,
    handleSelectIcon,
    handleSelectAll,
    filteredIcons,
    loading,
    limit,
    handleToggleIconPublishStatus,
    handleCopy,
    handleDeleteIcons,
    sortField,
    sortOrder,
    handleSort,
  } = useIconsContext();

  const [openModal, setOpenModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedIconIdForDelete, setSelectedIconIdForDelete] = useState(null);

  if (loading) {
    return <SkeletonTable rows={limit} />;
  }

  return (
    <Stack spacing={3} alignItems="center">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <CustomCheckbox
                checked={filteredIcons.length > 0 && selectedIcons.length === filteredIcons.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                indeterminate={
                  selectedIcons.length > 0 &&
                  selectedIcons.length < filteredIcons.length
                }
              />
            </TableCell>
            <TableCell sx={{ width: 52 }}>Icon</TableCell>
            <SortableCell field="name" label="Name" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
            <SortableCell field="type" label="Type" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} sx={{ whiteSpace: "nowrap" }} />
            <TableCell>Categories</TableCell>
            <TableCell>Tags</TableCell>
            <SortableCell field="downloads" label="Downloads" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} sx={{ whiteSpace: "nowrap" }} />
            <TableCell>Publish Status</TableCell>
            <SortableCell field="uploadDate" label="Upload Date" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} sx={{ whiteSpace: "nowrap" }} />
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredIcons.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={selectedIcons.includes(item.id)}
                  onChange={(e) => handleSelectIcon(item.id, e.target.checked)}
                />
              </TableCell>
              <TableCell
                onClick={() => {
                  setSelectedIcon(item);
                  setOpenModal(true);
                }}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  dangerouslySetInnerHTML={{ __html: item.svg_content }}
                  sx={{
                    width: 36,
                    height: 36,
                    "& svg": { width: "100%", height: "100%" },
                  }}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <CompactChipsDisplay items={item.categories} maxVisible={1} type="categories" />
              </TableCell>
              <TableCell>
                <CompactChipsDisplay items={item.tags} maxVisible={1} type="tags" />
              </TableCell>
              <TableCell>{item.downloads}</TableCell>
              <TableCell>
                {item.status === "PUBLISHED" ? (
                  <Eye
                    size={20}
                    weight="bold"
                    color="blue"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleIconPublishStatus(item.id, "UNPUBLISHED")}
                  />
                ) : (
                  <EyeSlash
                    size={20}
                    weight="bold"
                    color="grey"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleIconPublishStatus(item.id, "PUBLISHED")}
                  />
                )}
              </TableCell>
              <TableCell>{item.uploadDate}</TableCell>
              <TableCell>
                <IconActionsMenu
                  iconData={item}
                  onCopy={() => handleCopy(item.svg_content)}
                  onDelete={() => {
                    setSelectedIconIdForDelete(item.id);
                    setOpenDeleteModal(true);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TableFooter />

      <IconPreviewModal
        icon={selectedIcon}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedIcon(null);
        }}
      />
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          handleDeleteIcons([selectedIconIdForDelete]);
          setOpenDeleteModal(false);
        }}
        title="Delete Icon"
        destructive={true}
        itemName="icon"
        itemPluralName="icons"
      />
    </Stack>
  );
}

function AllIcons() {
  return (
    <Stack>
      <IconsContextProvider>
        <MultipleSelectActions />
        <TopBar />
        <IconTable />
      </IconsContextProvider>
    </Stack>
  );
}

export default AllIcons;
