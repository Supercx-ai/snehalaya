// Colour / fabric / size for a cart line. Real variant options when the product has
// them; otherwise derived from the store's title convention ("Maroon Kanjivaram Silk
// Saree" — colour prefix, fabric word, single-variant products are Free Size), the same
// convention the PDP colourway logic uses.
const isSku = (w: string) => /^[a-z]{2,6}\d{3,}$/i.test(w);

export function deriveLineAttrs(title: string, selectedOptions: { name: string; value: string }[]) {
  const options = selectedOptions.filter((o) => o.value.toLowerCase() !== "default title");
  const words = title.trim().split(/\s+/).filter((w) => !isSku(w));
  const colour =
    options.find((o) => /colou?r/i.test(o.name))?.value ??
    (words.length > 3 ? words.slice(0, words.length - 3).join(" ") : null);
  const fabric = words.length >= 2 ? words[words.length - 2] : null;
  const size = options.find((o) => /size/i.test(o.name))?.value ?? "Free Size";
  // The style phrase without the colour prefix — "Kanjivaram Silk Saree".
  const style = words.slice(Math.max(0, words.length - 3)).join(" ");
  return { options, colour, fabric, size, style };
}
