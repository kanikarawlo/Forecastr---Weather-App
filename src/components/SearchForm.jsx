import { useState } from "react";

function SearchForm({ onSearch, loading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="search-input"
      />
      <button
        type="submit"
        className="search-button"
        disabled={loading || !city.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchForm;
