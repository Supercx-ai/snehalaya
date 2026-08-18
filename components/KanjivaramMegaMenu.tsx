import Link from "next/link";
import Image from "next/image";
import { getCollection, type Product } from "@/lib/shopify";
import WishlistHeart from "./WishlistHeart";
import LocalizedPrice from "./LocalizedPrice";

// Kanjivaram dropdown — Figma node 2305:34 (homepage frame with the menu open):
// floating white panel (1218 wide, radius 5) with two 16px link columns (hairline under
// each link) and three 224px product cards on the right. Handles verified live.
const COLUMN_1 = [
  { label: "Korvai Kanjivarams", handle: "korvai-2" },
  { label: "Kattam Kanjivarams", handle: "kattam-1" },
  { label: "Butta Kanjivarams", handle: "butta" },
  { label: "Soft Silk Kanjivarams", handle: "soft-silk-198" },
  { label: "Tissue Kanjivarams", handle: "tissue-silk-1" },
];
const COLUMN_2 = [
  { label: "Brocade Kanjivarams", handle: "brocade-1" },
  { label: "Borderless Kanjivarams", handle: "borderless-1" },
  { label: "Printed Kanjivarams", handle: "printed-kanjivarams" },
];

function SubLink({ label, handle }: { label: string; handle: string }) {
  return (
    <Link
      href={`/collections/${handle}`}
      className="block border-b border-black/10 pb-4 text-lg text-ink hover:text-primary"
    >
      {label}
    </Link>
  );
}

// Simpler than ProductCard on purpose — the Figma menu cards have no Find-Similar bar
// or quick-add, just photo (heart chip, New badge), label, title, price.
function MenuProductCard({ product: p }: { product: Product }) {
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(p.priceRange.minVariantPrice.amount);

  return (
    <Link href={`/products/${p.handle}`} className="block w-[224px] shrink-0">
      <div className="relative aspect-[224/314] overflow-hidden rounded-md bg-border-subtle">
        {p.featuredImage && (
          <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill sizes="224px" className="object-cover" />
        )}
        <div className="absolute right-2.5 top-2.5">
          <WishlistHeart
            item={{
              handle: p.handle,
              title: p.title,
              image: p.featuredImage?.url ?? null,
              amount: p.priceRange.minVariantPrice.amount,
              currencyCode: p.priceRange.minVariantPrice.currencyCode,
            }}
          />
        </div>
        {p.tags?.some((t) => t.toLowerCase() === "new") && (
          <span className="absolute bottom-2.5 left-2.5 rounded-sm bg-burgundy px-2 py-0.5 text-tiny uppercase tracking-wide2 text-cream">
            New
          </span>
        )}
      </div>
      <div className="mt-2.5">
        {p.weaveType?.value && <p className="text-label uppercase tracking-wide2 text-accent">{p.weaveType.value}</p>}
        <p className="mt-0.5 truncate font-display text-card-title text-ink">{p.title}</p>
        <p className="mt-0.5 flex items-baseline gap-2 text-sm font-medium text-ink">
          <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
          {onSale && compareAt && (
            <span className="text-2xs font-normal text-ink-faint line-through">
              <LocalizedPrice handle={p.handle} amount={compareAt.amount} currencyCode={compareAt.currencyCode} format="currency" />
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export default async function KanjivaramMegaMenu() {
  const collection = await getCollection("kanjivaram-silk", { first: 3 });
  const products = collection?.products.nodes ?? [];

  return (
    <div className="px-4 pt-1 md:px-8">
      <div className="mx-auto max-w-[1218px] rounded-[5px] bg-white px-9 py-7 shadow-[0_24px_48px_rgba(23,23,23,0.16)]">
        <div className="flex gap-10">
          <div className="flex shrink-0 gap-8 pt-1.5">
            <div className="flex w-[180px] flex-col gap-4">
              {COLUMN_1.map((item) => <SubLink key={item.handle} {...item} />)}
            </div>
            <div className="flex w-[180px] flex-col gap-4">
              {COLUMN_2.map((item) => <SubLink key={item.handle} {...item} />)}
              <Link href="/collections/kanjivaram-silk" className="block pb-4 text-lg text-burgundy hover:text-primary">
                View More
              </Link>
            </div>
          </div>

          {products.length > 0 && (
            <div className="flex min-w-0 flex-1 justify-end gap-4 overflow-hidden">
              {products.map((p) => <MenuProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
