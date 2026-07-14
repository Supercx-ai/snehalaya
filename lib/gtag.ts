"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires a GA4 event if the script has loaded (no-op otherwise — e.g. GA not configured,
// consent not given, or ad blocker). Safe to call from anywhere client-side.
export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
