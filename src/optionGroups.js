// Option groups ("personnalisations") of Le Fournil de Chantilly, ported from the Uber Eats Manager sheet.
// min/max = number of choices the customer must make. repeat = the same option may be picked several times.
// limitBy = the max depends on another group's selection (e.g. number of included sauces depends on the size).
// included = free choices "jusqu'à max" (never forced); paid extras live in their own group ("sauce-sup").

const z = (names) => names.map((n) => [n, 0]);

const CANS = ["Coca-Cola", "Coca-Cola Zéro", "Coca-Cola Cherry", "Pepsi", "Fanta Orange", "Fanta Citron", "Oasis Tropical", "Oasis Pomme Cassis Framboise", "Oasis Fraise Framboise", "Orangina", "7up", "7up Menthe Citron Vert", "7up Cherry", "Sprite", "Schweppes Agrumes", "Lipton Ice Tea", "Slim Ananas", "Slim Citron", "Slim Litchi", "Eau"];
const BOTTLES = ["Coca-Cola 50 cl", "Coca-Cola Cherry 50 cl", "Orangina 50 cl", "Oasis Tropical 50 cl", "Oasis Orange 50 cl", "Lipton Ice Tea Pêche 50 cl", "Granini Orange", "Granini Pomme", "Granini Ananas"];
const RED_BULL = ["Red Bull Original", "Red Bull Myrtille", "Red Bull Juneberry", "Red Bull Abricot Pêche", "Red Bull Ice", "Red Bull Agrumes", "Red Bull Green"];
const BLUE = ["Fraise", "Litchi", "Pêche", "Pomme verte", "Pastèque"];
const SAUCES = ["Ketchup", "Mayonnaise", "Samouraï", "BBQ", "Burger", "Algérienne", "Biggy", "Blanche", "Curry", "Chilli"];
const MEATS = ["Steak", "Nuggets", "Poulet épicé", "Kebab", "Merguez", "Tenders", "Cordon bleu"];

const PAID_DRINKS = [
  ...CANS.map((n) => [n, n === "Eau" ? 1 : 1.5]),
  ["Capri-Sun Multivitamines 20 cl", 0.8],
  ["Capri-Sun Maxi Mangue Maracuja 33 cl", 1.5],
  ["Capri-Sun Maxi Multivitamines 33 cl", 1.5],
  ["Cristaline aromatisée Pêche", 1.5],
  ["Cristaline aromatisée Fraise", 1.5],
  ...BOTTLES.map((n) => [n, 2]),
  ["San Pellegrino", 1.5],
  ...RED_BULL.map((n, i) => [n, i ? 2.5 : 2]),
  ...BLUE.map((n) => ["B'lue " + n, 2.8]),
];

const g = (name, min, max, options, extra = {}) => ({ name, min, max, options, ...extra });

