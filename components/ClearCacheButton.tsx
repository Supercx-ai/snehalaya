"use client";

import { useState } from "react";

export default function ClearCacheButton() {
  const [status, setStatus] = useState<string | null>(null);

  async function clearCache() {
    const secret = window.prompt("Cache-clear secret:");
    if (!secret) return;
    setStatus("Clearing…");
    const res = await fetch("/api/clear-cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    setStatus(res.ok ? "Cache cleared." : "Wrong secret.");
  }

  return (
    <div>
      <button
        onClick={clearCache}
        style={{ padding: "0.6rem 1.2rem", borderRadius: 8, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
      >
        Clear cache
      </button>
      {status && <p style={{ marginTop: "0.5rem", color: "#555" }}>{status}</p>}
    </div>
  );
}
