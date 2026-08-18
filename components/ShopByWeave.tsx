import Image from "next/image";
import Link from "next/link";

// ponytail: these are weave/regional-style names (Linen, Kanchipuram Silk, etc.), the
// same category the header's Banarasi/Chanderi/Paithani/Tussar links hit — no live
// Fabric-taxonomy or collection match exists for them (Fabric means material: Cork/
// Cotton/Denim/Silk), so each card falls back to free-text /search, same as the header.
const WEAVES = [
  { label: "Linen", image: "/figma/weaves/linen.png", from: "rgb(220,43,62)", to: "rgb(103,17,26)" },
  { label: "Kanchipuram Silk", image: "/figma/weaves/kanchipuram.png", from: "rgb(255,226,148)", to: "rgb(255,174,0)" },
  { label: "Banarasi", image: "/figma/weaves/banarasi.png", from: "rgb(12,200,127)", to: "rgb(11,90,63)" },
  { label: "Kota", image: "/figma/weaves/kota.png", from: "rgb(0,216,255)", to: "rgb(30,76,93)" },
  { label: "Chettinad Cotton", image: "/figma/weaves/chettinad.png", from: "rgb(229,126,210)", to: "rgb(111,30,96)" },
  { label: "Tussara", image: "/figma/weaves/tussara.png", from: "rgb(241,142,105)", to: "rgb(131,78,70)" },
] as const;

// PLP weave cards — per-card 2x exports of the tiles inside Figma node 2304:2
// (gradient board + model cutout + white inner border baked per card; label is live text).
const PLP_CARDS = [
  { label: "Linen", image: "/figma/weaves/plp/linen.png?v=2", w: 365, h: 455 },
  { label: "Kanchipuram Silk", image: "/figma/weaves/plp/kanchipuram.png?v=2", w: 362, h: 459 },
  { label: "Banarasi", image: "/figma/weaves/plp/banarasi.png?v=2", w: 363, h: 459 },
  { label: "Kota", image: "/figma/weaves/plp/kota.png?v=2", w: 363, h: 459 },
  { label: "Chettinad Cotton", image: "/figma/weaves/plp/chettinad.png?v=2", w: 363, h: 453 },
  { label: "Tussara", image: "/figma/weaves/plp/tussara.png?v=2", w: 362, h: 453 },
] as const;

export default function ShopByWeave({ bare }: { bare?: boolean }) {
  if (bare) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6 lg:gap-8 xl:gap-10">
        {PLP_CARDS.map((w) => (
          <Link
            key={w.label}
            href={`/search?q=${encodeURIComponent(w.label)}`}
            className="block w-[140px] shrink-0 sm:w-auto"
          >
            <Image
              src={w.image}
              alt={w.label}
              width={w.w}
              height={w.h}
              className="w-full h-auto"
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 140px"
            />
            <p className="mt-2.5 text-center text-[16px] text-ink">{w.label}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto pl-4 md:px-8 py-12">
      {/* Mobile Figma keeps this as a horizontal-scroll strip, not a stacked grid — it
          only becomes a grid from sm: up. */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto sm:overflow-visible pb-2 pr-4 [scrollbar-width:none]">
        {WEAVES.map((w) => (
          <Link key={w.label} href={`/search?q=${encodeURIComponent(w.label)}`} className="block w-[108px] shrink-0 sm:w-auto">
            <div className="relative aspect-[168/226]">
              <div className="absolute inset-0 rounded-lg" style={{ background: `linear-gradient(to bottom, ${w.from}, ${w.to})` }} />
              <div className="absolute inset-3 rounded-md overflow-hidden border-2 border-white">
                <Image src={w.image} alt={w.label} fill className="object-cover object-center" />
              </div>
            </div>
            <p className="mt-3 text-center text-lg text-ink">{w.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
