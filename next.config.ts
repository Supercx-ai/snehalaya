import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Shopify serves product images from this CDN — next/image needs it allow-listed.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default config;
