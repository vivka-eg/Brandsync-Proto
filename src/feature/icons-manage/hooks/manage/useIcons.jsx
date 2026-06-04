"use client";
import { deleteIcon, getIcons, bulkPublishIcons } from "@/api/icons/icons";
import { useToast } from "@/context/shared/ToastContext";
import { updateSVGColor } from "@/utils/assets/icons/svg_utility";
import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

// Sortable fields map to Strapi field names
const SORT_FIELD_MAP = {
  name: "icon_name",
  type: "icon_type.type_name",
  downloads: "downloads",
  uploadDate: "createdAt",
};

function useIcons() {
  const [icons, setIcons] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [selectedIconType, setSelectedIconType] = useState({
    label: "All",
    value: "ALL",
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalIcons, setTotalIcons] = useState(0);
  const [sortField, setSortField] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const { setToast } = useToast();
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Track whether a filter/sort change already triggered a fetch so the page
  // effect doesn't fire a second redundant request.
  const filterChangePending = useRef(false);

  const getObjectURLFromSVG = (svg) => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  };

  const fetchIcons = async (pageOverride, sortFieldOverride, sortOrderOverride) => {
    setLoading(true);
    const currentPage = pageOverride ?? page;
    const currentSortField = sortFieldOverride ?? sortField;
    const currentSortOrder = sortOrderOverride ?? sortOrder;

    try {
      const strapiSortField = SORT_FIELD_MAP[currentSortField] ?? "createdAt";
      const params = {
        "pagination[page]": currentPage,
        "pagination[pageSize]": limit,
        populate: "*",
        [`sort[0]`]: `${strapiSortField}:${currentSortOrder}`,
      };

      if (searchValue.trim()) {
        params["filters[icon_name][$containsi]"] = searchValue.trim();
      }

      if (selectedIconType?.value && selectedIconType.value !== "ALL") {
        params["filters[icon_type][documentId][$eq]"] = selectedIconType.value;
      }

      if (selectedStatus && selectedStatus !== "ALL") {
        params["filters[status][$eq]"] = selectedStatus;
      }

      if (categoriesSelected?.length > 0) {
        categoriesSelected.forEach((cat, i) => {
          params[`filters[icon_category][documentId][$in][${i}]`] = cat.id;
        });
      }

      const response = await getIcons(params);

      setIcons(
        (response.data ?? []).map((icon) => ({
          id: icon.documentId,
          name: icon.icon_name,
          type: icon.icon_type?.type_name ?? "",
          categories: (icon.icon_category ?? []).map((cat) => cat.category_name),
          tags: (icon.icon_tags ?? []).map((tag) => tag.tag_name),
          downloads: icon.downloads,
          uploadDate: new Date(icon.createdAt).toLocaleDateString(),
          icon: getObjectURLFromSVG(icon.icon_content),
          status: icon.status,
          svg_content: updateSVGColor(
            icon.icon_content,
            mode === "dark" ? "#fff" : "#000"
          ),
        }))
      );

      setTotalIcons(response.meta?.pagination?.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch icons", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    filterChangePending.current = true;
    setPage(1);
    setSelectedIcons([]);
    fetchIcons(1, field, newOrder);
  };

  const handleSelectIcon = (id, checked) => {
    if (checked) {
      setSelectedIcons((prev) => [...prev, id]);
    } else {
      setSelectedIcons((prev) => prev.filter((iconId) => iconId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIcons(icons.map((icon) => icon.id));
    } else {
      setSelectedIcons([]);
    }
  };

  const handleToggleIconPublishStatus = async (iconId, status) => {
    try {
      await bulkPublishIcons([iconId], status);
      setIcons((prev) =>
        prev.map((icon) => (iconId === icon.id ? { ...icon, status } : icon))
      );
      setToast({
        open: true,
        type: "success",
        message: `Icon ${status === "PUBLISHED" ? "published" : "unpublished"} successfully`,
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to update icon status",
        variant: "filled",
      });
    }
  };

  const handleToggleIconsPublishStatus = async (iconsIds, status) => {
    try {
      await bulkPublishIcons(iconsIds, status);
      setIcons((prev) =>
        prev.map((icon) =>
          iconsIds.includes(icon.id) ? { ...icon, status } : icon
        )
      );
      setSelectedIcons([]);
      setToast({
        open: true,
        type: "success",
        message: `Icons ${status === "PUBLISHED" ? "published" : "unpublished"} successfully`,
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Failed to update icons status",
        variant: "filled",
      });
    }
  };

  const handleDeleteIcons = async (iconsIds) => {
    try {
      await Promise.all(iconsIds.map((id) => deleteIcon(id)));
      setIcons((prev) => prev.filter((icon) => !iconsIds.includes(icon.id)));
      setSelectedIcons([]);
      setToast({
        open: true,
        type: "success",
        message: `${iconsIds.length > 1 ? "Icons" : "Icon"} deleted successfully`,
        variant: "filled",
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: `Failed to delete ${iconsIds.length > 1 ? "icons" : "icon"}`,
        variant: "filled",
      });
    }
  };

  const handleCopy = (svgContent) => {
    navigator.clipboard.writeText(svgContent).then(() => {
      setToast({
        open: true,
        type: "success",
        message: "Copied SVG to clipboard",
        variant: "filled",
      });
    });
  };

  const totalPages = Math.ceil(totalIcons / limit);

  // When filters/sort change: reset to page 1 and fetch directly (handles the
  // case where page is already 1 and setPage(1) is a no-op, so page effect won't fire).
  useEffect(() => {
    filterChangePending.current = true;
    setPage(1);
    setSelectedIcons([]);
    fetchIcons(1);
  }, [searchValue, categoriesSelected, selectedIconType, selectedStatus, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Explicit page navigation (not triggered by filter/sort resets).
  useEffect(() => {
    if (filterChangePending.current) {
      filterChangePending.current = false;
      return;
    }
    setSelectedIcons([]);
    fetchIcons();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIcons((prevIcons) =>
      prevIcons.map((icon) => ({
        ...icon,
        svg_content: updateSVGColor(
          icon.svg_content,
          mode === "dark" ? "#fff" : "#000"
        ),
      }))
    );
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    icons,
    setIcons,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    categoriesSelected,
    setCategoriesSelected,
    selectedIconType,
    setSelectedIconType,
    selectedStatus,
    setSelectedStatus,
    selectedIcons,
    setSelectedIcons,
    handleSelectIcon,
    handleSelectAll,
    searchValue,
    setSearchValue,
    filteredIcons: icons,
    totalIcons,
    totalPages,
    sortField,
    sortOrder,
    handleSort,
    handleToggleIconPublishStatus,
    handleToggleIconsPublishStatus,
    handleDeleteIcons,
    handleCopy,
  };
}

export default useIcons;
