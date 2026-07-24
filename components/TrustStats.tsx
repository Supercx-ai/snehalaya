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
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-6">
      <div className="bg-cream flex overflow-x-auto md:overflow-visible [scrollbar-width:none]">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 min-w-[150px] md:min-w-0 shrink-0 md:shrink flex flex-col items-center text-center px-6 py-8 ${
              i > 0 ? "border-l border-border" : ""
            }`}
          >
            <Image src={s.icon} alt="" width={110} height={90} className="h-10 w-auto" />
            <p className="mt-3 text-lg font-semibold text-ink">{s.value}</p>
            <p className="mt-1 text-sm text-ink-secondary">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
