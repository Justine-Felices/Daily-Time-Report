"use client";

import { useEffect, useRef } from "react";

const DEFAULT_DRAFT_TTL_MS = 1000 * 60 * 60 * 48;

export default function useLocalStorageDraft({
  storageKey,
  draftValue,
  onRestore,
  hasDraft = true,
  enabled = true,
  ttlMs = DEFAULT_DRAFT_TTL_MS,
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

        if (!parsed || typeof parsed !== "object") {
          window.localStorage.removeItem(storageKey);
          return;
        }

        const parsedUpdatedAt = Date.parse(parsed.updatedAt || "");
        const isExpired =
          Number.isFinite(parsedUpdatedAt) && Date.now() - parsedUpdatedAt > ttlMs;

        if (isExpired) {
          window.localStorage.removeItem(storageKey);
          return;
        }

        onRestoreRef.current?.(parsed);
      }
    } catch {
      // Ignore malformed or inaccessible storage data.
      window.localStorage.removeItem(storageKey);
    } finally {
      hasHydratedRef.current = true;
    }
  }, [enabled, storageKey, ttlMs]);

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
