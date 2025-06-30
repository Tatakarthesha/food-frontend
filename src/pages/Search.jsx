// src/components/Search.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';


const Search = ({ searchTerm, onSearch, categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="search-section">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={onSearch}
          className="search-input"
        />
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Search;
