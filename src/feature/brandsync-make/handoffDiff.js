// Structural diff between two handoff manifests (previous version vs current).
// Pure + dependency-free: compares the declarative `body` (features, views,
// flows, data) and the `corpus` bill-of-materials by stable keys, classifying
// each item as added / removed / changed / unchanged so the viewer can show
// "what the new version included" against the prior version.

// Deep-ish equality good enough for manifest sub-objects (plain JSON values).
function sameJson(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

// Diff two arrays of objects keyed by `keyFn`. Returns { added, removed,
// changed, unchanged } where each entry carries the prev/next item.
function diffByKey(prevArr, nextArr, keyFn) {
  const prev = new Map();
  const next = new Map();
  (Array.isArray(prevArr) ? prevArr : []).forEach((it, i) => prev.set(keyFn(it, i), it));
  (Array.isArray(nextArr) ? nextArr : []).forEach((it, i) => next.set(keyFn(it, i), it));

  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  for (const [key, item] of next) {
    if (!prev.has(key)) { added.push({ key, next: item }); continue; }
    const before = prev.get(key);
    if (sameJson(before, item)) unchanged.push({ key, prev: before, next: item });
    else changed.push({ key, prev: before, next: item });
  }
  for (const [key, item] of prev) {
    if (!next.has(key)) removed.push({ key, prev: item });
  }
  return { added, removed, changed, unchanged };
}

const featureKey = (f, i) => f?.id || f?.intent || `f${i}`;
const viewKey = (v, i) => v?.id || v?.route || v?.name || `v${i}`;
const flowKey = (fl, i) => fl?.id || `${fl?.from}->${fl?.to}:${fl?.trigger}` || `flow${i}`;
const dataKey = (d, i) => d?.entity || `data${i}`;
const componentKey = (c, i) => c?.ref || c?.slug || `c${i}`;

// Build the full diff bundle. `prev` may be null (first/initial version) — then
// everything in `current` is "added".
export function diffManifests(prev, current) {
  const pb = prev?.body ?? null;
  const cb = current?.body ?? {};
  const pc = prev?.corpus ?? null;
  const cc = current?.corpus ?? {};

  const features = diffByKey(pb?.features, cb.features, featureKey);
  const views = diffByKey(pb?.views, cb.views, viewKey);
  const flows = diffByKey(pb?.flows, cb.flows, flowKey);
  const data = diffByKey(pb?.data, cb.data, dataKey);
  const components = diffByKey(pc?.components, cc.components, componentKey);

  const totals = { added: 0, removed: 0, changed: 0 };
  for (const d of [features, views, flows, data, components]) {
    totals.added += d.added.length;
    totals.removed += d.removed.length;
    totals.changed += d.changed.length;
  }

  return {
    isInitial: !prev,
    features,
    views,
    flows,
    data,
    components,
    totals,
    hasChanges: totals.added + totals.removed + totals.changed > 0,
  };
}

// Pick the previous version string from a `version=list` index (array of
// { version, ... }) relative to a current version. Returns the highest version
// strictly below `currentVersion`, or null if none.
const VERSION_RE = /^(\d+)\.(\d+)$/;
function parseVersion(v) {
  const m = VERSION_RE.exec(String(v ?? '').trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
}
export function compareVersions(a, b) {
  const pa = parseVersion(a), pb = parseVersion(b);
  if (!pa) return -1;
  if (!pb) return 1;
  if (pa[0] !== pb[0]) return pa[0] - pb[0];
  return pa[1] - pb[1];
}

export function previousVersionOf(versionList, currentVersion) {
  const versions = (Array.isArray(versionList) ? versionList : [])
    .map((r) => r?.version)
    .filter((v) => parseVersion(v) && compareVersions(v, currentVersion) < 0)
    .sort(compareVersions);
  return versions.length ? versions[versions.length - 1] : null;
}
