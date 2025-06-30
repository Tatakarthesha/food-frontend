import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaUserCircle, FaSearch, FaUtensils, FaCoffee, FaIceCream, FaHamburger } from 'react-icons/fa';
import { GiNoodles } from 'react-icons/gi';
import './Navbar.css';

const Navbar = ({ cartCount = 0, onCartClick, onSearch, onCategoryChange }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const username = user?.email?.split('@')[0];
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'All', icon: <FaUtensils /> },
    { name: 'Main Course', icon: <FaHamburger /> },
    { name: 'Starter', icon: <GiNoodles /> },
    { name: 'Dessert', icon: <FaIceCream /> },
    { name: 'Snacks', icon: <FaCoffee /> }
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    const value = e.target.value || e.target.search?.value || '';
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="nav-wrapper">
      <nav className="navbar">
        <div className="navbar-content">
          <h2 className="brand" onClick={() => navigate('/home')}>FoodieZone</h2>

          <div className="search-container">
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </form>
          </div>

          <div className="navbar-right">
            <button className="nav-btn" onClick={() => navigate('/home')}>Home</button>
            <button className="nav-btn cart-btn" onClick={onCartClick}>
              Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>

            <div className="profile" onClick={toggleDropdown}>
              <FaUserCircle size={24} color="#fff" />
              {username && <span className="user-greeting">Hi, {username}</span>}
              {showDropdown && (
                <div className="dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="categories">
        <div className="categories-content">
          {categories.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => handleCategoryClick(name)}
              className={`category-btn ${selectedCategory === name ? 'active' : ''}`}
              title={name}
            >
              {icon} {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
