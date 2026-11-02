import { ITEM_GROUPS } from "./optionGroups";
import { photoOf } from "./photos";

// Opening hours by weekday (0 = Sunday … 6 = Saturday), [open, close] in local time, null = closed all day.
// Mon–Fri 07:30–20:00, Sat 11:30–20:00, Sunday closed (hours given by the shop owner).
export const openingHours = {
  0: null,
  1: ["07:30", "20:00"],
  2: ["07:30", "20:00"],
  3: ["07:30", "20:00"],
  4: ["07:30", "20:00"],
  5: ["07:30", "20:00"],
  6: ["11:30", "20:00"],
};

// Human-readable version of openingHours (keep both in sync).
export const hoursSummary = [
  ["Lundi – vendredi", "7h30 – 20h00"],
  ["Samedi", "11h30 – 20h00"],
  ["Dimanche", "Fermé"],
];

// Contact details as printed on the shop's flyer.
export const restaurant = {
  name: "Le Fournil",
  tagline: "Burgers, tacos, paninis & desserts · Viande halal",
  slogan: "Le snack de votre quartier",
  address: "5 av. de Sylvie, 60500 Chantilly",
  phone: "09 70 93 34 10",
  snapchat: "fournil60",
  service: "Sur place · À emporter",
};

// course: role in "Surprends-moi": Mains = a meal is built around it, Desserts = suggested as a treat, null = never suggested.
// moods: tags used by the "Surprends-moi" generator.
const MENU = [
  { category: "Buckets", emoji: "🍗", course: "Mains", moods: ["Gourmand", "Réconfort"], items: [
    ["Mini Mixte", 12, "4 nuggets, 4 tenders et 2 wings de poulet croustillants, avec une petite frite et 2 sauces au choix. Viande halal."],
    ["Box Tenders", 24, "15 tenders de poulet croustillants, 2 portions de frites et 2 boissons. Viande halal."],
    ["Box Wings", 24, "15 wings de poulet croustillants, 2 portions de frites et 2 boissons. Viande halal."],
    ["Box Family", 32, "8 wings, 8 tenders et 8 nuggets de poulet croustillants, 4 portions de frites et 4 boissons. Idéal pour 4. Viande halal."],
  ] },
  { category: "Menus sandwichs", emoji: "🥪", course: "Mains", moods: ["Réconfort", "Gourmand"], note: "Sandwich, petite frite et canette incluses", items: [
    ["Menu sandwich kebab", 7.5, "Pain garni de viande kebab, salade, tomates et oignons. Servi avec frites et boisson au choix. Viande halal.", "🥙"],
    ["Menu sandwich le blindé", 8, "Triple steaks, œuf et cheddar. Servi avec frites et boisson au choix. Viande halal.", "🍔"],
    ["Menu sandwich country chicken", 7.5, "Poulet croustillant et galette de pomme de terre. Servi avec frites et boisson au choix. Viande halal.", "🍗"],
    ["Menu sandwich classique", 6.5, "2 steaks hachés et cheddar. Servi avec frites et boisson au choix. Viande halal.", "🍔"],
    ["Menu wrap poulet", 7.5, "3 tenders de poulet et cheddar. Servi avec frites et boisson au choix. Viande halal.", "🌯"],
    ["Menu wrap végé", 7.5, "Galette de blé garnie de 2 mozzasticks fondants et crudités. Servi avec frites et boisson au choix.", "🌯", ["Léger", "Équilibré"]],
    ["Menu Giant", 7.5, "Burger généreux avec steak haché de 90 g, cheddar, salade et sauce. Servi avec frites et boisson au choix. Viande halal.", "🍔"],
  ] },
  { category: "Duos burgers", emoji: "🍔", course: "Mains", moods: ["Gourmand", "Réconfort"], items: [
    ["Duo burger poulet", 7, "Deux burgers au poulet pané. Servis avec frites. Viande halal."],
    ["Duo cheeseburger", 6.5, "Deux cheeseburgers. Servis avec frites. Viande halal."],
    ["Duo burger poisson", 7, "Deux burgers au poisson pané. Servis avec frites.", "🐟"],
  ] },
  { category: "Tacos", emoji: "🌮", course: "Mains", moods: ["Gourmand"], items: [
    ["Tacos M", 7, "1 viande et sauce au choix. Viande halal."],
    ["Tacos L", 8, "2 viandes et sauce au choix. Viande halal."],
    ["Tacos XL", 9, "3 viandes et sauce au choix. Viande halal."],
    ["Tacos XXL", 10, "4 viandes et sauce au choix. Viande halal."],
  ] },
  { category: "Tasty crousty", emoji: "🍚", course: "Mains", moods: ["Réconfort"], items: [
    ["Tasty crousty", 7, "Bol de riz garni de nuggets ou de tenders croustillants, nappé de sauce : 1 sauce en M, 2 en L, 3 en XL. Viande halal."],
  ] },
  { category: "Menu Enfant", emoji: "🧒", course: "Mains", moods: ["Léger", "Réconfort"], items: [
    ["Menu Fournil Enfant", 6, "Petite frite, un Ptit'Cheese ou 4 nuggets, et un Capri-Sun ou une Pom'Potes. Viande halal.", undefined, undefined, null],
  ] },
  { category: "Les paninis", emoji: "🥖", course: "Mains", moods: ["Réconfort"], note: "Seul ou en menu (+2 €) avec canette et viennoiserie", items: [
    ["Panini", 4.5, "Panini grillé, garniture au choix : merguez, 3 fromages, poulet mariné, kebab, dinde, viande hachée ou jambon de poulet. Viande halal."],
    ["Panini Nutella", 3, "Panini grillé fourré au Nutella fondant.", "🍫", ["Gourmand", "Réconfort"], "Desserts"],
  ] },
  { category: "Croques", emoji: "🥪", course: "Mains", moods: ["Réconfort", "Léger"], items: [
    ["Croque", 4, "Jambon de dinde. Viande halal."],
  ] },
  { category: "Sandwichs crudités", emoji: "🥖", course: "Mains", moods: ["Léger", "Équilibré"], items: [
    ["Sandwich crudités", 4.5, "Baguette garnie de crudités et de la garniture de ton choix : thon, poulet épicé, dinde ou tranche de poulet. Viande halal."],
    ["Menu sandwich crudités", 6.5, "Sandwich crudités avec la garniture de ton choix, une boisson et une viennoiserie (pain au chocolat ou croissant). Viande halal."],
  ] },
  { category: "Salades", emoji: "🥗", course: "Mains", moods: ["Équilibré", "Léger"], items: [
    ["Salade César", 6, "Salade verte, tomates, croûtons et poulet émincé, sauce César. Viande halal."],
  ] },
  { category: "Tex-Mex", emoji: "🍤", course: "Starters", moods: ["Gourmand", "Réconfort"], items: [
    ["Nuggets", 6, "6 ou 8 nuggets de poulet panés et croustillants. Viande halal.", "🍗"],
    ["Wings", 6, "4 ou 6 ailes de poulet panées et croustillantes. Viande halal.", "🍗"],
    ["Tenders", 6, "Filets de poulet panés et croustillants. Viande halal.", "🍗"],
    ["Mozza sticks", 6, "Bâtonnets de mozzarella panés, fondants à cœur.", "🧀", ["Gourmand", "Réconfort", "Léger"]],
    ["Nems", 6, "4 ou 6 nems croustillants.", "🥟", ["Léger", "Gourmand"]],
    ["Jalapeños", 6, "5 piments jalapeños panés et farcis au fromage.", "🌶️"],
    ["Onion rings", 6, "5 rondelles d'oignon panées et croustillantes.", "🧅", ["Léger", "Gourmand"]],
  ] },
  { category: "Frites", emoji: "🍟", course: "Starters", moods: ["Réconfort", "Gourmand"], items: [
    ["Frites Twister", 4, "Frites en spirale assaisonnées et croustillantes."],
    ["Frites", 2.5, "Frites dorées et croustillantes. Petite, moyenne ou grande.", "🍟", ["Réconfort", "Léger"]],
    ["Frites Cheddar", 4, "Frites nappées de sauce cheddar fondante. En option : lardons ou oignons frits.", "🧀"],
    ["Pot de sauce", 0.5, "Pot de sauce au choix : ketchup, mayonnaise, samouraï, BBQ, burger, algérienne, biggy, blanche, curry ou chilli.", "🥫", null, null],
  ] },
  { category: "Desserts", emoji: "🍰", course: "Desserts", moods: ["Gourmand", "Réconfort"], items: [
    ["Flan", 2.5, "Part de flan pâtissier.", "🍮", ["Gourmand", "Léger"]],
    ["Tiramisu caramel", 2.5, "Tiramisu en verrine au caramel.", "☕"],
    ["Tiramisu chocolat noisette spéculoos", 2.5, "Tiramisu en verrine au chocolat, à la noisette et au spéculoos.", "☕"],
    ["Tarte au Daim", 2.5, "Part de tarte au Daim, caramel et chocolat.", "🥧"],
    ["Éclair au chocolat", 2.5, "Éclair garni de crème au chocolat et glacé au chocolat.", "🍫"],
    ["Crêpe", 2.5, "Crêpe sucrée, au Nutella ou au Nella. Chantilly, nappage ou saveur en supplément.", "🥞"],
    ["Cookie", 1.8, "Cookie au choix : trio de pépites de chocolat, tout chocolat ou chocolat blanc cranberry.", "🍪", ["Gourmand", "Léger"]],
    ["Maxi cookie au Nutella", 2.5, "Grand cookie fourré au Nutella.", "🍪"],
    ["Donut", 2, "Donut au choix : Oreo, fraise ou chocolat.", "🍩", ["Gourmand", "Léger"]],
    ["Donut au sucre", 1.8, "Donut nature saupoudré de sucre.", "🍩", ["Gourmand", "Léger"]],
    ["Muffin", 2.5, "Muffin au choix : Nutella ou tout chocolat.", "🧁"],
  ] },
  { category: "Milkshakes", emoji: "🥤", course: "Desserts", moods: ["Gourmand"], items: [
    ["Milkshake", 3.9, "Milkshake onctueux au parfum de ton choix parmi 12 parfums. Chantilly, nappage ou saveur en supplément."],
  ] },
  { category: "Boissons & Viennoiseries", emoji: "🥤", course: null, moods: [], items: [
    ["Boisson fraîche", 1.5, "Canette 33 cl au choix."],
    ["Eau plate", 1, "Bouteille d'eau plate.", "💧"],
    ["Capri-Sun Multivitamines 20 cl", 0.8, "Capri-Sun Multivitamines 20 cl.", "🧃"],
    ["Capri-Sun Maxi", 1.5, "Capri-Sun Maxi 33 cl, parfum au choix.", "🧃"],
    ["Cristaline aromatisée", 1.5, "Eau aromatisée Cristaline, parfum au choix.", "💧"],
    ["Bouteille", 2, "Bouteille au choix : Coca-Cola, Coca-Cola Cherry, Orangina, Oasis, Lipton Ice Tea pêche ou jus Granini (orange, pomme, ananas).", "🍾"],
    ["San Pellegrino", 1.5, "Petite bouteille d'eau pétillante San Pellegrino.", "💧"],
    ["Red Bull", 2, "Red Bull 25 cl au choix : Original à 2 €, Myrtille, Juneberry, Abricot Pêche, Ice, Agrumes ou Green à 2,50 €.", "⚡"],
    ["B'lue", 2.8, "Boisson vitaminée B'lue, parfum au choix."],
    ["Croissant", 1, "Croissant pur beurre.", "🥐"],
    ["Pain au chocolat", 1, "Pain au chocolat.", "🥐"],
    ["Chausson aux pommes", 1.5, "Chausson aux pommes.", "🥐"],
    ["Pain aux raisins", 1.5, "Pain aux raisins.", "🥐"],
    ["Pain suisse", 1.5, "Pain suisse.", "🥐"],
    ["Torsade", 1.5, "Torsade.", "🥐"],
    ["Cône au chocolat", 1.5, "Cône au chocolat.", "🥐"],
  ] },
];

