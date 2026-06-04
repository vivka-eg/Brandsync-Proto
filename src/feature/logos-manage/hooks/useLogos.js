import { useState, useEffect } from "react";
import { getProductLogosForTable } from "@/api/design-system/product-logos";

/**
 * Custom hook for managing logos data with pagination and search
 *
 * @returns {{
 *   logos: Array,
 *   loading: boolean,
 *   page: number,
 *   rowsPerPage: number,
 *   totalCount: number,
 *   searchQuery: string,
 *   debouncedSearchQuery: string,
 *   setPage: Function,
 *   setRowsPerPage: Function,
 *   setSearchQuery: Function,
 *   fetchLogos: Function,
 *   handleChangePage: Function,
 *   handleChangeRowsPerPage: Function,
 *   handleSearch: Function
 * }}
 */
export const useLogos = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search changes
      if (searchQuery !== debouncedSearchQuery) {
        setPage(0);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Fetches logos data from the API
   * @param {number} currentPage - Current page number (0-indexed)
   * @param {number} pageSize - Number of items per page
   * @param {string} search - Search query
   */
  const fetchLogos = async (currentPage, pageSize, search = "", field = sortField, order = sortOrder) => {
    setLoading(true);
    try {
      const { data, totalCount } = await getProductLogosForTable({
        page: currentPage + 1, // API uses 1-indexed pages
        pageSize,
        search,
        sort: `${field}:${order}`
      });
      setLogos(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching logos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logos whenever page, rowsPerPage, or debouncedSearchQuery changes
  useEffect(() => {
    fetchLogos(page, rowsPerPage, debouncedSearchQuery, sortField, sortOrder);
  }, [page, rowsPerPage, debouncedSearchQuery, sortField, sortOrder]);

  /**
   * Handles column sorting requests
   * @param {string} property - The column to sort by
   */
  const handleRequestSort = (property) => {
    const isAsc = sortField === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(property);
    setPage(0); // Reset to first page when sorting changes
  };

  /**
   * Handles page change in pagination
   * @param {Event} event - The event object
   * @param {number} newPage - New page number
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Handles rows per page change in pagination
   * @param {Event} event - The event object
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  /**
   * Handles search input change
   * @param {Event} event - The event object
   */
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return {
    logos,
    loading,
    page,
    rowsPerPage,
    totalCount,
    searchQuery,
    debouncedSearchQuery,
    sortField,
    sortOrder,
    setPage,
    setRowsPerPage,
    setSearchQuery,
    fetchLogos,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleRequestSort,
  };
};
