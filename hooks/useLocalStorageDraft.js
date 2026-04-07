"use client";

import { useEffect, useRef } from "react";

export default function useLocalStorageDraft({
  storageKey,
  draftValue,
  onRestore,
  hasDraft = true,
  enabled = true,
}) {
  const hasHydratedRef = useRef(false);
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    hasHydratedRef.current = false;

    if (typeof window === "undefined" || !enabled || !storageKey) {
      hasHydratedRef.current = true;
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        onRestoreRef.current?.(parsed);
      }
    } catch {
      // Ignore malformed or inaccessible storage data.
    } finally {
      hasHydratedRef.current = true;
    }
  }, [enabled, storageKey]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (typeof window === "undefined" || !enabled || !storageKey) return;

    try {
      if (!hasDraft) {
        window.localStorage.removeItem(storageKey);
        return;
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...draftValue,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignore storage issues in restricted browsing contexts.
    }
  }, [draftValue, enabled, hasDraft, storageKey]);
}
