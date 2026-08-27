import Image from "next/image";

// Press logos come from comp node 2191:92 (the row only — "Featured In" stays live text
// here rather than being baked into the image). The previous asset was a 1254px export
// whose rings were the pre-rebrand purple #6f1e60; this one is 3324px with the comp's
// maroon #67111a, so it stays sharp now that the strip runs the full section width.
export default function FeaturedIn() {
  return (
    <section className="px-4 md:px-[30px] py-8 text-center">
      <p className="font-display font-light text-3xl text-ink" style={{ fontVariant: "small-caps" }}>
        Featured In
      </p>

      {/* Six circles squeezed into a phone width become unreadable, so mobile holds them at
          a fixed size and scrolls (bleeding to the screen edges); md: up it just fills. */}
      <div className="mt-4 -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0 [scrollbar-width:none]">
        <Image
          src="/figma/press/logos-strip.png"
          alt="Featured in Thozhi, Vogue India, Hindustan Times, Femina and The Times of India"
          width={3324}
          height={450}
          sizes="(min-width: 768px) 100vw, 760px"
          className="h-auto w-[760px] max-w-none md:w-full"
        />
      </div>
    </section>
  );
}
