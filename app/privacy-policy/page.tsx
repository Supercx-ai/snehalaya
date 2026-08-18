import type { Metadata } from "next";
import Image from "next/image";
import NewsletterBlock from "@/components/NewsletterBlock";
import TermsIndex from "@/components/TermsIndex";

export const metadata: Metadata = {
  title: "Privacy Policy | Snehalayaa Silks",
  description:
    "Your trust is our most treasured heirloom. Read about how we safeguard and protect your personal information with absolute integrity.",
};

const INDEX = [
  { id: "information-we-collect", label: "1. Information We Collect" },
  { id: "how-we-use-data", label: "2. How We Use Data" },
  { id: "cookies-analytics", label: "3. Cookies & Analytics" },
  { id: "sharing-with-third-parties", label: "4. Sharing with Third Parties" },
  { id: "security-measures", label: "5. Security Measures" },
  { id: "your-legal-rights", label: "6. Your Legal Rights" },
  { id: "privacy-contact-info", label: "7. Privacy Contact Info" },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 font-display font-semibold text-[22px] leading-none text-burgundy">
      {children}
    </h3>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative h-[280px] md:h-[320px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="w-[60px] border-t-2 border-accent" aria-hidden />
          <h1 className="font-display font-light text-heading-sm md:text-[48px] leading-[1.2] text-white">
            Privacy Policy
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            Your trust is our most treasured heirloom. Read about how we safeguard and protect your personal
            information with absolute integrity.
          </p>
        </div>
      </section>

      <div className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 md:px-16 py-10 md:py-16 flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-8">
            <div className="bg-white rounded-lg border border-border p-6 flex flex-col gap-4">
              <h2 className="font-display font-semibold text-2xl leading-none text-burgundy">Document Index</h2>
              <div className="border-t border-border" />
              <TermsIndex sections={INDEX} />
              <div className="border-t border-border" />
              <p className="text-2xs text-[#999999]">Last updated: October 24, 2025</p>
            </div>
          </aside>

          <article className="flex-1 min-w-0 bg-white rounded-lg border border-border p-6 md:p-10">
            <h2 className="font-display font-light text-5xl text-ink">We value your private world</h2>
            <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
              At Snehalayaa Silks, we are deeply committed to respecting your privacy. This document outlines
              exactly what personal details we compile when you browse or make purchases from our store, how we
              protect it, and your choice to review or restrict that data.
            </p>

            <hr className="my-8 border-border" />

            <div className="space-y-8">
              <section>
                <SectionHeading id="information-we-collect">1. Personal Information We Collect</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  To complete orders and provide an exquisite luxury experience, we compile necessary billing
                  information, contact details, and technical parameters during interactions. Specifically:
                </p>
                <ul className="mt-3 pl-4 space-y-2">
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Identity &amp; Contact:</strong> Full name,
                    delivery address, phone numbers, and email coordinates.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Transaction Details:</strong> Item purchase
                    history, measurement records, custom tailoring selections, and financial slips (securely
                    processed via PCI-DSS compliant aggregators).
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Technical Parameters:</strong> IP address,
                    device fingerprints, screen specifications, and localized system logs.
                  </li>
                </ul>
              </section>

              <section>
                <SectionHeading id="how-we-use-data">2. How We Utilize Your Data</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  Your records are used entirely to fulfill requests and maintain high-quality catalog services:
                </p>
                <ul className="mt-3 pl-4 space-y-2">
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Processing global saree shipments and secure UPI/Credit-card payments.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Custom weaver matching for tailored blouses and pre-stitched pleat assignments.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Preventing fraudulent transactions and ensuring overall system safety.
                  </li>
                </ul>
              </section>

              <section>
                <SectionHeading id="cookies-analytics">3. Cookies &amp; Digital Tracking</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  We employ standard tracking markers (cookies) to save cart items during navigation, remember
                  selected currency preferences (e.g., INR to USD), and evaluate aggregate system performance
                  through secure statistics. You have the right to block these cookies via browser parameters.
                </p>
              </section>

              <section>
                <SectionHeading id="sharing-with-third-parties">4. Safe Sharing with Third Parties</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  We do not lease, rent, or trade your valuable information with random advertising networks. Data
                  is only shared with verified entities necessary to complete deliveries:
                </p>
                <ul className="mt-3 pl-4 space-y-2">
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Logistic partnerships (such as DHL, BlueDart) to transport bridal packages safely.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Highly-reputable global gateway vendors to verify and authenticate checkout steps.
                  </li>
                </ul>
              </section>

              <section>
                <SectionHeading id="security-measures">5. Data Security Standards</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  Our storage databases are protected using enterprise-grade Secure Socket Layer (SSL/TLS)
                  encryptions. All physical storefront archives (including measurements taken during Video Shopping
                  sessions) are restricted under severe access control.
                </p>
              </section>

              <section>
                <SectionHeading id="your-legal-rights">6. Your Legal &amp; Choice Rights</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  Under applicable laws, you retain the complete authority to:
                </p>
                <ul className="mt-3 pl-4 space-y-2">
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Request comprehensive logs of what details we have stored about you.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Revoke marketing/email consent instantly.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; Request the prompt removal and purging of your personal records from our databases.
                  </li>
                </ul>
              </section>

              <section>
                <SectionHeading id="privacy-contact-info">7. Contact Information</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  For any clarification regarding this privacy framework, or to exercise your rights, connect with
                  our privacy team:
                </p>
                <div className="mt-3 rounded-[8px] border border-border bg-cream p-5 flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-ink">
                    Email: <a href="mailto:privacy@snehalayaasilks.com">privacy@snehalayaasilks.com</a>
                  </p>
                  <p className="text-sm text-ink-subtle">Phone: (555) 123-4567 (Privacy Officer)</p>
                  <p className="text-sm text-ink-subtle">
                    Address: 23, Venkatanarayana Rd, T. Nagar, Chennai, Tamil Nadu 600017
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>

      <NewsletterBlock />
    </>
  );
}
