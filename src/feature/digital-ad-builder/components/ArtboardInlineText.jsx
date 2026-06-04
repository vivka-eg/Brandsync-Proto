"use client";

import React, { useRef, useLayoutEffect, useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Renders ad copy as Typography, or as contentEditable when `interactive`.
 * @param {"headline"|"subtext"} [editingRole]  -  passed with `onEditingRoleChange` so the parent can show inline tools while focused.
 * @param {(role: "headline"|"subtext"|null, anchorEl: HTMLElement | null) => void} [onEditingRoleChange]
 */
export default function ArtboardInlineText({
  value,
  richValue = null,
  onCommit,
  interactive,
  sx,
  editingRole,
  onEditingRoleChange,
  isActiveTool = false,
}) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  const escapeHtml = useCallback((raw) => {
    return String(raw)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }, []);

  const plainToHtml = useCallback(
    (raw) => {
      const t = raw == null ? "" : String(raw);
      return escapeHtml(t).replace(/\n/g, "<br>");
    },
    [escapeHtml],
  );

  const normalizeColor = useCallback((raw) => {
    const c = String(raw ?? "").trim();
    if (!c) return null;
    if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c)) return c;
    if (/^rgba?\([^)]+\)$/i.test(c)) return c;
    if (/^hsla?\([^)]+\)$/i.test(c)) return c;
    return null;
  }, []);

  const sanitizeInlineHtml = useCallback(
    (html) => {
      if (typeof document === "undefined") return "";
      const source = document.createElement("div");
      source.innerHTML = String(html ?? "");
      const out = document.createElement("div");

      const appendChildren = (fromNode, toNode) => {
        Array.from(fromNode.childNodes).forEach((child) => appendNode(child, toNode));
      };

      const appendNode = (node, parent) => {
        if (node.nodeType === Node.TEXT_NODE) {
          parent.appendChild(document.createTextNode(node.textContent ?? ""));
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const tag = node.nodeName.toLowerCase();
        if (tag === "br") {
          parent.appendChild(document.createElement("br"));
          return;
        }
        if (tag === "span" || tag === "font") {
          const color = normalizeColor(node.style?.color || node.getAttribute?.("color"));
          if (!color) {
            appendChildren(node, parent);
            return;
          }
          const span = document.createElement("span");
          span.style.color = color;
          appendChildren(node, span);
          parent.appendChild(span);
          return;
        }
        if (tag === "div" || tag === "p") {
          appendChildren(node, parent);
          parent.appendChild(document.createElement("br"));
          return;
        }
        appendChildren(node, parent);
      };

      appendChildren(source, out);
      while (out.lastChild?.nodeName === "BR") out.removeChild(out.lastChild);
      return out.innerHTML;
    },
    [normalizeColor],
  );

  const extractPlainText = useCallback((el) => {
    return (el.innerText ?? el.textContent ?? "").replace(/\u00A0/g, " ").replace(/\r/g, "");
  }, []);

  const syncDomFromValue = useCallback(() => {
    const el = ref.current;
    if (!el || !interactive) return;
    if (document.activeElement === el) return;
    const rich = typeof richValue === "string" && richValue.length > 0
      ? sanitizeInlineHtml(richValue)
      : "";
    const nextHtml = rich || plainToHtml(value);
    if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
  }, [value, richValue, interactive, plainToHtml, sanitizeInlineHtml]);

  useLayoutEffect(() => {
    syncDomFromValue();
  }, [syncDomFromValue]);

  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      const n = e.relatedTarget;
      const goingToFormatToolbar =
        n && typeof n.closest === "function" && n.closest("[data-ad-inline-format-toolbar]");
      if (!goingToFormatToolbar) {
        onEditingRoleChange?.(null, null);
      }
      if (!onCommit) return;
      const plain = extractPlainText(e.currentTarget);
      const safeHtml = sanitizeInlineHtml(e.currentTarget.innerHTML);
      const rich = /<span\b/i.test(safeHtml) ? safeHtml : null;
      onCommit({ plain, rich });
    },
    [onCommit, onEditingRoleChange, extractPlainText, sanitizeInlineHtml],
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (editingRole && onEditingRoleChange && ref.current) {
      onEditingRoleChange(editingRole, ref.current);
    }
  }, [editingRole, onEditingRoleChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    if (typeof document !== "undefined" && document.queryCommandSupported?.("insertText")) {
      document.execCommand("insertText", false, text);
    } else {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);

  if (!interactive) {
    const safeRich = typeof richValue === "string" && richValue.length > 0
      ? sanitizeInlineHtml(richValue)
      : "";
    if (safeRich) {
      return (
        <Typography component="div" sx={sx} dangerouslySetInnerHTML={{ __html: safeRich }} />
      );
    }
    return (
      <Typography component="div" sx={sx}>
        {value}
      </Typography>
    );
  }

  return (
    <Box
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPaste={handlePaste}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          e.currentTarget.blur();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      sx={{
        ...sx,
        cursor: "text",
        outline: "none",
        borderRadius: 1,
        transition: "box-shadow 0.15s ease",
        boxShadow: isActiveTool
          ? (t) => `0 0 0 2px ${t.palette.primary.main}, 0 0 0 4px ${alpha(t.palette.primary.main, 0.2)}`
          : focused
            ? (t) => `0 0 0 2px ${t.palette.primary.main}`
            : "none",
        "@media (hover: hover)": {
          "&:hover": {
            boxShadow: focused
              ? (t) => `0 0 0 2px ${t.palette.primary.main}`
              : "inset 0 0 0 1px rgba(255,255,255,0.45)",
          },
        },
      }}
    />
  );
}
