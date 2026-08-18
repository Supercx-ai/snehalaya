"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  cartDiscountCodesUpdate,
  cartBuyerIdentityUpdate,
  cartCheckoutIdentityUpdate,
  getCart as fetchCart,
  getProductRecommendations,
  getProducts,
  type CountryCode,
} from "./shopify";
import { splitName, toE164India, type CheckoutAddress } from "./checkout-address";
import { getSelectedCountry, setCurrency } from "./currency";

const COOKIE = "cartId";

// Read the current visitor's cart (null if they have none yet).
export async function getCart() {
  const id = (await cookies()).get(COOKIE)?.value;
  return id ? fetchCart(id, await getSelectedCountry()) : null;
}

async function requireCartId() {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) throw new Error("No active cart");
  return id;
}

// Add a variant. Creates a cart on first add; reuses it after.
// If the stored cart is gone (expired/checked out), start a fresh one.
export async function addToCart(merchandiseId: string, quantity = 1) {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  const country = await getSelectedCountry();
  const cart = (id && (await cartLinesAdd(id, merchandiseId, quantity, country))) || (await cartCreate(merchandiseId, quantity, country));
  if (cart) jar.set(COOKIE, cart.id, { httpOnly: true, sameSite: "lax", path: "/" });
  revalidatePath("/cart");
  return cart;
}

export async function updateCartLine(lineId: string, quantity: number) {
  const cart = await cartLinesUpdate(await requireCartId(), lineId, quantity, await getSelectedCountry());
  revalidatePath("/cart");
  return cart;
}

export async function removeCartLine(lineId: string) {
  const cart = await cartLinesRemove(await requireCartId(), lineId, await getSelectedCountry());
  revalidatePath("/cart");
  return cart;
}

export async function applyDiscountCode(code: string) {
  const cart = await cartDiscountCodesUpdate(await requireCartId(), [code], await getSelectedCountry());
  revalidatePath("/cart");
  return cart;
}

// Cart-page "You May Also Like" rail: Shopify's recommendations first, topped up with
// recent store products so the rail is long enough to scroll; excludes what's in the cart.
export async function getUpsell(productId: string, excludeIds: string[] = []) {
  const [recs, more] = await Promise.all([
    getProductRecommendations(productId, 10),
    getProducts(24).catch(() => []),
  ]);
  const exclude = new Set([productId, ...excludeIds]);
  const seen = new Set<string>();
  const out = [];
  for (const p of [...recs, ...more]) {
    if (exclude.has(p.id) || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= 24) break;
  }
  return out;
}

// Sets the visitor's currency AND, if they already have a cart, actually re-prices it
// (a plain re-fetch with a different @inContext does not change an existing cart's currency).
export async function switchCurrency(country: CountryCode) {
  await setCurrency(country);
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  const cart = await cartBuyerIdentityUpdate(id, country);
  revalidatePath("/cart");
  return cart;
}

// Buy Now: a fresh single-item cart (ignores whatever's already in the visitor's cart),
// straight to Shopify checkout.
export async function buyNow(merchandiseId: string, quantity = 1) {
  const cart = await cartCreate(merchandiseId, quantity, await getSelectedCountry());
  return cart?.checkoutUrl ?? null;
}

export async function saveCheckoutBuyerIdentity(address: CheckoutAddress) {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  const country = await getSelectedCountry();
  const { firstName, lastName } = splitName(address.fullName);
  const phone = toE164India(address.mobile);
  try {
    const cart = await cartCheckoutIdentityUpdate(id, {
      countryCode: country,
      email: address.email.trim() || undefined,
      phone,
      deliveryAddress: {
        address1: address.house.trim(),
        address2: [address.area, address.landmark].filter(Boolean).join(", ") || undefined,
        city: address.city.trim(),
        province: address.state.trim(),
        zip: address.pincode.trim(),
        country: country === "IN" ? "IN" : country,
        firstName,
        lastName,
        phone,
      },
    });
    revalidatePath("/cart");
    revalidatePath("/cart/shipping");
    revalidatePath("/cart/payment");
    return cart;
  } catch {
    return null;
  }
}
