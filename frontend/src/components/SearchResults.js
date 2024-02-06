import React from 'react'

// SearchResults.js (or wherever you have your SearchResults component)
function SearchResults({ searchQuery, results }) {
    // Display the search results here
    return (
      <div>
        <h2>Search Results for "{searchQuery}"</h2>
        {/* Display the search results content */}
        {results.map(result => (
          <div key={result.id}>{result.name}</div>
        ))}
      </div>
    );
  }
  
  export default SearchResults;
  

