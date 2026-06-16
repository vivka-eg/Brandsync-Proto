"use client";

// Single source of truth for the signed-in user's email, used by the Make
// data calls (projects, patterns, usage, orgs, generate). Set once at login
// in useAuth, read synchronously everywhere — including non-React callers
// (fetch bodies, event handlers) that can't use the auth context hook.

const KEY = "brandsync-make:user-email";

export function setUserEmail(email) {
  try {
    if (email) localStorage.setItem(KEY, email);
  } catch {
    /* private mode / SSR */
  }
}

export function getUserEmail() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function clearUserEmail() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
