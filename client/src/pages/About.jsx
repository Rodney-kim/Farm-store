export default function About() {
  return (
    <section className="page-section container">
      <h1>About FarmStore</h1>
      <p style={{ maxWidth: "70ch" }}>
        FarmStore connects local farmers directly with customers who want fresh, honest
        produce delivered to their door. We work with smallholder farms to bring you
        vegetables, fruits, dairy, eggs, cereals and other farm products, picked and
        packed with care.
      </p>

      <div className="info-grid">
        <div className="info-card">
          <h3>Our Mission</h3>
          <p>Make fresh, affordable farm produce accessible to every household.</p>
        </div>
        <div className="info-card">
          <h3>Our Farmers</h3>
          <p>We partner with local farmers to ensure fair prices and consistent quality.</p>
        </div>
        <div className="info-card">
          <h3>Our Promise</h3>
          <p>Every order is checked for freshness before it leaves our store.</p>
        </div>
      </div>
    </section>
  );
}
