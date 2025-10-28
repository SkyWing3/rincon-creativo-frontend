import React, { useState, useContext } from 'react';
import './Checkout.css';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [razonSocial, setRazonSocial] = useState('');
  const [nit, setNit] = useState('');

  // Mock user data
  const userData = {
    nombre: 'John',
    apellidos: 'Doe',
    departamento: 'La Paz',
    ciudad: 'La Paz',
    telefono: '12345678',
    correo: 'john.doe@example.com',
  };

  // Mock cart data
  const cartItems = [
    { id: 1, name: 'Producto 1', price: 10, quantity: 2 },
    { id: 2, name: 'Producto 2', price: 20, quantity: 1 },
  ];

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="checkout-container">
        <h2>Finalizar Compra</h2>
        <p>Debes iniciar sesión para finalizar la compra.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <div className="checkout-content">
        <div className="user-data">
          <h3>Datos de la Cuenta</h3>
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Apellidos:</strong> {userData.apellidos}</p>
          <p><strong>Departamento:</strong> {userData.departamento}</p>
          <p><strong>Ciudad:</strong> {userData.ciudad}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <p><strong>Correo Electrónico:</strong> {userData.correo}</p>
        </div>
        <div className="billing-data">
          <h3>Datos de Facturación</h3>
          <form>
            <div className="form-group">
              <label htmlFor="razonSocial">Razón Social</label>
              <input
                type="text"
                id="razonSocial"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nit">NIT o Carnet de Identidad</label>
              <input
                type="text"
                id="nit"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="cart-summary">
          <h3>Resumen del Carrito</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-summary">
              <span>{item.name} (x{item.quantity})</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="cart-total-summary">
            <strong>Total:</strong>
            <span>${cartTotal}</span>
          </div>
          <div className="payment-method">
            <h4>Método de Pago</h4>
            <div className="binance-pay">
              <img src="https://img.icons8.com/fluency/48/binance.png" alt="Binance Pay" />
              <span>Binance Pay</span>
            </div>
          </div>
          <button className="place-order-btn">Realizar Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
