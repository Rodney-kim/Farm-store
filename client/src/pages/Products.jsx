import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Loading from "../components/Loading.jsx";
import { getProducts, getCategories } from "../services/api.js";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the full product list once. Search and category filtering
  // both happen on the frontend, as the brief asks for.
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const [products, cats] = await Promise.all([getProducts(), getCategories()]);
        if (cancelled) return;
        setAllProducts(products);
        setCategories(cats);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, search]);

  function handleCategorySelect(category) {
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  }

  return (
    <section className="page-section container">
      <div className="section-heading">
        <h2>All Products</h2>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />

        <div className="filter-chips">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              className={`filter-chip ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loading label="Loading products..." />}
      {!loading && error && <div className="error-banner">{error}</div>}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="state-block">
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
