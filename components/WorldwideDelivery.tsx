import Image from "next/image";
import Link from "next/link";

// "Snehalayaa, Delivered Worldwide" band — desktop comp node 2191:259, mobile comp node
// 2191:1710. Left third is the gold-silk drape; the rest is deep maroon #67111a with a
// mandala at low opacity and three assurance cards.
//
// The icons are the comp's own exports (worldwide-shipping / secured-payment / support,
// 49x49 at 8x). They were previously hand-drawn SVG approximations — the delivery one in
// particular was a wireframe globe with a padlock, nothing like the comp's globe-and-parcel.
const CARDS = [
  { icon: "/figma/worldwide/icon-delivery.png", title: "International Delivery", caption: "Shipping to 40+ countries" },
  { icon: "/figma/worldwide/icon-payments.png", title: "Secure Payments", caption: "Global cards, UPI & wallets" },
  { icon: "/figma/worldwide/icon-support.png", title: "Virtual Help", caption: "Live video shopping assistance" },
];

function GoldOrnament() {
  // Comp Frame 17 = Line + the Snehalayaa emblem (node 2191:267, repainted cream) + Line.
  return (
    <div className="mt-4 flex items-center justify-center gap-4" aria-hidden>
      <span className="h-px w-[80px] sm:w-[120px] bg-gradient-to-r from-transparent to-accent" />
      <Image src="/figma/worldwide/emblem.png" alt="" width={31} height={32} className="size-8 shrink-0" />
      <span className="h-px w-[80px] sm:w-[120px] bg-gradient-to-l from-transparent to-accent" />
    </div>
  );
}

export default function WorldwideDelivery() {
  return (
    <section className="relative overflow-hidden bg-[#67111a] text-cream">
      {/* Mobile background is the comp's own, exported flat from node 2191:1710 with its
          children hidden. Figma places that mandala with a custom **Crop** fill, which no
          combination of background-size/position reproduces — every approximation put the
          motif in the wrong place, so this is the real composite (maroon + mandala already
          at the comp's opacity). */}
      <div className="absolute inset-0 sm:hidden">
        <Image src="/figma/worldwide/bg-mobile.png" alt="" fill sizes="100vw" priority className="object-cover" />
      </div>

      {/* Desktop keeps the mandala as a low-opacity wash over the section's maroon. */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block opacity-[0.12] bg-no-repeat bg-cover bg-right"
        style={{ backgroundImage: "url('/figma/worldwide/mandala-tile.png')" }}
      />

      {/* Mobile comp doesn't just crop the drape into a band — node 2191:1748 rotates it
          -90.17deg, so the fold runs horizontally. Centre-cropping the upright asset gave a
          completely different slice of silk, hence a pre-rotated asset for this breakpoint. */}
      <div className="relative h-[200px] w-full sm:hidden">
        <Image src="/figma/worldwide/silk-bg-mobile.png" alt="" fill sizes="100vw" priority className="object-cover" />
      </div>

      {/* Desktop keeps the upright drape as the left-hand column. */}
      <div className="hidden sm:absolute sm:inset-y-0 sm:left-0 sm:block sm:w-[42%] lg:w-[34%]">
        <Image
          src="/figma/worldwide/silk-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 34vw, 42vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#67111a]/95" />
      </div>

      <div className="relative px-4 md:px-[30px] pb-14 pt-6 sm:py-16 md:py-20">
        <div className="sm:ml-[44%] lg:ml-[36%] max-w-[760px]">
          <h2 className="text-center font-display font-light text-[28px] sm:text-[34px] md:text-[46px] leading-tight text-cream">
            Snehalayaa, Delivered Worldwide
          </h2>
          <GoldOrnament />
          <p className="mt-5 text-center text-[14px] sm:text-[15px] leading-relaxed text-cream/85 max-w-[620px] mx-auto">
            Explore sarees through a personal video shopping session. See the saree in real light,
            ask questions, and get help choosing from our team.
          </p>

          {/* Mobile comp stacks the cards as icon-left rows; sm: up they become the comp's
              centred three-up columns. */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="flex items-center gap-4 rounded-[10px] border border-cream/30 bg-white/[0.12] px-4 py-4 text-left sm:flex-col sm:gap-0 sm:px-4 sm:py-6 sm:text-center"
              >
                <Image src={c.icon} alt="" width={44} height={44} className="size-11 shrink-0 sm:size-10" />
                <div className="sm:mt-3">
                  <p className="font-display text-[19px] leading-snug text-cream">{c.title}</p>
                  <p className="mt-0.5 sm:mt-1 text-[12px] text-cream/70">{c.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="flex h-11 flex-1 sm:flex-none items-center justify-center rounded-[4px] bg-cream px-7 text-[13px] font-medium tracking-[0.4px] text-burgundy"
            >
              Shop Internationally
            </Link>
            <Link
              href="/about"
              className="flex h-11 flex-1 sm:flex-none items-center justify-center rounded-[4px] border border-cream/60 px-7 text-[13px] tracking-[0.4px] text-cream hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
