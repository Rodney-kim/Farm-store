export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products"
      />
    </div>
  );
}
