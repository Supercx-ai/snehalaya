import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/shopify";

export const revalidate = 3600; // ISR

export default async function BlogIndex() {
  const blog = await getArticles();

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>{blog?.title ?? "Blog"}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
        {blog?.articles.nodes.map((a) => (
          <Link key={a.handle} href={`/blog/${a.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
            {a.image && (
              <Image src={a.image.url} alt={a.image.altText ?? a.title} width={a.image.width} height={a.image.height} style={{ width: "100%", height: "auto", borderRadius: 8 }} />
            )}
            <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{a.title}</h3>
            <p style={{ margin: 0, color: "#555", fontSize: "0.9rem" }}>{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
