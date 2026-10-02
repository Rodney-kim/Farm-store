import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint for contact messages in this MVP — this simply
    // confirms receipt on the frontend. Wire this up to a real endpoint
    // later if you need to store or email these messages.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section className="page-section container">
      <h1>Contact Us</h1>

      <div className="contact-layout">
        <div>
          <p>Have a question about an order or a product? Reach out any time.</p>
          <div className="info-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="info-card">
              <h3>Phone</h3>
              <p>+254 700 000 000</p>
            </div>
            <div className="info-card">
              <h3>Email</h3>
              <p>hello@farmstore.co.ke</p>
            </div>
            <div className="info-card">
              <h3>Location</h3>
              <p>Eldoret, Kenya</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {sent && <div className="error-banner" style={{ background: "var(--color-primary-tint)", color: "var(--color-primary-dark)" }}>
            Thanks! Your message has been noted.
          </div>}

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
