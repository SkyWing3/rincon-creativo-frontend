

import React, { useState } from 'react';
import './Orders.css';
import OrderDetail from '../OrderDetail/OrderDetail';

const Orders = ({ show, onClose }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with data from your endpoint
  const orders = [
    {
      id: '#12345',
      date: '2024-01-15',
      total: '150.00 Bs',
      status: 'Completado',
      products: [
        { id: 1, name: 'Producto 1', quantity: 2, price: 50, image: 'https://via.placeholder.com/60' },
        { id: 2, name: 'Producto 2', quantity: 1, price: 50, image: 'https://via.placeholder.com/60' },
      ],
    },
    {
      id: '#12346',
      date: '2024-02-20',
      total: '200.00 Bs',
      status: 'Pendiente',
      products: [
        { id: 3, name: 'Producto 3', quantity: 4, price: 50, image: 'https://via.placeholder.com/60' },
      ],
    },
    {
      id: '#12347',
      date: '2024-03-10',
      total: '75.50 Bs',
      status: 'Cancelado',
      products: [
        { id: 4, name: 'Producto 4', quantity: 1, price: 75.50, image: 'https://via.placeholder.com/60' },
      ],
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completado':
        return 'status-completed';
      case 'Pendiente':
        return 'status-pending';
      case 'Cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (!show) {
    return null;
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-modal">
      <div className="orders-container">
        {selectedOrder ? (
          <OrderDetail order={selectedOrder} onBack={handleBack} />
        ) : (
          <>
            <div className="orders-header">
              <h1>Mis Pedidos</h1>
              <button onClick={onClose} className="close-btn">×</button>
            </div>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item" onClick={() => handleOrderClick(order)} style={{cursor: 'pointer'}}>
                  <div className="order-details">
                    <span>Pedido {order.id}</span>
                    <p>Fecha: {order.date}</p>
                    <p>Total: {order.total}</p>
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
