"use client";

import { useSyncExternalStore } from "react";
import type { ResourceView } from "./ResourceListToolbar";

/** Each list's view (list or grid), remembered on this device, per list. */
const viewListeners = new Set<() => void>();
const viewKey = (noun: string) => `texer:view:${noun}`;
function readView(noun: string): ResourceView {
  try {
    return localStorage.getItem(viewKey(noun)) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
}
export function useStoredView(noun: string): [ResourceView, (view: ResourceView) => void] {
  const view = useSyncExternalStore(
    (listener) => {
      viewListeners.add(listener);
      return () => viewListeners.delete(listener);
    },
    () => readView(noun),
    () => "list" as ResourceView,
  );
  const setView = (next: ResourceView) => {
    try {
      localStorage.setItem(viewKey(noun), next);
    } catch {
      // Private storage off: the choice lasts until the page reloads.
    }
    viewListeners.forEach((listener) => listener());
  };
  return [view, setView];
}

