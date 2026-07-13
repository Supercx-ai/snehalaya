"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageT } from "@/lib/shopify";

export default function ProductGallery({ images, title }: { images: ImageT[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  if (images.length === 0) return null;
  const img = images[active];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        style={{ border: "none", padding: 0, background: "none", cursor: "zoom-in", display: "block", width: "100%" }}
        aria-label="Zoom image"
      >
        <Image
          src={img.url}
          alt={img.altText ?? title}
          width={img.width}
          height={img.height}
          priority
          style={{ width: "100%", height: "auto", borderRadius: 8 }}
        />
      </button>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          {images.map((thumb, i) => (
            <button
              key={thumb.url}
              onClick={() => setActive(i)}
              style={{ padding: 0, border: i === active ? "2px solid #111" : "2px solid transparent", borderRadius: 6, cursor: "pointer", background: "none" }}
            >
              <Image src={thumb.url} alt="" width={64} height={64} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4 }} />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, cursor: "zoom-out" }}
        >
          <Image src={img.url} alt={img.altText ?? title} width={img.width} height={img.height} style={{ maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto" }} />
        </div>
      )}
    </div>
  );
}
