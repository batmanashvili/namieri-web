"use client";

import { useSyncExternalStore } from "react";

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?: (t: string, cb: () => void) => void;
  removeEventListener?: (t: string, cb: () => void) => void;
};

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function subscribe(onChange: () => void) {
  const c = connection();
  c?.addEventListener?.("change", onChange);
  return () => c?.removeEventListener?.("change", onChange);
}

/** True when the browser asks for reduced data use (Save-Data / Data Saver). */
export function useSaveData() {
  return useSyncExternalStore(
    subscribe,
    () => connection()?.saveData === true,
    () => false,
  );
}
