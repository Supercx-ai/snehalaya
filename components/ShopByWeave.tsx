import Image from "next/image";
import Link from "next/link";

// ponytail: these are weave/regional-style names (Linen, Kanchipuram Silk, etc.), the
// same category the header's Banarasi/Chanderi/Paithani/Tussar links hit — no live
// Fabric-taxonomy or collection match exists for them (Fabric means material: Cork/
// Cotton/Denim/Silk), so each card falls back to free-text /search, same as the header.
const WEAVES = [
  { label: "Linen", image: "/figma/weaves/linen.png", from: "rgb(220,43,62)", to: "rgb(103,17,26)" },
  { label: "Kanchipuram Silk", image: "/figma/weaves/kanchipuram.png", from: "rgb(255,226,148)", to: "rgb(255,174,0)" },
  // ponytail: Figma's literal dark stop for Banarasi is near-black (29,34,30) — fine at the
  // original 55%-alpha wash, but rendered flat it made the card fade to black. Swapped for a
  // deep green so the card reads as green top-to-bottom, matching the intended look.
  { label: "Banarasi", image: "/figma/weaves/banarasi.png", from: "rgb(12,200,127)", to: "rgb(11,90,63)" },
  { label: "Kota", image: "/figma/weaves/kota.png", from: "rgb(0,216,255)", to: "rgb(30,76,93)" },
  { label: "Chettinad Cotton", image: "/figma/weaves/chettinad.png", from: "rgb(229,126,210)", to: "rgb(111,30,96)" },
  { label: "Tussara", image: "/figma/weaves/tussara.png", from: "rgb(241,142,105)", to: "rgb(131,78,70)" },
] as const;

// PLP comp (MacBook Air - 5): the tiles there are richer than the homepage strip —
// mandala pattern in the gradient, model popping out over the inner white frame.
// That art is baked into per-tile captures (cream headroom included, so they sit
// seamlessly on the PLP's bg-cream page).
const PLP_TILES = [
  { label: "Linen", image: "/figma/plp/weave-linen.jpg" },
  { label: "Kanchipuram Silk", image: "/figma/plp/weave-kanchipuram.jpg" },
  { label: "Banarasi", image: "/figma/plp/weave-banarasi.jpg" },
  { label: "Kota", image: "/figma/plp/weave-kota.jpg" },
  { label: "Chettinad Cotton", image: "/figma/plp/weave-chettinad.jpg" },
  { label: "Tussara", image: "/figma/plp/weave-tussara.jpg" },
] as const;

export default function ShopByWeave({ bare }: { bare?: boolean }) {
  if (bare) {
    // Tiles stay at the comp's ~183px size (per feedback: no proportional scale-up);
    // justify-between spreads the fixed-size tiles across the fluid row.
    return (
      <div className="flex gap-4 lg:justify-between overflow-x-auto pb-2 [scrollbar-width:none]">
        {PLP_TILES.map((w) => (
          <Link key={w.label} href={`/search?q=${encodeURIComponent(w.label)}`} className="block w-[140px] md:w-[183px] shrink-0">
            <div className="relative aspect-[162/188]">
              <Image src={w.image} alt={w.label} fill className="object-cover" />
            </div>
            <p className="mt-1 text-center text-lg text-ink">{w.label}</p>
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
              {/* Solid gradient frame — the real photo sits on top, sharp and untinted,
                  inset evenly on all sides so the gradient shows as a uniform border. */}
              <div className="absolute inset-0 rounded-lg" style={{ background: `linear-gradient(to bottom, ${w.from}, ${w.to})` }} />
              <div className="absolute inset-3 rounded-md overflow-hidden border-2 border-white">
                <Image src={w.image} alt={w.label} fill className="object-cover" />
              </div>
            </div>
            <p className="mt-3 text-center text-lg text-ink">{w.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
