"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/shopify";
import { productsByColour } from "@/lib/search";
import ProductCard from "./ProductCard";
import ImageSearchModal, { IMAGE_SEARCH_KEY } from "./ImageSearchModal";

// Approx RGB for the catalogue's colour facets — used to name the colour under the
// picker dot so "search this colour" maps to a real /search term.
const COLOUR_RGB: Record<string, [number, number, number]> = {
  red: [190, 30, 45], maroon: [110, 20, 30], pink: [220, 120, 150], orange: [220, 120, 40],
  yellow: [230, 200, 60], gold: [200, 160, 60], green: [30, 120, 70], teal: [30, 120, 120],
  blue: [40, 80, 160], purple: [110, 40, 120], black: [30, 30, 30], white: [240, 240, 240],
  cream: [245, 238, 220], beige: [230, 215, 185], brown: [120, 80, 50], grey: [130, 130, 130],
  gray: [130, 130, 130], multicolor: [150, 100, 150],
};

// Nearest named colour, preferring a catalogue facet when one is close, otherwise any of the
// known colours so "search this colour" is always actionable.
function nearestColour(rgb: [number, number, number], available: string[]): string | null {
  const preferred = new Set(available.map((l) => l.toLowerCase().replace(/\s+/g, "")));
  let best: string | null = null;
  let bestScore = Infinity;
  for (const [key, ref] of Object.entries(COLOUR_RGB)) {
    const d = (ref[0] - rgb[0]) ** 2 + (ref[1] - rgb[1]) ** 2 + (ref[2] - rgb[2]) ** 2;
    const score = preferred.has(key) ? d * 0.85 : d; // nudge toward colours the store stocks
    if (score < bestScore) { bestScore = score; best = key; }
  }
  return best ? best.charAt(0).toUpperCase() + best.slice(1) : null;
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
      <path d="M4 8V6.5a1.5 1.5 0 0 1 1.5-1.5H8l1-1.5h6L16 5h2.5A1.5 1.5 0 0 1 20 6.5V8" />
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  );
}

export default function ImageSearchResults({ fallback, colours }: { fallback: Product[]; colours: string[] }) {
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(fallback);
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [dot, setDot] = useState({ x: 0.5, y: 0.55 });
  const [picked, setPicked] = useState<{ hex: string; name: string | null } | null>(null);
  const [interacted, setInteracted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const runSearch = useCallback(async (dataUrl: string) => {
    setPending(true);
    setNote("");
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const form = new FormData();
      form.append("image", blob, "upload.jpg");
      const res = await fetch("/api/image-search", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setNote("Showing popular sarees — visual matching isn't available for this image yet.");
        setProducts(fallback);
      }
    } catch {
      setNote("Showing popular sarees — visual matching isn't available right now.");
      setProducts(fallback);
    } finally {
      setPending(false);
    }
  }, [fallback]);

  // Pick up the image chosen in the launcher modal.
  useEffect(() => {
    let stored: string | null = null;
    try { stored = sessionStorage.getItem(IMAGE_SEARCH_KEY); } catch {}
    if (stored) { setImage(stored); runSearch(stored); }
  }, [runSearch]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0);
    sample(dot.x, dot.y);
  };

  const sample = useCallback((nx: number, ny: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const px = Math.min(canvas.width - 1, Math.max(0, Math.round(nx * canvas.width)));
    const py = Math.min(canvas.height - 1, Math.max(0, Math.round(ny * canvas.height)));
    try {
      const d = canvas.getContext("2d")?.getImageData(px, py, 1, 1).data;
      if (!d) return;
      const rgb: [number, number, number] = [d[0], d[1], d[2]];
      const hex = "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
      setPicked({ hex, name: nearestColour(rgb, colours) });
    } catch {}
  }, [colours]);

  const onImageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    setDot({ x: nx, y: ny });
    setInteracted(true);
    sample(nx, ny);
  };

  // Live: moving the dot re-filters the grid to the colour under it (debounced), no button.
  useEffect(() => {
    if (!interacted || !picked?.name) return;
    const name = picked.name;
    const id = setTimeout(() => {
      productsByColour(name).then((ps) => { if (ps.length) { setProducts(ps); setNote(`Showing ${name} sarees from your photo.`); } }).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [interacted, picked?.name]);

  const chooseNewImage = (dataUrl: string) => { setImage(dataUrl); runSearch(dataUrl); };

  return (
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-6 md:py-8">
        <h1 className="font-display text-[26px] md:text-[30px] leading-tight text-ink">Visual Search Results</h1>
        <p className="mt-1 text-[13px] text-[#777]">
          {image ? "Sarees matching your photo. Move the dot over your image to pick a colour." : "Upload or capture a saree photo to find similar styles."}
        </p>
        {note && <p className="mt-1 text-[12px] text-[#a06]">{note}</p>}

        <div className="mt-6 flex flex-col lg:grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          {/* Left column — uploaded image + colour selection only (Figma node 2467-2). */}
          <div className="w-full max-w-[360px] lg:max-w-none lg:sticky lg:top-24">
            {image ? (
              <>
                <div
                  onPointerDown={onImageMove}
                  onPointerMove={(e) => e.buttons === 1 && onImageMove(e)}
                  className="relative aspect-[289/386] w-full overflow-hidden rounded-[10px] bg-border-subtle cursor-crosshair touch-none select-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, cannot be optimized */}
                  <img src={image} alt="Your uploaded saree" onLoad={onImageLoad} className="w-full h-full object-cover" />
                  {/* Colour-sample focus box + dot that hovers over the image */}
                  <div
                    className="pointer-events-none absolute size-[84px] -translate-x-1/2 -translate-y-1/2 rounded-[6px] border-2 border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                    style={{ left: `${dot.x * 100}%`, top: `${dot.y * 100}%` }}
                  >
                    <span
                      className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                      style={{ background: picked?.hex ?? "#ffffff" }}
                    />
                  </div>
                </div>

                {picked && (
                  <div className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#e3d9c3] bg-white px-3 py-2 text-[12px] text-ink">
                    <span className="size-4 rounded-full border border-border" style={{ background: picked.hex }} />
                    {interacted && picked.name ? `Matching ${picked.name} sarees` : "Move the dot over your image to filter by colour"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#e3d9c3] bg-[#fdfbf7] px-3 py-2.5 text-[13px] font-medium text-burgundy"
                >
                  <CameraIcon /> Select an Image
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex aspect-[289/386] w-full flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed border-[#d9cfc2] bg-white text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-[#f9efec] text-burgundy"><CameraIcon /></span>
                <span className="text-[13px] font-medium text-burgundy">Select an Image</span>
                <span className="px-4 text-[11px] text-[#999]">Upload or capture a saree photo</span>
              </button>
            )}
          </div>

          {/* Right column — matching sarees, 4 per row on desktop. */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-[22px] gap-y-8 lg:gap-y-[34px]">
            {pending
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[289/386] w-full animate-pulse rounded-[10px] bg-border-subtle" />
                ))
              : products.map((p) => (
                  <ProductCard key={p.id} product={p} fullWidth plp showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
                ))}
          </div>
        </div>
      </div>

      <ImageSearchModal open={modalOpen} onClose={() => setModalOpen(false)} onImage={chooseNewImage} />
    </main>
  );
}
