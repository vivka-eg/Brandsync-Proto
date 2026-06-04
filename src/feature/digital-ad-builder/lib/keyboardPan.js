/** Space-to-pan: ignore when typing or inside menus/dialogs. */
export function isSpacePanBlockedTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.closest("input, textarea, select, [contenteditable]")) return true;
  if (target.closest('[role="listbox"], [role="menu"], [role="menuitem"]')) return true;
  if (target.closest('[role="dialog"]')) return true;
  return false;
}
