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
      style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
    >
      Share
    </button>
  );
}
