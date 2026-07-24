import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCollection, getCollections } from "@/lib/shopify";
import { loadMoreCollectionProducts } from "@/lib/collection";
import { generateCollectionStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import InfiniteProducts from "@/components/InfiniteProducts";
import CollectionSidebar from "@/components/CollectionSidebar";
import SortSelect from "@/components/SortSelect";
import FilterForm from "@/components/FilterForm";

export const revalidate = 3600; // ISR: rebuild at most hourly; product-update webhook busts it sooner

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  const collections = await getCollections(100);
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle, { first: 1 });
  if (!collection) return {};
  return { title: collection.title, description: collection.description };
}

const SORTS: Record<string, { sortKey?: string; reverse?: boolean; label: string }> = {
  "best-selling": { sortKey: "BEST_SELLING", label: "Best selling" },
  "price-asc": { sortKey: "PRICE", reverse: false, label: "Price: low to high" },
  "price-desc": { sortKey: "PRICE", reverse: true, label: "Price: high to low" },
  newest: { sortKey: "CREATED", reverse: true, label: "Newest" },
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ f?: string | string[]; minPrice?: string; maxPrice?: string; sort?: string }>;
}) {
  const { handle } = await params;
  const sp = await searchParams;

  const selectedInputs = sp.f ? (Array.isArray(sp.f) ? sp.f : [sp.f]) : [];
  const filters = selectedInputs.map((f) => JSON.parse(f));
  if (sp.minPrice || sp.maxPrice) {
    filters.push({ price: { min: sp.minPrice ? Number(sp.minPrice) : undefined, max: sp.maxPrice ? Number(sp.maxPrice) : undefined } });
  }
  const sort = (sp.sort && SORTS[sp.sort]) || undefined;

  const collection = await getCollection(handle, { first: 12, filters, sortKey: sort?.sortKey, reverse: sort?.reverse });
  if (!collection) notFound();

  const { nodes, filters: availableFilters, pageInfo } = collection.products;
  const url = `${SITE_URL}/collections/${handle}`;

  // Carries the current filter/price selection into SortSelect so a sort change
  // re-navigates without dropping whatever's already applied.
  const baseQuery = new URLSearchParams();
  selectedInputs.forEach((f) => baseQuery.append("f", f));
  if (sp.minPrice) baseQuery.set("minPrice", sp.minPrice);
  if (sp.maxPrice) baseQuery.set("maxPrice", sp.maxPrice);

  return (
    <>
    <JsonLd
      data={[
        generateCollectionStructuredData(collection, url),
        generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: collection.title, url },
        ]),
      ]}
    />
    <main className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-9 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-ink-secondary">{collection.title}</span>
        </nav>

        <h1 className="mt-3 font-display font-light text-heading-sm md:text-heading-lg text-ink">{collection.title}</h1>
        {collection.description && <p className="mt-2 max-w-[720px] text-base text-ink-subtle">{collection.description}</p>}

        <FilterForm basePath={`/collections/${handle}`} className="mt-8 flex flex-col md:flex-row gap-8 items-start">
          <input type="hidden" name="sort" value={sp.sort ?? ""} />
          <aside className="w-full md:w-[260px] shrink-0 md:sticky md:top-24">
            <CollectionSidebar
              filters={availableFilters}
              selectedInputs={selectedInputs}
              minPrice={sp.minPrice}
              maxPrice={sp.maxPrice}
            />
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex justify-end mb-6">
              <SortSelect basePath={`/collections/${handle}`} currentSort={sp.sort ?? ""} baseQuery={baseQuery.toString()} />
            </div>

            <InfiniteProducts
              key={handle + JSON.stringify(sp)}
              resetKey={handle + JSON.stringify(sp)}
              initial={nodes}
              cursor={pageInfo.endCursor}
              hasNext={pageInfo.hasNextPage}
              loadMore={loadMoreCollectionProducts.bind(null, handle, filters, sort?.sortKey, sort?.reverse)}
            />
          </div>
        </FilterForm>
      </div>
    </main>
    </>
  );
}
