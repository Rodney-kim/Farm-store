import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h4 className="brand">🌿 FarmStore</h4>
          <p>Fresh farm products delivered to your doorstep.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>Phone: +254 700 000 000</li>
            <li>Email: hello@farmstore.co.ke</li>
            <li>Location: Eldoret, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">© 2026 FarmStore. All Rights Reserved.</div>
    </footer>
  );
}
