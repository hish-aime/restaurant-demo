export default function Collapsible({ id, title, emoji, count, note, open, onToggle, children }) {
  return (
    <section className={`collapsible ${open ? "is-open" : ""}`}>
      <button
        className="collapsible-head"
        aria-expanded={open}
        aria-controls={`section-${id}`}
        onClick={onToggle}
      >
        {emoji && <span className="collapsible-emoji">{emoji}</span>}
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-count">{count} produit{count > 1 ? "s" : ""}</span>
        <span className="collapsible-chevron" aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div id={`section-${id}`} className="collapsible-body">
          {note && <p className="category-note">{note}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
