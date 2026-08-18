import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Snehalayaa Silks",
  description: "We deliver handloomed grace securely to your doorstep across 40+ countries.",
};

// The Figma comp uses Lucide icons (layers are named "truck"/"globe"/"package")
// drawn at 24px with a 2px round-capped #B89552 stroke.
function LucideIcon({ paths }: { paths: string }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B89552"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

const TRUCK =
  '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>';
const GLOBE =
  '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>';
const PACKAGE =
  '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>';

const RATES = [
  { region: "India (Domestic)", threshold: "Above ₹5,000", fee: "Free of Charge", timeline: "3 - 5 business days" },
  { region: "India (Domestic)", threshold: "Below ₹5,000", fee: "₹200 flat rate", timeline: "3 - 5 business days" },
  { region: "North America (USA, Canada)", threshold: "Above ₹50,000", fee: "Free of Charge", timeline: "5 - 7 business days" },
  { region: "North America (USA, Canada)", threshold: "Below ₹50,000", fee: "₹3,500 flat rate", timeline: "6 - 9 business days" },
  { region: "Europe & United Kingdom", threshold: "Above ₹50,000", fee: "Free of Charge", timeline: "5 - 7 business days" },
  { region: "Middle East & GCC Countries", threshold: "Above ₹40,000", fee: "Free of Charge", timeline: "4 - 6 business days" },
];

function CardHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <LucideIcon paths={icon} />
      <h2 className="font-display font-medium text-3xl text-burgundy">{children}</h2>
    </div>
  );
}

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="relative h-[280px] md:h-[320px] overflow-hidden">
        <Image src="/figma/terms/silk-bg.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-burgundy/[.82]" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display font-light text-heading-sm md:text-[48px] leading-[1.2] text-white">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="max-w-[600px] text-md leading-[1.5] text-cream">
            We deliver handloomed grace securely to your doorstep across 40+ countries.
          </p>
        </div>
      </section>

      <div className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-4 md:px-[100px] py-12 md:py-20 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <section className="bg-white rounded-lg border border-border p-6 md:p-8 flex flex-col gap-4">
              <CardHeading icon={TRUCK}>Domestic Deliveries (India)</CardHeading>
              <ul className="space-y-1 text-base leading-[1.5] text-ink-secondary">
                <li>
                  &bull; <strong className="font-semibold">Free Delivery</strong> on all domestic orders above
                  &#8377;5,000. Under &#8377;5,000, a nominal flat rate of &#8377;200 applies.
                </li>
                <li>
                  &bull; <strong className="font-semibold">Dispatch Timeline:</strong> Ships out within 24-48 hours.
                </li>
                <li>
                  &bull; <strong className="font-semibold">Delivery Expectation:</strong> Metro regions take 3-5
                  days. Remote states take up to 7-9 days.
                </li>
              </ul>
            </section>

            <section className="bg-white rounded-lg border border-border p-6 md:p-8 flex flex-col gap-4">
              <CardHeading icon={GLOBE}>International Deliveries</CardHeading>
              <ul className="space-y-1 text-base leading-[1.5] text-ink-secondary">
                <li>
                  &bull; <strong className="font-semibold">Free Global Shipping</strong> on orders above
                  &#8377;50,000. Below &#8377;50,000, rates are calculated automatically at checkout.
                </li>
                <li>
                  &bull; <strong className="font-semibold">Sovereign Duties:</strong> Customs clearance and local
                  import taxes are the responsibility of the recipient.
                </li>
                <li>
                  &bull; <strong className="font-semibold">Delivery Expectation:</strong> 5-9 business days
                  worldwide.
                </li>
              </ul>
            </section>
          </div>

          <section className="bg-white rounded-lg border border-border p-6 md:p-8 flex flex-col gap-4">
            <h2 className="font-display font-medium text-3xl text-burgundy">Processing &amp; Tailoring Timeline</h2>
            <p className="text-base leading-[1.5] text-ink-secondary">
              Please be advised that if your order includes handloom customization services such as fall matching,
              standard pico stitching, or hand-tailoring of blouses, an additional{" "}
              <strong className="font-semibold">3 to 5 business days</strong> will be appended to your shipment
              processing timeline. Uncustomized premium sarees will always be dispatched within{" "}
              <strong className="font-semibold">24 hours</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-medium text-4xl text-ink">Standard Delivery Rates</h2>
            <div className="mt-6 rounded-lg border border-border overflow-hidden overflow-x-auto">
              {/* border-separate avoids Chrome's per-cell paint seams that collapse
                  shows on the solid header row at fractional layout widths */}
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-base">
                <thead>
                  <tr className="bg-burgundy text-white">
                    <th className="h-12 px-6 text-left font-semibold w-[300px]">Region / Country</th>
                    <th className="h-12 px-6 text-left font-semibold w-[250px]">Order Value threshold</th>
                    <th className="h-12 px-6 text-left font-semibold w-[200px]">Standard Fee</th>
                    <th className="h-12 px-6 text-left font-semibold">Expected Delivery Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {RATES.map((r, i) => (
                    <tr key={`${r.region}-${r.threshold}`} className={i % 2 === 1 ? "bg-cream" : "bg-white"}>
                      <td className="h-12 px-6 border-t border-border text-ink">{r.region}</td>
                      <td className="h-12 px-6 border-t border-border text-ink-secondary">{r.threshold}</td>
                      <td className="h-12 px-6 border-t border-border font-semibold text-burgundy">{r.fee}</td>
                      <td className="h-12 px-6 border-t border-border text-ink-secondary">{r.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-border p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
            <span className="w-14 h-14 rounded-full bg-cream flex items-center justify-center shrink-0">
              <LucideIcon paths={PACKAGE} />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="font-display font-medium text-3xl text-ink">Real-Time Dispatch Tracking</h2>
              <p className="text-base leading-[1.5] text-ink-secondary">
                As soon as your order has been packed and handed over to our verified transit partners (DHL, FedEx,
                or BlueDart), a tracking link will be delivered instantly to your registered phone number via
                WhatsApp/SMS and to your primary email address.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
