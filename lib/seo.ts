import type { ProductDetail, Collection, Product } from "./shopify";

// No aggregateRating field here on purpose — Google penalizes fabricated review markup.
// Add it once Judge.me is connected and real rating data exists.
export function generateProductStructuredData(product: ProductDetail, url: string) {
  const variant = product.variants.nodes[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.nodes.map((i) => i.url),
    url,
    brand: { "@type": "Brand", name: "Snehalayaa Silks" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: variant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function generateCollectionStructuredData(collection: Collection & { products?: { nodes: Product[] } }, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    url,
    itemListElement: (collection.products?.nodes ?? []).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${new URL(url).origin}/products/${p.handle}`,
    })),
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