export const GROUPS = {
  supp: g("Suppléments", 0, 4, [["Œuf", 1], ["Chèvre", 1], ["Cheddar", 1], ["Lardons", 1]]),
  accomp: g("Accompagnement", 1, 1, [["Petite frite (incluse)", 0], ["Frites moyennes", 1.5], ["Grandes frites", 3], ["Frites Twister", 2], ["Frites Cheddar", 2]]),
  "sauce-sup": g("Sauces supplémentaires", 0, 5, SAUCES.map((n) => [n, 0.5]), { note: "0,50 € l'unité, en plus des sauces incluses" }),
  "boisson-sup": g("Boisson supplémentaire", 0, 3, PAID_DRINKS, { note: "Au prix plein" }),
  dessert: g("Un petit dessert ?", 0, 3, [
    ["Flan", 2.5], ["Tiramisu caramel", 2.5], ["Tiramisu chocolat noisette spéculoos", 2.5], ["Tarte au Daim", 2.5], ["Éclair au chocolat", 2.5],
    ["Panini Nutella", 3], ["Crêpe sucrée", 2.5], ["Crêpe Nutella", 3], ["Crêpe Nella", 3.5],
    ["Cookie trio de pépites de chocolat", 1.8], ["Cookie tout chocolat", 1.8], ["Cookie chocolat blanc cranberry", 1.8], ["Maxi cookie au Nutella", 2.5],
    ["Donut Oreo", 2], ["Donut fraise", 2], ["Donut chocolat", 2], ["Donut au sucre", 1.8],
    ["Muffin Nutella", 2.5], ["Muffin tout chocolat", 2.5],
  ]),
  "boisson-incl": g("Boisson incluse", 1, 1, z(CANS), { note: "Canettes 33 cl uniquement" }),
  bi2: g("2 boissons incluses", 2, 2, z(CANS), { note: "Canettes 33 cl uniquement" }),
  box: g("Boissons de la Box", 1, 1, [["4 canettes", 0], ["1 grande bouteille de Coca-Cola", 0]]),
  bi4: g("4 boissons incluses", 4, 4, z(CANS), { repeat: true, note: "La même canette peut être choisie plusieurs fois" }),
  vienn: g("Viennoiserie incluse", 1, 1, [["Pain au chocolat", 0], ["Croissant", 0]]),
  "en-menu": g("En menu", 0, 1, [["Boisson et viennoiserie", 2]], { note: "Canette 33 cl + pain au chocolat ou croissant" }),
  "sauces-x2": g("Sauces incluses", 0, 2, z(SAUCES), { included: true }),
  "sauce-tacos": g("Sauce incluse", 0, 1, z(SAUCES), { included: true }),
  "viande-tacos-1": g("Viande", 1, 1, z(MEATS)),
  "viande-tacos-2": g("Viandes", 2, 2, z(MEATS)),
  "viande-tacos-3": g("Viandes", 3, 3, z(MEATS)),
  "viande-tacos-4": g("Viandes", 4, 4, z(MEATS)),
  "taille-crousty": g("Taille", 1, 1, [["M", 0], ["L", 2], ["XL", 5]], { note: "M : 1 sauce · L : 2 sauces · XL : 3 sauces" }),
  "viande-crousty": g("Viande", 1, 1, z(["Nuggets", "Tenders"])),
  "sauce-crousty": g("Sauces incluses", 0, 3, z(["Sucrée", "Piquante", "Sucrée piquante", ...SAUCES]), {
    included: true,
    limitBy: { group: "taille-crousty", values: { M: 1, L: 2, XL: 3 } },
  }),
  "qte-nuggets": g("Nombre de nuggets", 1, 1, [["6 nuggets", 0], ["8 nuggets", 2]]),
  "qte-46": g("Nombre de pièces", 1, 1, [["4 pièces", 0], ["6 pièces", 2]]),
  "taille-frites": g("Taille des frites", 1, 1, [["Petite", 0], ["Moyenne", 1], ["Grande", 2.5]]),
  "supp-frites": g("Suppléments frites", 0, 2, [["Lardons", 1], ["Oignons frits", 1]]),
  "garniture-panini": g("Garniture du panini", 1, 1, z(["Merguez", "3 fromages", "Poulet mariné", "Kebab", "Dinde", "Viande hachée", "Jambon de poulet"])),
  "garniture-sandwich": g("Garniture du sandwich", 1, 1, z(["Thon", "Poulet épicé", "Dinde", "Tranche de poulet"])),
  "kids-plat": g("Plat du menu enfant", 1, 1, z(["Ptit'Cheese", "4 nuggets"])),
  "kids-boisson": g("Boisson du menu enfant", 1, 1, z(["Capri-Sun", "Pom'Potes"])),
  "garniture-crepe": g("Garniture de la crêpe", 1, 1, [["Sucrée", 0], ["Nutella", 0.5], ["Nella", 1]]),
  "supp-gourmand": g("Suppléments gourmands", 0, 3, [["Chantilly", 0.5], ["Nappage", 1], ["Saveur", 1.2]]),
  "parfum-milkshake": g("Parfum du milkshake", 1, 1, z(["Nutella", "Oréo", "Fraise", "Vanille", "Kit Kat", "Nella", "Mangue", "Kinder Country", "M&M's", "Spéculoos", "Coco", "Kinder Bueno"])),
  "sauce-pot": g("Sauce du pot", 1, 1, z(SAUCES)),
  "canette-choix": g("Canette au choix", 1, 1, z(CANS.filter((n) => n !== "Eau"))),
  bouteille: g("Bouteille au choix", 1, 1, z(BOTTLES)),
  redbull: g("Choix du Red Bull", 1, 1, RED_BULL.map((n, i) => [n, i ? 0.5 : 0]), { note: "+0,50 € hors Original" }),
  "parfum-cookie": g("Parfum du cookie", 1, 1, z(["Trio de pépites de chocolat", "Tout chocolat", "Chocolat blanc cranberry"])),
  "parfum-donut": g("Parfum du donut", 1, 1, z(["Oreo", "Fraise", "Chocolat"])),
  "parfum-muffin": g("Parfum du muffin", 1, 1, z(["Nutella", "Tout chocolat"])),
  "parfum-blue": g("Parfum B'lue", 1, 1, z(BLUE)),
  "parfum-capri": g("Parfum Capri-Sun", 1, 1, z(["Mangue Maracuja", "Multivitamines"])),
  "parfum-cristaline": g("Parfum Cristaline", 1, 1, z(["Pêche", "Fraise"])),
};

