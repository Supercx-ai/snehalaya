import type { Metadata } from "next";
import Image from "next/image";
import { STORES } from "@/lib/stores";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

export const metadata: Metadata = {
  title: "Contact Us | Snehalayaa Silks",
  description:
    "Whether seeking details about our latest collection or planning a bespoke visit, our team is prepared to welcome you with Indian warmth.",
};

const COLLECTIONS = [
  "Heritage Kanjivaram Silk Sarees",
  "Banarasi Silks",
  "Chanderi",
  "Paithani",
  "Tussar",
  "Maharani Bridal Collection",
  "Contemporary Cotton",
  "Other",
];

const FIELD_INPUT =
  "h-[47px] w-full rounded-[4px] border border-border bg-white px-3.5 text-base text-ink placeholder:text-[#999999] focus:outline-none focus:border-accent";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.6px] text-burgundy">
      {children}
      {required && <span className="text-[#d0342c]"> *</span>}
    </span>
  );
}

// The design's meta-row icons are simple gold line glyphs — inline SVGs on
// currentColor rather than extracted assets.
function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="mt-px w-4 h-4 shrink-0">
      <path d="M8 14.5s-4.7-4.1-4.7-7.6a4.7 4.7 0 1 1 9.4 0c0 3.5-4.7 7.6-4.7 7.6Z" />
      <circle cx="8" cy="6.7" r="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="mt-px w-4 h-4 shrink-0">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.6V8l2.3 1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="mt-px w-4 h-4 shrink-0">
      <path
        d="M3.2 2.4h2.4l1.1 2.9-1.5 1.2a9.4 9.4 0 0 0 4.3 4.3l1.2-1.5 2.9 1.1v2.4c0 .5-.4.9-.9.9A11.7 11.7 0 0 1 2.3 3.3c0-.5.4-.9.9-.9Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactUsPage() {
  return (
    <>
      <section className="relative h-[240px] md:h-[283px] overflow-hidden">
        <Image src="/figma/contact/hero.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.77]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-2 px-6 text-center">
          <h1 className="font-display font-light text-heading-sm md:text-[44px] leading-[1.2] text-white">
            Visit Our Sanctuaries
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-[#faf3e3]">
            Whether seeking details about our latest collection or planning a bespoke visit, our team is prepared to
            welcome you with Indian warmth.
          </p>
        </div>
      </section>

      <div className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-16 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-[584fr_520fr] gap-6 lg:gap-12">
          <form
            {...(DOMAIN ? { action: `https://${DOMAIN}/contact#contact_form`, method: "post" } : {})}
            className="bg-white rounded-[12px] border border-border-subtle p-5 md:p-8 flex flex-col gap-6"
          >
            {DOMAIN && (
              <>
                <input type="hidden" name="form_type" value="contact" />
                <input type="hidden" name="utf8" value="&#10003;" />
              </>
            )}

            <div className="flex flex-col gap-2">
              <h2 className="font-display font-light text-[26px] md:text-[32px] leading-[1.2] text-burgundy">
                Send an Inquiry
              </h2>
              <p className="text-sm leading-[1.5] text-ink-subtle">
                Please fill in the form below. Our relationship advisors will reach out to you within 24 working hours.
              </p>
            </div>

            <label className="flex flex-col gap-2">
              <Label required>Your Name</Label>
              <input type="text" name="contact[name]" required placeholder="Enter your full name" className={FIELD_INPUT} />
            </label>

            <label className="flex flex-col gap-2">
              <Label required>Email Address</Label>
              <input type="email" name="contact[email]" required placeholder="Enter email address" className={FIELD_INPUT} />
            </label>

            <label className="flex flex-col gap-2">
              <Label>Phone Number</Label>
              <input type="tel" name="contact[phone]" placeholder="e.g. +91 98765 43210" className={FIELD_INPUT} />
            </label>

            <label className="flex flex-col gap-2">
              <Label>Interested Collection</Label>
              <span className="relative">
                <select name="contact[Interested Collection]" className={`${FIELD_INPUT} appearance-none pr-9`}>
                  {COLLECTIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <Image
                  src="/figma/icon-chevron.svg"
                  alt=""
                  width={10}
                  height={6}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
              </span>
            </label>

            <label className="flex-1 flex flex-col gap-2">
              <Label>Your Message</Label>
              <textarea
                name="contact[body]"
                required
                placeholder="Write down any specific weavers requests, custom matching drapes, or timing details..."
                className="flex-1 min-h-[120px] w-full rounded-[4px] border border-border bg-white px-3.5 py-3 text-base leading-[1.5] text-ink placeholder:text-[#999999] focus:outline-none focus:border-accent resize-y"
              />
            </label>

            <button type="submit" className="h-[47px] w-full rounded-[4px] bg-burgundy text-sm font-semibold text-white">
              Send Inquiry
            </button>
          </form>

          <div className="flex flex-col gap-6">
            {STORES.map((s) => (
              <div key={s.city} className="bg-white rounded-[12px] border border-border-subtle p-4 md:p-6 flex flex-col gap-4 lg:flex-1">
                <h2 className="font-display text-[22px] md:text-3xl leading-[1.2] text-burgundy">{s.label}</h2>
                <div className="relative w-full aspect-[472/230] lg:aspect-auto lg:flex-1 lg:min-h-[180px] rounded-[8px] overflow-hidden">
                  <Image src={s.image} alt={s.label} fill className="object-cover" />
                </div>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-start gap-2 text-sm leading-[1.4] text-ink-subtle">
                    <span className="text-accent"><PinIcon /></span>
                    {s.address}
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-[1.4] text-ink-subtle">
                    <span className="text-accent"><ClockIcon /></span>
                    {s.hours}
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-[1.4]">
                    <span className="text-accent"><PhoneIcon /></span>
                    <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="font-medium text-burgundy">
                      {s.phone}
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
