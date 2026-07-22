import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";

export const revalidate = 3600; // ISR

export default async function CollectionsIndex() {
  const collections = await getCollections(50);

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>All Collections</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
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
      </div>
    </main>
  );
}
