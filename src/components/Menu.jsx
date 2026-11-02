import { useState } from "react";
import {
  ALL,
  COLLAPSE_AFTER,
  HOME,
  MENUS,
  categories,
  categoryEmojis,
  categoryNotes,
  restaurant,
  sectionsOf,
} from "../data";
import { useOpenState } from "../utils/useOpenState";
import CategoryTabs from "./CategoryTabs";
import Collapsible from "./Collapsible";
import DishImage from "./DishImage";
import Tags from "./Tags";
import Home from "./Home";
import NosMenus from "./NosMenus";

const SORTS = [
  { key: "default", label: "Notre sélection" },
  { key: "asc", label: "Prix croissant" },
  { key: "desc", label: "Prix décroissant" },
  { key: "az", label: "A → Z" },
];

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function sortDishes(list, sort) {
  const sorted = [...list];
  if (sort === "asc") sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, "fr"));
  if (sort === "desc") sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, "fr"));
  if (sort === "az") sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return sorted;
}

function DishGrid({ items, onPickDish }) {
  return (
    <div className="dish-grid">
      {items.map((dish) => (
        <div key={dish.id} className="dish-card">
          <span className="dish-art">
            <DishImage dish={dish} />
            <Tags tags={dish.tags} />
          </span>
          <div className="dish-info">
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <div className="dish-footer">
              <span className="dish-price">€{dish.price.toFixed(2)}</span>
              <button className="add-btn" onClick={() => onPickDish(dish)}>
                {dish.groups.length > 0 ? "Composer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Menu({ dishes, selectedCategory, onCategoryChange, onPickDish, onSurprise }) {
  const [sort, setSort] = useState("default");
  const [query, setQuery] = useState("");
  const openState = useOpenState();

  function changeCategory(tab) {
    setQuery("");
    onCategoryChange(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isGrid = selectedCategory !== HOME && selectedCategory !== MENUS;
  const pool = selectedCategory === ALL ? dishes : dishes.filter((dish) => dish.category === selectedCategory);
  const showToolbar = isGrid && pool.length > COLLAPSE_AFTER;

  const searching = showToolbar && query.trim() !== "";
  const grouped = !searching && sort === "default";
  const flat = sortDishes(
    searching ? pool.filter((d) => normalize(`${d.name} ${d.description}`).includes(normalize(query.trim()))) : pool,
    sort
  );

  const sections =
    selectedCategory === ALL
      ? categories.map((category) => ({
          id: category,
          title: category,
          emoji: categoryEmojis[category],
          note: categoryNotes[category],
          items: dishes.filter((d) => d.category === category),
        }))
      : sectionsOf(selectedCategory, pool);
  const collapsible = grouped && sections.length > 1;
  const allOpen = sections.every((s) => openState.isOpen(s.id, s.items.length));

  return (
    <section className="menu">
      <div className="menu-heading">
        <h2>{restaurant.name}</h2>
        <p className="menu-tagline">{restaurant.tagline}</p>
      </div>

      <CategoryTabs selected={selectedCategory} onChange={changeCategory} />

      {selectedCategory === HOME && (
        <Home
          onPickDish={onPickDish}
          onGoMenus={() => changeCategory(MENUS)}
          onGoCategory={changeCategory}
          onSurprise={onSurprise}
        />
      )}

      {selectedCategory === MENUS && <NosMenus onPickDish={onPickDish} />}

      {isGrid && showToolbar && (
        <div className="toolbar">
          <input
            className="toolbar-search"
            type="search"
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="toolbar-sorts" role="group" aria-label="Trier les produits">
            {SORTS.map(({ key, label }) => (
              <button
                key={key}
                className={`sort-chip ${sort === key ? "active" : ""}`}
                aria-pressed={sort === key}
                onClick={() => setSort(key)}
              >
                {label}
              </button>
            ))}
          </div>
          {collapsible && (
            <button className="toolbar-toggle" onClick={() => openState.setAll(sections, !allOpen)}>
              {allOpen ? "Tout replier" : "Tout déplier"}
            </button>
          )}
        </div>
      )}

      {isGrid && !showToolbar && categoryNotes[selectedCategory] && (
        <p className="category-note">{categoryNotes[selectedCategory]}</p>
      )}

      {isGrid && searching && (
        <p className="toolbar-result">
          {flat.length === 0
            ? `Aucun produit ne correspond à « ${query.trim()} ».`
            : `${flat.length} résultat${flat.length > 1 ? "s" : ""}`}
        </p>
      )}

      {isGrid && collapsible &&
        sections.map((section) => {
          const count = section.items.length;
          return (
            <Collapsible
              key={section.id}
              id={section.id.replace(/\W+/g, "-")}
              title={section.title}
              emoji={section.emoji}
              note={section.note}
              count={count}
              open={openState.isOpen(section.id, count)}
              onToggle={() => openState.toggle(section.id, count)}
            >
              <DishGrid items={section.items} onPickDish={onPickDish} />
            </Collapsible>
          );
        })}

      {isGrid && grouped && !collapsible && (
        <>
          {showToolbar && categoryNotes[selectedCategory] && (
            <p className="category-note">{categoryNotes[selectedCategory]}</p>
          )}
          <DishGrid items={pool} onPickDish={onPickDish} />
        </>
      )}

      {isGrid && !grouped && <DishGrid items={flat} onPickDish={onPickDish} />}
    </section>
  );
}
