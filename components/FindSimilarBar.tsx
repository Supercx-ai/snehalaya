"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// The "Find Similar" overlay on a product card image (Figma node 2263:1917).
// Comp geometry, measured off the card frame (288.11 x 384.72 — the same 289/386 image
// box the PLP card uses): bar 264.26 x 45.7 inset ~12px left/right and ~8.5px from the
// bottom, radius 5.96, #faf7f2 at 96% over a drop shadow. Gold 8px dot, Manrope 11.71/
// 1.64px label in #67111a, and a 32px maroon square button holding a 16px white icon.
//
// Hidden until hover on pointer devices: the comp only shows it on the one hovered card,
// and the bar sits exactly where the "New" badge lives, so a permanently-visible bar would
// bury that badge on every card. Touch has no hover, so there it stays visible.
export default function FindSimilarBar({ query }: { query: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={`Find items similar to ${query}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
      className="absolute inset-x-3 bottom-2 h-[46px] rounded-md bg-[rgba(250,247,242,0.96)] shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-between pl-4 pr-2 transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
    >
      <span className="flex items-center gap-2.5 text-xs tracking-[1.64px] text-primary">
        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
        Find Similar
      </span>
      <span className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center shrink-0">
        <Image src="/figma/icon-image-search-white.svg" alt="" width={16} height={16} />
      </span>
    </button>
  );
}
