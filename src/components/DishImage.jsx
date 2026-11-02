import { useState } from "react";

// Product photo, or the emoji when the product has none (or the photo fails to load).
export default function DishImage({ dish, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (dish.photo && !failed) {
    return (
      <img
        className={`dish-photo ${className}`}
        src={dish.photo}
        alt=""
        loading="lazy"
        draggable="false"
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className={`dish-emoji-fallback ${className}`} aria-hidden="true">{dish.emoji}</span>;
}
