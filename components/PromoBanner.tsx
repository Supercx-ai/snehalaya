import Image from "next/image";
import Link from "next/link";

// "Raagam" is a promotional line name baked into the Figma banner artwork, not a live
// collection — falls back to /search, same pattern as other non-collection nav links.
// The dots are decorative; the design only supplies one slide's worth of content.
export default function PromoBanner() {
  return (
    <section className="max-w-[1280px] mx-auto px-9 py-8">
      <Link href="/search?q=raagam" className="block relative rounded-lg overflow-hidden">
        <Image src="/figma/promo/raagam-banner.png" alt="Raagam Silk Cotton — Zari Check Sarees" width={1226} height={420} className="w-full h-auto" />
      </Link>
      <div className="mt-4 flex items-center justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={i === 2 ? "w-10 h-[13px] rounded-full bg-accent" : "w-[22px] h-[22px] rounded-full border border-accent flex items-center justify-center"}>
            {i !== 2 && <span className="w-3 h-3 rounded-full bg-primary" />}
          </span>
        ))}
      </div>
    </section>
  );
}
