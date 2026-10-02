import { Link } from "react-router-dom";

// Simple icon lookup so category cards feel distinct without needing
// real photography. Falls back to a generic leaf icon for anything new.
const CATEGORY_ICONS = {
  Vegetables: "🥕",
  Fruits: "🍎",
  Dairy: "🥛",
  Eggs: "🥚",
  Cereals: "🌾",
  "Other Farm Products": "🍯",
};

export default function CategoryCard({ name }) {
  const icon = CATEGORY_ICONS[name] || "🌿";

  return (
    <Link to={`/products?category=${encodeURIComponent(name)}`} className="category-card">
      <div className="icon">{icon}</div>
      <h3>{name}</h3>
    </Link>
  );
}
