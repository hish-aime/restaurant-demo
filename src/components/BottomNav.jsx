import { HOME, MENUS } from "../data";

// Phone-only navigation bar (hidden on desktop by CSS).
export default function BottomNav({ selected, onHome, onMenus, onSearch, onCart, cartCount, cartTotal }) {
  const items = [
    { key: "home", icon: "🏠", label: "Accueil", active: selected === HOME, onClick: onHome },
    { key: "menus", icon: "🍽️", label: "Menus", active: selected === MENUS, onClick: onMenus },
    { key: "search", icon: "🔍", label: "Recherche", active: false, onClick: onSearch },
    {
      key: "cart",
      icon: "🛒",
      label: cartCount > 0 ? `€${cartTotal.toFixed(2)}` : "Panier",
      active: false,
      onClick: onCart,
      badge: cartCount,
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map((item) => (
        <button
          key={item.key}
          className={`bottom-nav-item ${item.active ? "active" : ""}`}
          aria-current={item.active ? "page" : undefined}
          onClick={item.onClick}
        >
          <span className="bottom-nav-icon" aria-hidden="true">
            {item.icon}
            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