export const categoryNotes = Object.fromEntries(
  MENU.filter((c) => c.note).map((c) => [c.category, c.note])
);

// Tab ids of the menu navigation (categories sit between HOME/MENUS and ALL)
export const HOME = "Accueil";
export const MENUS = "Nos Menus";
export const ALL = "Tout";

export const categories = MENU.map((cat) => cat.category);
export const categoryEmojis = Object.fromEntries(MENU.map((cat) => [cat.category, cat.emoji]));

// A category (or section) with more products than this starts collapsed.
export const COLLAPSE_AFTER = 6;

// Sub-sections of the big categories: [title, emoji, product names], in display order.
const SUBSECTIONS = {
  Desserts: [
    ["Pâtisseries & crêpes", "🍰", ["Flan", "Tiramisu caramel", "Tiramisu chocolat noisette spéculoos", "Tarte au Daim", "Éclair au chocolat", "Crêpe"]],
    ["Cookies, donuts & muffins", "🍪", ["Cookie", "Maxi cookie au Nutella", "Donut", "Donut au sucre", "Muffin"]],
  ],
  "Boissons & Viennoiseries": [
    ["Boissons fraîches", "🥤", ["Boisson fraîche", "Bouteille", "Capri-Sun Multivitamines 20 cl", "Capri-Sun Maxi"]],
    ["Eaux", "💧", ["Eau plate", "Cristaline aromatisée", "San Pellegrino"]],
    ["Énergie & vitamines", "⚡", ["Red Bull", "B'lue"]],
    ["Viennoiseries", "🥐", ["Croissant", "Pain au chocolat", "Chausson aux pommes", "Pain aux raisins", "Pain suisse", "Torsade", "Cône au chocolat"]],
  ],
};

