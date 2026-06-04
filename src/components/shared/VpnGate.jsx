"use client";
import VpnContentAlert from "./VpnContentAlert";

const VPN_ERROR_RE = /fetch failed|ECONNREFUSED|ENOTFOUND|network|Failed to fetch/i;

/**
 * Detects VPN / network errors and replaces the entire wrapped layout
 * (sidebar + content) with the standard VpnContentAlert.
 *
 * Usage:
 *   <VpnGate error={fetchError}>
 *     <Sidebar />
 *     <MainContent />
 *   </VpnGate>
 *
 * @param {string|null} error  - Error message string from a failed fetch.
 * @param {string}      [title] - Passed through to VpnContentAlert.
 * @param {React.ReactNode} children
 */
export default function VpnGate({ error, title, children }) {
  const isVpnError = Boolean(error && VPN_ERROR_RE.test(error));
  if (isVpnError) return <VpnContentAlert title={title} />;
  return children;
}

/** Convenience hook — returns true when the error string looks like a VPN issue. */
export function useIsVpnError(error) {
  return Boolean(error && VPN_ERROR_RE.test(error));
}
