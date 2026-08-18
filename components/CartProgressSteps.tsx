import Link from "next/link";
import Image from "next/image";

type Step = "cart" | "shipping" | "payment";

const STEPS: { id: Step; label: string; href: string }[] = [
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "shipping", label: "Shipping", href: "/cart/shipping" },
  { id: "payment", label: "Payment", href: "/cart/payment" },
];

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={`size-5 ${className}`} aria-hidden>
      <path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function CardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={`size-5 ${className}`} aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19" />
      <path d="M6 15h4" />
    </svg>
  );
}

function ArrowConnector() {
  return (
    <div className="flex items-center mx-3 lg:mx-4 mb-6 text-[#cfc3ae]" aria-hidden>
      <div className="w-10 sm:w-16 lg:w-[90px] h-px bg-current" />
      <svg viewBox="0 0 8 10" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[7px] h-[9px] -ml-px">
        <path d="M1 1l4.5 4L1 9" />
      </svg>
    </div>
  );
}

export default function CartProgressSteps({ current = "cart" }: { current?: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Checkout progress" className="flex items-center justify-center">
      {STEPS.map((step, i) => {
        const active = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center">
            <Link href={step.href} className="flex flex-col items-center gap-2">
              <div
                className={`w-[46px] h-[46px] rounded-full flex items-center justify-center ${
                  active ? "bg-burgundy text-cream" : "bg-[#f1ebe3] border border-[#e8e0d5] text-[#3f3f3f]"
                }`}
              >
                {step.id === "cart" ? (
                  <span className="relative size-5 overflow-clip">
                    <Image
                      src={active ? "/figma/icon-cart-white.svg" : "/figma/icon-cart.svg"}
                      alt=""
                      width={20}
                      height={20}
                      className="size-full"
                    />
                  </span>
                ) : step.id === "shipping" ? (
                  <PinIcon />
                ) : (
                  <CardIcon />
                )}
              </div>
              <span
                className={`text-[11px] tracking-[1.2px] uppercase whitespace-nowrap ${
                  active ? "text-burgundy font-semibold" : "text-[#3f3f3f] font-medium"
                }`}
              >
                {i + 1}. {step.label}
              </span>
            </Link>
            {i < STEPS.length - 1 && <ArrowConnector />}
          </div>
        );
      })}
    </nav>
  );
}
