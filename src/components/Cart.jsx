import { optionsLabel } from "../utils/composer";
import { suggestionsFor } from "../utils/suggestions";
import DishImage from "./DishImage";

export default function Cart({ cart, open, onClose, onChangeQuantity, onPickDish, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  const suggestions = suggestionsFor(cart);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className={`cart ${open ? "cart--open" : ""}`} aria-label="Ma commande">
      <div className="cart-header">
        <h2>
          Ma commande
          {cart.length > 0 && <small className="cart-header-count">{count} article{count > 1 ? "s" : ""}</small>}
        </h2>
        <button className="cart-close" aria-label="Fermer le panier" onClick={onClose}>✕</button>
      </div>

      <div className="cart-body">
      {cart.length === 0 ? (
        <p className="cart-empty">
          <span aria-hidden="true">🛒</span>
          Ton panier est vide pour l'instant.
        </p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.lineKey} className="cart-item">
              <span className="cart-item-art"><DishImage dish={item} /></span>
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                {item.options?.length > 0 && (
                  <span className="cart-item-options">{optionsLabel(item.options)}</span>
                )}
                <span className="qty">
                  <button
                    aria-label={item.quantity === 1 ? `Retirer ${item.name}` : `Moins de ${item.name}`}
                    onClick={() => onChangeQuantity(item.lineKey, -1)}
                  >
                    {item.quantity === 1 ? "🗑" : "−"}
                  </button>
                  <span aria-label={`Quantité : ${item.quantity}`}>{item.quantity}</span>
                  <button aria-label={`Plus de ${item.name}`} onClick={() => onChangeQuantity(item.lineKey, 1)}>+</button>
                </span>
              </div>
              <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      {suggestions.length > 0 && (
        <div className="cart-suggest">
          <p className="cart-suggest-title">Tu aimeras aussi</p>
          <ul>
            {suggestions.map((dish) => (
              <li key={dish.id}>
                <button className="suggest-card" onClick={() => onPickDish(dish)}>
                  <span className="suggest-art"><DishImage dish={dish} /></span>
                  <span className="suggest-name">{dish.name}</span>
                  <span className="suggest-price">€{dish.price.toFixed(2)}</span>
                  <span className="suggest-add" aria-hidden="true">+</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      </div>

      <div className="cart-footer">
      <div className="cart-totals">
        <div className="cart-totals-row">
          <span>Sous-total</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-totals-row">
          <span>TVA (10 %)</span>
          <span>€{tax.toFixed(2)}</span>
        </div>
        <div className="cart-totals-row total">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="checkout-btn"
        disabled={cart.length === 0}
        onClick={onCheckout}
      >
        Commander
      </button>
      </div>
    </aside>
  );
}
