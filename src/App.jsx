import { useEffect, useState } from "react";
import { dishes, HOME, MENUS } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import SurpriseMe from "./components/SurpriseMe";
import ItemComposer from "./components/ItemComposer";
import OpenStatus from "./components/OpenStatus";
import SearchOverlay from "./components/SearchOverlay";
import BottomNav from "./components/BottomNav";
import { makeLineKey, unitPrice } from "./utils/composer";
import { useTheme } from "./utils/useTheme";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(HOME);
  const [showPayment, setShowPayment] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartCollapsed, setCartCollapsed] = useState(false); // desktop: sidebar hidden by its close button
  const [showSearch, setShowSearch] = useState(false);
  const [composing, setComposing] = useState(null);
  const [theme, toggleTheme] = useTheme();

  function addToCart(dish, options = []) {
    const lineKey = makeLineKey(dish.id, options);
    setCartCollapsed(false);
    setCart((prev) => {
      const existing = prev.find((item) => item.lineKey === lineKey);
      if (existing) {
        return prev.map((item) =>
          item.lineKey === lineKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { ...dish, lineKey, options, basePrice: dish.price, price: unitPrice(dish.price, options), quantity: 1 },
      ];
    });
  }

  function pickDish(dish) {
    if (dish.groups.length > 0) setComposing(dish);
    else addToCart(dish);
  }

  function changeQuantity(lineKey, delta) {
    // removing the last product closes the cart window
    if (cart.length === 1 && cart[0].lineKey === lineKey && cart[0].quantity + delta <= 0) setShowCart(false);
    setCart((prev) =>
      prev
        .map((item) => (item.lineKey === lineKey ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function openCart() {
    setCartCollapsed(false);
    setShowCart(true);
  }

  function closeCart() {
    setCartCollapsed(true);
    setShowCart(false);
  }

  function cancelOrder() {
    setCart([]);
    setShowCart(false);
  }

  function goTo(tab) {
    setSelectedCategory(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!showCart) return;
    const onKey = (e) => e.key === "Escape" && setShowCart(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCart]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="brand">
            <span className="brand-mark" aria-hidden="true">🥖</span>
            Le fournil
          </h1>
          <OpenStatus />
        </div>
        <div className="header-actions">
          <button className="header-search" onClick={() => setShowSearch(true)} aria-label="Rechercher un produit">
            <span aria-hidden="true">🔍</span>
            <span className="header-search-label">Rechercher un produit…</span>
          </button>
          <button className="surprise-btn" onClick={() => setShowSurprise(true)}>
            🎲 <span className="surprise-btn-label">Surprends-moi</span>
          </button>
          <button
            className="icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="cart-badge-wrapper"
            aria-label="Ouvrir le panier"
            onClick={openCart}
          >
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className={`app-main ${cartCollapsed ? "app-main--cart-collapsed" : ""}`}>
        <Menu
          dishes={dishes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPickDish={pickDish}
          onSurprise={() => setShowSurprise(true)}
        />
        <Cart
          cart={cart}
          open={showCart}
          onClose={closeCart}
          onCancel={cancelOrder}
          onChangeQuantity={changeQuantity}
          onPickDish={pickDish}
          onCheckout={() => { setShowCart(false); setShowPayment(true); }}
        />
      </main>

      {showCart && <div className="cart-backdrop" onClick={() => setShowCart(false)} />}

      <BottomNav
        selected={selectedCategory}
        onHome={() => goTo(HOME)}
        onMenus={() => goTo(MENUS)}
        onSearch={() => setShowSearch(true)}
      />

      {/* Phones and tablets: the cart is a chat-style bubble, shown once something is in it */}
      {cartCount > 0 && !showCart && (
        <button
          key={cartCount}
          className="cart-fab"
          aria-label={`Ouvrir le panier : ${cartCount} article${cartCount > 1 ? "s" : ""}`}
          onClick={() => setShowCart(true)}
        >
          <span aria-hidden="true">🛒</span>
          <span className="cart-fab-count">{cartCount}</span>
        </button>
      )}

      {showSearch && (
        <SearchOverlay
          dishes={dishes}
          onPickDish={(dish) => { setShowSearch(false); pickDish(dish); }}
          onClose={() => setShowSearch(false)}
        />
      )}
      {composing && (
        <ItemComposer
          key={composing.id}
          item={composing}
          onClose={() => setComposing(null)}
          onAdd={(dish, options) => { addToCart(dish, options); setComposing(null); }}
        />
      )}
      {showPayment && (
        <PaymentModal
          cart={cart}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setCart([]); setShowPayment(false); }}
        />
      )}
      {showSurprise && (
        <SurpriseMe
          dishes={dishes}
          onAddToCart={addToCart}
          onClose={() => setShowSurprise(false)}
        />
      )}
    </div>
  );
}
