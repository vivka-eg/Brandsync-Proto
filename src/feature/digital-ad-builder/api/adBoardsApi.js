"use client";

import { getToken } from "@/lib/keycloak";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";

function getAuthHeaders() {
  let token = null;
  try {
    token = getToken();
  } catch {
    // Keycloak not initialised (dev mode) — proceed without token
  }
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("keycloak-token");
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Strip signed backgroundImageUrls before saving; only the stable assetId is kept. */
function sanitiseStateForSave(state) {
  return {
    ...state,
    artboards: (state.artboards ?? []).map((ab) => ({
      ...ab,
      backgroundImageUrl: null,
    })),
  };
}

/** Build a human-readable size summary from artboards, e.g. "300×250, 728×90". */
export function buildSizeSummary(artboards) {
  return (artboards ?? [])
    .map((ab) => {
      const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
      return preset ? `${preset.width}×${preset.height}` : ab.selectedSizeId;
    })
    .join(", ");
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data;
}

/** Create a new saved board. Returns the saved board metadata. */
export async function saveNewBoard({ name, state }) {
  const stateSnapshot = sanitiseStateForSave(state);
  const res = await fetch("/api/ad-boards", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({
      name,
      stateSnapshot,
      stateVersion: stateSnapshot.version ?? 0,
      artboardCount: state.artboards?.length ?? 1,
      sizeSummary: buildSizeSummary(state.artboards),
    }),
  });
  return handleResponse(res);
}

/** Overwrite an existing saved board's state. */
export async function updateBoardState({ id, name, state }) {
  const stateSnapshot = sanitiseStateForSave(state);
  const res = await fetch(`/api/ad-boards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({
      name,
      stateSnapshot,
      stateVersion: stateSnapshot.version ?? 0,
      artboardCount: state.artboards?.length ?? 1,
      sizeSummary: buildSizeSummary(state.artboards),
    }),
  });
  return handleResponse(res);
}

/** Rename a board without touching its state. */
export async function renameBoard({ id, name }) {
  const res = await fetch(`/api/ad-boards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ name }),
  });
  return handleResponse(res);
}

/** Fetch the list of the current user's saved boards. */
export async function listBoards() {
  const res = await fetch("/api/ad-boards", {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return handleResponse(res);
}

/** Load a single board's full state by id. */
export async function loadBoard(id) {
  const res = await fetch(`/api/ad-boards/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return handleResponse(res);
}

/** Delete a saved board. */
export async function deleteBoard(id) {
  const res = await fetch(`/api/ad-boards/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
