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
      className="w-11 h-11 rounded-lg border border-[#f4dcbf] bg-[#fdeed9] text-ink flex items-center justify-center shrink-0"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15V3" />
        <path d="M8 7l4-4 4 4" />
        <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
      </svg>
    </button>
  );
}
