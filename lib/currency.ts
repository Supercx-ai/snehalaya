"use server";

import { cookies } from "next/headers";
import type { CountryCode } from "./shopify";

const COOKIE = "country";
const DEFAULT: CountryCode = "IN";

export async function getSelectedCountry(): Promise<CountryCode> {
  const value = (await cookies()).get(COOKIE)?.value as CountryCode | undefined;
  return value ?? DEFAULT;
}

export async function setCurrency(country: CountryCode) {
  (await cookies()).set(COOKIE, country, { sameSite: "lax", path: "/" });
}
