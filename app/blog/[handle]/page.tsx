import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/shopify";

export const revalidate = 3600; // ISR

export default async function ArticlePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const article = await getArticle(handle);
  if (!article) notFound();

  return (
    <main style={{ maxWidth: 720, marginInline: "auto" }}>
      <h1 style={{ marginTop: 0 }}>{article.title}</h1>
      <p style={{ color: "#888", fontSize: "0.9rem" }}>{new Date(article.publishedAt).toLocaleDateString()}</p>
      {article.image && (
        <Image src={article.image.url} alt={article.image.altText ?? article.title} width={article.image.width} height={article.image.height} style={{ width: "100%", height: "auto", borderRadius: 8, marginBottom: "1.5rem" }} />
      )}
      {/* contentHtml comes from Shopify's own rich-text editor — trusted merchant content, same as any Liquid theme rendering it. */}
      <div dangerouslySetInnerHTML={{ __html: article.contentHtml ?? "" }} style={{ lineHeight: 1.7 }} />
    </main>
  );
}
