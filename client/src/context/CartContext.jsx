import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "farmstore_cart";

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // Corrupted or blocked storage shouldn't crash the app.
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  // Whenever the cart changes, mirror it into localStorage so a page
  // refresh (or closing the tab) doesn't lose the customer's cart.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product._id);

      if (existing) {
        return current.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          image: product.image,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook so components just call useCart() instead of importing
// useContext + CartContext everywhere.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
