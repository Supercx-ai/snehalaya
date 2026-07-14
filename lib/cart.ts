"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  cartDiscountCodesUpdate,
  getCart as fetchCart,
  getProductRecommendations,
} from "./shopify";
import { getSelectedCountry } from "./currency";

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
export async function addToCart(merchandiseId: string) {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  const country = await getSelectedCountry();
  const cart = (id && (await cartLinesAdd(id, merchandiseId, 1, country))) || (await cartCreate(merchandiseId, 1, country));
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

export async function getUpsell(productId: string) {
  return getProductRecommendations(productId);
}
