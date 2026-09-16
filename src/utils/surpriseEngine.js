export const MOODS = [
  { key: "Léger", emoji: "🥗" },
  { key: "Réconfort", emoji: "🍲" },
  { key: "Healthy", emoji: "🥦" },
  { key: "Gourmand", emoji: "🍫" },
];

export const BUDGET_TIERS = [
  { key: "15-20", label: "15€ – 20€", min: 15, max: 20 },
  { key: "20-30", label: "20€ – 30€", min: 20, max: 30 },
  { key: "30+", label: "30€ et plus", min: 30, max: Infinity },
];

const LEVELS = [
  { cats: ["Starters", "Mains", "Desserts"], mood: true },
  { cats: ["Starters", "Mains", "Desserts"], mood: false },
  { cats: ["Starters", "Mains"], mood: true },
  { cats: ["Starters", "Mains"], mood: false },
  { cats: ["Mains"], mood: false },
];

function cartesianProduct(pools) {
  return pools.reduce(
    (acc, pool) => acc.flatMap((combo) => pool.map((dish) => [...combo, dish])),
    [[]]
  );
}

function sameIds(combo, ids) {
  const comboIds = combo.map((d) => d.id).sort().join(",");
  return comboIds === [...ids].sort().join(",");
}

function tryLevel(dishes, cats, requireMood, mood, maxBudget, excludeIds) {
  const pools = [];
  for (const cat of cats) {
    let candidates = dishes.filter((d) => d.category === cat);
    if (requireMood) candidates = candidates.filter((d) => d.moods.includes(mood));
    if (candidates.length === 0) return null;
    pools.push(candidates);
  }

  const combos = cartesianProduct(pools);
  const valid = combos.filter((combo) => combo.reduce((sum, d) => sum + d.price, 0) <= maxBudget);
  if (valid.length === 0) return null;

  const fresh = valid.filter((combo) => !sameIds(combo, excludeIds));
  const pool = fresh.length > 0 ? fresh : valid;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { items: chosen, total: chosen.reduce((sum, d) => sum + d.price, 0) };
}

export function pickCombo(dishes, mood, budgetTier, excludeIds = []) {
  for (let level = 0; level < LEVELS.length; level++) {
    const { cats, mood: requireMood } = LEVELS[level];
    const result = tryLevel(dishes, cats, requireMood, mood, budgetTier.max, excludeIds);
    if (result) {
      return {
        ...result,
        degraded: level > 0,
        level,
        note: buildJustification(mood, level, result.items),
      };
    }
  }
  return { items: [], total: 0, impossible: true };
}

export function buildJustification(mood, level, items) {
  const names = items.map((d) => d.name).join(", ");
  const moodLower = mood.toLowerCase();
  switch (level) {
    case 0:
      return `Parce que tu voulais ${moodLower} : ${names}.`;
    case 1:
      return `On n'a pas trouvé de trio 100% ${moodLower}, mais celui-ci devrait te plaire : ${names}.`;
    case 2:
      return `Pas de dessert ${moodLower} qui rentre dans le budget, alors on garde l'essentiel : ${names}.`;
    case 3:
      return `Budget serré ! Voici une entrée + plat qui rentrent dans ton budget : ${names}.`;
    default:
      return `Avec ce budget, on te propose au moins ça : ${names}.`;
  }
}
