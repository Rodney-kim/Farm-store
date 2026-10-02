import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../services/api.js";

const EMPTY_FORM = { customerName: "", phone: "", email: "", address: "" };

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // If the cart is empty and no order has just been placed, send the
  // customer back to shopping instead of showing a blank checkout form.
  if (items.length === 0 && !confirmedOrder) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!form.address.trim()) nextErrors.address = "Delivery address is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        ...form,
        products: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
        })),
      });
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="container page-section">
        <div className="confirmation-card">
          <div className="icon">✅</div>
          <h2>Order placed successfully!</h2>
          <p className="order-number">
            Order Number: #{confirmedOrder._id.slice(-6).toUpperCase()}
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="page-section container">
      <div className="section-heading">
        <h2>Checkout</h2>
      </div>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} noValidate>
          {submitError && <div className="error-banner">{submitError}</div>}

          <div className={`form-field ${errors.customerName ? "has-error" : ""}`}>
            <label htmlFor="customerName">Full Name</label>
            <input
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
            />
            {errors.customerName && <span className="field-error">{errors.customerName}</span>}
          </div>

          <div className={`form-field ${errors.phone ? "has-error" : ""}`}>
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className={`form-field ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-field ${errors.address ? "has-error" : ""}`}>
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary-card">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="order-line" key={item.productId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>KSh {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>KSh {cartTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
