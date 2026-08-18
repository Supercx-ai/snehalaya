import type { Metadata } from "next";
import Image from "next/image";
import NewsletterBlock from "@/components/NewsletterBlock";
import TermsIndex from "@/components/TermsIndex";

export const metadata: Metadata = {
  title: "Terms & Conditions | Snehalayaa Silks",
  description:
    "Our legal relationship is woven with mutual trust and clarity. Please review these rules to understand your purchase agreements and responsibilities.",
};

const INDEX = [
  { id: "acceptance-of-terms", label: "1. Acceptance of Terms" },
  { id: "user-account-security", label: "2. User Account Security" },
  { id: "ordering-tailoring-payments", label: "3. Ordering & Tailoring Payments" },
  { id: "intellectual-property-rights", label: "4. Intellectual Property Rights" },
  { id: "user-conduct-policy", label: "5. User Conduct Policy" },
  { id: "limitation-of-liability", label: "6. Limitation of Liability" },
  { id: "governing-law-disputes", label: "7. Governing Law & Dispute Resolution" },
  { id: "contact-details", label: "8. Contact Details" },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 font-display font-semibold text-[22px] leading-none text-burgundy">
      {children}
    </h3>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <section className="relative h-[280px] md:h-[320px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        {/* Figma layers the section's #67111A fill at 82% over the silk photo */}
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="w-[60px] border-t-2 border-accent" aria-hidden />
          <h1 className="font-display font-light text-heading-sm md:text-[48px] leading-[1.2] text-white">
            Terms &amp; Conditions
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            Our legal relationship is woven with mutual trust and clarity. Please review these rules to
            understand your purchase agreements and responsibilities.
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
            <h2 className="font-display font-light text-5xl text-ink">Woven Agreements</h2>
            <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
              Welcome to the digital atelier of Snehalayaa Silks. By accessing this platform, ordering luxury
              handloom garments, or booking personalized Video Consultations, you agree to comply with the terms
              defined herein.
            </p>

            <hr className="my-8 border-border" />

            <div className="space-y-8">
              <section>
                <SectionHeading id="acceptance-of-terms">1. Acceptance of Terms</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  These terms constitute a legally binding agreement between you and Snehalayaa Silks. If you
                  disagree with any portion of these conditions, you must immediately cease accessing our website
                  and digital services. We reserve the right to revise these provisions at any time.
                </p>
              </section>

              <section>
                <SectionHeading id="user-account-security">2. User Account Security</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  When registering an account to save measurements or favorite sarees, you are responsible for
                  maintaining the privacy of passwords and credentials. Snehalayaa Silks will not be liable for
                  losses arising from unauthorized access on your behalf.
                </p>
              </section>

              <section>
                <SectionHeading id="ordering-tailoring-payments">3. Ordering, Tailoring &amp; Payments</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  As we deal in authentic, handloom silk pieces, please consider the following ordering guidelines:
                </p>
                <ul className="mt-3 pl-4 space-y-2">
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Color Discrepancies:</strong> Natural
                    hand-dyed yarns may vary slightly in shade depending on digital screen settings and atmospheric
                    lighting during photography.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Tailoring Specifications:</strong> Customized
                    blouse stitching and fall/pico allocations are completed according to metrics you provide.
                    Tailored orders are non-refundable.
                  </li>
                  <li className="text-sm leading-[1.6] text-ink-subtle">
                    &bull; <strong className="font-semibold text-ink">Payment Authorization:</strong> Credit cards,
                    global wire transfers, and UPI must clear our gateway before sarees are assigned to weavers for
                    handloom completion.
                  </li>
                </ul>
              </section>

              <section>
                <SectionHeading id="intellectual-property-rights">4. Intellectual Property Rights</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  All branding elements, logo assets, creative video sessions, unique patterns, and imagery of
                  actress Sneha are protected strictly under copyright and trademark provisions. Any unauthorized
                  download, reproduction, or duplicate digital distribution represents complete legal infringement.
                </p>
              </section>

              <section>
                <SectionHeading id="user-conduct-policy">5. User Conduct Policy</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  You agree to use our digital showroom only for benign search and valid retail acquisitions. You
                  may not deploy script bots, scrapers, or reverse-engineer our image-search technology, nor
                  interfere with system infrastructure or checkout gateways.
                </p>
              </section>

              <section>
                <SectionHeading id="limitation-of-liability">6. Limitation of Liability</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  To the maximum extent permitted by law, Snehalayaa Silks will not be liable for any indirect,
                  incidental, or consequential damages resulting from platform downtime, delayed delivery by
                  foreign postal carriers, or variations in custom woven silk weaves.
                </p>
              </section>

              <section>
                <SectionHeading id="governing-law-disputes">7. Governing Law &amp; Disputes</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  These conditions are governed by and interpreted under the statutory framework of the Republic of
                  India. Any legal dispute, claim, or mediation arising from purchase transactions will be resolved
                  exclusively inside the courts of Chennai, Tamil Nadu.
                </p>
              </section>

              <section>
                <SectionHeading id="contact-details">8. Contact Details</SectionHeading>
                <p className="mt-3 text-base leading-[1.6] text-ink-subtle">
                  If you require any clarification regarding our legal conditions or operational protocols, please
                  connect with us:
                </p>
                <div className="mt-3 rounded-[8px] border border-border bg-cream p-5 flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-ink">
                    Email: <a href="mailto:legal@snehalayaasilks.com">legal@snehalayaasilks.com</a>
                  </p>
                  <p className="text-sm text-ink-subtle">Phone: (555) 123-4567 (Legal Liaison)</p>
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
