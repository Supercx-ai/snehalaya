export const PRICE_RANGES = [
  { label: "Any Price", min: undefined, max: undefined },
  { label: "Under ₹5k", min: undefined, max: 5000 },
  { label: "₹5k–₹10k", min: 5000, max: 10000 },
  { label: "₹10k–₹25k", min: 10000, max: 25000 },
  { label: "₹25k–₹55k", min: 25000, max: 55000 },
  { label: "₹55k+", min: 55000, max: undefined },
] as const;
