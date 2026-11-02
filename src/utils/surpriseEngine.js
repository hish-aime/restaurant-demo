import { GROUPS } from "../optionGroups";
import { buildSelection, cheapestSelection, computeOptions, groupTotal, isValid, unitPrice } from "./composer";

export const MOODS = [
  { key: "Léger", emoji: "🥗" },
  { key: "Réconfort", emoji: "🍲" },
  { key: "Équilibré", emoji: "🥦" },
  { key: "Gourmand", emoji: "🍫" },
];

export const BUDGET_TIERS = [
  { key: "8", label: "Jusqu'à 8 €", max: 8 },
  { key: "10", label: "Jusqu'à 10 €", max: 10 },
  { key: "15", label: "Jusqu'à 15 €", max: 15 },
  { key: "20", label: "Jusqu'à 20 €", max: 20 },
];

// A meal is built around one "Mains" product (a menu, a tacos, a panini…), taken with the choices the
// customer would make in the composer. If the product does not come with a drink, one is added.
// Optional extras (dessert, side, supplements) are only suggested, never added on their own.
const LEVELS = [
  { moodOnly: true, complete: true },
  { moodOnly: false, complete: true },
  { moodOnly: true, complete: false },
  { moodOnly: false, complete: false },
];

// Option groups that hold the drink of a menu
const DRINK_GROUPS = ["boisson-incl", "bi2", "bi4", "box", "kids-boisson"];
const LIGHT_DRINK = /Zéro|Slim|Eau|Ice Tea/;
const SIDE_UPGRADES = { Gourmand: "Frites Cheddar", Réconfort: "Frites Cheddar", Équilibré: "Frites moyennes", Léger: "Frites moyennes" };

const rand = (n) => Math.floor(Math.random() * n);
const sample = (list, n) => {
  const rest = [...list];
  const out = [];
  while (rest.length > 0 && out.length < n) out.push(rest.splice(rand(rest.length), 1)[0]);
  return out;
};
const hasGroup = (dish, id) => dish.groups.some((ref) => (typeof ref === "string" ? ref : ref.id) === id);
const priceOf = (dish, sel) => unitPrice(dish.price, computeOptions(dish, sel));
const line = (role, dish, sel) => {
  const options = computeOptions(dish, sel);
  return { role, dish, options, unit: unitPrice(dish.price, options) };
};

// What the customer would pick, at random: free choices first, a paid upgrade only up to `allowance` euros.
function randomSelection(dish, { mood, allowance = 0, menu = false }) {
  const sel = buildSelection(dish, ({ id, def, min, max }) => {
    const names = def.options.map(([name]) => name);
    if (id === "en-menu") return menu ? { [names[0]]: 1 } : null;
    if (def.included) return Object.fromEntries(sample(names, max).map((name) => [name, 1]));
    if (min === 0) return null;

    let pool = def.options.filter(([, price]) => price <= allowance).map(([name]) => name);
    if (pool.length < min) pool = names;
    if (mood === "Léger" && DRINK_GROUPS.includes(id)) {
      const light = pool.filter((name) => LIGHT_DRINK.test(name));
      if (light.length >= 1) pool = light;
    }
    if (def.repeat) {
      const flavours = sample(pool, 2);
      const chosen = {};
      for (let i = 0; i < min; i++) {
        const name = flavours[rand(flavours.length)];
        chosen[name] = (chosen[name] || 0) + 1;
      }
      return chosen;
    }
    return Object.fromEntries(sample(pool, min).map((name) => [name, 1]));
  });
  return isValid(dish, sel) ? sel : cheapestSelection(dish);
}

function covered(main, sel) {
  return {
    side: groupTotal(sel, "accomp") > 0 || /frite/i.test(main.description),
    drink: DRINK_GROUPS.some((id) => groupTotal(sel, id) > 0),
  };
}

function buildMeal(dishes, main, ctx, complete) {
  const sel = randomSelection(main, { ...ctx, menu: complete });
  const extras = [];
  if (complete && !covered(main, sel).drink) {
    const drink = dishes.find((d) => d.name === "Boisson fraîche");
    if (drink) extras.push({ role: "drink", dish: drink, sel: randomSelection(drink, ctx) });
  }
  return { main: { dish: main, sel }, extras };
}

const baseTotal = (meal) => priceOf(meal.main.dish, meal.main.sel) + meal.extras.reduce((sum, e) => sum + priceOf(e.dish, e.sel), 0);

function applyOption(sel, { groupId, optionName, mode }) {
  const current = sel[groupId] || {};
  if (mode === "replace") return { ...sel, [groupId]: { [optionName]: 1 } };
  return { ...sel, [groupId]: { ...current, [optionName]: (current[optionName] || 0) + 1 } };
}

const dishSuggestion = (role, dish, sel) => ({
  id: `dish:${dish.id}`,
  type: "dish",
  role,
  dish,
  sel,
  options: computeOptions(dish, sel),
  price: priceOf(dish, sel),
});

