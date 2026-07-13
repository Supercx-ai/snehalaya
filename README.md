# Xtracut — Next.js + Shopify headless storefront

Minimal App Router storefront on the Shopify Storefront API. Native `fetch` for
GraphQL (no Apollo/SDK), ISR + on-demand revalidation via webhooks, `next/image`.

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill in:
   - `SHOPIFY_STORE_DOMAIN` — `your-shop.myshopify.com`
   - `SHOPIFY_STOREFRONT_TOKEN` — Admin → Settings → Apps → Develop apps → create app → Storefront API access token
   - `SHOPIFY_WEBHOOK_SECRET` — used to verify the revalidate webhook
3. `npm run dev`

## How it works

| File | Role |
|------|------|
| `lib/shopify.ts` | GraphQL client + queries, cache-tagged for revalidation |
| `app/page.tsx` | Product grid, `revalidate = 3600` (ISR) |
| `app/products/[handle]/page.tsx` | Product page, `generateStaticParams` pre-renders, ISR |
| `app/api/revalidate/route.ts` | Shopify webhook → HMAC verify → `revalidateTag` |

## Webhooks

In Shopify Admin → Settings → Notifications → Webhooks (or via Admin API), add
`products/create`, `products/update`, `products/delete` pointing to
`https://<your-domain>/api/revalidate`. Edits go live within seconds instead of
waiting for the hourly ISR window.

## Not included (add when needed)

- Cart / checkout — Storefront API `cartCreate`/`cartLinesAdd`, then redirect to `checkout.webUrl`.
- Collections, search, pagination — extend `lib/shopify.ts`.
