import { useState, useEffect } from "react";
import { optionsLabel } from "../utils/composer";
import { restaurant } from "../data";
import DishImage from "./DishImage";

function generateOrderNumber() {
  return "FC-" + Math.floor(10000 + Math.random() * 90000);
}

// Demo tracker: each stage lasts a few seconds instead of real kitchen time.
const TRACK_STEPS = [
  { label: "Commande reçue", hint: "Le restaurant a bien reçu ta commande." },
  { label: "En préparation", hint: "Ta commande est en cours de préparation." },
  { label: "Prête", hint: `C'est prêt ! Passe la récupérer au ${restaurant.address}.` },
];
const TRACK_DELAY = 5000;

export default function PaymentModal({ cart, onClose, onSuccess }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const [step, setStep] = useState("summary");
  const [orderNumber] = useState(generateOrderNumber);
  const [orderTime] = useState(() => new Date());
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    if (step !== "processing") return;
    const timer = setTimeout(() => setStep("success"), 2000);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "success" || trackIndex >= TRACK_STEPS.length - 1) return;
    const timer = setTimeout(() => setTrackIndex((i) => i + 1), TRACK_DELAY);
    return () => clearTimeout(timer);
  }, [step, trackIndex]);

  function handleOverlayClick() {
    if (step !== "processing") onClose();
  }

  function handleNumberChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setForm((f) => ({ ...f, number: formatted }));
  }

  function handleExpiryChange(e) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = raw.length > 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw;
    setForm((f) => ({ ...f, expiry: formatted }));
  }

  const canPay =
    form.name.trim() &&
    form.number.replace(/\s/g, "").length === 16 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3;

  const formattedTime = orderTime.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {step === "summary" && (
          <div className="modal-step">
            <h2 className="modal-title">Récapitulatif de la commande</h2>
            <ul className="modal-item-list">
              {cart.map((item, i) => (
                <li key={item.lineKey ?? i} className="modal-item-row">
                  <span className="modal-item-art"><DishImage dish={item} /></span>
                  <span className="modal-item-name">
                    {item.name}
                    {item.options?.length > 0 && <small className="modal-item-options">{optionsLabel(item.options)}</small>}
                  </span>
                  <span className="modal-item-qty">x{item.quantity}</span>
                  <span className="modal-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="modal-totals">
              <div className="modal-totals-row">
                <span>Sous-total</span><span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="modal-totals-row">
                <span>TVA (10 %)</span><span>€{tax.toFixed(2)}</span>
              </div>
              <div className="modal-totals-row modal-totals-total">
                <span>Total</span><span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Annuler</button>
              <button className="modal-btn-primary" onClick={() => setStep("card")}>
                Passer au paiement
              </button>
            </div>
          </div>
        )}

        {step === "card" && (
          <div className="modal-step">
            <h2 className="modal-title">Détails du paiement</h2>
            <div className="card-form">
              <label className="card-label">
                Nom sur la carte
                <input
                  className="card-input"
                  type="text"
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="card-label">
                Numéro de carte
                <input
                  className="card-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={form.number}
                  onChange={handleNumberChange}
                />
              </label>
              <div className="card-row">
                <label className="card-label">
                  Expiration
                  <input
                    className="card-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={form.expiry}
                    onChange={handleExpiryChange}
                  />
                </label>
                <label className="card-label">
                  CVV
                  <input
                    className="card-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    maxLength={4}
                    value={form.cvv}
                    onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  />
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setStep("summary")}>Retour</button>
              <button
                className="modal-btn-primary"
                disabled={!canPay}
                onClick={() => setStep("processing")}
              >
                Payer €{total.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="modal-step modal-step-centered">
            <div className="spinner" />
            <p className="processing-title">Paiement en cours…</p>
            <p className="processing-subtitle">Merci de ne pas fermer cette fenêtre.</p>
          </div>
        )}

        {step === "success" && (
          <div className="modal-step modal-step-centered">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Paiement réussi !</h2>
            <p className="success-meta">Commande {orderNumber} · {formattedTime}</p>
            <ol className="tracker" aria-label="Suivi de commande">
              {TRACK_STEPS.map((s, i) => (
                <li
                  key={s.label}
                  className={`tracker-step ${i < trackIndex ? "done" : ""} ${i === trackIndex ? "current" : ""}`}
                  aria-current={i === trackIndex ? "step" : undefined}
                >
                  <span className="tracker-dot">{i < trackIndex ? "✓" : i + 1}</span>
                  <span className="tracker-label">{s.label}</span>
                </li>
              ))}
            </ol>
            <p className="tracker-hint" role="status">{TRACK_STEPS[trackIndex].hint}</p>
            <ul className="modal-item-list modal-item-list--receipt">
              {cart.map((item, i) => (
                <li key={item.lineKey ?? i} className="modal-item-row">
                  <span className="modal-item-art"><DishImage dish={item} /></span>
                  <span className="modal-item-name">
                    {item.name}
                    {item.options?.length > 0 && <small className="modal-item-options">{optionsLabel(item.options)}</small>}
                  </span>
                  <span className="modal-item-qty">x{item.quantity}</span>
                  <span className="modal-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="modal-totals">
              <div className="modal-totals-row modal-totals-total">
                <span>Total payé</span><span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="modal-btn-primary modal-btn-full" onClick={onSuccess}>
              Nouvelle commande
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
