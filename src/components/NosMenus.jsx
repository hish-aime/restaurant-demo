import { categoryEmojis, menuSections } from "../data";
import { useOpenState } from "../utils/useOpenState";
import Collapsible from "./Collapsible";
import DishImage from "./DishImage";

export default function NosMenus({ onPickDish }) {
  const openState = useOpenState(0);

  return (
    <div className="menus">
      <p className="menus-intro">Touche un menu, on te guide étape par étape : plat, frites, sauces, boisson, dessert.</p>
      {menuSections.map((section) => {
        const count = section.items.length;
        return (
          <Collapsible
            key={section.category}
            id={`menus-${section.category.replace(/\W+/g, "-")}`}
            title={section.category}
            emoji={categoryEmojis[section.category]}
            count={count}
            open={openState.isOpen(section.category, count)}
            onToggle={() => openState.toggle(section.category, count)}
          >
            <div className="menus-grid">
              {section.items.map((dish) => {
                const steps = dish.groups.filter((g) => typeof g === "string").length;
                return (
                  <button key={dish.id} className="menu-tile" onClick={() => onPickDish(dish)}>
                    <span className="menu-tile-art"><DishImage dish={dish} /></span>
                    <span className="menu-tile-name">{dish.name}</span>
                    <span className="menu-tile-desc">{dish.description}</span>
                    <span className="menu-tile-foot">
                      <span className="menu-tile-price">dès €{dish.price.toFixed(2)}</span>
                      <span className="menu-tile-cta">
                        Composer · {steps} étape{steps > 1 ? "s" : ""} →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
