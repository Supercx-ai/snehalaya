"use client";

// Native Web Share API where available (mobile), clipboard copy fallback (desktop). No key needed.
export default function ShareButton({ title }: { title: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        if (navigator.share) await navigator.share({ title, url });
        else { await navigator.clipboard.writeText(url); alert("Link copied"); }
      }}
      aria-label="Share"
      className="w-11 h-11 rounded-md border border-border-strong bg-cream text-ink-secondary text-base shrink-0"
    >
      ↗
    </button>
  );
}
