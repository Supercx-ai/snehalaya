import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

type FooterLink = { label: string; href: string } | { label: string; href?: undefined };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Sarees", href: "/collections" },
      { label: "New Arrivals", href: "/collections/new-arrival" },
      { label: "Bridal", href: "/collections/maharani-bridal-collection" },
      { label: "Maharani", href: "/collections/maharani-bridal-collection" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "Shipping Details", href: "/shipping-policy" },
      { label: "Returns & Exchanges", href: "/returns-exchange" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Stores", href: "/store-locator" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Careers" },
      { label: "Journal", href: "/blog" },
    ],
  },
  {
    // ponytail: no dedicated booking backend — Virtual Shopping / Book a Session both
    // route through WhatsApp, same as the "Shop with us live" homepage section.
    title: "Services",
    links: [
      { label: "Virtual Shopping" },
      { label: "International Shopping" },
      { label: "Book a Session" },
    ],
  },
];

const PAYMENT_BADGES = ["VISA", "Mastercard", "UPI", "Amex", "RuPay"];

export default function Footer() {
  const whatsappHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : undefined;

  return (
    <footer className="bg-white border-t-[6px] border-accent">
      {/* Mobile Figma stacks the brand block and every link column full-width, one after
          another — it's only a 5-up grid from md: up. */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-9 py-16 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div>
          <Image src="/figma/logo.png" alt="Snehalayaa Silks" width={112} height={23} className="h-[26px] w-auto" />
          <p className="mt-4 font-display text-xl text-ink">Authentic Indian silk sarees, woven with intention.</p>
          <div className="mt-6 flex gap-3">
            <span className="w-[18px] h-[18px] text-accent" aria-hidden>
              <Image src="/figma/footer/icon-share.png" alt="" width={18} height={18} />
            </span>
            <Link href="/account" aria-label="Account">
              <Image src="/figma/footer/icon-account.png" alt="" width={18} height={18} />
            </Link>
            <Link href="/store-locator" aria-label="Store locator">
              <Image src="/figma/footer/icon-pin.png" alt="" width={18} height={18} />
            </Link>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-display font-medium text-xl text-primary">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label} className="text-sm text-ink tracking-wide">
                  {l.href ? (
                    <Link href={l.href}>{l.label}</Link>
                  ) : (l.label === "Virtual Shopping" || l.label === "Book a Session") && whatsappHref ? (
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ) : (
                    <span className="text-ink-faint">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-accent/[.28]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-9 py-6 flex flex-wrap items-center justify-center md:justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {PAYMENT_BADGES.map((b) => (
              <span key={b} className="h-[26px] px-2.5 flex items-center rounded text-2xs tracking-wide bg-border-subtle text-ink">
                {b}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink">India · INR (₹) <span className="text-accent">·</span> Ship worldwide</p>
          <p className="text-xs text-ink">&copy; {new Date().getFullYear()} Snehalayaa Silks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
