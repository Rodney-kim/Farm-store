import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();

  function linkClass({ isActive }) {
    return isActive ? "active-link" : "";
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          🌿 FarmStore
        </NavLink>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
            <span className="cart-link">
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <span>Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClass} onClick={() => setMenuOpen(false)}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