const MENU_CATEGORIES = new Set(["Buckets", "Duos burgers", "Tacos", "Tasty crousty"]);

// Small badges on products; only what the product name or description states.
const TAGS = {
  "Menu wrap végé": ["Végé"],
  "Mozza sticks": ["Végé"],
  "Onion rings": ["Végé"],
  Jalapeños: ["Épicé", "Végé"],
};

let nextId = 1;
export const dishes = MENU.flatMap((cat) =>
  cat.items.map(([name, price, description, emoji, moods, course]) => ({
    id: nextId++,
    name,
    description,
    price,
    category: cat.category,
    emoji: emoji || cat.emoji,
    course: course === undefined ? cat.course : course,
    moods: moods ?? cat.moods,
    photo: photoOf(name),
    tags: TAGS[name] ?? [],
    groups: ITEM_GROUPS[name] ?? [],
    isMenu: MENU_CATEGORIES.has(cat.category) || name.startsWith("Menu "),
  }))
);

const byName = Object.fromEntries(dishes.map((d) => [d.name, d]));
const pick = (names) => names.map((n) => byName[n]).filter(Boolean);

// Products of a category split into its sub-sections (a single untitled section when it has none).
export function sectionsOf(category, items) {
  const subs = SUBSECTIONS[category];
  if (!subs) return [{ id: category, title: category, emoji: categoryEmojis[category], items }];
  return subs
    .map(([title, emoji, names]) => ({
      id: `${category}/${title}`,
      title,
      emoji,
      items: names.map((n) => items.find((d) => d.name === n)).filter(Boolean),
    }))
    .filter((section) => section.items.length > 0);
}

