import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCollection, getCollections } from "@/lib/shopify";
import { loadMoreCollectionProducts } from "@/lib/collection";
import { generateCollectionStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import InfiniteProducts from "@/components/InfiniteProducts";
import CollectionSidebar, { KEYWORD_GROUPS } from "@/components/CollectionSidebar";
import MobileFilterToggle from "@/components/MobileFilterToggle";
import SortSelect from "@/components/SortSelect";
import FilterForm from "@/components/FilterForm";
import PlpChips from "@/components/PlpChips";
import ShopByWeave from "@/components/ShopByWeave";

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

type SP = Record<string, string | string[] | undefined>;
const asList = (v: string | string[] | undefined) => (v ? (Array.isArray(v) ? v : [v]) : []);
const asOne = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// Full current query string from every param — callers drop/replace single keys.
function buildQuery(sp: SP, omit: string[] = []) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || omit.includes(k)) continue;
    asList(v).forEach((x) => params.append(k, x));
  }
  return params;
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<SP>;
}) {
  const { handle } = await params;
  const sp = await searchParams;

  const selectedInputs = asList(sp.f);
  const filters = selectedInputs.map((f) => JSON.parse(f));
  const minPrice = asOne(sp.minPrice);
  const maxPrice = asOne(sp.maxPrice);
  if (minPrice || maxPrice) {
    filters.push({ price: { min: minPrice ? Number(minPrice) : undefined, max: maxPrice ? Number(maxPrice) : undefined } });
  }
  const sortParam = asOne(sp.sort) ?? "";
  const sort = SORTS[sortParam];
  const disc = asOne(sp.disc);

  const keywordSelections = Object.fromEntries(KEYWORD_GROUPS.map((g) => [g.param, asList(sp[g.param])]));
  const keywordGroups = Object.values(keywordSelections).filter((g) => g.length > 0);

  const [collection, collections] = await Promise.all([
    getCollection(handle, { first: 12, filters, sortKey: sort?.sortKey, reverse: sort?.reverse }),
    getCollections(50),
  ]);
  if (!collection) notFound();

  const { nodes, filters: availableFilters, pageInfo } = collection.products;
  const url = `${SITE_URL}/collections/${handle}`;

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
    {/* PLP comp (MacBook Air - 5, node 2239-11): cream page, 30px gutters, fluid width. */}
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-4 md:pt-5 md:pb-10">
        <nav className="flex items-center gap-1.5 text-[11px] text-[#999]">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-ink">Collections</Link>
          <span>/</span>
          <span className="text-[#666]">{collection.title}</span>
        </nav>
        <h1 className="sr-only">{collection.title}</h1>

        <div className="mt-6">
          <ShopByWeave bare />
        </div>

        <FilterForm
          basePath={`/collections/${handle}`}
          className="mt-10 flex flex-col lg:grid lg:grid-cols-[272px_minmax(0,1fr)] gap-x-6 gap-y-6 items-start"
        >
          <input type="hidden" name="sort" value={sortParam} />
          {sp.sale && <input type="hidden" name="sale" value={asOne(sp.sale)} />}
          <MobileFilterToggle>
            <CollectionSidebar
              filters={availableFilters}
              selectedInputs={selectedInputs}
              minPrice={minPrice}
              maxPrice={maxPrice}
              collections={collections.filter((c) => c.handle !== handle).map((c) => ({ handle: c.handle, title: c.title }))}
              keywordSelections={keywordSelections}
              discount={disc}
              showApply={false}
            />
          </MobileFilterToggle>

          <div className="flex-1 min-w-0 w-full">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <PlpChips
                basePath={`/collections/${handle}`}
                query={buildQuery(sp).toString()}
                currentSort={sortParam}
                saleActive={Boolean(sp.sale)}
              />
              <SortSelect basePath={`/collections/${handle}`} currentSort={sortParam} baseQuery={buildQuery(sp, ["sort"]).toString()} />
            </div>

            <InfiniteProducts
              key={handle + JSON.stringify(sp)}
              resetKey={handle + JSON.stringify(sp)}
              initial={nodes}
              cursor={pageInfo.endCursor}
              hasNext={pageInfo.hasNextPage}
              loadMore={loadMoreCollectionProducts.bind(null, handle, filters, sort?.sortKey, sort?.reverse)}
              plp
              saleOnly={Boolean(sp.sale)}
              keywordGroups={keywordGroups}
              minDiscount={disc ? Number(disc) : undefined}
            />
          </div>
        </FilterForm>
      </div>
    </main>
    </>
  );
}
