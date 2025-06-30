import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cuisine: '',
    price: '',
    ingredients: '',
    isVegetarian: false,
    calories: '',
    image: '',
    rating: ''
  });

  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  // Clear messages after some time
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setSuccessMessage('Successfully logged in');
    } else {
      setErrorMessage('Invalid admin credentials');
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const product = {
        ...formData,
        price: parseFloat(formData.price),
        calories: parseInt(formData.calories),
        rating: parseFloat(formData.rating),
        ingredients: formData.ingredients.split(',').map(i => i.trim())
      };

      const res = await fetch('http://localhost:4000/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (res.ok) {
        setSuccessMessage('Food item added successfully!');
        setErrorMessage('');
        setFormData({
          name: '',
          category: '',
          cuisine: '',
          price: '',
          ingredients: '',
          isVegetarian: false,
          calories: '',
          image: '',
          rating: ''
        });
        setTimeout(() => navigate('/home'), 2000);
      } else {
        setErrorMessage('Error adding food item.');
        setSuccessMessage('');
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="admin-container">
      {!isLoggedIn ? (
        <>
          <h2>Admin Login</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Login as Admin</button>
          </form>
        </>
      ) : (
        <>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <button onClick={handleLogout} className="logout-btn">Logout Admin</button>

          <h2>Add New Food Item</h2>
          <form onSubmit={handleProductSubmit} className="admin-form">
            <input 
              type="text" 
              name="name" 
              placeholder="Food Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="category" 
              placeholder="Category (e.g., Main Course, Starter)" 
              value={formData.category} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="cuisine" 
              placeholder="Cuisine Type" 
              value={formData.cuisine} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="number" 
              name="price" 
              placeholder="Price" 
              value={formData.price} 
              onChange={handleChange} 
              step="0.01"
              min="0"
              required 
            />
            <textarea 
              name="ingredients" 
              placeholder="Ingredients (comma-separated)" 
              value={formData.ingredients} 
              onChange={handleChange} 
              required
            ></textarea>

            <label className="checkbox-label" htmlFor="isVegetarian">
              <input 
                type="checkbox" 
                id="isVegetarian"
                name="isVegetarian" 
                checked={formData.isVegetarian} 
                onChange={handleChange} 
              /> 
              Vegetarian
            </label>

            <input 
              type="number" 
              name="calories" 
              placeholder="Calories" 
              value={formData.calories} 
              onChange={handleChange} 
              min="0"
              required 
            />
            <input 
              type="url" 
              name="image" 
              placeholder="Image URL" 
              value={formData.image} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="number" 
              step="0.1" 
              name="rating" 
              placeholder="Rating (0-5)" 
              value={formData.rating} 
              onChange={handleChange} 
              min="0"
              max="5"
              required 
            />
            <button type="submit">Add Food Item</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Admin;
