import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts, getProductRecommendations } from "@/lib/shopify";
import ProductGrid from "@/components/ProductGrid";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import AddToCart from "@/components/AddToCart";
import BuyNowButton from "@/components/BuyNowButton";
import ProductGallery from "@/components/ProductGallery";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";
import SizeGuide from "@/components/SizeGuide";
import ReviewsWidget from "@/components/ReviewsWidget";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ProductAttributes from "@/components/ProductAttributes";
import RecentlyViewed from "@/components/RecentlyViewed";
import LocalizedPrice from "@/components/LocalizedPrice";
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

  const variant = product.variants.nodes[0]; // simple store: buy the first variant
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
    <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
      <ProductGallery images={images} title={product.title} />

      <div>
        <h1 style={{ marginTop: 0, marginBottom: "0.25rem" }}>{product.title}</h1>
        <p style={{ fontSize: "1.2rem" }}>
          <LocalizedPrice
            handle={product.handle}
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
        </p>
        <p style={{ color: "#444", lineHeight: 1.6 }}>{product.description}</p>

        <ProductAttributes metafields={product.metafields} />
        <SizeGuide />

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", margin: "1rem 0" }}>
          <AddToCart
            merchandiseId={variant?.id}
            soldOut={!variant?.availableForSale}
            item={{ id: product.id, title: product.title, amount: product.priceRange.minVariantPrice.amount, currencyCode: product.priceRange.minVariantPrice.currencyCode }}
          />
          <BuyNowButton
            merchandiseId={variant?.id}
            soldOut={!variant?.availableForSale}
            item={{ id: product.id, title: product.title, amount: product.priceRange.minVariantPrice.amount, currencyCode: product.priceRange.minVariantPrice.currencyCode }}
          />
          <WishlistButton
            item={{
              handle: product.handle,
              title: product.title,
              image: product.featuredImage?.url ?? null,
              amount: product.priceRange.minVariantPrice.amount,
              currencyCode: product.priceRange.minVariantPrice.currencyCode,
            }}
          />
          <ShareButton title={product.title} />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <ReviewsWidget />
        </div>
      </div>

      <WhatsAppCTA text={`Hi! I'm interested in "${product.title}" — is it available?`} />

      {similar.length > 0 && (
        <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>You may also like</h2>
          <ProductGrid products={similar} />
        </div>
      )}

      <div style={{ gridColumn: "1 / -1" }}>
        <RecentlyViewed
          current={{
            handle: product.handle,
            title: product.title,
            image: product.featuredImage?.url ?? null,
            amount: product.priceRange.minVariantPrice.amount,
            currencyCode: product.priceRange.minVariantPrice.currencyCode,
          }}
        />
      </div>
    </main>
    </>
  );
}
