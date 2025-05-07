// frontend/src/hooks/useShots.js

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage an array of shot objects.
 * Each shot: { x: number, y: number, score: number }
 *
 * @param {string} storageKey localStorage key for persistence
 * @returns {Object} { shots, addShot, clearShots }
 */
export function useShots(storageKey = "quiver-shots") {
  // 1️. Initialize state from localStorage (or empty array)
  const [shots, setShots] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // 2️. Persist to localStorage whenever shots change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(shots));
    } catch {
      // fail silently
    }
  }, [shots, storageKey]);

  // 3️. Stable callback to add a shot
  const addShot = useCallback(
    (shot) => setShots((prev) => [...prev, shot]),
    []
  );

  // 4️. Stable callback to clear all shots
  const clearShots = useCallback(() => setShots([]), []);

  return { shots, addShot, clearShots };
}
