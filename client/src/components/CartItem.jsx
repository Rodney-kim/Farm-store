import { useCart } from "../context/CartContext.jsx";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-icon">{item.image || "🌾"}</div>

      <div>
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-unit">KSh {item.price} / {item.unit}</div>
      </div>

      <div className="qty-selector">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="product-price">KSh {lineTotal}</div>

      <button className="cart-item-remove" onClick={() => removeFromCart(item.productId)}>
        Remove
      </button>
    </div>
  );
}
