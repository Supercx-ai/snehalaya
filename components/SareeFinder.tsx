"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { findSarees } from "@/lib/sareeFinder";
import { PRICE_RANGES } from "@/lib/weaves";
import { slugifyColour, colourSwatch } from "@/lib/colours";
import type { ColorFilterValue, Product } from "@/lib/shopify";

export default function SareeFinder({ fabrics, colours }: { fabrics: ColorFilterValue[]; colours: ColorFilterValue[] }) {
  const [fabricSlug, setFabricSlug] = useState<string | null>(fabrics[0] ? slugifyColour(fabrics[0].label) : null);
  const [priceIndex, setPriceIndex] = useState(0);
  const [colourSlug, setColourSlug] = useState<string | null>(null);
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

  const fabricLabel = fabricSlug === null ? "All fabrics" : fabrics.find((f) => slugifyColour(f.label) === fabricSlug)?.label;
  const colourLabel = colourSlug === null ? null : colours.find((c) => slugifyColour(c.label) === colourSlug)?.label;

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

      <div className="relative max-w-[1280px] mx-auto px-9 py-12 grid md:grid-cols-[1fr_409px] gap-10 items-start">
        <div>
          <h2 className="font-display font-light text-heading-xl text-primary">Find Your Saree</h2>
          <p className="mt-1 text-base text-ink-subtle">Choose a fabric and a colour — we&apos;ll narrow the collection to match.</p>

          {fabrics.length > 0 && (
            <div className="mt-8">
              <div className="text-xs tracking-wide2 text-ink uppercase">Fabric / Weave</div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Pill active={fabricSlug === null} onClick={() => setFabricSlug(null)}>All</Pill>
                {fabrics.map((f) => (
                  <Pill key={f.label} active={fabricSlug === slugifyColour(f.label)} onClick={() => setFabricSlug(slugifyColour(f.label))}>
                    {f.label}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="text-xs tracking-wide2 text-ink uppercase">Price Range</div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {PRICE_RANGES.map((p, i) => (
                <Pill key={p.label} active={priceIndex === i} accent onClick={() => setPriceIndex(i)}>{p.label}</Pill>
              ))}
            </div>
          </div>

          {colours.length > 0 && (
            <div className="mt-6">
              <div className="text-xs tracking-wide2 text-ink uppercase">Colour</div>
              <div className="mt-3 flex gap-4 flex-wrap">
                <Swatch active={colourSlug === null} label="All" onClick={() => setColourSlug(null)} swatch="#fff" />
                {colours.map((c) => (
                  <Swatch
                    key={c.label}
                    active={colourSlug === slugifyColour(c.label)}
                    label={c.label}
                    swatch={colourSwatch(c.label)}
                    onClick={() => setColourSlug(slugifyColour(c.label))}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border-strong flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative w-[157px] h-[91px] rounded-lg overflow-hidden bg-border-subtle shrink-0">
                {preview && <Image src={preview.url} alt={preview.altText ?? ""} fill className="object-cover" />}
              </div>
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-accent text-white text-tiny tracking-wide2 uppercase mb-2">Selected</span>
                <p className="font-display text-title leading-tight">
                  <span className="text-primary">{fabricLabel}</span>
                  {colourLabel && <span className="text-ink"> · {colourLabel}</span>}
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {pending ? "Counting…" : `${count ?? 0} saree${count === 1 ? "" : "s"} match your selection`}
                </p>
              </div>
            </div>
            <button onClick={viewSarees} className="h-[52px] px-8 rounded-sm bg-primary text-cream text-xs font-medium">
              View Sarees
            </button>
          </div>
        </div>

        <div className="relative hidden md:block h-[428px] rounded-lg overflow-hidden border border-white shadow-[0_0_0_1px_theme(colors.border.strong)]">
          <Image src="/figma/find/hero-photo.png" alt="Kanjivaram saree collection" fill className="object-cover" />
          <div className="absolute bottom-8 left-6 font-display text-white">
            <span className="block text-title leading-tight">Kanjivaram Saree</span>
            <span className="block text-heading-xl leading-tight">Collection</span>
          </div>
        </div>
      </div>

      <Image src="/figma/find/border.png" alt="" width={1280} height={49} className="w-full h-auto rotate-180" />
    </section>
  );
}

function Pill({ active, accent, onClick, children }: { active: boolean; accent?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-[39px] px-5 rounded-full text-xs tracking-wide2 ${
        active ? `text-white ${accent ? "bg-accent" : "bg-primary"}` : "bg-white text-ink border border-border-strong"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ active, label, swatch, onClick }: { active: boolean; label: string; swatch: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 w-[74px]" title={label}>
      <span
        className={`relative block w-[74px] h-[74px] rounded-swatch overflow-hidden ${active ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border-strong"}`}
        style={{ background: swatch }}
      >
        <Image src="/figma/find/pattern-texture.png" alt="" fill className="object-cover opacity-20 mix-blend-overlay" />
      </span>
      <span className={`text-xs ${active ? "text-primary font-semibold" : "text-ink-secondary"}`}>{label}</span>
    </button>
  );
}
