"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { findSarees } from "@/lib/sareeFinder";
import { PRICE_RANGES, FINDER_FABRICS } from "@/lib/weaves";
import { slugifyColour, colourSwatch, FINDER_COLOURS } from "@/lib/colours";
import type { ColorFilterValue, Product } from "@/lib/shopify";

export default function SareeFinder({ fabrics, colours }: { fabrics: ColorFilterValue[]; colours: ColorFilterValue[] }) {
  // Live Shopify facets win when the store exposes them as filters; otherwise the comp's
  // own rows render and filter by keyword. Previously an empty facet dropped the whole
  // row, leaving the section with nothing but Price Range.
  const fabricOptions = fabrics.length > 0 ? fabrics.map((f) => f.label) : FINDER_FABRICS.map((f) => f.label);
  const colourOptions = colours.length > 0 ? colours.map((c) => c.label) : FINDER_COLOURS.map((c) => c.label);
  // Comp opens on the first fabric + first colour selected (Kanjivaram · Red), not "All".
  const [fabricSlug, setFabricSlug] = useState<string | null>(slugifyColour(fabricOptions[0]));
  const [priceIndex, setPriceIndex] = useState(0);
  const [colourSlug, setColourSlug] = useState<string | null>(slugifyColour(colourOptions[0]));
  const [count, setCount] = useState<number | null>(null);
  const [preview, setPreview] = useState<Product["featuredImage"]>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const price = PRICE_RANGES[priceIndex];

  useEffect(() => {
    let cancelled = false;
    setPending(true);
    findSarees(fabricSlug, colourSlug, { min: price.min, max: price.max }).then((r) => {
      if (!cancelled) { setCount(r.count); setPreview(r.products[0]?.featuredImage ?? null); setPending(false); }
    });
    return () => { cancelled = true; };
  }, [fabricSlug, colourSlug, price.min, price.max]);

  const fabricLabel = fabricSlug === null ? "All fabrics" : fabricOptions.find((l) => slugifyColour(l) === fabricSlug);
  const colourLabel = colourSlug === null ? null : colourOptions.find((l) => slugifyColour(l) === colourSlug);

  // Dynamic: follows the current fabric/colour/price selection, using the first matching
  // product's photo (falls back to the static shot while that fetch is still pending).
  const photoPanel = (
    <div className="relative w-full h-[190px] md:h-auto md:w-[409px] md:aspect-[409/428] rounded-lg overflow-hidden border border-white shadow-[0_0_0_1px_theme(colors.border.strong)]">
      <Image
        src={preview?.url ?? "/figma/find/hero-photo.png"}
        alt={preview?.altText ?? `${fabricLabel ?? "Saree"} collection`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent from-35% to-primary/90 to-55%" />
      <div className="absolute inset-y-0 left-[42%] right-0 flex flex-col items-center justify-center text-center font-display text-white px-2">
        <span className="block text-lg md:text-title leading-tight">{fabricSlug ? `${fabricLabel} Saree` : "Saree"}</span>
        <span className="block text-3xl md:text-heading-xl leading-tight">Collection</span>
      </div>
    </div>
  );

  function viewSarees() {
    const params = new URLSearchParams();
    if (fabricSlug) params.set("fabric", fabricSlug);
    if (colourSlug) params.set("colour", colourSlug);
    if (price.min != null) params.set("minPrice", String(price.min));
    if (price.max != null) params.set("maxPrice", String(price.max));
    router.push(`/find?${params.toString()}`);
  }

  return (
    <section className="relative bg-cream">
      <Image src="/figma/find/border.png" alt="" width={1280} height={49} className="w-full h-auto" />
      <Image src="/figma/find/backdrop-texture.png" alt="" fill className="absolute inset-0 object-cover -z-10" />

      <div className="relative px-4 md:px-[30px] py-12 grid grid-cols-1 md:grid-cols-[1fr_409px] gap-8 md:gap-10 items-start">
        <div>
          <h2 className="font-display font-light text-heading-sm md:text-heading-xl text-ink">Find Your Saree</h2>
          <p className="mt-1 text-base text-ink-subtle">Choose a weave and a colour — we&apos;ll narrow the collection to match.</p>

          {/* Mobile Figma keeps every pill/swatch row as a horizontal-scroll strip, same
              as the card carousels elsewhere — it only wraps from md: up. */}
          <div className="mt-8">
            <div className="text-xs tracking-wide2 text-ink">Fabric / Weave</div>
            <div className="mt-3 flex gap-2 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible pb-1 [scrollbar-width:none]">
              {fabricOptions.map((label) => (
                <Pill key={label} active={fabricSlug === slugifyColour(label)} onClick={() => setFabricSlug(slugifyColour(label))}>
                  {label}
                </Pill>
              ))}
            </div>
          </div>

          {/* Mobile Figma places the photo panel right after Fabric/Weave, before Price
              Range — desktop keeps it as the side column instead (rendered further down). */}
          <div className="mt-6 md:hidden">{photoPanel}</div>

          <div className="mt-6">
            <div className="text-xs tracking-wide2 text-ink">Price Range</div>
            <div className="mt-3 flex gap-2 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible pb-1 [scrollbar-width:none]">
              {PRICE_RANGES.map((p, i) => (
                <Pill key={p.label} active={priceIndex === i} accent onClick={() => setPriceIndex(i)}>{p.label}</Pill>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs tracking-wide2 text-ink">Colour</div>
            <div className="mt-3 flex gap-4 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible py-1.5 [scrollbar-width:none]">
              {colourOptions.map((label) => (
                <Swatch
                  key={label}
                  active={colourSlug === slugifyColour(label)}
                  label={label}
                  swatch={colourSwatch(label)}
                  onClick={() => setColourSlug(slugifyColour(label))}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-strong flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative w-[130px] h-[93px] md:w-[157px] md:h-[91px] rounded-lg overflow-hidden bg-border-subtle shrink-0">
                {preview && <Image src={preview.url} alt={preview.altText ?? ""} fill className="object-cover" />}
              </div>
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-accent text-white text-tiny tracking-wide2 uppercase mb-2">Selected</span>
                <p className="font-display text-xl md:text-title leading-tight">
                  <span className="text-primary">{fabricLabel}</span>
                  {colourLabel && <span className="text-ink"> · {colourLabel}</span>}
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {pending ? "Counting…" : `${count ?? 0} saree${count === 1 ? " matches" : "s match"} your selection`}
                </p>
              </div>
            </div>
            <button onClick={viewSarees} className="h-[36px] px-5 text-2xs md:h-[52px] md:px-8 rounded-sm bg-primary text-cream md:text-xs font-medium">
              View Sarees
            </button>
          </div>
        </div>

        <div className="hidden md:block">{photoPanel}</div>
      </div>

      <Image src="/figma/find/border.png" alt="" width={1280} height={49} className="w-full h-auto rotate-180" />
    </section>
  );
}

function Pill({ active, accent, onClick, children }: { active: boolean; accent?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-[39px] px-5 rounded-full text-xs tracking-wide2 shrink-0 whitespace-nowrap ${
        active ? `text-white ${accent ? "bg-accent" : "bg-primary"}` : "bg-white text-ink border border-border-strong"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ active, label, swatch, onClick }: { active: boolean; label: string; swatch: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 w-14 md:w-[74px] shrink-0" title={label}>
      <span
        className={`relative block w-14 h-14 md:w-[74px] md:h-[74px] rounded-swatch ${active ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border-strong"}`}
        style={{ background: swatch }}
      >
        <span className="absolute inset-0 rounded-swatch overflow-hidden">
          <Image src="/figma/find/pattern-texture.png" alt="" fill className="object-cover opacity-20 mix-blend-overlay" />
        </span>
      </span>
      <span className={`text-xs ${active ? "text-primary font-semibold" : "text-[#777777]"}`}>{label}</span>
    </button>
  );
}
