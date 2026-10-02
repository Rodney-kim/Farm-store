import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getProducts, createProduct, deleteProduct } from "../services/api.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  unit: "kg",
  image: "🌱",
  stock: "",
};

export default function Admin() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h1>Admin only</h1>
        <p>
          Please <Link to="/login">log in</Link> with an admin account.
        </p>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setError("");
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <h1>Admin: Products</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h2>Add product</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 480 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category (e.g. Vegetables)" value={form.category} onChange={handleChange} required />
        <input name="unit" placeholder="Unit (kg, bunch...)" value={form.unit} onChange={handleChange} required />
        <input name="image" placeholder="Emoji or image URL" value={form.image} onChange={handleChange} />
        <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit" className="btn">Add product</button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>Existing products ({products.length})</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
            <span>
              {p.image} {p.name} · {p.price}/{p.unit} · stock {p.stock}
            </span>
            <button onClick={() => handleDelete(p._id, p.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
