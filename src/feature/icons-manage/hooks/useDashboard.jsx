import {
  getPlatformTotals,
  getCategoryStats,
  getDateTrends,
  getTopIcons,
} from "@/api/icons/icon-dashboard";
import React, { useState, useEffect } from "react";

function useDashboard() {
  const [stats, setStats] = useState({});
  const [topDownloaded, setTopDownloaded] = useState([]);
  const [downloadTrends, setDownloadTrends] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    setIsLoading(true);

    try {
      const [
        totalInfoResponse,
        categoryWiseDownloadsResponse,
        topIconsResponse,
        dateTrendsResponse,
      ] = await Promise.all([
        getPlatformTotals(),
        getCategoryStats(),
        getTopIcons(),
        getDateTrends(),
      ]);

      // set the total info :
      const totalInfo = totalInfoResponse.data ?? totalInfoResponse;
      setStats({
        totalIcons: totalInfo.total_icons,
        totalDownloads: totalInfo.total_downloads,
        activeUsers: totalInfo.total_users,
        publishedIcons: totalInfo.total_published_icons,
      });

      // set the category wise downloads :
      const categoryWiseDownloads =
        categoryWiseDownloadsResponse.data ?? categoryWiseDownloadsResponse;
      setCategoryStats(
        Object.keys(categoryWiseDownloads).map((category) => ({
          category,
          icons: categoryWiseDownloads[category],
        }))
      );

      // set the top icons :
      const topIcons = topIconsResponse.data ?? topIconsResponse;
      setTopDownloaded(
        Object.keys(topIcons)
          .map((icon, index) => ({
            id: index,
            name: icon,
            downloads: topIcons[icon],
            category: "Category 1",
          }))
          .sort((a, b) => b.downloads - a.downloads)
      );

      // set the download trends :
      const dateTrends = dateTrendsResponse.data ?? dateTrendsResponse;
      setDownloadTrends(
        Object.keys(dateTrends)
          .map((date) => ({
            date,
            downloads: dateTrends[date],
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7)
      );
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return { stats, topDownloaded, downloadTrends, categoryStats, isLoading };
}

export default useDashboard;
