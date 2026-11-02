const TAG_CLASS = { Végé: "veg", Épicé: "hot", Incontournable: "top" };
const TAG_ICON = { Végé: "🌱", Épicé: "🌶️", Incontournable: "⭐" };

// Small badges on a product (Végé, Épicé…), stacked on top of its picture.
export default function Tags({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <span className="tags">
      {tags.map((tag) => (
        <span key={tag} className={`tag tag--${TAG_CLASS[tag] ?? "top"}`}>
          <span aria-hidden="true">{TAG_ICON[tag]}</span> {tag}
        </span>
      ))}
    </span>
  );
}
