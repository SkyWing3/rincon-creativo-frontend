import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Landing from './components/Landing/Landing';
import Catalog from './components/Catalog/Catalog';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import Notification from './components/Notification/Notification';
import { ThemeContext } from './context/ThemeContext';
import './App.css';

function Main() {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setNotification({ message: 'Producto agregado al carrito', type: 'success' });
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartItems(cartItems.filter((item) => item.id !== productToRemove.id));
  };

  const handleUpdateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(product);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Router>
        <Navbar cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/catalog" element={<Catalog onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/cart"
            element={<ShoppingCart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default Main;
