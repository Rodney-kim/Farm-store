import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getProductById } from "../services/api.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setAdded(false);
    setQuantity(1);

    getProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container page-section">
        <Loading label="Loading product..." />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container page-section state-block">
        <h3>Product Not Found</h3>
        <p>We couldn't find the product you're looking for.</p>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
  }

  return (
    <div className="container page-section">
      <div className="details-grid">
        <div className="details-image">{product.image || "🌾"}</div>

        <div>
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <p className="details-price">
            KSh {product.price} <span className="product-unit">/ {product.unit}</span>
          </p>

          <p className={`stock-status ${inStock ? "in-stock" : "out-of-stock"}`}>
            {inStock ? `${product.stock} available` : "Out of stock"}
          </p>

          {inStock && (
            <>
              <div className="form-field">
                <label>Quantity</label>
                <div className="qty-selector">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>
                    +
                  </button>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>

              {added && (
                <p style={{ color: "var(--color-primary)", marginTop: "12px" }}>
                  Added to cart!
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
