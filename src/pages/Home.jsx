import React, { useState, useEffect } from 'react';
import { FaStar, FaFire } from 'react-icons/fa';
import './Home.css';

const Home = ({ initialSearchTerm = '', initialCategory = 'All' }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Main Course', 'Starter', 'Dessert', 'Snacks'];

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (foods.length > 0) {
      filterFoods(initialSearchTerm, initialCategory);
    }
  }, [initialSearchTerm, initialCategory, foods]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/foods');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch foods: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.foods) {
        throw new Error('Invalid data format received from server');
      }
      
      setFoods(data.foods);
      filterFoods(initialSearchTerm, initialCategory, data.foods);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError('Failed to load foods. Please try again.');
      setFoods([]);
      setFilteredFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterFoods(value, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterFoods(searchTerm, category);
  };

  const filterFoods = (search, category, foodList = foods) => {
    try {
      if (!foodList || !Array.isArray(foodList)) {
        console.error('Invalid food list for filtering:', foodList);
        return;
      }

      let filtered = [...foodList];

      if (category && category !== 'All') {
        filtered = filtered.filter(food => 
          food.category && food.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filtered = filtered.filter(food =>
          (food.name && food.name.toLowerCase().includes(searchLower)) ||
          (food.description && food.description.toLowerCase().includes(searchLower))
        );
      }

      setFilteredFoods(filtered);
    } catch (err) {
      console.error('Error filtering foods:', err);
      setFilteredFoods(foodList);
    }
  };

  const addToCart = (food) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = cartItems.find(item => item._id === food._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...food, quantity: 1 });
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cartItems }
      }));

      const button = document.querySelector(`[data-food-id="${food._id}"]`);
      if (button) {
        button.textContent = 'Added!';
        setTimeout(() => {
          button.textContent = 'Add to Cart';
        }, 1000);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleRetry = () => {
    fetchFoods();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    filterFoods('', 'All');
  };

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading delicious foods...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">Try Again</button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredFoods.length === 0 ? (
            <div className="no-results">
              <h3>No foods found</h3>
              <p>Try adjusting your search or selecting a different category</p>
              <button 
                onClick={handleReset}
                className="reset-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFoods.map(food => (
              <div key={food._id} className="food-card">
                <div className="food-image">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
                    }}
                  />
                  {food.isVegetarian && <span className="veg-badge">🌱 Veg</span>}
                </div>
                
                <div className="food-details">
                  <h3>{food.name}</h3>
                  <p className="description">{food.description}</p>
                  
                  <div className="food-meta">
                    <span className="rating">
                      <FaStar className="star-icon" /> {food.rating}
                    </span>
                    <span className="calories">
                      <FaFire className="fire-icon" /> {food.calories} cal
                    </span>
                  </div>
                  
                  <div className="food-footer">
                    <span className="price">${food.price.toFixed(2)}</span>
                    <button 
                      className="add-cart-btn"
                      onClick={() => addToCart(food)}
                      data-food-id={food._id}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
