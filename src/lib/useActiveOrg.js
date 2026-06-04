"use client";

import { useEffect, useState, useCallback } from "react";

// The active org is the tenant the user is currently working in. It drives
// where new patterns are saved, what the MCP retrieves as grounding context,
// and which patterns the browse views show. Persisted in localStorage so the
// choice is remembered across reloads; defaults to the default org (Brandsync)
// the first time. LOCAL DEV: user is hardcoded, same as the other Make code.

const KEY = "brandsync-make:active-org-id";
const USER_EMAIL = "vivka@eg.dk";

// Synchronous read for non-React callers (e.g. building a fetch body).
export function getStoredOrgId() {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function useActiveOrg() {
  const [orgs, setOrgs] = useState([]);
  const [activeOrgId, setActiveOrgIdState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/orgs?userEmail=${encodeURIComponent(USER_EMAIL)}`);
        const body = await res.json();
        const list = body.orgs || [];
        if (cancelled) return;
        setOrgs(list);
        const stored = getStoredOrgId();
        const valid = stored && list.some((o) => o.id === stored);
        const fallback = list.find((o) => o.is_default)?.id ?? list[0]?.id ?? null;
        const chosen = valid ? stored : fallback;
        setActiveOrgIdState(chosen);
        // Persist the fallback so getStoredOrgId() (used directly by the
        // picker, clone, and the patterns/projects fetches) agrees with what
        // the switcher shows. Without this, a stale/deleted org id left in
        // localStorage silently scopes those calls to a non-existent org.
        if (!valid && chosen) {
          try { localStorage.setItem(KEY, chosen); } catch { /* private mode */ }
        }
      } catch {
        if (!cancelled) setOrgs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setActiveOrgId = useCallback((id) => {
    setActiveOrgIdState(id);
    try { localStorage.setItem(KEY, id); } catch { /* private mode */ }
  }, []);

  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? null;
  return { orgs, activeOrgId, activeOrg, setActiveOrgId, loading };
}
