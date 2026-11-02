import { useState, useEffect } from "react";
import { MOODS, BUDGET_TIERS, pickMeal, resolveMeal } from "../utils/surpriseEngine";
import { optionsLabel } from "../utils/composer";
import DishImage from "./DishImage";

const euros = (amount) => `€${amount.toFixed(2)}`;

export default function SurpriseMe({ dishes, onAddToCart, onClose }) {
  const [step, setStep] = useState("config");
  const [mood, setMood] = useState(null);
  const [budgetTier, setBudgetTier] = useState(null);
  const [meal, setMeal] = useState(null);
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    if (step !== "spinning") return;
    const timer = setTimeout(() => {
      setMeal(pickMeal(dishes, mood, budgetTier));
      setPicked([]);
      setStep("result");
    }, 1200);
    return () => clearTimeout(timer);
  }, [step, dishes, mood, budgetTier]);

  function handleOverlayClick() {
    if (step !== "spinning") onClose();
  }

  function handleReroll() {
    setMeal(pickMeal(dishes, mood, budgetTier, [meal.main.dish.id]));
    setPicked([]);
  }

  function togglePicked(id) {
    setPicked((current) => (current.includes(id) ? current.filter((p) => p !== id) : [...current, id]));
  }

  const ready = meal && !meal.impossible;
  const resolved = ready ? resolveMeal(meal, picked) : null;
  const remaining = ready ? meal.budget - resolved.total : 0;

  function handleAddToCart() {
    resolved.lines.forEach((l) => onAddToCart(l.dish, l.options));
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal surprise-modal" onClick={(e) => e.stopPropagation()}>

        {step === "config" && (
          <div className="modal-step">
            <h2 className="modal-title">🎲 Surprends-moi</h2>
            <div className="surprise-options">
              <div className="option-group">
                <p className="option-group-label">Ton envie</p>
                <div className="category-filters">
                  {MOODS.map((m) => (
                    <button
                      key={m.key}
                      className={`filter-btn ${mood === m.key ? "active" : ""}`}
                      onClick={() => setMood(m.key)}
                    >
                      {m.emoji} {m.key}
                    </button>
                  ))}
                </div>
              </div>
              <div className="option-group">
                <p className="option-group-label">Ton budget</p>
                <div className="category-filters">
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier.key}
                      className={`filter-btn ${budgetTier?.key === tier.key ? "active" : ""}`}
                      onClick={() => setBudgetTier(tier)}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Annuler</button>
              <button
                className="modal-btn-primary"
                disabled={!mood || !budgetTier}
                onClick={() => setStep("spinning")}
              >
                Lancer !
              </button>
            </div>
          </div>
        )}

        {step === "spinning" && (
          <div className="modal-step modal-step-centered">
            <div className="surprise-dice">🎲</div>
            <div className="spinner" />
            <p className="processing-title">On te mijote une surprise…</p>
          </div>
        )}

        {step === "result" && meal?.impossible && (
          <div className="modal-step modal-step-centered">
            <p className="surprise-empty">Aucun repas ne rentre dans ce budget pour l'instant 😅</p>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Fermer</button>
              <button className="modal-btn-primary" onClick={() => setStep("config")}>
                Choisir un autre budget
              </button>
            </div>
          </div>
        )}

        {step === "result" && ready && (
          <div className="modal-step">
            <h2 className="modal-title">Ta sélection surprise</h2>
            <p className="surprise-justification">{meal.note}</p>

            <ul className="modal-item-list surprise-lines">
              {resolved.lines.map((l) => (
                <li key={`${l.role}-${l.dish.id}`} className="modal-item-row surprise-line">
                  <span className="modal-item-art"><DishImage dish={l.dish} /></span>
                  <span className="modal-item-name">
                    {l.dish.name}
                    {l.options.length > 0 && <small className="modal-item-options">{optionsLabel(l.options)}</small>}
                    {l.role === "main" && meal.included && <small className="surprise-included">✓ {meal.included}</small>}
                  </span>
                  <span className="modal-item-price">{euros(l.unit)}</span>
                </li>
              ))}
            </ul>

            {meal.suggestions.length > 0 && (
              <div className="surprise-extras">
                <p className="surprise-extras-title">Un petit plus ?</p>
                <div className="surprise-extras-list">
                  {meal.suggestions.map((s) => {
                    const on = picked.includes(s.id);
                    const over = !on && resolved.total + s.price > meal.budget;
                    return (
                      <button
                        key={s.id}
                        className={`extra-chip ${on ? "on" : ""}`}
                        aria-pressed={on}
                        onClick={() => togglePicked(s.id)}
                      >
                        <span className="extra-chip-art">
                          {s.dish ? <DishImage dish={s.dish} /> : <span className="extra-chip-plus" aria-hidden="true">+</span>}
                        </span>
                        <span className="extra-chip-label">
                          {s.dish ? s.dish.name : s.label}
                          {s.options?.length > 0 && <small>{optionsLabel(s.options)}</small>}
                          {over && <small className="extra-chip-over">hors budget</small>}
                        </span>
                        <span className="extra-chip-price">{on ? "✓" : `+${euros(s.price)}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="modal-totals">
              <div className="modal-totals-row modal-totals-total">
                <span>Total</span><span>{euros(resolved.total)}</span>
              </div>
              <div className={`modal-totals-row surprise-budget ${remaining < 0 ? "over" : ""}`}>
                <span>Budget {euros(meal.budget)}</span>
                <span>{remaining >= 0 ? `Il te reste ${euros(remaining)}` : `Dépasse de ${euros(-remaining)}`}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={handleReroll}>Relancer</button>
              <button className="modal-btn-primary" onClick={handleAddToCart}>Ajouter au panier</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
