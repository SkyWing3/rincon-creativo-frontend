
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './Main';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Landing from './components/Landing/Landing';
import Catalog from './components/Catalog/Catalog';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import { AuthContext } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(null);

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
        <Router>
            <div className="app-container">
                <div className="content-wrap">
                    <Main 
                        cartItems={cartItems}
                        notification={notification}
                        handleCloseNotification={handleCloseNotification}
                    />
                    <Routes>
                        <Route path="/" element={<Landing imageUrl="https://comunidadescolar.com.bo/wp-content/uploads/2019/02/Tejidos.jpg" />} />
                        <Route path="/catalog" element={<Catalog onAddToCart={handleAddToCart} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/cart"
                            element={<ShoppingCart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />}
                        />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

