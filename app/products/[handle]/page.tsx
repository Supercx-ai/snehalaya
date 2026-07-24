import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProduct, getProducts, getProductRecommendations } from "@/lib/shopify";
import ProductGrid from "@/components/ProductGrid";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseBox from "@/components/ProductPurchaseBox";
import WishlistButton from "@/components/WishlistButton";
import ShareButton from "@/components/ShareButton";
import SizeGuide from "@/components/SizeGuide";
import ReviewsWidget from "@/components/ReviewsWidget";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ProductAttributes from "@/components/ProductAttributes";
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
          <span className="text-ink-secondary">{product.title}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <ProductGallery images={images} title={product.title} similarQuery={product.weaveType?.value ?? product.title} />

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-wide2 text-accent uppercase">{product.weaveType?.value}</p>
                <h1 className="mt-1 font-display font-light text-heading-sm md:text-heading-lg text-ink">{product.title}</h1>
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
            <p className="mt-2 text-sm text-ink-subtle leading-relaxed">{product.description}</p>

            <div className="mt-6">
              <ProductPurchaseBox
                productId={product.id}
                handle={product.handle}
                title={product.title}
                compareAtPrice={product.compareAtPriceRange?.minVariantPrice ?? null}
                options={product.options}
                variants={product.allVariants}
              />
            </div>

            <DeliveryEstimate shipDays={product.metafields.ship_days} />

            <SizeGuide />

            <div className="mt-6">
              <ProductAttributes metafields={product.metafields} />
              <ShippingReturns />
            </div>

            <div className="mt-6">
              <TrustBadges />
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
            <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-ink text-center">You May Also Like</h2>
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
