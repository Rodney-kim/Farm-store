import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard.jsx";
import Loading from "../components/Loading.jsx";
import { getCategories } from "../services/api.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section container">
      <div className="section-heading">
        <h2>Categories</h2>
      </div>

      {loading && <Loading label="Loading categories..." />}
      {!loading && error && <div className="error-banner">{error}</div>}

      {!loading && !error && categories.length === 0 && (
        <div className="state-block">
          <h3>No categories yet</h3>
          <p>Add some products to see categories appear here.</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="category-grid">
          {categories.map((name) => (
            <CategoryCard key={name} name={name} />
          ))}
        </div>
      )}
    </section>
  );
}
