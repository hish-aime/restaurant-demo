import { useEffect, useRef, useState } from "react";
import { ALL, HOME, MENUS, categories, categoryEmojis } from "../data";

const PINNED = [
  { tab: HOME, emoji: "🏠" },
  { tab: MENUS, emoji: "🍽️" },
];

const SCROLLING = [...categories.map((tab) => ({ tab, emoji: categoryEmojis[tab] })), { tab: ALL, emoji: "☰" }];

export default function CategoryTabs({ selected, onChange }) {
  const scroller = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  function updateEdges() {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  // keep the selected tab visible in the bar
  useEffect(() => {
    scroller.current?.parentElement.parentElement
      .querySelector(".tab.active")
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  const scrollBy = (dir) => scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  const renderTab = ({ tab, emoji }, pinned) => (
    <button
      key={tab}
      className={`tab ${pinned ? "tab--pinned" : ""} ${selected === tab ? "active" : ""}`}
      aria-current={selected === tab ? "page" : undefined}
      onClick={() => onChange(tab)}
    >
      <span className="tab-emoji" aria-hidden="true">{emoji}</span>
      {tab}
    </button>
  );

  return (
    <nav className="tabs" aria-label="Catégories">
      <div className="tabs-pinned">{PINNED.map((t) => renderTab(t, true))}</div>
      <div className="tabs-viewport">
        {edges.left && (
          <button className="tabs-arrow tabs-arrow--left" aria-label="Catégories précédentes" onClick={() => scrollBy(-1)}>‹</button>
        )}
        <div className="tabs-scroll" ref={scroller} onScroll={updateEdges}>
          {SCROLLING.map((t) => renderTab(t, false))}
        </div>
        {edges.right && (
          <button className="tabs-arrow tabs-arrow--right" aria-label="Catégories suivantes" onClick={() => scrollBy(1)}>›</button>
        )}
      </div>
    </nav>
  );
}
