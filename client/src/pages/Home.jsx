import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import Loading from "../components/Loading.jsx";
import { getProducts, getCategories } from "../services/api.js";

const HERO_ICONS = ["🍅", "🥑", "🥛", "🥚", "🌽", "🍯"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        const [products, cats] = await Promise.all([getProducts(), getCategories()]);
        if (cancelled) return;
        setFeatured(products.slice(0, 4));
        setCategories(cats);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Fresh Farm Products Delivered to You</h1>
            <p>Allow customers to conveniently purchase fresh farm products online.</p>
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
          </div>

          <div className="hero-icons">
            {HERO_ICONS.map((icon) => (
              <div className="hero-icon-tile" key={icon}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section container">
        <div className="section-heading">
          <h2>Featured Products</h2>
          <Link to="/products">View all</Link>
        </div>

        {loading && <Loading label="Loading featured products..." />}
        {!loading && error && <div className="error-banner">{error}</div>}
        {!loading && !error && featured.length === 0 && (
          <div className="state-block">
            <h3>No products yet</h3>
            <p>Run the seed script on the server to add sample products.</p>
          </div>
        )}
        {!loading && !error && featured.length > 0 && (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {!loading && categories.length > 0 && (
        <section className="page-section container">
          <div className="section-heading">
            <h2>Shop by Category</h2>
          </div>
          <div className="category-grid">
            {categories.map((name) => (
              <CategoryCard key={name} name={name} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
