import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProduct, getProducts, getProductRecommendations, getProductsByQuery } from "@/lib/shopify";
import ColourwaySwatches, { type Colourway } from "@/components/ColourwaySwatches";
import ProductGrid from "@/components/ProductGrid";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseBox from "@/components/ProductPurchaseBox";
import WishlistButton from "@/components/WishlistButton";
import ShareButton from "@/components/ShareButton";
import ReviewsWidget from "@/components/ReviewsWidget";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ProductAttributes from "@/components/ProductAttributes";
import OffersBox from "@/components/OffersBox";
import ShippingReturns from "@/components/ShippingReturns";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import TrustBadges from "@/components/TrustBadges";
import CustomerSupport from "@/components/CustomerSupport";
import RecentlyViewed from "@/components/RecentlyViewed";
import ViewItemTracker from "@/components/ViewItemTracker";

export const revalidate = 3600; // ISR

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Pre-render existing product pages at build; new handles render on-demand then cache.
export async function generateStaticParams() {
  const products = await getProducts(100);
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    openGraph: { images: product.featuredImage ? [product.featuredImage.url] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const images = product.images.nodes.length > 0 ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const url = `${SITE_URL}/products/${product.handle}`;
  // Shopify's own recommendation model — real signal today, unlike a hand-rolled
  // colour/weave/border scorer that would need metafields that don't exist yet.
  const similar = await getProductRecommendations(product.id);

  // Colourways for the design's "Color" swatches — each colourway is its own product
  // ("Mint Blue Raw Silk Saree", "Pink Raw Silk Saree"). Shared style = title minus the
  // leading colour words (and any trailing SKU token like "SSBG03205").
  const isSku = (w: string) => /^[a-z]{2,6}\d{3,}$/i.test(w);
  const stripSku = (t: string) => t.trim().split(/\s+/).filter((w) => !isSku(w)).join(" ");
  const words = stripSku(product.title).split(/\s+/);
  const phrase = words.slice(-3).join(" ");
  let colourways: Colourway[] = [];
  if (words.length > 3) {
    const res = await getProductsByQuery(`title:"${phrase}"`, { first: 10 }).catch(() => null);
    colourways = (res?.nodes ?? [])
      .filter((p) => stripSku(p.title).endsWith(phrase) && stripSku(p.title) !== phrase)
      .slice(0, 6)
      .map((p) => ({
        handle: p.handle,
        name: stripSku(p.title).slice(0, -phrase.length).trim(),
        image: p.featuredImage?.url ?? null,
      }));
  }

  return (
    <>
    <JsonLd
      data={[
        generateProductStructuredData(product, url),
        generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: product.title, url },
        ]),
      ]}
    />
    <ViewItemTracker
      id={product.id}
      title={product.title}
      amount={product.priceRange.minVariantPrice.amount}
      currencyCode={product.priceRange.minVariantPrice.currencyCode}
    />
    <main className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-9 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          {/* ponytail: category path is a mockup — no collection hierarchy on the product yet */}
          <span>Women</span>
          <span>/</span>
          <span>Sarees</span>
          <span>/</span>
          <span className="text-ink-secondary">{product.title}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="md:sticky md:top-6 self-start">
            <ProductGallery images={images} title={product.title} similarQuery={product.weaveType?.value ?? product.title} />
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-wide2 text-accent uppercase">{product.weaveType?.value}</p>
                <h1 className="mt-1 font-display font-light text-heading-sm md:text-heading-lg text-ink leading-tight">{product.title}</h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ShareButton title={product.title} />
                <WishlistButton
                  item={{
                    handle: product.handle,
                    title: product.title,
                    image: product.featuredImage?.url ?? null,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode,
                  }}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-ink leading-relaxed">{product.description}</p>

            <div className="mt-6">
              <ProductPurchaseBox
                productId={product.id}
                handle={product.handle}
                title={product.title}
                compareAtPrice={product.compareAtPriceRange?.minVariantPrice ?? null}
                options={product.options}
                variants={product.allVariants}
                colourways={<ColourwaySwatches items={colourways} currentHandle={product.handle} />}
              />
            </div>

            <DeliveryEstimate shipDays={product.metafields.ship_days} />

            <div className="mt-6">
              <TrustBadges />
            </div>

            <OffersBox />

            <div className="mt-6">
              <ProductAttributes metafields={product.metafields} description={product.description} />
              <ShippingReturns />
            </div>

            <div className="mt-6">
              <CustomerSupport chatText={`Hi! I have a question about "${product.title}".`} />
            </div>

            <div className="mt-8">
              <ReviewsWidget />
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            {/* Left-aligned serif heading — "Similar Items", PDP node 2245:865 */}
            <h2 className="font-display font-light text-heading-sm md:text-heading-md text-ink">Similar Items</h2>
            <div className="mt-8">
              <ProductGrid products={similar} />
            </div>
          </div>
        )}
      </div>

      <RecentlyViewed
        current={{
          handle: product.handle,
          title: product.title,
          image: product.featuredImage?.url ?? null,
          amount: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        }}
      />
    </main>

    <WhatsAppCTA text={`Hi! I'm interested in "${product.title}" — is it available?`} />
    </>
  );
}
