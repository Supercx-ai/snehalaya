import type { Metadata } from "next";
import { topPicks } from "@/lib/search";
import { getColorFilterValues } from "@/lib/shopify";
import ImageSearchResults from "@/components/ImageSearchResults";

export const metadata: Metadata = { title: "Search by Image", robots: { index: false } };

export default async function ImageSearchPage() {
  const [fallback, colours] = await Promise.all([topPicks(), getColorFilterValues()]);
  return <ImageSearchResults fallback={fallback} colours={colours.map((c) => c.label)} />;
}