// Optional extras shown under the result: supplements on the main, a side, desserts.
function buildSuggestions(dishes, meal, mood) {
  const { dish: main, sel } = meal.main;
  const suggestions = [];

  const optionIdeas = [];
  if (hasGroup(main, "accomp")) {
    const name = SIDE_UPGRADES[mood];
    optionIdeas.push({ groupId: "accomp", optionName: name, mode: "replace", label: `${name} à la place de la petite frite` });
  }
  if (hasGroup(main, "supp")) {
    const name = sample(GROUPS.supp.options.map(([n]) => n), 1)[0];
    optionIdeas.push({ groupId: "supp", optionName: name, mode: "add", label: `${name} en plus` });
  }
  if (hasGroup(main, "sauce-sup")) {
    const name = sample(GROUPS["sauce-sup"].options.map(([n]) => n), 1)[0];
    optionIdeas.push({ groupId: "sauce-sup", optionName: name, mode: "add", label: `Une sauce ${name.toLowerCase()} en plus` });
  }
  for (const idea of sample(optionIdeas, 2)) {
    suggestions.push({
      ...idea,
      id: `${idea.groupId}:${idea.optionName}`,
      type: "option",
      price: priceOf(main, applyOption(sel, idea)) - priceOf(main, sel),
    });
  }

  const inMeal = new Set([main.name, ...meal.extras.map((e) => e.dish.name)]);
  const frites = dishes.find((d) => d.name === "Frites");
  if (frites && !covered(main, sel).side && !inMeal.has(frites.name) && mood !== "Léger") {
    const fSel = randomSelection(frites, { mood });
    suggestions.push(dishSuggestion("side", frites, fSel));
  }

  const desserts = dishes.filter((d) => d.course === "Desserts" && !inMeal.has(d.name));
  const liked = desserts.filter((d) => d.moods.includes(mood));
  for (const dessert of sample(liked.length >= 2 ? liked : desserts, 2)) {
    const dSel = randomSelection(dessert, { mood });
    suggestions.push(dishSuggestion("dessert", dessert, dSel));
  }
  return suggestions;
}

function includedLabel(main, meal) {
  const { side, drink } = covered(main, meal.main.sel);
  const hasExtraDrink = meal.extras.some((e) => e.role === "drink");
  if (side && drink) return "Frites et boisson compris";
  if (drink) return "Boisson comprise";
  if (side && hasExtraDrink) return "Frites comprises, boisson ajoutée";
  if (hasExtraDrink) return "Boisson ajoutée";
  return side ? "Frites comprises" : "";
}

function buildJustification(mood, level, meal) {
  const name = meal.main.dish.name;
  const included = includedLabel(meal.main.dish, meal);
  const suffix = included ? ` (${included.toLowerCase()})` : "";
  const moodLower = mood.toLowerCase();
  switch (level) {
    case 0:
      return `Pour ton envie « ${moodLower} » : ${name}${suffix}.`;
    case 1:
      return `Rien de 100 % ${moodLower} dans ce budget, mais ${name}${suffix} devrait te plaire.`;
    case 2:
      return `Budget serré : on garde ${name}, qui colle à ton envie, sans boisson.`;
    default:
      return `Avec ce budget, on te propose au moins ${name}.`;
  }
}

export function pickMeal(dishes, mood, budgetTier, excludeIds = []) {
  for (let level = 0; level < LEVELS.length; level++) {
    const { moodOnly, complete } = LEVELS[level];
    const mains = dishes.filter((d) => d.course === "Mains" && (!moodOnly || d.moods.includes(mood)));

    // one random way of ordering each main that fits the budget
    const options = [];
    for (const main of mains) {
      const fits = Array.from({ length: 8 }, () => {
        const allowance = mood !== "Léger" && Math.random() < 0.4 ? 2 : 0;
        return buildMeal(dishes, main, { mood, allowance }, complete);
      }).filter((meal) => baseTotal(meal) <= budgetTier.max);
      if (fits.length > 0) options.push(fits[rand(fits.length)]);
    }

    const fresh = options.filter((meal) => !excludeIds.includes(meal.main.dish.id));
    const pool = fresh.length > 0 ? fresh : options;
    if (pool.length === 0) continue;

    const meal = pool[rand(pool.length)];
    return {
      ...meal,
      budget: budgetTier.max,
      level,
      degraded: level > 0,
      included: includedLabel(meal.main.dish, meal),
      suggestions: buildSuggestions(dishes, meal, mood),
      note: buildJustification(mood, level, meal),
    };
  }
  return { impossible: true };
}

// The meal with the picked suggestions applied: lines to show and to add to the cart.
export function resolveMeal(meal, pickedIds) {
  const picked = new Set(pickedIds);
  const mainSel = meal.suggestions
    .filter((s) => s.type === "option" && picked.has(s.id))
    .reduce((sel, s) => applyOption(sel, s), meal.main.sel);
  const lines = [
    line("main", meal.main.dish, mainSel),
    ...meal.extras.map((e) => line(e.role, e.dish, e.sel)),
    ...meal.suggestions.filter((s) => s.type === "dish" && picked.has(s.id)).map((s) => line(s.role, s.dish, s.sel)),
  ];
  return { lines, total: lines.reduce((sum, l) => sum + l.unit, 0) };
}
