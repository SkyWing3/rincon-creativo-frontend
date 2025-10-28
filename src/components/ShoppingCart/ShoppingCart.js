import React from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart-container">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <img src={item.image} alt={item.name} />
                  <span className="item-name">{item.name}</span>
                </div>
                <div className="item-details">
                  <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(item, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item, item.quantity + 1)}>+</button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => onRemoveFromCart(item)} className="remove-btn">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            <Link to="/checkout" className="pay-btn">Finalizar Compra</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
