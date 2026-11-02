import { useState } from "react";
import {
  computeOptions,
  groupHint,
  groupTotal,
  isValid,
  pruneSelection,
  unitPrice,
  visibleGroups,
} from "../utils/composer";
import { ingredientPhoto } from "../photos";
import DishImage from "./DishImage";

export default function ItemComposer({ item, onAdd, onClose }) {
  const [sel, setSel] = useState({});
  const [step, setStep] = useState(0);

  const groups = visibleGroups(item, sel);
  const stepIndex = Math.min(step, groups.length - 1);
  const current = groups[stepIndex];
  const isLast = stepIndex === groups.length - 1;
  const currentTotal = groupTotal(sel, current.id);
  const options = computeOptions(item, sel);
  const total = unitPrice(item.price, options);
  const valid = isValid(item, sel);

  function update(nextSel) {
    setSel(pruneSelection(item, nextSel));
  }

  function toggle(optionName) {
    const chosen = sel[current.id] || {};
    if (current.max === 1) {
      const already = chosen[optionName] > 0;
      if (already && current.min === 0) {
        update({ ...sel, [current.id]: {} });
        return;
      }
      update({ ...sel, [current.id]: { [optionName]: 1 } });
      if (current.min === 1 && !already && !isLast) setStep(stepIndex + 1);
      return;
    }
    if (chosen[optionName] > 0) {
      const rest = Object.fromEntries(Object.entries(chosen).filter(([name]) => name !== optionName));
      update({ ...sel, [current.id]: rest });
    } else if (currentTotal < current.max) {
      update({ ...sel, [current.id]: { ...chosen, [optionName]: 1 } });
    }
  }

  function adjust(optionName, delta) {
    const chosen = sel[current.id] || {};
    const count = (chosen[optionName] || 0) + delta;
    if (count < 0 || (delta > 0 && currentTotal >= current.max)) return;
    const next = { ...chosen, [optionName]: count };
    if (count === 0) delete next[optionName];
    update({ ...sel, [current.id]: next });
  }

  function handleOverlayClick() {
    onClose();
  }

  const canNext = currentTotal >= current.min;
  const nextLabel = current.min === 0 && currentTotal === 0 ? "Passer" : "Suivant";

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal composer" onClick={(e) => e.stopPropagation()}>
        <div className="composer-head">
          <span className="composer-art"><DishImage dish={item} /></span>
          <div className="composer-title">
            <h2>{item.name}</h2>
            <p>Dès €{item.price.toFixed(2)}</p>
          </div>
          <button className="composer-close" aria-label="Fermer" onClick={onClose}>✕</button>
        </div>

        <div className="composer-progress" aria-hidden="true">
          {groups.map((g, i) => (
            <span
              key={g.id}
              className={`composer-dot ${i < stepIndex ? "done" : ""} ${i === stepIndex ? "current" : ""}`}
            />
          ))}
        </div>

        <div className="composer-body">
          <p className="composer-step">Étape {stepIndex + 1} sur {groups.length}</p>
          <h3 className="composer-group">{current.def.name}</h3>
          <p className="composer-hint">
            {groupHint(current)}
            {current.def.note ? ` · ${current.def.note}` : ""}
            {current.max > 1 && ` · ${currentTotal}/${current.max}`}
          </p>

          <ul className="composer-options">
            {current.def.options.map(([name, price]) => {
              const count = sel[current.id]?.[name] || 0;
              const selected = count > 0;
              const full = !selected && current.max > 1 && currentTotal >= current.max;
              return (
                <li key={name}>
                  {current.def.repeat ? (
                    <div className={`composer-option ${selected ? "selected" : ""}`}>
                      <span className="composer-option-name">{name}</span>
                      {price > 0 && <span className="composer-option-price">+€{price.toFixed(2)}</span>}
                      <span className="composer-stepper">
                        <button aria-label={`Retirer ${name}`} disabled={count === 0} onClick={() => adjust(name, -1)}>−</button>
                        <span>{count}</span>
                        <button aria-label={`Ajouter ${name}`} disabled={currentTotal >= current.max} onClick={() => adjust(name, 1)}>+</button>
                      </span>
                    </div>
                  ) : (
                    <button
                      className={`composer-option ${selected ? "selected" : ""}`}
                      disabled={full}
                      onClick={() => toggle(name)}
                    >
                      <span className="composer-check">{selected ? "✓" : ""}</span>
                      {current.id.startsWith("viande-") && ingredientPhoto(name) && (
                        <img className="composer-thumb" src={ingredientPhoto(name)} alt="" loading="lazy" />
                      )}
                      <span className="composer-option-name">{name}</span>
                      {price > 0 && <span className="composer-option-price">+€{price.toFixed(2)}</span>}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="composer-footer">
          {!isLast && valid && (
            <button className="composer-quick" onClick={() => onAdd(item, options)}>
              Terminer avec mes choix · €{total.toFixed(2)}
            </button>
          )}
          <div className="composer-actions">
            <button
              className="modal-btn-secondary"
              disabled={stepIndex === 0}
              onClick={() => setStep(stepIndex - 1)}
            >
              Retour
            </button>
            {isLast ? (
              <button className="modal-btn-primary" disabled={!valid} onClick={() => onAdd(item, options)}>
                Ajouter · €{total.toFixed(2)}
              </button>
            ) : (
              <button className="modal-btn-primary" disabled={!canNext} onClick={() => setStep(stepIndex + 1)}>
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
