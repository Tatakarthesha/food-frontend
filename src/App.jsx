import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Updated navbar hiding logic to include cart page
  const hideNavbarRoutes = ['/login', '/signup', '/admin', '/cart'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartCount(savedCart.length);
    };

    // Listen for cart updates
    const handleCartUpdate = (event) => {
      const { cartItems } = event.detail;
      setCartCount(cartItems.length);
    };

    // Add event listener
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Initial cart count
    updateCartCount();

    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Only navigate if not already on home page
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Only navigate if not already on home page
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  return (
    <div className="app-container">
      {!shouldHideNavbar && (
        <Navbar 
          cartCount={cartCount} 
          onCartClick={handleCartClick}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      <main className={`main-content ${shouldHideNavbar ? 'no-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route 
            path="/home" 
            element={
              <Home 
                key={`${searchTerm}-${selectedCategory}`}
                initialSearchTerm={searchTerm}
                initialCategory={selectedCategory}
              />
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
};

export default App;
