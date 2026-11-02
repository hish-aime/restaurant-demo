import { HOME, MENUS } from "../data";

// Phone-only navigation bar (hidden on desktop by CSS). The cart is the floating bubble, not a tab.
export default function BottomNav({ selected, onHome, onMenus, onSearch }) {
  const items = [
    { key: "home", icon: "🏠", label: "Accueil", active: selected === HOME, onClick: onHome },
    { key: "menus", icon: "🍽️", label: "Menus", active: selected === MENUS, onClick: onMenus },
    { key: "search", icon: "🔍", label: "Recherche", active: false, onClick: onSearch },
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
          <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