// "On partage ?" on the home page: the boxes by number of people.
export const shareOffers = [
  { people: 2, items: pick(["Box Tenders", "Box Wings"]) },
  { people: 4, items: pick(["Box Family"]) },
];
export const menuMinPrice = Math.min(...dishes.filter((d) => d.isMenu).map((d) => d.price));

// "Accueil" rows, Netflix style.
export const homeRows = [
  { title: "Les incontournables", items: pick(["Menu sandwich le blindé", "Menu Giant", "Tacos L", "Mini Mixte", "Duo cheeseburger", "Tasty crousty", "Menu wrap poulet"]) },
  { title: "Petits prix", items: pick(["Croque", "Sandwich crudités", "Panini", "Frites", "Flan", "Cookie", "Salade César"]) },
  { title: "Côté gourmand", items: pick(["Milkshake", "Crêpe", "Maxi cookie au Nutella", "Donut", "Tiramisu caramel", "Tarte au Daim", "Éclair au chocolat"]) },
  { title: "Les petits", items: pick(["Menu Fournil Enfant", "Duo cheeseburger", "Nuggets", "Frites", "Capri-Sun Maxi"]) },
  { title: "Pour se rafraîchir", items: pick(["Boisson fraîche", "Red Bull", "Bouteille", "Cristaline aromatisée", "B'lue"]) },
];

// "Nos Menus": every composable menu, grouped by category.
export const menuSections = categories
  .map((category) => ({ category, items: dishes.filter((d) => d.category === category && d.isMenu) }))
  .filter((section) => section.items.length > 0);

// Cover photo of each category: its first product that has a photo (null = emoji).
export const categoryCovers = Object.fromEntries(
  categories.map((category) => [category, dishes.find((d) => d.category === category && d.photo)?.photo ?? null])
);
