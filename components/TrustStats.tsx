import Image from "next/image";

export default function TrustStats() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-6">
      {/* Mobile Figma shows these at real size (not this whole banner shrunk to fit,
          which would make the text illegible) — scroll horizontally instead. */}
      <div className="overflow-x-auto [scrollbar-width:none]">
        <Image
          src="/figma/stats/stats-bar.png"
          alt="5M+ successful deliveries, 1500+ designers, 24/7 customer support, 75+ countries served"
          width={1222}
          height={193}
          className="h-auto w-[700px] max-w-none md:w-full"
        />
      </div>
    </section>
  );
}
