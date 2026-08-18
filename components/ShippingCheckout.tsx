"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { saveCheckoutBuyerIdentity } from "@/lib/cart";
import { INDIAN_STATES } from "@/lib/indian-states";
import {
  checkoutAddressComplete,
  loadCheckoutAddress,
  saveCheckoutAddress,
  type CheckoutAddress,
} from "@/lib/checkout-address";
import CartProgressSteps from "@/components/CartProgressSteps";
import OrderSummary from "@/components/OrderSummary";
import CheckoutOrderDetails from "@/components/CheckoutOrderDetails";
import GoldRule from "@/components/GoldRule";

const THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);

const fieldClass =
  "h-11 w-full px-3.5 rounded-[6px] border border-[#ddd5c9] bg-white text-[14px] text-ink placeholder:text-[#b3aca0] focus:outline-none focus:border-burgundy";

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#555]">
        {label}
        {required && <span className="text-[#c62828]"> *</span>}
      </span>
      {children}
    </label>
  );
}

function SectionHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
      <span className="text-[#c0453c]">{icon}</span>
      {children}
    </h2>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[19px]" aria-hidden>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M2.8 19.5c.7-3.2 3.2-4.8 6.2-4.8s5.5 1.6 6.2 4.8" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8" />
      <path d="M17.8 14.9c1.8.7 3 2.1 3.4 4.1" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[19px]" aria-hidden>
      <path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 shrink-0" aria-hidden>
      <path d="M1.5 5.5h12.5v11H1.5z" />
      <path d="M14 9h4.2l2.8 3.4v4.1H14" />
      <circle cx="6" cy="17.5" r="1.9" />
      <circle cx="17.5" cy="17.5" r="1.9" />
    </svg>
  );
}

function RefreshIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`${className} shrink-0`} aria-hidden>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V7h-3.5" />
    </svg>
  );
}

function ShieldIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`${className} shrink-0`} aria-hidden>
      <path d="M12 3 5 5.5v6c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5v-6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

function LockIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={`${className} shrink-0`} aria-hidden>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

function SupportIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`${className} shrink-0`} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
    </svg>
  );
}

const TRUST_ROW = [
  { icon: <ShieldIcon className="size-5" />, label: "100% Authentic Products" },
  { icon: <LockIcon className="size-5" />, label: "Secure Payments" },
  { icon: <RefreshIcon className="size-5" />, label: "Easy Return & Exchange" },
  { icon: <SupportIcon className="size-5" />, label: "Dedicated Support" },
];

