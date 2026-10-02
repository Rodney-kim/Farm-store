import { Link } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container page-section state-block">
        <h3>Your cart is empty</h3>
        <p>Add some fresh produce to get started.</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="page-section container">
      <div className="section-heading">
        <h2>Shopping Cart</h2>
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row total">
          <span>Total</span>
          <span>KSh {cartTotal}</span>
        </div>
      </div>

      <div className="product-actions" style={{ marginTop: "24px", justifyContent: "flex-end" }}>
        <Link to="/products" className="btn btn-outline">
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn btn-primary">
          Checkout
        </Link>
      </div>
    </section>
  );
}