// Groups shown at the "En menu" / "Box" choice only
const IN_MENU = { group: "en-menu", option: "Boisson et viennoiserie" };
const MENU_SANDWICH = ["supp", "accomp", "sauce-sup", "boisson-incl", "dessert"];
const tacos = (n) => [`viande-tacos-${n}`, "sauce-tacos", "supp", "sauce-sup", "boisson-sup", "dessert"];

// Option groups shown for each item, in the order the customer sees them (suppléments, frites, sauces, boisson, dessert last).
export const ITEM_GROUPS = {
  "Mini Mixte": ["accomp", "sauces-x2", "sauce-sup", "dessert"],
  "Box Tenders": ["sauce-sup", "bi2", "dessert"],
  "Box Wings": ["sauce-sup", "bi2", "dessert"],
  "Box Family": ["box", { id: "bi4", requires: { group: "box", option: "4 canettes" } }, "sauce-sup", "dessert"],

  "Menu sandwich kebab": MENU_SANDWICH,
  "Menu sandwich le blindé": MENU_SANDWICH,
  "Menu sandwich country chicken": MENU_SANDWICH,
  "Menu sandwich classique": MENU_SANDWICH,
  "Menu wrap poulet": MENU_SANDWICH,
  "Menu wrap végé": MENU_SANDWICH,
  "Menu Giant": MENU_SANDWICH,
  "Duo burger poulet": MENU_SANDWICH,
  "Duo cheeseburger": MENU_SANDWICH,
  "Duo burger poisson": MENU_SANDWICH,

  "Tacos M": tacos(1),
  "Tacos L": tacos(2),
  "Tacos XL": tacos(3),
  "Tacos XXL": tacos(4),
  "Tasty crousty": ["taille-crousty", "viande-crousty", "sauce-crousty", "supp", "sauce-sup", "dessert"],

  Nuggets: ["qte-nuggets", "sauce-sup"],
  Wings: ["qte-46", "sauce-sup"],
  Tenders: ["qte-46", "sauce-sup"],
  "Mozza sticks": ["sauce-sup"],
  Nems: ["qte-46", "sauce-sup"],
  Jalapeños: ["sauce-sup"],
  "Onion rings": ["sauce-sup"],

  "Frites Twister": ["sauce-sup"],
  Frites: ["taille-frites", "sauce-sup"],
  "Frites Cheddar": ["supp-frites", "sauce-sup"],
  "Pot de sauce": ["sauce-pot"],

  Panini: ["garniture-panini", "en-menu", { id: "boisson-incl", requires: IN_MENU }, { id: "vienn", requires: IN_MENU }, "sauce-sup", "dessert"],
  Croque: ["en-menu", { id: "boisson-incl", requires: IN_MENU }, { id: "vienn", requires: IN_MENU }, "sauce-sup", "dessert"],
  "Sandwich crudités": ["garniture-sandwich", "sauce-sup", "dessert"],
  "Menu sandwich crudités": ["garniture-sandwich", "sauce-sup", "boisson-incl", "vienn", "dessert"],
  "Salade César": ["dessert"],
  "Menu Fournil Enfant": ["kids-plat", "kids-boisson", "dessert"],

  Crêpe: ["garniture-crepe", "supp-gourmand"],
  Cookie: ["parfum-cookie"],
  Donut: ["parfum-donut"],
  Muffin: ["parfum-muffin"],
  Milkshake: ["parfum-milkshake", "supp-gourmand"],

  "Boisson fraîche": ["canette-choix"],
  "Capri-Sun Maxi": ["parfum-capri"],
  "Cristaline aromatisée": ["parfum-cristaline"],
  Bouteille: ["bouteille"],
  "Red Bull": ["redbull"],
  "B'lue": ["parfum-blue"],
};
