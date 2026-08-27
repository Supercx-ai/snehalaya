import Image from "next/image";

// Icons cropped directly from the original stats-bar.png export (real designed glyphs,
// not hand-drawn) — the numbers/labels are now live text instead of baked into the image.
const STATS = [
  { icon: "/figma/stats/icon-deliveries.png", value: "5M+", label: "Successful Deliveries" },
  { icon: "/figma/stats/icon-designers.png", value: "1500+", label: "Designers" },
  { icon: "/figma/stats/icon-support.png", value: "24/7", label: "Customer Support" },
  { icon: "/figma/stats/icon-countries.png", value: "75+", label: "Countries Served" },
];

export default function TrustStats() {
  return (
    <section className="px-4 md:px-[30px] pb-6 pt-1">
      {/* A 4-col grid rather than a flex row with min-widths: the old min-w-[150px] forced
          the bar wider than a phone, which is what made it scroll. Grid quarters always fit. */}
      <div className="bg-cream grid grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex min-w-0 flex-col items-center px-1.5 pb-6 pt-2 text-center md:px-6 md:pb-8 md:pt-3"
          >
            {/* Re-cut centred on a shared square canvas — the originals were sliced from
                stats-bar.png on an even grid while the glyphs weren't evenly spaced, so each
                one drifted further right than the last (+3.5, +12.5, +21.5, +30.5px). */}
            <Image src={s.icon} alt="" width={224} height={224} className="h-10 w-auto md:h-[72px]" />
            <p className="mt-2 text-base font-semibold text-ink md:mt-3 md:text-2xl">{s.value}</p>
            <p className="mt-1 text-[11px] leading-tight text-ink-secondary md:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
