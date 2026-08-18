import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[480px] sm:h-[560px] md:h-[650px] overflow-hidden">
      <Image
        src="/figma/hero/background.png"
        alt="Woman draped in a handwoven silk saree"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-overlay" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display font-light text-8xl md:text-6xl leading-tight text-white">
          The Art of Finding
          <br />
          Your Perfect Saree
        </h1>
        <p className="mt-6 max-w-[443px] text-base leading-relaxed text-white">
          Discover handwoven sarees crafted for every celebration — from Muhurtham mornings to festival evenings.
        </p>

        <div className="mt-8 flex flex-col xs:flex-row justify-center gap-3 w-full max-w-[280px] xs:max-w-none">
          <Link
            href="/collections"
            className="flex items-center justify-center w-full xs:w-[195px] h-[41px] rounded-sm bg-white text-black text-2xs font-medium tracking-wide2"
          >
            Explore Collection
          </Link>
          <Link
            href="/collections/new-arrival"
            className="flex items-center justify-center w-full xs:w-[195px] h-[41px] rounded-sm border border-white text-white text-2xs font-medium tracking-wide2"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>

      {/* Decorative — matches the Figma design; no video source provided to make it functional.
          Confirmed visible on mobile too (was wrongly hidden below lg: before) — centered by
          percentage on mobile, pinned to the confirmed desktop px position from md: up. */}
      <Image
        src="/figma/hero/play-button.png"
        alt=""
        width={61}
        height={61}
        className="absolute left-1/2 -translate-x-1/2 top-[38%] md:left-[629px] md:top-[234px] md:translate-x-0 opacity-[0.14] pointer-events-none"
      />
    </section>
  );
}
