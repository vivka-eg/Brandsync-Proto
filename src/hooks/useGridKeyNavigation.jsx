"use client";
import { useRef, useState, useCallback } from "react";

export function useGridKeyNavigation(columns = 2) {
  const itemsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const register = useCallback(
    (index) => (el) => {
      itemsRef.current[index] = el;
    },
    []
  );

  const focusItem = useCallback((index) => {
    if (itemsRef.current[index]) {
      setFocusedIndex(index);
      itemsRef.current[index].focus();
    }
  }, []);

  const onKeyDown = useCallback(
    (e, index) => {
      const total = itemsRef.current.length;
      const row = Math.floor(index / columns);
      const col = index % columns;
      const totalRows = Math.ceil(total / columns);

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          itemsRef.current[index]?.click();
          break;

        case "ArrowRight": {
          e.preventDefault();
          const next = index < total - 1 ? index + 1 : 0;
          focusItem(next);
          break;
        }

        case "ArrowLeft": {
          e.preventDefault();
          const prev = index > 0 ? index - 1 : total - 1;
          focusItem(prev);
          break;
        }

        case "ArrowDown": {
          e.preventDefault();
          const nextRow = row + 1;
          if (nextRow < totalRows) {
            const candidate = nextRow * columns + col;
            // If the last row is incomplete, clamp to the last item
            focusItem(Math.min(candidate, total - 1));
          } else {
            // Wrap to same column in first row
            focusItem(col);
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          const prevRow = row - 1;
          if (prevRow >= 0) {
            focusItem(prevRow * columns + col);
          } else {
            // Wrap to same column in last row
            const lastRowStart = (totalRows - 1) * columns;
            const candidate = lastRowStart + col;
            focusItem(Math.min(candidate, total - 1));
          }
          break;
        }

        case "Home":
          e.preventDefault();
          focusItem(0);
          break;

        case "End":
          e.preventDefault();
          focusItem(total - 1);
          break;
      }
    },
    [columns, focusItem]
  );

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  return { register, onKeyDown, focusedIndex, resetFocus, focusItem };
}
