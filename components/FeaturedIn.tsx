import Image from "next/image";

export default function FeaturedIn() {
  return (
    <section className="px-4 md:px-[30px] py-8 text-center">
      <p className="font-display font-light text-3xl text-ink" style={{ fontVariant: "small-caps" }}>
        Featured In
      </p>
      <Image src="/figma/press/logos-strip.png" alt="Featured in Vogue India, Hindustan Times, Femina and more" width={1254} height={180} className="mt-4 mx-auto w-full max-w-[1100px] h-auto" />
    </section>
  );
}
