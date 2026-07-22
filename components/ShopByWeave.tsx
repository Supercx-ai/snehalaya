import Image from "next/image";
import Link from "next/link";

// ponytail: these are weave/regional-style names (Linen, Kanchipuram Silk, etc.), the
// same category the header's Banarasi/Chanderi/Paithani/Tussar links hit — no live
// Fabric-taxonomy or collection match exists for them (Fabric means material: Cork/
// Cotton/Denim/Silk), so each card falls back to free-text /search, same as the header.
const WEAVES = [
  { label: "Linen", image: "/figma/weaves/linen.png", from: "rgba(220,43,62,0.55)", to: "rgba(103,17,26,0.55)" },
  { label: "Kanchipuram Silk", image: "/figma/weaves/kanchipuram.png", from: "rgba(255,226,148,0.55)", to: "rgba(255,174,0,0.55)" },
  { label: "Banarasi", image: "/figma/weaves/banarasi.png", from: "rgba(12,200,127,0.55)", to: "rgba(29,34,30,0.55)" },
  { label: "Kota", image: "/figma/weaves/kota.png", from: "rgba(0,216,255,0.55)", to: "rgba(30,76,93,0.55)" },
  { label: "Chettinad Cotton", image: "/figma/weaves/chettinad.png", from: "rgba(229,126,210,0.55)", to: "rgba(111,30,96,0.55)" },
  { label: "Tussara", image: "/figma/weaves/tussara.png", from: "rgba(241,142,105,0.55)", to: "rgba(131,78,70,0.55)" },
] as const;

export default function ShopByWeave() {
  return (
    <section className="max-w-[1280px] mx-auto px-8 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {WEAVES.map((w) => (
          <Link key={w.label} href={`/search?q=${encodeURIComponent(w.label)}`} className="block">
            <div className="relative aspect-[168/226] rounded-lg overflow-hidden">
              <Image src={w.image} alt={w.label} fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${w.from}, ${w.to})` }} />
              <div className="absolute inset-[8px] rounded-md border border-white" />
            </div>
            <p className="mt-3 text-center text-lg text-ink">{w.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
