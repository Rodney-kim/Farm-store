import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const inStock = product.stock > 0;

  return (
    <div className="product-card">
      <div className="product-image">{product.image || "🌾"}</div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}

        <div className="product-price-row">
          <span className="product-price">KSh {product.price}</span>
          <span className="product-unit">/ {product.unit}</span>
        </div>

        <span className={`stock-status ${inStock ? "in-stock" : "out-of-stock"}`}>
          {inStock ? `In stock (${product.stock})` : "Out of stock"}
        </span>

        <div className="product-actions">
          <Link to={`/products/${product._id}`} className="btn btn-outline btn-sm">
            View Product
          </Link>
          <button
            className="btn btn-primary btn-sm"
            disabled={!inStock}
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
