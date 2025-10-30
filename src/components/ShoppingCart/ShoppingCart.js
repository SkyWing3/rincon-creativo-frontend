import React from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
    const hasItems = Array.isArray(cartItems) && cartItems.length > 0;

    return (
        <div className="shopping-cart-container">
            <h2>Carrito de Compras</h2>
            {!hasItems ? (
                <p className="cart-empty">No hay productos en el carrito.</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {cartItems.map((item) => {
                            const subtotal = Number(item.price || 0) * (item.quantity || 0);
                            return (
                                <li key={item.id} className="cart-item">
                                    <div className="item-info">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <div className="item-details">
                                        <div className="quantity-control">
                                            <button onClick={() => onUpdateQuantity(item, item.quantity - 1)}>
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item, item.quantity + 1)}>
                                                +
                                            </button>
                                        </div>
                                        <span>Bs {subtotal.toFixed(2)}</span>
                                        <button
                                            onClick={() => onRemoveFromCart(item)}
                                            className="remove-btn"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="cart-actions">
                        <Link to="/checkout" className="pay-btn">
                            Finalizar Compra
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;
