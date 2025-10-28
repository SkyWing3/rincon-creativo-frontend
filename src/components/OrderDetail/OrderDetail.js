
import React from 'react';
import './OrderDetail.css';

const OrderDetail = ({ order, onBack }) => {
  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h2>Detalle del Pedido {order.id}</h2>
        <button onClick={onBack} className="back-btn">Volver a la lista</button>
      </div>
      <div className="order-summary">
        <p><strong>Fecha:</strong> {order.date}</p>
        <p><strong>Total:</strong> {order.total}</p>
        <p><strong>Estado:</strong> {order.status}</p>
      </div>
      <div className="product-list">
        <h3>Productos</h3>
        {order.products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <span>{product.name}</span>
                <p>Precio unitario: {product.price} Bs</p>
              </div>
            </div>
            <div className="product-quantity">
              <p>Cantidad: {product.quantity}</p>
            </div>
            <div className="product-price">
              <p>Subtotal: {product.quantity * product.price} Bs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
