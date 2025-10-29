import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import './Admin.css';

const AdminDashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAdminData = useCallback(async () => {
        const userRole = user?.role || user?.rol;
        if (!token || !user || userRole === 'client') {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const [usersResponse, ordersResponse] = await Promise.all([
                adminService.getUsers(token),
                adminService.getOrders(token),
            ]);

            const resolveList = (payload) => {
                if (Array.isArray(payload?.data)) {
                    return payload.data;
                }
                if (Array.isArray(payload)) {
                    return payload;
                }
                return [];
            };

            setUsers(resolveList(usersResponse.data));
            setOrders(resolveList(ordersResponse.data));
        } catch (err) {
            let errorMessage = 'No se pudieron obtener los datos administrativos.';
            const serverMessage = err?.response?.data?.message || err?.response?.data?.detail;
            if (serverMessage) {
                errorMessage = serverMessage;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    const handleLogout = async () => {
        await logout();
    };

    const formatDate = (value) => {
        if (!value) {
            return 'N/D';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleString();
    };

    const formatFullName = (record) => {
        if (typeof record === 'string') {
            return record;
        }
        if (!record) {
            return 'N/D';
        }
        const slots = [
            record.first_name,
            record.f_last_name,
            record.s_last_name,
        ].filter(Boolean);
        if (slots.length === 0) {
            return record.name || record.username || 'N/D';
        }
        return slots.join(' ');
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'N/D';
        }
        const amount = Number(value);
        if (Number.isNaN(amount)) {
            return value;
        }
        return `Bs ${amount.toFixed(2)}`;
    };

    const formatPercentage = (value) => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
            return 'N/D';
        }
        return `${Number(value)}%`;
    };

    const resolveOrderCustomer = (order) => {
        const customerRecord = order?.customer || order?.user;
        if (customerRecord) {
            return formatFullName(customerRecord);
        }
        if (order?.customer_name) {
            return order.customer_name;
        }
        return 'N/D';
    };

    const summarizeOrderDetails = (details) => {
        if (!Array.isArray(details) || details.length === 0) {
            return 'Sin detalles';
        }
        const itemsCount = details.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
        return `${details.length} productos / ${itemsCount} unidades`;
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard-header">
                <div>
                    <h1>Panel de Administración</h1>
                    {user && (
                        <p className="admin-dashboard-user">
                            Bienvenido, {user.first_name} {user.f_last_name}
                        </p>
                    )}
                </div>
                <button className="admin-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </header>
            {error && (
                <div className="admin-error-card">
                    <p>{error}</p>
                    <button className="admin-retry" onClick={fetchAdminData} disabled={isLoading}>
                        Reintentar
                    </button>
                </div>
            )}
            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Usuarios registrados</h2>
                    {isLoading && <span className="admin-section-status">Cargando...</span>}
                    {!isLoading && users.length > 0 && (
                        <span className="admin-section-status">{users.length} usuarios</span>
                    )}
                </div>
                {!isLoading && users.length === 0 && !error && (
                    <p className="admin-section-empty">No se encontraron usuarios.</p>
                )}
                {users.length > 0 && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Teléfono</th>
                                    <th>Departamento</th>
                                    <th>Registrado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{formatFullName(record)}</td>
                                        <td>{record.email || 'N/D'}</td>
                                        <td className="admin-capitalize">{record.role || record.rol || 'N/D'}</td>
                                        <td>{record.phone || 'N/D'}</td>
                                        <td>{record.departamento || 'N/D'}</td>
                                        <td>{record.registrado_el || formatDate(record.created_at || record.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Pedidos recibidos</h2>
                    {isLoading && <span className="admin-section-status">Cargando...</span>}
                    {!isLoading && orders.length > 0 && (
                        <span className="admin-section-status">{orders.length} pedidos</span>
                    )}
                </div>
                {!isLoading && orders.length === 0 && !error && (
                    <p className="admin-section-empty">No se encontraron pedidos.</p>
                )}
                {orders.length > 0 && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Total</th>
                                    <th>Descuento</th>
                                    <th>Creado</th>
                                    <th>Actualizado</th>
                                    <th>Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{resolveOrderCustomer(order)}</td>
                                        <td className="admin-capitalize">{order.status || order.state || 'N/D'}</td>
                                        <td>{formatCurrency(order.total ?? order.total_amount ?? order.amount)}</td>
                                        <td>{formatPercentage(order.global_discount)}</td>
                                        <td>{formatDate(order.created_at || order.createdAt)}</td>
                                        <td>{formatDate(order.updated_at || order.updatedAt)}</td>
                                        <td>{summarizeOrderDetails(order.details)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
