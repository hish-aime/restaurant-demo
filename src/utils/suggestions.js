import { dishes } from "../data";

// What a meal is usually missing, with the products we suggest for each gap (in this order).
const GAPS = [
  {
    covered: (item) => item.category === "Boissons & Viennoiseries" || hasOption(item, /boisson|canette/i),
    names: ["Boisson fraîche", "Red Bull", "Bouteille"],
  },
  {
    covered: (item) => item.category === "Desserts" || item.category === "Milkshakes" || hasOption(item, /dessert/i),
    names: ["Cookie", "Flan", "Donut"],
  },
  {
    covered: (item) => item.category === "Frites" || item.category === "Tex-Mex" || hasOption(item, /frite|accompagnement/i),
    names: ["Frites", "Nuggets", "Mozza sticks"],
  },
];

const hasOption = (item, pattern) => (item.options ?? []).some((o) => pattern.test(o.group));

const byName = Object.fromEntries(dishes.map((d) => [d.name, d]));

// Up to `max` products for what the cart is missing (one per gap, drink first).
export function suggestionsFor(cart, max = 3) {
  if (cart.length === 0) return [];
  const inCart = new Set(cart.map((item) => item.name));
  return GAPS.filter((gap) => !cart.some(gap.covered))
    .map((gap) => gap.names.map((n) => byName[n]).find((d) => d && !inCart.has(d.name)))
    .filter(Boolean)
    .slice(0, max);
}
