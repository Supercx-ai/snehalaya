import Image from "next/image";

export default function BrandAmbassador() {
  return (
    <section className="px-4 md:px-[30px] py-12">
      <div className="relative rounded-[18px] border-2 border-accent/40 overflow-hidden bg-[#fef5e7]">
        {/* Desktop: photo fills the card, text overlays on the right 55%. Mobile Figma
            flips the order entirely — heading + copy come first, photo + signature sit
            in a row below — so the two layouts are built separately rather than reused. */}
        <div className="hidden md:block md:absolute md:inset-0">
          <Image src="/figma/ambassador/founder-photo.png" alt="Sneha, founder of Snehalayaa Silks" fill className="object-cover" />
        </div>

        <div className="relative md:ml-[45%] px-6 py-8 md:px-10 md:py-14 max-w-full md:max-w-[520px]">
          <h2 className="font-display font-light text-heading-sm md:text-heading-md text-ink">Wrap Yourself In Timeless Elegance With Us</h2>
          <p className="mt-6 text-base md:text-lg text-ink leading-relaxed">
            Snehalayaa represents more than just sarees; it celebrates the art of crafting one&apos;s personality. At Snehalayaa Silks, we understand this art like no one else.
          </p>
          <p className="mt-4 text-base md:text-lg text-ink leading-relaxed">
            Our commitment to customer satisfaction ensures we deliver sarees of exceptional quality, beauty, and luxury. Each piece showcases the impeccable craftsmanship of our weavers, bringing each saree to life.
          </p>
          <Image src="/figma/ambassador/signature.png" alt="Sneha" width={130} height={63} className="mt-6 hidden md:block" />
          <p className="mt-2 text-base md:text-lg text-primary hidden md:block">Founder of Snehalayaa Silks - Actress Sneha.</p>
        </div>

        <div className="md:hidden px-6 pb-8 flex items-end gap-4">
          <div className="relative w-[140px] h-[210px] rounded-lg overflow-hidden shrink-0">
            <Image src="/figma/ambassador/founder-photo.png" alt="Sneha, founder of Snehalayaa Silks" fill className="object-cover object-left" />
          </div>
          <div>
            <Image src="/figma/ambassador/signature.png" alt="Sneha" width={110} height={53} />
            <p className="mt-2 text-sm text-primary">Founder of Snehalayaa Silks - Actress Sneha.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
