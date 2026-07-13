import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/shopify";
import AddToCart from "@/components/AddToCart";
import ProductGallery from "@/components/ProductGallery";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";
import SizeGuide from "@/components/SizeGuide";
import ReviewsWidget from "@/components/ReviewsWidget";
import WhatsAppCTA from "@/components/WhatsAppCTA";

export const revalidate = 3600; // ISR

// Pre-render existing product pages at build; new handles render on-demand then cache.
export async function generateStaticParams() {
  const products = await getProducts(100);
  return products.map((p) => ({ handle: p.handle }));
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const variant = product.variants.nodes[0]; // simple store: buy the first variant
  const images = product.images.nodes.length > 0 ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const isSilk = product.silkMark?.value === "true" || product.tags.some((t) => t.toLowerCase() === "silk-mark");

  return (
    <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
      <ProductGallery images={images} title={product.title} />

      <div>
        <h1 style={{ marginTop: 0, marginBottom: "0.25rem" }}>{product.title}</h1>
        {isSilk && (
          <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 999, background: "#fff3cd", color: "#7a5c00", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Silk Mark Certified
          </span>
        )}
        <p style={{ fontSize: "1.2rem" }}>
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>
        <p style={{ color: "#444", lineHeight: 1.6 }}>{product.description}</p>

        {product.blousePiece?.value && (
          <p style={{ color: "#444" }}><strong>Blouse piece:</strong> {product.blousePiece.value}</p>
        )}
        <SizeGuide />

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", margin: "1rem 0" }}>
          <AddToCart merchandiseId={variant?.id} soldOut={!variant?.availableForSale} />
          <WishlistButton />
          <ShareButton title={product.title} />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <ReviewsWidget />
        </div>
      </div>

      <WhatsAppCTA text={`Hi! I'm interested in "${product.title}" — is it available?`} />
    </main>
  );
}
