import type { Metadata } from "next";
import Image from "next/image";
import { STORES } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Our Store | Snehalayaa Silks",
  description:
    "Experience the authentic joy of draping wherever you are in the world. Our advisors will present our heritage handloom sarees in high-definition live streams.",
};

// Rebuilt to the Figma "Our Store" comp: silk hero + two photo cards with just
// name/address/direction link — the old map iframes and hours aren't in the design.
export default function StoreLocator() {
  return (
    <>
      <section className="relative h-[280px] md:h-[320px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display font-light text-heading-sm md:text-[48px] leading-[1.2] text-white">
            Our Store
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            Experience the authentic joy of draping wherever you are in the world. Our advisors will present our
            heritage handloom sarees in high-definition live streams.
          </p>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORES.map((s) => (
            <div key={s.city} className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-2">
                <div className="relative aspect-[560/379] rounded-[10px] overflow-hidden">
                  <Image src={s.image} alt={s.label} fill className="object-cover" />
                </div>
              </div>
              <div className="px-4 pb-5 pt-1">
                <h2 className="font-display font-light text-[36px] leading-[1.2] text-black">{s.label}</h2>
                <p className="mt-1 text-base leading-[1.2] text-ink-subtle">{s.address}</p>
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-lg leading-[1.2] tracking-wide2 text-burgundy"
                >
                  Get Direction
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
