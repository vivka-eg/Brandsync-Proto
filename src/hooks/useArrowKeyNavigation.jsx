// Updated hook in arrowKeyNavigation.jsx
"use client";
import { useRef, useState, useCallback } from "react";

export function useArrowKeyNavigation() {
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
      // Only set visual focus state
      itemsRef.current[index].focus();
    }
  }, []);

  const reset = useCallback(() => {
    itemsRef.current = [];
    setFocusedIndex(-1);
  }, []);

  const onKeyDown = useCallback(
    (e, index) => {
      const totalItems = itemsRef.current.filter(Boolean).length;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          itemsRef.current[index]?.click();
          break;

        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation(); // Prevent default radio group behavior
          const nextIndex = index < totalItems - 1 ? index + 1 : 0;
          focusItem(nextIndex);
          break;

        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation(); // Prevent default radio group behavior
          const prevIndex = index > 0 ? index - 1 : totalItems - 1;
          focusItem(prevIndex);
          break;

        case "Home":
          e.preventDefault();
          focusItem(0);
          break;

        case "End":
          e.preventDefault();
          const lastIndex = totalItems - 1;
          focusItem(lastIndex);
          break;
      }
    },
    [focusItem]
  );

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  return { register, onKeyDown, focusedIndex, resetFocus, focusItem };
}
