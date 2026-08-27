import Image from "next/image";

// Comp: node 2191:853. The group is 1211x535; the cream card is only ~434 tall and sits
// flush to the bottom, while the founder cutout (node 2191:862, 362x535) runs the group's
// full height — so she breaks out above the card's top edge. That's why the card can't be
// the positioning context here: it clips, and the previous build had the photo inside it
// with object-cover, which cropped her head off and lost the overhang entirely.
const CARD_H = 434;
const GROUP_H = 535;
const PHOTO_W = 362;
const GAP = 40; // comp's auto-layout spacing between photo and copy

export default function BrandAmbassador() {
  const copy = (
    <>
      <h2 className="font-display font-light text-heading-sm md:text-heading-md text-ink">Wrap Yourself In Timeless Elegance With Us</h2>
      <p className="mt-6 text-base md:text-lg text-ink leading-relaxed">
        Snehalayaa represents more than just sarees; it celebrates the art of crafting one&apos;s personality. At Snehalayaa Silks, we understand this art like no one else.
      </p>
      <p className="mt-4 text-base md:text-lg text-ink leading-relaxed">
        Our commitment to customer satisfaction ensures we deliver sarees of exceptional quality, beauty, and luxury. Each piece showcases the impeccable craftsmanship of our weavers, bringing each saree to life.
      </p>
    </>
  );

  return (
    <section className="px-4 md:px-[30px] py-12">
      {/* Desktop — fixed-height stage so the cutout can overhang the card. */}
      <div className="relative hidden md:block" style={{ height: GROUP_H }}>
        <div
          className="absolute inset-x-0 bottom-0 rounded-[18px] border-2 border-accent/40 bg-[#fef5e7]"
          style={{ height: CARD_H }}
        />
        <Image
          src="/figma/ambassador/founder-photo.png"
          alt="Sneha, founder of Snehalayaa Silks"
          width={PHOTO_W}
          height={GROUP_H}
          priority={false}
          sizes="362px"
          className="absolute bottom-0 left-0 object-contain object-bottom"
          style={{ width: PHOTO_W, height: GROUP_H }}
        />
        <div
          className="absolute bottom-0 right-0 flex flex-col justify-center pr-10"
          style={{ height: CARD_H, left: PHOTO_W + GAP }}
        >
          <div className="max-w-[760px]">
            {copy}
            <Image src="/figma/ambassador/signature.png" alt="Sneha" width={130} height={63} className="mt-6" />
            <p className="mt-2 text-base md:text-lg text-primary">Founder of Snehalayaa Silks - Actress Sneha.</p>
          </div>
        </div>
      </div>

      {/* Mobile — comp reorders to copy first, then photo + signature side by side. */}
      <div className="md:hidden rounded-[18px] border-2 border-accent/40 bg-[#fef5e7] px-6 py-8">
        {copy}
        <div className="mt-6 flex items-end gap-4">
          <Image
            src="/figma/ambassador/founder-photo.png"
            alt="Sneha, founder of Snehalayaa Silks"
            width={140}
            height={210}
            className="w-[140px] h-[210px] object-contain object-bottom shrink-0"
          />
          <div>
            <Image src="/figma/ambassador/signature.png" alt="Sneha" width={110} height={53} />
            <p className="mt-2 text-sm text-primary">Founder of Snehalayaa Silks - Actress Sneha.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
