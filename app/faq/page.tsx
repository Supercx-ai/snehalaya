import type { Metadata } from "next";
import FaqBrowser from "@/components/FaqBrowser";

export const metadata: Metadata = {
  title: "FAQs | Snehalayaa Silks",
  description: "Find absolute guidance on orders, shipping, care rituals, and customized tailoring.",
};

// The hero lives inside FaqBrowser: the design puts the search bar in the hero,
// and its state drives the accordion list below.
export default function FaqPage() {
  return (
    <div className="bg-cream">
      <FaqBrowser />
    </div>
  );
}
