import React from "react";
import styles from "../logoTable.module.css";

const TableLoadingSkeleton = ({ isTablet }) => {
  return (
    <tr>
      <td>
        <div className={styles.skeletonLine} style={{ width: 120 }} />
      </td>
      {!isTablet && (
        <td>
          <div className={styles.skeletonRect} style={{ width: 60, height: 60 }} />
        </td>
      )}
      <td>
        <div className={styles.skeletonRect} style={{ width: 60, height: 60 }} />
      </td>
      <td>
        <div className={styles.skeletonRect} style={{ width: 80, height: 60 }} />
      </td>
      {!isTablet && (
        <td>
          <div className={styles.skeletonRect} style={{ width: 80, height: 24 }} />
        </td>
      )}
      <td style={{ textAlign: "center" }}>
        <div className={styles.skeletonRect} style={{ width: 20, height: 20, margin: "0 auto" }} />
      </td>
      <td style={{ textAlign: "center" }}>
        <div className={styles.skeletonRect} style={{ width: 20, height: 20, margin: "0 auto" }} />
      </td>
      <td>
        <div className={styles.skeletonRect} style={{ width: 60, height: 28, margin: "0 auto" }} />
      </td>
    </tr>
  );
};

export default TableLoadingSkeleton;
