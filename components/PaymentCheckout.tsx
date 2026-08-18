"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { checkoutAddressComplete, loadCheckoutAddress, type CheckoutAddress } from "@/lib/checkout-address";
import CartProgressSteps from "@/components/CartProgressSteps";
import OrderSummary from "@/components/OrderSummary";
import CheckoutOrderDetails from "@/components/CheckoutOrderDetails";
import GoldRule from "@/components/GoldRule";

const METHODS = [
  { id: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay, Amex" },
  { id: "netbanking", label: "Net Banking", hint: "All major Indian banks" },
  { id: "wallet", label: "Wallets", hint: "Paytm, Amazon Pay and more" },
  { id: "emi", label: "EMI", hint: "Credit card and cardless EMI" },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives" },
] as const;

type Method = (typeof METHODS)[number]["id"];

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"];

export default function PaymentCheckout() {
  const { cart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [method, setMethod] = useState<Method>("upi");
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("GPay");

  useEffect(() => {
    const saved = loadCheckoutAddress();
    setAddress(saved);
    if (!checkoutAddressComplete(saved)) router.replace("/cart/shipping");
  }, [router]);

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

  if (!address || !checkoutAddressComplete(address)) {
    return <main className="bg-cream min-h-[50vh]" />;
  }

  const total = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: cart.cost.totalAmount.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(cart.cost.totalAmount.amount));

  return (
    <main className="bg-cream">
      <div className="px-4 md:px-[30px] py-8 md:py-10">
        <CartProgressSteps current="payment" />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px] gap-8 xl:gap-10 items-start">
          <div className="space-y-6">
            <section className="rounded-[8px] border border-[#e8e0d5] bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 min-w-0">
                  <span className="mt-0.5 relative size-5 overflow-clip shrink-0">
                    <Image src="/figma/icon-store.svg" alt="" width={20} height={20} className="size-full" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[1.4px] uppercase text-[#888]">Delivering to</p>
                    <p className="mt-1 text-[15px] font-semibold text-ink">{address.fullName}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#666]">
                      {address.house}, {address.area}
                      {address.landmark ? `, ${address.landmark}` : ""}
                      {", "}
                      {address.city}, {address.state} — {address.pincode}
                      <br />
                      +91 {address.mobile.replace(/^\+91/, "").replace(/\D/g, "").slice(-10)}
                    </p>
                  </div>
                </div>
                <Link href="/cart/shipping" className="text-[11px] tracking-[1.4px] uppercase text-burgundy font-semibold shrink-0">
                  Edit
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-[13px] font-semibold tracking-[1.6px] uppercase text-burgundy">Select Payment Method</h2>
              <GoldRule className="mt-2 w-[72px]" />
              <div className="mt-5 overflow-hidden rounded-[8px] border border-[#e8e0d5] bg-white">
                {METHODS.map((m, i) => {
                  const selected = method === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer ${
                        i > 0 ? "border-t border-[#eee6da]" : ""
                      } ${selected ? "bg-[#faf4ea]" : "bg-white"}`}
                    >
                      <span className={`mt-0.5 flex size-4 items-center justify-center rounded-full border ${selected ? "border-burgundy" : "border-[#ccc]"}`}>
                        {selected && <span className="size-2 rounded-full bg-burgundy" />}
                      </span>
                      <input
                        type="radio"
                        name="payment-method"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setMethod(m.id)}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium text-ink">{m.label}</span>
                        <span className="block text-[12px] text-[#888]">{m.hint}</span>
                        {selected && m.id === "upi" && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {UPI_APPS.map((app) => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => setUpiApp(app)}
                                  className={`h-8 px-3 rounded-[4px] border text-[12px] ${
                                    upiApp === app ? "border-burgundy bg-white text-burgundy" : "border-[#e0d6c8] text-[#666]"
                                  }`}
                                >
                                  {app}
                                </button>
                              ))}
                            </div>
                            <input
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="UPI ID (optional)"
                              className="mt-3 h-11 w-full max-w-sm px-3 rounded-[4px] border border-[#d9cfc2] bg-cream text-[13px]"
                            />
                          </div>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>

              <a
                href={cart.checkoutUrl}
                className="mt-6 flex items-center justify-center h-12 rounded-[4px] bg-burgundy text-cream text-[13px] font-semibold tracking-[1.6px] uppercase"
              >
                Pay Securely {total}
              </a>
            </section>
          </div>

          <div className="lg:sticky lg:top-24">
            <OrderSummary cart={cart} title="Price Details" hideAction showCoupon={false} showTrust={false} />
            <CheckoutOrderDetails cart={cart} />
          </div>
        </div>
      </div>
    </main>
  );
}
