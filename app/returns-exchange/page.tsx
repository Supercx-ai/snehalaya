import type { Metadata } from "next";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export const metadata: Metadata = {
  title: "Returns & Exchange Policy | Snehalayaa Silks",
  description: "We guarantee the authenticity of every yarn, and your complete peace of mind.",
};

const STEPS = [
  {
    number: "01",
    title: "Submit Request",
    body: "Initiate return request on your customer portal within 7 days of receiving delivery.",
  },
  {
    number: "02",
    title: "Authentication Check",
    body: "Our virtual support confirms the product eligibility tags and original fold status.",
  },
  {
    number: "03",
    title: "Free Pick-up",
    body: "We arrange a free doorstep pickup directly from your shipping address in India.",
  },
  {
    number: "04",
    title: "Refund Executed",
    body: "Upon quality authentication, a complete refund is disbursed within 5-7 working days.",
  },
];

const ELIGIBILITY_RULES = [
  "Saree must remain completely unworn, unwashed and undamaged.",
  "Original loom authenticity tags and price labels must remain securely attached.",
  "Custom stitched blouses, customized borders, falls, or hem finishing are strictly ineligible for return.",
  "Original packaging materials, silk preservation cards, and premium boxes must accompany the return request.",
];

// Lucide "check" as in the comp — 16px, 2px round #B89552 stroke.
function CheckIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B89552"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 mt-0.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ReturnsExchangePage() {
  return (
    <>
      <section className="relative h-[280px] md:h-[320px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display font-light text-heading-sm md:text-[48px] leading-[1.2] text-white">
            Returns &amp; Exchange Policy
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            We guarantee the authenticity of every yarn, and your complete peace of mind.
          </p>
        </div>
      </section>

      <div className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 md:px-[100px] py-12 md:py-20 space-y-12">
          <section>
            <h2 className="font-display font-medium text-4xl text-ink text-center">Our Simplified Return Cycle</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step) => (
                <div key={step.number} className="bg-white rounded-lg border border-border p-6">
                  <p className="font-display font-bold text-[36px] leading-none text-accent">{step.number}</p>
                  <h3 className="mt-3 font-display font-semibold text-2xl leading-none text-burgundy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-[1.5] text-ink-secondary">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <section className="bg-white rounded-lg border border-border p-6 md:p-8">
              <h2 className="font-display font-medium text-3xl text-burgundy">Eligibility Criteria</h2>
              <ul className="mt-4 space-y-3">
                {ELIGIBILITY_RULES.map((rule) => (
                  <li key={rule} className="flex gap-3 text-base leading-[1.5] text-ink-secondary">
                    <CheckIcon />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg border border-border p-6 md:p-8">
              <h2 className="font-display font-medium text-3xl text-burgundy">Exchange Protocols</h2>
              <p className="mt-4 text-base leading-[1.5] text-ink-secondary">
                We accommodate exchanges for products of equivalent value or higher. If you wish to substitute a
                saree weave, please contact our concierge team to reserve the alternate selection prior to
                dispatching your return.
              </p>
              <hr className="my-6 border-border" />
              <h2 className="font-display font-medium text-3xl text-burgundy">Refund Timelines</h2>
              <p className="mt-4 text-base leading-[1.5] text-ink-secondary">
                Refunds are processed immediately following successful quality control inspection at our Chennai or
                Coimbatore warehouses. Funds will reflect in your source card, UPI link, or bank account within{" "}
                <strong className="font-semibold">5 to 7 working days</strong>. International transactions may
                occasionally require up to <strong className="font-semibold">10 business days</strong>.
              </p>
            </section>
          </div>

          <section className="bg-burgundy rounded-[16px] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <h2 className="font-display font-light text-5xl text-white">
                Have questions about a customized order?
              </h2>
              <p className="mt-2 text-base leading-[1.5] text-cream">
                Our support team can handle any unique return scenario, international shipment holds, or general
                weave issues with absolute care.
              </p>
            </div>
            {WHATSAPP_NUMBER ? (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-[4px] bg-accent text-sm font-semibold text-white"
              >
                Consult Saree Concierge
              </a>
            ) : (
              <a
                href="mailto:legal@snehalayaasilks.com"
                className="shrink-0 px-6 py-3.5 rounded-[4px] bg-accent text-sm font-semibold text-white"
              >
                Consult Saree Concierge
              </a>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
