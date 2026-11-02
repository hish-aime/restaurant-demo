import { useState } from "react";
import { COLLAPSE_AFTER } from "../data";

// Open/closed state of collapsible sections: sections with more than `openUpTo` products start closed
// (COLLAPSE_AFTER by default, 0 = always closed) until toggled.
export function useOpenState(openUpTo = COLLAPSE_AFTER) {
  const [overrides, setOverrides] = useState({});
  const startsOpen = (count) => count <= openUpTo;

  return {
    isOpen: (id, count) => overrides[id] ?? startsOpen(count),
    toggle: (id, count) =>
      setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? startsOpen(count)) })),
    setAll: (sections, open) =>
      setOverrides((prev) => ({ ...prev, ...Object.fromEntries(sections.map((s) => [s.id, open])) })),
  };
}
