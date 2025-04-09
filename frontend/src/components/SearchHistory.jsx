function SearchHistory({ searchHistory, onHistoryClick }) {
    if (!searchHistory.length) return null;
    
    return (
      <div className="search-history">
        <h3>Recent Searches</h3>
        <ul>
          {searchHistory.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onHistoryClick(item)}
                className="history-button"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default SearchHistory;
  