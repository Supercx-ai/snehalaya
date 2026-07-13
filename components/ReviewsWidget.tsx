// Judge.me widget — drop-in once the shop token exists.
// Docs: https://judge.me/support/en_US/article/widget-installation-headless
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN;

export default function ReviewsWidget() {
  if (!SHOP_DOMAIN || !PUBLIC_TOKEN) {
    // ponytail: needs NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN + NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN (Judge.me → Settings → Integrations → Judge.me API)
    return null;
  }
  return (
    <div
      id="judgeme_product_reviews"
      data-judgeme-shop-domain={SHOP_DOMAIN}
      data-judgeme-token={PUBLIC_TOKEN}
    />
  );
}
