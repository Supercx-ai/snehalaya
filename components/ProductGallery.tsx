"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ImageT } from "@/lib/shopify";

export default function ProductGallery({ images, title, similarQuery }: { images: ImageT[]; title: string; similarQuery?: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const router = useRouter();
  if (images.length === 0) return null;
  const img = images[active];

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 shrink-0">
          {images.map((thumb, i) => (
            <button
              key={thumb.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-[84px] h-28 rounded-md overflow-hidden border-2 ${i === active ? "border-burgundy" : "border-transparent"}`}
            >
              <Image src={thumb.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label="Zoom image"
            className="relative block w-full rounded-lg overflow-hidden bg-border-subtle aspect-[3/4] cursor-zoom-in"
          >
            <Image src={img.url} alt={img.altText ?? title} fill priority className="object-cover" />
          </button>

          {similarQuery && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); router.push(`/search?q=${encodeURIComponent(similarQuery)}`); }}
              className="absolute top-3 right-3 flex flex-col items-center gap-1"
            >
              {/* White square icon chip + micro label — gallery corner, PDP node 2245:865 */}
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="7" y="3" width="14" height="14" rx="2" />
                  <path d="M3 7v12a2 2 0 0 0 2 2h12" />
                </svg>
              </span>
              <span className="rounded-sm bg-white/95 px-1.5 py-0.5 text-[10px] text-ink shadow-sm">View Similar</span>
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex md:hidden gap-2 mt-3 overflow-x-auto [scrollbar-width:none]">
            {images.map((thumb, i) => (
              <button
                key={thumb.url}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent"}`}
              >
                <Image src={thumb.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] cursor-zoom-out"
        >
          <Image src={img.url} alt={img.altText ?? title} width={img.width} height={img.height} className="max-w-[90vw] max-h-[90vh] w-auto h-auto" />
        </div>
      )}
    </div>
  );
}
