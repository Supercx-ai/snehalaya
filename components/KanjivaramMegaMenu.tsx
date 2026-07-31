import Link from "next/link";
import { getCollection } from "@/lib/shopify";
import ProductCard from "./ProductCard";

// ponytail: these are weave/technique sub-types Shopify has no dedicated collection or
// filter facet for — routed through /search like the other weave-name nav links, not
// invented collections. Swap to real collection handles if/when they exist.
const COLUMN_1 = ["Korvai Kanjivarams", "Kattam Kanjivarams", "Butta Kanjivarams", "Soft Silk Kanjivarams", "Tissue Kanjivarams"];
const COLUMN_2 = ["Brocade Kanjivarams", "Borderless Kanjivarams", "Printed Kanjivarams"];

function SubLink({ label }: { label: string }) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(label)}`}
      className="block pb-3 border-b border-border-subtle text-sm text-ink hover:text-primary"
    >
      {label}
    </Link>
  );
}

export default async function KanjivaramMegaMenu() {
  const collection = await getCollection("kanjivaram-silk-sarees", { first: 3 });
  const products = collection?.products.nodes ?? [];

  return (
    <div className="bg-white border-t border-border shadow-lg">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 grid grid-cols-[auto_auto_1fr] gap-x-12">
        <div className="flex flex-col gap-3 w-[200px]">
          {COLUMN_1.map((label) => <SubLink key={label} label={label} />)}
        </div>
        <div className="flex flex-col gap-3 w-[200px]">
          {COLUMN_2.map((label) => <SubLink key={label} label={label} />)}
          <Link href="/collections/kanjivaram-silk-sarees" className="text-sm text-primary font-medium">
            View More
          </Link>
        </div>

        {products.length > 0 && (
          <div className="flex gap-6 justify-end">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} showNewBadge={p.tags?.some((t) => t.toLowerCase() === "new")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
