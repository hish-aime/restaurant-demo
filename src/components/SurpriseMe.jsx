import { useState, useEffect } from "react";
import { MOODS, BUDGET_TIERS, pickCombo } from "../utils/surpriseEngine";

export default function SurpriseMe({ dishes, onAddToCart, onClose }) {
  const [step, setStep] = useState("config");
  const [mood, setMood] = useState(null);
  const [budgetTier, setBudgetTier] = useState(null);
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    if (step !== "spinning") return;
    const timer = setTimeout(() => {
      setCombo(pickCombo(dishes, mood, budgetTier));
      setStep("result");
    }, 1200);
    return () => clearTimeout(timer);
  }, [step, dishes, mood, budgetTier]);

  function handleOverlayClick() {
    if (step !== "spinning") onClose();
  }

  function handleLaunch() {
    setStep("spinning");
  }

  function handleReroll() {
    const excludeIds = combo.items.map((d) => d.id);
    setCombo(pickCombo(dishes, mood, budgetTier, excludeIds));
  }

  function handleAddToCart() {
    combo.items.forEach((dish) => onAddToCart(dish));
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

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
                onClick={handleLaunch}
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

        {step === "result" && combo?.impossible && (
          <div className="modal-step modal-step-centered">
            <p className="surprise-empty">Aucune combinaison ne rentre dans ce budget pour l'instant 😅</p>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Fermer</button>
              <button className="modal-btn-primary" onClick={() => setStep("config")}>
                Choisir un autre budget
              </button>
            </div>
          </div>
        )}

        {step === "result" && combo && !combo.impossible && (
          <div className="modal-step">
            <h2 className="modal-title">Ta sélection surprise</h2>
            <ul className="modal-item-list">
              {combo.items.map((item) => (
                <li key={item.id} className="modal-item-row">
                  <span className="modal-item-emoji">{item.emoji}</span>
                  <span className="modal-item-name">{item.name}</span>
                  <span className="modal-item-price">€{item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="modal-totals">
              <div className="modal-totals-row modal-totals-total">
                <span>Total</span><span>€{combo.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="surprise-justification">{combo.note}</p>
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
