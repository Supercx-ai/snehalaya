"use client";

import { useState } from "react";
import Image from "next/image";

type Faq = { q: string; a: string };
type Category = { key: string; label: string; faqs: Faq[] };

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// Only the first Orders answer exists in the Figma comp (the rest are drawn
// collapsed) — remaining answers are written from the live policy pages' copy
// so the FAQ never contradicts /shipping-policy, /returns-exchange or the T&C.
const CATEGORIES: Category[] = [
  {
    key: "orders",
    label: "Orders and Shipping",
    faqs: [
      {
        q: "How long will it take to deliver my domestic order?",
        a: "For domestic deliveries within India, orders are processed within 1-2 business days. Delivery typically takes 3 to 5 business days for metro cities, and up to 7 business days for regional areas.",
      },
      {
        q: "Do you offer international shipping?",
        a: "Yes — we deliver to 40+ countries. Global shipping is free on orders above ₹50,000; below that, rates are calculated automatically at checkout. International deliveries take 5-9 business days worldwide.",
      },
      {
        q: "How can I track my saree shipment?",
        a: "As soon as your order has been packed and handed over to our verified transit partners (DHL, FedEx, or BlueDart), a tracking link is delivered instantly to your registered phone number via WhatsApp/SMS and to your primary email address.",
      },
      {
        q: "Can I customize the blouse stitching or fall matching?",
        a: "Yes. Customized blouse stitching and fall/pico allocations are completed according to the measurements you provide. Handloom customization adds 3 to 5 business days to your processing timeline, and tailored orders are non-refundable.",
      },
      {
        q: "Are the colors on the website exactly identical to the real saree?",
        a: "Natural hand-dyed yarns may vary slightly in shade depending on your digital screen settings and the atmospheric lighting during photography. We do our best to present every weave in true daylight color.",
      },
    ],
  },
  {
    key: "returns",
    label: "Returns and Exchanges",
    faqs: [
      {
        q: "What is your return window?",
        a: "Initiate a return request on your customer portal within 7 days of receiving delivery. We arrange a free doorstep pickup anywhere in India.",
      },
      {
        q: "Which sarees are eligible for return?",
        a: "The saree must remain completely unworn, unwashed and undamaged, with the original loom authenticity tags and price labels securely attached. Custom stitched blouses, customized borders, falls, or hem finishing are strictly ineligible.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed immediately after quality inspection at our Chennai or Coimbatore warehouses, and reflect in your source card, UPI link, or bank account within 5 to 7 working days. International transactions may require up to 10 business days.",
      },
      {
        q: "Can I exchange my saree for a different weave?",
        a: "We accommodate exchanges for products of equivalent value or higher. Contact our concierge team to reserve the alternate selection before dispatching your return.",
      },
    ],
  },
  {
    key: "care",
    label: "Product Care",
    faqs: [
      {
        q: "How should I store my silk sarees?",
        a: "Keep them in a breathable cotton or muslin wrap, away from direct sunlight and moisture. Use the silk preservation cards included with your order and re-fold the saree every few months to protect the zari.",
      },
      {
        q: "Can I machine-wash a Kanjivaram?",
        a: "No — pure handloom silks should only be dry cleaned. Machine washing damages the hand-dyed yarns and the zari work.",
      },
      {
        q: "How do I keep the zari bright over the years?",
        a: "Avoid direct contact with perfume, deodorant, and dampness, and store the saree wrapped in muslin. Air it in gentle shade (never harsh sun) once every few months.",
      },
    ],
  },
  {
    key: "sizing",
    label: "Sizing",
    faqs: [
      {
        q: "How long is a standard saree?",
        a: "Our sarees follow the classic drape length of approximately 5.5 metres, accompanied by a running blouse piece of about 0.8 metres unless noted otherwise on the product page.",
      },
      {
        q: "Can blouses be stitched to my measurements?",
        a: "Yes — save your measurements to your account or share them at checkout, and our tailoring unit completes the blouse to those metrics before dispatch.",
      },
      {
        q: "What if my stitched blouse doesn't fit?",
        a: "Tailored items are non-refundable, but our concierge team will guide you through local alteration options and help with sizing for your next order.",
      },
    ],
  },
  {
    key: "payment",
    label: "Payment",
    faqs: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept credit and debit cards (Visa, Mastercard, Amex, RuPay), UPI, and global wire transfers.",
      },
      {
        q: "Is it safe to pay on your website?",
        a: "Yes. Payments are processed through PCI-DSS compliant aggregators and every session is protected with enterprise-grade SSL/TLS encryption.",
      },
      {
        q: "When is my payment captured?",
        a: "Your payment must clear our gateway before sarees are assigned to weavers for handloom completion — so it is captured when the order is confirmed.",
      },
    ],
  },
];

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={open ? "#67111A" : "#B89552"}
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M5 12h14" />
      {!open && <path d="M12 5v14" />}
    </svg>
  );
}

