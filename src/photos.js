// Product photos (public/photos, cut-out WebP). Products without a photo keep their emoji.
const file = (name) => `${import.meta.env.BASE_URL}photos/${name}`;

const PRODUCTS = {
  "Mini Mixte": "buckets-bucketsolo.webp",
  "Box Tenders": "buckets-bucketduo.webp",
  "Box Wings": "buckets-bucketduo.webp",
  "Box Family": "buckets-bucket4.webp",
  "Menu sandwich kebab": "burger-pain-pita-kebab.webp",
  "Menu sandwich le blindé": "burger-pain-pita-blinde.webp",
  "Menu sandwich classique": "burger-pain-pita-classiq.webp",
  "Menu wrap poulet": "wrap-wrap-chicken.webp",
  "Menu wrap végé": "wrap-wrap-mozza.webp",
  "Menu Giant": "burger-giant.webp",
  "Duo burger poulet": "burger-duochicken.webp",
  "Duo cheeseburger": "burger-duocheese.webp",
  "Duo burger poisson": "burger-duofish.webp",
  "Tacos M": "ingredients-tacos-tacos.webp",
  "Tacos L": "ingredients-tacos-tacos.webp",
  "Tacos XL": "ingredients-tacos-tacos.webp",
  "Tacos XXL": "ingredients-tacos-tacos.webp",
  "Tasty crousty": "tasty-tasty.webp",
  "Menu Fournil Enfant": "kid.webp",
  "Panini": "panini-panini.webp",
  "Panini Nutella": "panini-sans-titre.webp",
  "Croque": "croque-croque.webp",
  "Sandwich crudités": "sandwich-sandwich1.webp",
  "Menu sandwich crudités": "sandwich-sandwich1.webp",
  "Salade César": "salade-salade.webp",
  "Nuggets": "texmex-nuggets.webp",
  "Wings": "texmex-wings.webp",
  "Tenders": "texmex-tenders.webp",
  "Mozza sticks": "texmex-mozza.webp",
  "Nems": "texmex-nems.webp",
  "Jalapeños": "texmex-jalapenos.webp",
  "Onion rings": "texmex-oignonsrings.webp",
  "Frites Twister": "texmex-fritesspirales.webp",
  "Frites": "frites.webp",
  "Frites Cheddar": "texmex-frites-cheddar.webp",
  "Pot de sauce": "sauces-sauce2.webp",
  "Flan": "dessert-flan.webp",
  "Tiramisu caramel": "dessert-tiramisu.webp",
  "Tiramisu chocolat noisette spéculoos": "dessert-tiramisu.webp",
  "Tarte au Daim": "dessert-tarte-daim.webp",
  "Éclair au chocolat": "dessert-eclairchoco.webp",
  "Crêpe": "dessert-crepe.webp",
  "Milkshake": "milkshake-nutella.webp",
  "Menu sandwich country chicken": "burger-country-chicken.webp",
};

// Thumbnails of the tacos / crousty meat choices
const INGREDIENTS = {
  "Steak": "ing-steak.webp",
  "Nuggets": "ing-nuggets.webp",
  "Kebab": "ing-kebab.webp",
  "Merguez": "ing-merguez.webp",
  "Tenders": "ing-tenders.webp",
  "Cordon bleu": "ing-cordon-bleu.webp",
};

export const photoOf = (dishName) => (PRODUCTS[dishName] ? file(PRODUCTS[dishName]) : null);
export const ingredientPhoto = (optionName) => (INGREDIENTS[optionName] ? file(INGREDIENTS[optionName]) : null);
