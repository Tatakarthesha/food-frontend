// Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentOption, setPaymentOption] = useState('online');
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState('paypal');
  const [bankPin, setBankPin] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedItems);
  };

  const updateCart = (updatedItems) => {
    // Update state
    setCartItems(updatedItems);
    
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch event for navbar update
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedItems }
    }));
  };

  const handleRemove = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    updateCart(updatedItems);
  };

  const handleQuantityChange = (id, delta) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedItems);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!address.trim() || !pinCode.trim()) {
      setErrorMessage('Please enter delivery address and pin code.');
      setSuccessMessage('');
      return;
    }
    if (!/^[0-9]{6}$/.test(pinCode)) {
      setErrorMessage('Please enter a valid 6-digit pin code.');
      setSuccessMessage('');
      return;
    }
    if (paymentOption === 'online') {
      if (!bankPin.trim()) {
        setErrorMessage('Please enter your bank PIN for online payment.');
        setSuccessMessage('');
        return;
      }
      if (!/^\d{4,6}$/.test(bankPin)) {
        setErrorMessage('Bank PIN should be 4 to 6 digits.');
        setSuccessMessage('');
        return;
      }
    }

    setErrorMessage('');
    setSuccessMessage(
      `Order placed successfully! Payment method: ${paymentOption === 'online' ? onlinePaymentMethod : 'Cash on Delivery'}.`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear cart immediately
    updateCart([]);
    
    setTimeout(() => {
      setAddress('');
      setPinCode('');
      setBankPin('');
      setSuccessMessage('');
      navigate('/home'); // Navigate back to home after order placement
    }, 4000);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="continue-shopping" onClick={() => navigate('/home')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                  </div>
                  <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>

          <div className="payment-section">
            <h3>Choose Payment Method</h3>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentOption === 'online'}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              Online Payment
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentOption === 'cod'}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              Cash on Delivery
            </label>

            {paymentOption === 'online' && (
              <div className="online-payment-methods">
                <h4>Select Online Payment Method</h4>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="onlinePaymentMethod"
                    value="paypal"
                    checked={onlinePaymentMethod === 'paypal'}
                    onChange={(e) => setOnlinePaymentMethod(e.target.value)}
                  />
                  PayPal
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="onlinePaymentMethod"
                    value="paytm"
                    checked={onlinePaymentMethod === 'paytm'}
                    onChange={(e) => setOnlinePaymentMethod(e.target.value)}
                  />
                  Paytm
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="onlinePaymentMethod"
                    value="googlepay"
                    checked={onlinePaymentMethod === 'googlepay'}
                    onChange={(e) => setOnlinePaymentMethod(e.target.value)}
                  />
                  Google Pay
                </label>
                <input
                  type="password"
                  placeholder="Enter Bank PIN"
                  value={bankPin}
                  onChange={(e) => setBankPin(e.target.value)}
                  maxLength={6}
                  className="bank-pin-input"
                />
              </div>
            )}
          </div>

          <div className="delivery-section">
            <h3>Delivery Details</h3>
            <textarea
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            ></textarea>
            <input
              type="text"
              placeholder="Pin Code (6 digits)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              maxLength={6}
            />
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;