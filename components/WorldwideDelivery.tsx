import Image from "next/image";
import Link from "next/link";

// "Snehalayaa, Delivered Worldwide" band — homepage node 2056:6196 (between Worn & Loved
// and the founder section). Left third is the gold-silk drape (2x export of the design's
// Background image); the rest is deep purple #4A074C with three assurance cards.

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8" aria-hidden>
      <circle cx="11" cy="10" r="7.5" />
      <path d="M3.5 10h15M11 2.5c2.4 2 3.6 4.7 3.6 7.5S13.4 15.5 11 17.5c-2.4-2-3.6-4.7-3.6-7.5S8.6 4.5 11 2.5Z" />
      <rect x="14" y="13.5" width="7" height="6.5" rx="1" fill="#4A074C" />
      <path d="M15.6 13.5v-1a1.9 1.9 0 0 1 3.8 0v1" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 9.5h19" />
      <path d="M6 14.5h5" />
      <path d="m15.5 15 1.6 1.6L20.5 13" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8" aria-hidden>
      <circle cx="12" cy="7" r="3.4" />
      <path d="M5 20c.7-3.5 3.4-5.3 7-5.3s6.3 1.8 7 5.3" />
      <path d="M4.5 12.5v-1a7.5 7.5 0 0 1 15 0v1" />
      <rect x="3" y="12" width="2.6" height="4.5" rx="1.1" />
      <rect x="18.4" y="12" width="2.6" height="4.5" rx="1.1" />
    </svg>
  );
}

function GoldOrnament() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-[130px] bg-gradient-to-r from-transparent to-[#d9b871]" />
      <svg viewBox="0 0 28 28" fill="none" className="size-6 text-[#d9b871]">
        <path d="M14 2.5 25.5 14 14 25.5 2.5 14 14 2.5Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="1" />
        <path d="M14 6.5v15M6.5 14h15" stroke="currentColor" strokeWidth="0.7" />
      </svg>
      <span className="h-px w-[130px] bg-gradient-to-l from-transparent to-[#d9b871]" />
    </div>
  );
}

const CARDS = [
  { icon: <GlobeIcon />, title: "International Delivery", caption: "Shipping to 40+ countries" },
  { icon: <CardIcon />, title: "Secure Payments", caption: "Global cards, UPI & wallets" },
  { icon: <HeadsetIcon />, title: "Virtual Help", caption: "Live video shopping assistance" },
];

export default function WorldwideDelivery() {
  return (
    <section className="relative overflow-hidden bg-[#4A074C] text-cream">
      {/* Gold silk drape — left third on desktop, a soft top banner behind content on mobile. */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[42%] lg:w-[34%]">
        <Image
          src="/figma/worldwide/silk-bg.png"
          alt=""
          fill
          className="object-cover object-center opacity-20 sm:opacity-100"
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 42vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#4A074C] sm:to-[#4A074C]/95" />
      </div>
      {/* Faint mandala glow on the right, matching the design's botanical watermark. */}
      <div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(217,184,113,0.10),transparent_62%)]" />

      <div className="relative px-4 md:px-[30px] py-16 md:py-20">
        <div className="sm:ml-[44%] lg:ml-[36%] max-w-[760px]">
          <h2 className="text-center font-display font-light text-[34px] md:text-[46px] leading-tight text-cream">
            Snehalayaa, Delivered Worldwide
          </h2>
          <GoldOrnament />
          <p className="mt-5 text-center text-[15px] leading-relaxed text-[#e7d3e1] max-w-[620px] mx-auto">
            Explore sarees through a personal video shopping session. See the saree in real light,
            ask questions, and get help choosing from our team.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="flex flex-col items-center rounded-[8px] border border-white/20 bg-white/[0.06] px-4 py-6 text-center"
              >
                <span className="text-cream">{c.icon}</span>
                <p className="mt-3 font-display text-[19px] leading-snug text-cream">{c.title}</p>
                <p className="mt-1 text-[12px] text-[#e0c9da]">{c.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="flex items-center justify-center h-11 px-7 rounded-[4px] bg-cream text-[13px] font-medium tracking-[0.4px] text-burgundy"
            >
              Shop Internationally
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center h-11 px-7 rounded-[4px] border border-cream/60 text-[13px] tracking-[0.4px] text-cream hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
