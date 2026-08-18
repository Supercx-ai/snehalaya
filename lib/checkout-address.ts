export type CheckoutAddress = {
  fullName: string;
  mobile: string;
  email: string;
  whatsappUpdates: boolean;
  house: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  billingSameAsShipping: boolean;
};

export const EMPTY_CHECKOUT_ADDRESS: CheckoutAddress = {
  fullName: "",
  mobile: "",
  email: "",
  whatsappUpdates: true,
  house: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  billingSameAsShipping: true,
};

const KEY = "snehalaya-checkout-address";

export function loadCheckoutAddress(): CheckoutAddress {
  if (typeof window === "undefined") return EMPTY_CHECKOUT_ADDRESS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_CHECKOUT_ADDRESS;
    return { ...EMPTY_CHECKOUT_ADDRESS, ...JSON.parse(raw) };
  } catch {
    return EMPTY_CHECKOUT_ADDRESS;
  }
}

export function saveCheckoutAddress(address: CheckoutAddress) {
  localStorage.setItem(KEY, JSON.stringify(address));
}

export function checkoutAddressComplete(a: CheckoutAddress) {
  return Boolean(
    a.fullName.trim() &&
    a.mobile.replace(/\D/g, "").length >= 10 &&
    a.email.includes("@") &&
    a.house.trim() &&
    a.area.trim() &&
    a.city.trim() &&
    a.state.trim() &&
    a.pincode.replace(/\D/g, "").length === 6
  );
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export function toE164India(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  if (mobile.trim().startsWith("+")) return mobile.trim();
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}
