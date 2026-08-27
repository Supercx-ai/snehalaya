"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// "Raagam" is a promotional line name baked into the Figma banner artwork, not a live
// collection — falls back to /search, same pattern as other non-collection nav links.
// ponytail: only one banner image exists — slides repeat it until more are designed;
// swap in distinct images/links per slide once they exist.
const SLIDE_COUNT = 5;

export default function PromoBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDE_COUNT), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-4 md:px-[30px] py-8">
      {/* No CSS rounding here: the comp rounds only the top-left and bottom-right (~17px)
          and leaves the other two sharp, and that shape is baked into the asset's alpha
          along with the white inset outline. rounded-lg was rounding all four. overflow-hidden
          stays — it clips the sliding track. */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <Link key={i} href="/search?q=raagam" className="block relative w-full shrink-0">
              {/* The comp crops this differently per breakpoint: 1226x420 (2.92) on desktop
                  but 418x255 (1.64) on mobile — not the same art scaled, so a single asset
                  left the mobile banner far too short. */}
              <Image
                src="/figma/promo/raagam-banner-mobile.png"
                alt="Raagam Silk Cotton — Zari Check Sarees"
                width={1254}
                height={766}
                className="w-full h-auto md:hidden"
                priority={i === 0}
              />
              <Image
                src="/figma/promo/raagam-banner.png"
                alt="Raagam Silk Cotton — Zari Check Sarees"
                width={2452}
                height={840}
                className="hidden w-full h-auto md:block"
                priority={i === 0}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              i === index
                ? "w-10 h-[13px] rounded-full bg-accent"
                : "w-[22px] h-[22px] rounded-full border border-accent flex items-center justify-center"
            }
          >
            {i !== index && <span className="w-3 h-3 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </section>
  );
}