export default function ShippingCheckout() {
  const { cart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutAddress | null>(null);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(loadCheckoutAddress());
  }, []);

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main className="bg-cream min-h-[50vh]">
        <div className="px-4 md:px-[30px] py-16 text-center">
          <h1 className="font-display font-light text-[32px] text-ink">Your Cart</h1>
          <p className="mt-2 text-sm text-ink-subtle">
            It&apos;s empty. <Link href="/" className="text-burgundy font-medium">Browse products →</Link>
          </p>
        </div>
      </main>
    );
  }

  if (!form) return <main className="bg-cream min-h-[50vh]" />;

  const set = <K extends keyof CheckoutAddress>(key: K, value: CheckoutAddress[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const a = data?.address ?? {};
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  area: a.road || a.suburb || prev.area,
                  city: a.city || a.town || a.village || prev.city,
                  state: a.state || prev.state,
                  pincode: a.postcode?.replace(/\D/g, "").slice(0, 6) || prev.pincode,
                }
              : prev
          );
        } catch {
          setError("Could not read this location. Please enter the address.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location permission was denied.");
      }
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!checkoutAddressComplete(form)) {
      setError("Please fill every required field.");
      return;
    }
    setSaving(true);
    setError("");
    saveCheckoutAddress(form);
    await saveCheckoutBuyerIdentity(form);
    router.push("/cart/payment");
  };

  const threshold = Number.isFinite(THRESHOLD) && THRESHOLD > 0 ? THRESHOLD : 15000;
  const thresholdLabel = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(threshold);

  return (
    <main className="bg-cream">
      <div className="border-b border-[#e8e0d5] bg-[#f8f2ed]">
        <div className="px-4 md:px-[30px] py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[13px] text-[#333]">
          <span className="flex items-center gap-2.5"><span className="text-[#b3aea6]"><TruckIcon /></span> Free Shipping on orders above {thresholdLabel}</span>
          <span className="flex items-center gap-2.5"><span className="text-[#555]"><RefreshIcon /></span> Easy 7-Day Returns &amp; Exchange</span>
          <span className="flex items-center gap-2.5"><span className="text-[#9d2733]"><ShieldIcon /></span> 100% Authentic Products</span>
        </div>
      </div>

      <div className="px-4 md:px-[30px] py-8 md:py-10">
        <div className="relative">
          <CartProgressSteps current="shipping" />
          <span className="hidden lg:flex items-center gap-2 absolute right-0 top-3.5 text-[12px] font-semibold tracking-[1.4px] uppercase text-ink">
            <LockIcon /> Secure Checkout
          </span>
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px] gap-8 xl:gap-9 items-start">
          <div>
            <div className="rounded-[10px] border border-[#e8e0d5] bg-white px-5 md:px-7 py-6 md:py-7">
              <h1 className="text-[15px] font-bold tracking-[1.6px] uppercase text-burgundy">Personal Details</h1>
              <GoldRule className="mt-2 w-[110px]" />
              <p className="mt-2.5 text-[12.5px] text-[#777]">Please enter your details to continue</p>

              <div className="mt-6">
                <SectionHeader icon={<UsersIcon />}>Contact Information</SectionHeader>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input className={fieldClass} placeholder="Full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
                  </Field>
                  <Field label="Mobile Number" required>
                    <input
                      className={fieldClass}
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value)}
                      required
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Email Address" required>
                      <input className={fieldClass} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                    </Field>
                  </div>
                </div>
                <label className="mt-4 flex items-center gap-2.5 text-[13px] text-[#444]">
                  <input
                    type="checkbox"
                    className="size-4 accent-burgundy"
                    checked={form.whatsappUpdates}
                    onChange={(e) => set("whatsappUpdates", e.target.checked)}
                  />
                  Keep me updated with order status on WhatsApp
                </label>
              </div>

              <div className="mt-7 pt-6 border-t border-[#f0e9de]">
                <div className="flex items-center justify-between gap-4">
                  <SectionHeader icon={<PinIcon />}>Shipping Address</SectionHeader>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="flex items-center gap-2 text-[13px] text-[#c0392b]"
                  >
                    <span className="size-[14px] rounded-[3px] border border-[#c0392b] shrink-0" aria-hidden />
                    {locating ? "Locating…" : "Use current location"}
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="House / Flat / Building" required>
                    <input className={fieldClass} value={form.house} onChange={(e) => set("house", e.target.value)} required />
                  </Field>
                  <Field label="Area / Locality" required>
                    <input className={fieldClass} value={form.area} onChange={(e) => set("area", e.target.value)} required />
                  </Field>
                  <Field label="Landmark (Optional)">
                    <input className={fieldClass} value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
                  </Field>
                  <Field label="City" required>
                    <input className={fieldClass} value={form.city} onChange={(e) => set("city", e.target.value)} required />
                  </Field>
                  <Field label="State" required>
                    <select className={fieldClass} value={form.state} onChange={(e) => set("state", e.target.value)} required>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Pincode" required>
                    <input
                      className={fieldClass}
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                    />
                  </Field>
                </div>
                <label className="mt-4 flex items-center gap-2.5 text-[13px] text-[#444]">
                  <input
                    type="checkbox"
                    className="size-4 accent-burgundy"
                    checked={form.billingSameAsShipping}
                    onChange={(e) => set("billingSameAsShipping", e.target.checked)}
                  />
                  Billing address is same as shipping address
                </label>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <p className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#777]">
              <ShieldIcon /> Safe &amp; Secure Payments. Easy returns. 100% Authentic products.
            </p>
          </div>

          <div className="lg:sticky lg:top-24">
            <OrderSummary
              cart={cart}
              title="Price Details"
              checkout
              actionAsSubmit
              actionDisabled={saving}
              actionLabel={saving ? "Saving…" : "Proceed to Payment"}
              showCoupon={false}
              showTrust={false}
            />
            <CheckoutOrderDetails cart={cart} />
            <div className="mt-5 flex items-stretch divide-x divide-[#e3dccf]">
              {TRUST_ROW.map((item) => (
                <div key={item.label} className="flex flex-1 items-center gap-2 px-2.5 first:pl-0 last:pr-0 text-[#c0453c]">
                  {item.icon}
                  <span className="text-[11px] leading-tight text-[#444]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
