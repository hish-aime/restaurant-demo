import { GROUPS } from "../optionGroups";

// selection shape: { [groupId]: { [optionName]: count } }

const toRef = (ref) => (typeof ref === "string" ? { id: ref } : ref);

export function groupTotal(sel, id) {
  return Object.values(sel[id] || {}).reduce((sum, n) => sum + n, 0);
}

function limits(def, sel) {
  if (def.limitBy) {
    const parent = sel[def.limitBy.group] || {};
    const chosen = Object.keys(parent).find((name) => parent[name] > 0);
    const sizes = Object.values(def.limitBy.values);
    return { min: def.min, max: def.limitBy.values[chosen] ?? Math.min(...sizes) };
  }
  return { min: def.min, max: def.max };
}

export function visibleGroups(item, sel) {
  return item.groups
    .map(toRef)
    .filter((ref) => !ref.requires || sel[ref.requires.group]?.[ref.requires.option] > 0)
    .map((ref) => {
      const def = GROUPS[ref.id];
      return { id: ref.id, def, ...limits(def, sel) };
    });
}

export function isValid(item, sel) {
  return visibleGroups(item, sel).every((g) => {
    const total = groupTotal(sel, g.id);
    return total >= g.min && total <= g.max;
  });
}

// Drops selections of groups that are no longer shown, or that exceed a shrunk limit.
export function pruneSelection(item, sel) {
  const next = {};
  for (const g of visibleGroups(item, sel)) {
    next[g.id] = groupTotal(sel, g.id) > g.max ? {} : sel[g.id] || {};
  }
  return next;
}

// Builds a selection group by group, in the order the composer shows them.
// choose(group, sel) returns { [optionName]: count } for that group, or nothing to leave it empty.
// Only for flows where the customer makes no choice themselves (Surprends-moi); the composer starts empty.
export function buildSelection(item, choose) {
  let sel = {};
  for (const ref of item.groups.map(toRef)) {
    if (ref.requires && !(sel[ref.requires.group]?.[ref.requires.option] > 0)) continue;
    const def = GROUPS[ref.id];
    const chosen = choose({ id: ref.id, def, ...limits(def, sel) }, sel);
    if (chosen && Object.keys(chosen).length > 0) sel = { ...sel, [ref.id]: chosen };
  }
  return sel;
}

// Cheapest valid selection: first option(s) of every mandatory group.
export function cheapestSelection(item) {
  let sel = {};
  for (const ref of item.groups.map(toRef)) {
    if (ref.requires && !(sel[ref.requires.group]?.[ref.requires.option] > 0)) continue;
    const def = GROUPS[ref.id];
    const { min } = limits(def, sel);
    if (min === 0) continue;
    const chosen = {};
    if (def.repeat) chosen[def.options[0][0]] = min;
    else def.options.slice(0, min).forEach(([name]) => { chosen[name] = 1; });
    sel = { ...sel, [ref.id]: chosen };
  }
  return sel;
}

export function computeOptions(item, sel) {
  return visibleGroups(item, sel).flatMap((g) =>
    g.def.options
      .filter(([name]) => sel[g.id]?.[name] > 0)
      .map(([name, price]) => ({ group: g.def.name, name, price, count: sel[g.id][name] }))
  );
}

export const unitPrice = (basePrice, options) =>
  basePrice + options.reduce((sum, o) => sum + o.price * o.count, 0);

export const makeLineKey = (dishId, options) =>
  `${dishId}|${options.map((o) => `${o.group}:${o.name}x${o.count}`).join("|")}`;

export function groupHint({ def, min, max }) {
  if (def.included) return `Offert${max > 1 ? "es" : "e"} · jusqu'à ${max}`;
  const repeat = def.repeat ? " (même choix possible plusieurs fois)" : "";
  if (min === 0) return max === 1 ? "Facultatif" : `Facultatif · jusqu'à ${max}`;
  if (min === max) return (min === 1 ? "Choisis 1" : `Choisis ${min}`) + repeat;
  return `Choisis de ${min} à ${max}`;
}

export function optionsLabel(options) {
  return options.map((o) => (o.count > 1 ? `${o.count}× ${o.name}` : o.name)).join(", ");
}
