import React from "react";
import LazyImage from "@/components/shared/LazyImage";
import styles from "../logoTable.module.css";

const LogoTableRow = ({ logo, isTablet, isAdmin, isSuperAdmin, onEdit, onDelete }) => {
  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{logo.name}</td>

      {!isTablet && (
        <td>
          {logo.logo && (
            <div className={styles.logoThumb}>
              <LazyImage
                src={logo.logo}
                alt={logo.name}
                width={60}
                height={60}
                enableModal={false}
                style={{ objectFit: "contain", padding: "8px" }}
              />
            </div>
          )}
        </td>
      )}

      <td>
        {logo.verticalLogo && (
          <div className={styles.logoThumb}>
            <LazyImage
              src={logo.verticalLogo}
              alt={`${logo.name} vertical`}
              width={60}
              height={60}
              enableModal={false}
              style={{ objectFit: "contain", padding: "4px" }}
            />
          </div>
        )}
      </td>

      <td>
        {logo.horizontalLogo && (
          <div className={styles.logoThumbWide}>
            <LazyImage
              src={logo.horizontalLogo}
              alt={`${logo.name} horizontal`}
              width={80}
              height={60}
              enableModal={false}
              style={{ objectFit: "contain", padding: "4px" }}
            />
          </div>
        )}
      </td>

      {!isTablet && (
        <td>
          <span className={styles.badge}>{logo.colorPalette}</span>
        </td>
      )}

      <td style={{ textAlign: "center" }}>
        {logo.hasPowerpoint ? (
          <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        ) : (
          <span className={styles.dash}>—</span>
        )}
      </td>

      <td style={{ textAlign: "center" }}>
        {logo.hasCvi ? (
          <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        ) : (
          <span className={styles.dash}>—</span>
        )}
      </td>

      <td>
        <div className={styles.rowActions}>
          {(isAdmin || isSuperAdmin) && (
            <button
              className={`${styles.actionBtn} ${styles.edit}`}
              onClick={() => onEdit(logo.id)}
              aria-label="Edit logo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {isSuperAdmin && (
            <button
              className={`${styles.actionBtn} ${styles.delete}`}
              onClick={() => onDelete(logo)}
              aria-label="Delete logo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LogoTableRow;
