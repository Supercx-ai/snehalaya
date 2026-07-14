import Image from "next/image";
import Link from "next/link";
import { getCollections, getProductsPage } from "@/lib/shopify";
import Products from "@/components/Products";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ReviewsWidget from "@/components/ReviewsWidget";
import InstagramFeed from "@/components/InstagramFeed";
import BrandAmbassador from "@/components/BrandAmbassador";
import ColourPicker from "@/components/ColourPicker";

export const revalidate = 600; // ISR: rebuild at most every 10 min; webhook busts it sooner

export default async function Home() {
  // One round-trip each, in parallel.
  const [collections, firstPage] = await Promise.all([getCollections(8), getProductsPage(12)]);
  const banner = collections.find((c) => c.image); // first collection with an image = hero

  return (
    <main>
      {banner?.image && (
        <Link href={`/collections/${banner.handle}`} style={{ display: "block", position: "relative", marginBottom: "2rem" }}>
          <Image
            src={banner.image.url}
            alt={banner.image.altText ?? banner.title}
            width={banner.image.width}
            height={banner.image.height}
            priority
            style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 12 }}
          />
          <span style={{ position: "absolute", left: 24, bottom: 24, color: "#fff", fontSize: "2rem", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
            {banner.title}
          </span>
        </Link>
      )}

      {collections.length > 0 && (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
              {c.image && (
                <Image
                  src={c.image.url}
                  alt={c.image.altText ?? c.title}
                  width={c.image.width}
                  height={c.image.height}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }}
                />
              )}
              <p style={{ margin: "0.5rem 0 0", fontWeight: 600 }}>{c.title}</p>
            </Link>
          ))}
        </section>
      )}

      <section style={{ marginBottom: "3rem" }}>
        <h2>Shop by colour</h2>
        <ColourPicker />
      </section>

      <BrandAmbassador />

      <Products initial={firstPage.nodes} cursor={firstPage.pageInfo.endCursor} hasNext={firstPage.pageInfo.hasNextPage} />

      <section style={{ margin: "3rem 0" }}>
        <h2>Customer reviews</h2>
        <ReviewsWidget />
      </section>

      <section style={{ margin: "3rem 0" }}>
        <h2>From Instagram</h2>
        <InstagramFeed />
      </section>

      <WhatsAppCTA />
    </main>
  );
}
