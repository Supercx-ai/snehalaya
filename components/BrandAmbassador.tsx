import Image from "next/image";

// Comp: node 2191:853. The group is 1211x535; the cream card is only ~434 tall and sits
// flush to the bottom, while the founder cutout (node 2191:862, 362x535) runs the group's
// full height — so she breaks out above the card's top edge. That's why the card can't be
// the positioning context here: it clips, and the previous build had the photo inside it
// with object-cover, which cropped her head off and lost the overhang entirely.
const CARD_H = 437; // comp node 2191:857
const GROUP_H = 591; // comp 535; model scaled up per feedback, card height unchanged
const PHOTO_W = 400; // comp 362
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
        {/* Card per node 2191:857 — #fef5e7 under a gold floral plate, 2px #f0ce9a inside
            stroke, radius 18. The florals live at the two edges with a transparent middle,
            so object-cover keeps them pinned to the sides as the card widens. */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden rounded-[18px] border-2 border-[#f0ce9a] bg-[#fef5e7]"
          style={{ height: CARD_H }}
        >
          <Image src="/figma/ambassador/floral.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <Image
          src="/figma/ambassador/founder-photo.png"
          alt="Sneha, founder of Snehalayaa Silks"
          width={PHOTO_W}
          height={GROUP_H}
          priority={false}
          sizes="362px"
          className="absolute bottom-0 -left-3 object-contain object-bottom"
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

      {/* Mobile — comp node 2191:1749 (419x470). Background is the comp's own cream+floral
          composite: Figma places that floral with a Crop fill, which background-size can't
          reproduce. The model is 188x280 (45% of the card) sitting FLUSH to the bottom edge;
          the previous build floated a 140x210 thumbnail with cream space beneath it. */}
      <div className="md:hidden relative overflow-hidden rounded-[18px] border-2 border-[#f0ce9a] bg-[#fef5e7]">
        <Image src="/figma/ambassador/card-mobile.png" alt="" fill sizes="100vw" className="object-cover" />

        <div className="relative px-5 pt-6">{copy}</div>

        <div className="relative mt-5 flex items-end gap-2 pl-0 pr-5">
          <Image
            src="/figma/ambassador/founder-photo.png"
            alt="Sneha, founder of Snehalayaa Silks"
            width={188}
            height={280}
            sizes="45vw"
            className="-ml-2 w-[60%] h-auto shrink-0 object-contain object-bottom"
          />
          <div className="pb-7">
            <Image src="/figma/ambassador/signature.png" alt="Sneha" width={110} height={53} />
            <p className="mt-1 text-xs text-primary">Founder of Snehalayaa Silks - Actress Sneha.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
