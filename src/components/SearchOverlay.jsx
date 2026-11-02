import { useEffect, useRef, useState } from "react";
import { homeRows } from "../data";
import DishImage from "./DishImage";

const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function SearchOverlay({ dishes, onPickDish, onClose }) {
  const [query, setQuery] = useState("");
  const input = useRef(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = normalize(query.trim());
  // Name matches come first, then description / category / tag matches.
  const rank = (d) => {
    const name = normalize(d.name);
    if (name.startsWith(q)) return 0;
    if (name.includes(q)) return 1;
    return normalize(`${d.description} ${d.category} ${d.tags.join(" ")}`).includes(q) ? 2 : 3;
  };
  const results = q
    ? dishes
        .map((d) => [rank(d), d])
        .filter(([r]) => r < 3)
        .sort((a, b) => a[0] - b[0] || a[1].name.length - b[1].name.length)
        .map(([, d]) => d)
    : homeRows[0].items;

  return (
    <div className="modal-overlay search-overlay" onClick={onClose}>
      <div className="search-panel" role="dialog" aria-label="Rechercher un produit" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <span aria-hidden="true">🔍</span>
          <input
            ref={input}
            type="search"
            placeholder="Burger, tacos, flan…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close" aria-label="Fermer la recherche" onClick={onClose}>✕</button>
        </div>

        <p className="search-hint">
          {q
            ? results.length === 0
              ? `Aucun produit ne correspond à « ${query.trim()} ».`
              : `${results.length} résultat${results.length > 1 ? "s" : ""}`
            : "Les incontournables"}
        </p>

        <ul className="search-results">
          {results.map((dish) => (
            <li key={dish.id}>
              <button className="search-result" onClick={() => onPickDish(dish)}>
                <span className="search-result-art"><DishImage dish={dish} /></span>
                <span className="search-result-text">
                  <strong>{dish.name}</strong>
                  <small>{dish.category}</small>
                </span>
                <span className="search-result-price">€{dish.price.toFixed(2)}</span>
                <span className="search-result-add" aria-hidden="true">+</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
