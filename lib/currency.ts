"use server";

import { cookies } from "next/headers";
import { getProductPrice, type CountryCode } from "./shopify";

const COOKIE = "country";
const DEFAULT: CountryCode = "IN";

export async function getSelectedCountry(): Promise<CountryCode> {
  const value = (await cookies()).get(COOKIE)?.value as CountryCode | undefined;
  return value ?? DEFAULT;
}

export async function setCurrency(country: CountryCode) {
  (await cookies()).set(COOKIE, country, { sameSite: "lax", path: "/" });
}

// Called client-side to swap a displayed price into the selected currency, without
// making the ISR-cached product/collection page itself dynamic.
export async function getLocalizedPrice(handle: string, country: CountryCode) {
  return getProductPrice(handle, country);
}