export default function FaqBrowser() {
  const [activeKey, setActiveKey] = useState(CATEGORIES[0].key);
  const [openQuestion, setOpenQuestion] = useState<string | null>(CATEGORIES[0].faqs[0].q);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const q = query.trim().toLowerCase();
  const active = CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0];
  const results = searching
    ? CATEGORIES.flatMap((c) => c.faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)))
    : active.faqs;

  return (
    <>
      <section className="relative min-h-[280px] md:min-h-[330px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative min-h-[280px] md:min-h-[330px] flex flex-col items-center justify-center gap-5 px-6 py-12 text-center">
          <h1 className="font-display font-light text-heading-sm md:text-[54px] leading-[1.1] text-white">
            How can we help you today?
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            Find absolute guidance on orders, shipping, care rituals, and customized tailoring.
          </p>
          <div className="flex items-center gap-3 w-full max-w-[520px] h-[50px] rounded-full bg-white px-5">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#B89552" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setOpenQuestion(null);
                setQuery(e.target.value);
              }}
              placeholder="Type questions about shipping, care, or returns..."
              className="w-full min-w-0 bg-transparent text-md text-ink placeholder:text-ink-faint outline-none"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 md:px-[100px] pt-12 md:pt-16 pb-12 md:pb-20 flex flex-col lg:flex-row items-start gap-8 lg:gap-[60px]">
        <aside className="w-full lg:w-[280px] shrink-0">
          <h2 className="font-display font-medium text-3xl text-burgundy">Categories</h2>
          <div className="mt-4 flex flex-col gap-2">
            {CATEGORIES.map((c) => {
              const isActive = !searching && c.key === activeKey;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveKey(c.key);
                    setOpenQuestion(c.faqs[0].q);
                  }}
                  className={`flex items-center justify-between h-[47px] px-4 rounded-[8px] text-sm text-left ${
                    isActive ? "bg-burgundy text-white font-semibold" : "bg-white border border-border text-ink"
                  }`}
                >
                  {c.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                      isActive ? "bg-accent text-white" : "bg-cream text-ink-subtle"
                    }`}
                  >
                    {c.faqs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <h2 className="font-display font-medium text-4xl text-ink">
            {searching ? `Results for “${query.trim()}”` : `${active.label} Qs`}
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            {results.map((f) => {
              const open = openQuestion === f.q;
              return (
                <div key={f.q} className="bg-white rounded-lg border border-border p-6">
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(open ? null : f.q)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-display font-semibold text-2xl text-burgundy">{f.q}</span>
                    <PlusIcon open={open} />
                  </button>
                  {open && <p className="mt-4 text-base leading-[1.6] text-ink-subtle">{f.a}</p>}
                </div>
              );
            })}
            {results.length === 0 && (
              <p className="text-base text-ink-subtle">No answers match your search — try a different phrase.</p>
            )}
          </div>
        </div>
      </div>

      {/* Full-width white band in the comp (1280×294, pad 80/60, gap 24) — sits between the cream content and the footer. */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-14 md:py-20 flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-[32px] leading-tight text-burgundy">Couldn&rsquo;t find the answers you need?</h2>
          <p className="max-w-[560px] text-base leading-[1.6] text-ink-subtle">
            Our dedicated saree concierge team is available to assist you via WhatsApp live video consultations,
            phone support, or direct email help desk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[6px] bg-burgundy text-sm font-semibold text-white"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="mailto:legal@snehalayaasilks.com"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[6px] border border-burgundy text-sm font-semibold text-burgundy"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email Concierge
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
