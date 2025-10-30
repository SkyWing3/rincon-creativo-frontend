import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import './Admin.css';

const initialProductFormState = {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
    category_id: '',
};

const initialCategoryFormState = {
    nombre: '',
    descripcion: '',
};

const ROLE_OPTIONS = ['client', 'admin', 'fulfillment'];
const ROLE_LABELS = {
    client: 'Cliente',
    admin: 'Administrador',
    fulfillment: 'Fulfillment',
};

const AdminDashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productForm, setProductForm] = useState(initialProductFormState);
    const [categoryForm, setCategoryForm] = useState(initialCategoryFormState);
    const [productFeedback, setProductFeedback] = useState(null);
    const [categoryFeedback, setCategoryFeedback] = useState(null);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [roleSelections, setRoleSelections] = useState({});
    const [savingUserRoles, setSavingUserRoles] = useState({});
    const [userFeedback, setUserFeedback] = useState(null);

    const resolveErrorMessage = (err, fallback) => {
        const serverMessage =
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.response?.data?.error;
        if (serverMessage) {
            return serverMessage;
        }
        if (typeof err?.response?.data === 'string' && err.response.data.trim()) {
            return err.response.data.trim();
        }
        if (err?.message) {
            return err.message;
        }
        return fallback;
    };

    const fetchAdminData = useCallback(async () => {
        const userRole = user?.role || user?.rol;
        if (!token || !user || userRole === 'client') {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const [usersResult, ordersResult, productsResult, categoriesResult] = await Promise.allSettled([
                adminService.getUsers(token),
                adminService.getOrders(token),
                adminService.getProducts(token),
                adminService.getCategories(token),
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

            const errors = [];

            if (usersResult.status === 'fulfilled') {
                setUsers(resolveList(usersResult.value.data));
            } else {
                setUsers([]);
                errors.push(
                    `Usuarios: ${resolveErrorMessage(
                        usersResult.reason,
                        'No se pudieron obtener los usuarios.',
                    )}`,
                );
            }
            setRoleSelections({});
            setSavingUserRoles({});

            if (ordersResult.status === 'fulfilled') {
                setOrders(resolveList(ordersResult.value.data));
            } else {
                setOrders([]);
                errors.push(
                    `Pedidos: ${resolveErrorMessage(
                        ordersResult.reason,
                        'No se pudieron obtener los pedidos.',
                    )}`,
                );
            }

            if (productsResult.status === 'fulfilled') {
                setProducts(resolveList(productsResult.value.data));
            } else {
                setProducts([]);
                errors.push(
                    `Productos: ${resolveErrorMessage(
                        productsResult.reason,
                        'No se pudieron obtener los productos.',
                    )}`,
                );
            }

            if (categoriesResult.status === 'fulfilled') {
                setCategories(resolveList(categoriesResult.value.data));
            } else {
                setCategories([]);
                errors.push(
                    `Categorías: ${resolveErrorMessage(
                        categoriesResult.reason,
                        'No se pudieron obtener las categorías.',
                    )}`,
                );
            }

            if (errors.length === 0) {
                setError(null);
            } else if (errors.length === 4) {
                setError(`No se pudieron obtener los datos administrativos. ${errors.join(' ')}`);
            } else {
                setError(errors.join(' '));
            }
        } catch (err) {
            setError(resolveErrorMessage(err, 'No se pudieron obtener los datos administrativos.'));
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

    const resolveUserRole = (record) => {
        if (!record) {
            return 'client';
        }
        const rawRole = (record.role || record.rol || '').toLowerCase();
        if (ROLE_OPTIONS.includes(rawRole)) {
            return rawRole;
        }
        return 'client';
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

    const resolveProductCategory = (product) => {
        const categoryRecord = product?.category;
        if (categoryRecord?.nombre) {
            return categoryRecord.nombre;
        }
        if (categoryRecord?.name) {
            return categoryRecord.name;
        }
        if (product?.category_name) {
            return product.category_name;
        }
        if (product?.category_id) {
            return `ID ${product.category_id}`;
        }
        return 'N/D';
    };

    const handleRoleSelectChange = (userId, newRole) => {
        if (!ROLE_OPTIONS.includes(newRole)) {
            return;
        }
        const userRecord = users.find((item) => item.id === userId);
        const currentRole = resolveUserRole(userRecord);
        setUserFeedback(null);
        if (newRole === currentRole) {
            setRoleSelections((prev) => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
            return;
        }
        setRoleSelections((prev) => ({
            ...prev,
            [userId]: newRole,
        }));
    };

    const handleUpdateUserRole = async (userId) => {
        if (!token) {
            setUserFeedback({
                type: 'error',
                message: 'No se encontró un token de autenticación válido.',
            });
            return;
        }
        const userRecord = users.find((item) => item.id === userId);
        if (!userRecord) {
            setUserFeedback({
                type: 'error',
                message: 'No se pudo identificar al usuario seleccionado.',
            });
            return;
        }
        const currentRole = resolveUserRole(userRecord);
        const selectedRole = roleSelections[userId];
        const nextRole = selectedRole ?? currentRole;
        if (!ROLE_OPTIONS.includes(nextRole)) {
            setUserFeedback({
                type: 'error',
                message: 'Selecciona un rol válido antes de continuar.',
            });
            return;
        }
        if (nextRole === currentRole) {
            setUserFeedback({
                type: 'error',
                message: 'Selecciona un rol diferente para poder actualizar.',
            });
            return;
        }
        setSavingUserRoles((prev) => ({
            ...prev,
            [userId]: true,
        }));
        setUserFeedback(null);
        try {
            await adminService.updateUserRole(token, userId, nextRole);
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === userId
                        ? {
                              ...item,
                              role: nextRole,
                              rol: nextRole,
                          }
                        : item,
                ),
            );
            setUserFeedback({
                type: 'success',
                message: `Rol actualizado a ${ROLE_LABELS[nextRole] || nextRole} correctamente.`,
            });
            setRoleSelections((prev) => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
        } catch (err) {
            setUserFeedback({
                type: 'error',
                message: resolveErrorMessage(err, 'No se pudo actualizar el rol del usuario.'),
            });
        } finally {
            setSavingUserRoles((prev) => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleProductInputChange = ({ target }) => {
        const { name, value } = target;
        setProductForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setProductFeedback(null);
    };

    const handleCategoryInputChange = ({ target }) => {
        const { name, value } = target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCategoryFeedback(null);
    };

    const handleProductSubmit = async (event) => {
        event.preventDefault();
        setProductFeedback(null);

        if (!token) {
            setProductFeedback({
                type: 'error',
                message: 'No se encontró un token de autenticación válido.',
            });
            return;
        }

        const trimmedName = productForm.nombre.trim();
        if (!trimmedName) {
            setProductFeedback({
                type: 'error',
                message: 'El nombre del producto es obligatorio.',
            });
            return;
        }

        if (productForm.precio === '') {
            setProductFeedback({
                type: 'error',
                message: 'El precio es obligatorio.',
            });
            return;
        }

        if (productForm.stock === '') {
            setProductFeedback({
                type: 'error',
                message: 'El stock es obligatorio.',
            });
            return;
        }

        if (!productForm.category_id) {
            setProductFeedback({
                type: 'error',
                message:
                    categories.length === 0
                        ? 'Debes crear una categoría antes de registrar productos.'
                        : 'Selecciona una categoría para el producto.',
            });
            return;
        }

        const parsedPrice = Number(productForm.precio);
        if (Number.isNaN(parsedPrice)) {
            setProductFeedback({
                type: 'error',
                message: 'Ingresa un precio válido.',
            });
            return;
        }

        if (parsedPrice < 0) {
            setProductFeedback({
                type: 'error',
                message: 'El precio no puede ser negativo.',
            });
            return;
        }

        const parsedStock = Number(productForm.stock);
        if (Number.isNaN(parsedStock)) {
            setProductFeedback({
                type: 'error',
                message: 'Ingresa un stock válido.',
            });
            return;
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            setProductFeedback({
                type: 'error',
                message: 'El stock debe ser un número entero mayor o igual a cero.',
            });
            return;
        }

        const parsedCategoryId = Number(productForm.category_id);
        if (Number.isNaN(parsedCategoryId)) {
            setProductFeedback({
                type: 'error',
                message: 'Selecciona una categoría válida.',
            });
            return;
        }

        const payload = {
            nombre: trimmedName,
            precio: parsedPrice,
            stock: parsedStock,
            category_id: parsedCategoryId,
        };

        const trimmedDescription = productForm.descripcion.trim();
        if (trimmedDescription) {
            payload.descripcion = trimmedDescription;
        }

        const trimmedImageUrl = productForm.imagen_url.trim();
        if (trimmedImageUrl) {
            payload.imagen_url = trimmedImageUrl;
        }

        const isEditing = editingProductId !== null;
        setIsSavingProduct(true);
        try {
            if (isEditing) {
                await adminService.updateProduct(token, editingProductId, payload);
                setProductFeedback({
                    type: 'success',
                    message: 'Producto actualizado correctamente.',
                });
            } else {
                await adminService.createProduct(token, payload);
                setProductFeedback({
                    type: 'success',
                    message: 'Producto creado correctamente.',
                });
            }
            setProductForm(() => ({ ...initialProductFormState }));
            if (isEditing) {
                setEditingProductId(null);
            }
            await fetchAdminData();
        } catch (err) {
            setProductFeedback({
                type: 'error',
                message: resolveErrorMessage(
                    err,
                    isEditing ? 'No se pudo actualizar el producto.' : 'No se pudo crear el producto.',
                ),
            });
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();
        setCategoryFeedback(null);

        if (!token) {
            setCategoryFeedback({
                type: 'error',
                message: 'No se encontró un token de autenticación válido.',
            });
            return;
        }

        const trimmedName = categoryForm.nombre.trim();
        if (!trimmedName) {
            setCategoryFeedback({
                type: 'error',
                message: 'El nombre de la categoría es obligatorio.',
            });
            return;
        }

        const payload = {
            nombre: trimmedName,
        };

        const trimmedDescription = categoryForm.descripcion.trim();
        if (trimmedDescription) {
            payload.descripcion = trimmedDescription;
        }

        const isEditing = editingCategoryId !== null;
        setIsSavingCategory(true);
        try {
            if (isEditing) {
                await adminService.updateCategory(token, editingCategoryId, payload);
                setCategoryFeedback({
                    type: 'success',
                    message: 'Categoría actualizada correctamente.',
                });
            } else {
                await adminService.createCategory(token, payload);
                setCategoryFeedback({
                    type: 'success',
                    message: 'Categoría creada correctamente.',
                });
            }
            setCategoryForm(() => ({ ...initialCategoryFormState }));
            if (isEditing) {
                setEditingCategoryId(null);
            }
            await fetchAdminData();
        } catch (err) {
            setCategoryFeedback({
                type: 'error',
                message: resolveErrorMessage(
                    err,
                    isEditing ? 'No se pudo actualizar la categoría.' : 'No se pudo crear la categoría.',
                ),
            });
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleEditProduct = (product) => {
        setProductFeedback(null);
        setEditingProductId(product.id);
        setProductForm({
            nombre: product.nombre || product.name || '',
            descripcion: product.descripcion || product.description || '',
            precio: product.precio !== undefined && product.precio !== null
                ? String(product.precio)
                : product.price !== undefined && product.price !== null
                ? String(product.price)
                : '',
            stock:
                product.stock !== undefined && product.stock !== null
                    ? String(product.stock)
                    : '',
            imagen_url: product.imagen_url || product.image_url || '',
            category_id: product.category_id
                ? String(product.category_id)
                : product.category?.id
                ? String(product.category.id)
                : '',
        });
    };

    const handleCancelProductEdit = () => {
        setEditingProductId(null);
        setProductForm(() => ({ ...initialProductFormState }));
        setProductFeedback(null);
    };

    const handleDeleteProduct = async (productId) => {
        if (!token) {
            setProductFeedback({
                type: 'error',
                message: 'No se encontró un token de autenticación válido.',
            });
            return;
        }

        const confirmDeletion = window.confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.');
        if (!confirmDeletion) {
            return;
        }

        setProductFeedback(null);
        setIsSavingProduct(true);
        try {
            await adminService.deleteProduct(token, productId);
            if (editingProductId === productId) {
                handleCancelProductEdit();
            }
            setProductFeedback({
                type: 'success',
                message: 'Producto eliminado correctamente.',
            });
            await fetchAdminData();
        } catch (err) {
            setProductFeedback({
                type: 'error',
                message: resolveErrorMessage(err, 'No se pudo eliminar el producto.'),
            });
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleEditCategory = (category) => {
        setCategoryFeedback(null);
        setEditingCategoryId(category.id);
        setCategoryForm({
            nombre: category.nombre || category.name || '',
            descripcion: category.descripcion || category.description || '',
        });
    };

    const handleCancelCategoryEdit = () => {
        setEditingCategoryId(null);
        setCategoryForm(() => ({ ...initialCategoryFormState }));
        setCategoryFeedback(null);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!token) {
            setCategoryFeedback({
                type: 'error',
                message: 'No se encontró un token de autenticación válido.',
            });
            return;
        }

        const confirmDeletion = window.confirm('¿Seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.');
        if (!confirmDeletion) {
            return;
        }

        setCategoryFeedback(null);
        setIsSavingCategory(true);
        try {
            await adminService.deleteCategory(token, categoryId);
            if (editingCategoryId === categoryId) {
                handleCancelCategoryEdit();
            }
            setCategoryFeedback({
                type: 'success',
                message: 'Categoría eliminada correctamente.',
            });
            await fetchAdminData();
        } catch (err) {
            setCategoryFeedback({
                type: 'error',
                message: resolveErrorMessage(err, 'No se pudo eliminar la categoría.'),
            });
        } finally {
            setIsSavingCategory(false);
        }
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
                {userFeedback && (
                    <p
                        className={`admin-feedback ${
                            userFeedback.type === 'error' ? 'error' : 'success'
                        }`}
                    >
                        {userFeedback.message}
                    </p>
                )}
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
                                {users.map((record) => {
                                    const currentRole = resolveUserRole(record);
                                    const pendingRole = roleSelections[record.id] ?? currentRole;
                                    const isSavingRole = Boolean(savingUserRoles[record.id]);
                                    const hasPendingChange = pendingRole !== currentRole;
                                    return (
                                        <tr key={record.id}>
                                            <td>{record.id}</td>
                                            <td>{formatFullName(record)}</td>
                                            <td>{record.email || 'N/D'}</td>
                                            <td>
                                                <div className="admin-role-control">
                                                    <select
                                                        className="admin-role-select"
                                                        value={pendingRole}
                                                        onChange={(event) =>
                                                            handleRoleSelectChange(record.id, event.target.value)
                                                        }
                                                        disabled={isSavingRole}
                                                    >
                                                        {ROLE_OPTIONS.map((role) => (
                                                            <option key={role} value={role}>
                                                                {ROLE_LABELS[role] || role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        className="admin-secondary admin-role-save"
                                                        onClick={() => handleUpdateUserRole(record.id)}
                                                        disabled={!hasPendingChange || isSavingRole}
                                                    >
                                                        {isSavingRole ? 'Guardando...' : 'Actualizar'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{record.phone || 'N/D'}</td>
                                            <td>{record.departamento || 'N/D'}</td>
                                            <td>
                                                {record.registrado_el ||
                                                    formatDate(record.created_at || record.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })}
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
            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Productos</h2>
                    {isLoading && <span className="admin-section-status">Cargando...</span>}
                    {!isLoading && products.length > 0 && (
                        <span className="admin-section-status">{products.length} productos</span>
                    )}
                </div>
                <div className="admin-section-form">
                    <h3>{editingProductId ? 'Editar producto' : 'Agregar producto'}</h3>
                    <form className="admin-form" onSubmit={handleProductSubmit}>
                        <label className="admin-form-label" htmlFor="product-nombre">
                            Nombre *
                        </label>
                        <input
                            id="product-nombre"
                            name="nombre"
                            className="admin-form-input"
                            type="text"
                            value={productForm.nombre}
                            onChange={handleProductInputChange}
                            placeholder="Nombre del producto"
                            required
                        />

                        <label className="admin-form-label" htmlFor="product-descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="product-descripcion"
                            name="descripcion"
                            className="admin-form-input"
                            value={productForm.descripcion}
                            onChange={handleProductInputChange}
                            placeholder="Descripción breve"
                            rows={3}
                        />

                        <label className="admin-form-label" htmlFor="product-precio">
                            Precio *
                        </label>
                        <input
                            id="product-precio"
                            name="precio"
                            className="admin-form-input"
                            type="number"
                            min="0"
                            step="0.01"
                            value={productForm.precio}
                            onChange={handleProductInputChange}
                            placeholder="0.00"
                            required
                        />

                        <label className="admin-form-label" htmlFor="product-stock">
                            Stock *
                        </label>
                        <input
                            id="product-stock"
                            name="stock"
                            className="admin-form-input"
                            type="number"
                            min="0"
                            step="1"
                            value={productForm.stock}
                            onChange={handleProductInputChange}
                            placeholder="0"
                            required
                        />

                        <label className="admin-form-label" htmlFor="product-imagen">
                            URL de la imagen
                        </label>
                        <input
                            id="product-imagen"
                            name="imagen_url"
                            className="admin-form-input"
                            type="url"
                            value={productForm.imagen_url}
                            onChange={handleProductInputChange}
                            placeholder="https://"
                        />

                        <label className="admin-form-label" htmlFor="product-categoria">
                            Categoría *
                        </label>
                        <select
                            id="product-categoria"
                            name="category_id"
                            className="admin-form-input"
                            value={productForm.category_id}
                            onChange={handleProductInputChange}
                            disabled={categories.length === 0}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={String(category.id)}>
                                    {category.nombre || category.name} (ID {category.id})
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="admin-form-note">
                                Crea una categoría antes de registrar productos.
                            </p>
                        )}

                        <div className="admin-form-actions">
                            <button
                                type="submit"
                                className="admin-submit"
                                disabled={isSavingProduct || isLoading}
                            >
                                {isSavingProduct
                                    ? 'Guardando...'
                                    : editingProductId
                                    ? 'Guardar cambios'
                                    : 'Agregar producto'}
                            </button>
                            {editingProductId && (
                                <button
                                    type="button"
                                    className="admin-secondary"
                                    onClick={handleCancelProductEdit}
                                    disabled={isSavingProduct}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                    {productFeedback && (
                        <p
                            className={`admin-feedback ${
                                productFeedback.type === 'error' ? 'error' : 'success'
                            }`}
                        >
                            {productFeedback.message}
                        </p>
                    )}
                </div>
                {!isLoading && products.length === 0 && !error && (
                    <p className="admin-section-empty">No se encontraron productos.</p>
                )}
                {products.length > 0 && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Actualizado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.nombre || product.name || 'N/D'}</td>
                                        <td>{resolveProductCategory(product)}</td>
                                        <td>{formatCurrency(product.precio ?? product.price)}</td>
                                        <td>{product.stock ?? 'N/D'}</td>
                                        <td>{formatDate(product.updated_at || product.updatedAt)}</td>
                                        <td className="admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-button"
                                                onClick={() => handleEditProduct(product)}
                                                disabled={isSavingProduct}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-button danger"
                                                onClick={() => handleDeleteProduct(product.id)}
                                                disabled={isSavingProduct}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Categorías</h2>
                    {isLoading && <span className="admin-section-status">Cargando...</span>}
                    {!isLoading && categories.length > 0 && (
                        <span className="admin-section-status">{categories.length} categorías</span>
                    )}
                </div>
                <div className="admin-section-form">
                    <h3>{editingCategoryId ? 'Editar categoría' : 'Agregar categoría'}</h3>
                    <form className="admin-form" onSubmit={handleCategorySubmit}>
                        <label className="admin-form-label" htmlFor="category-nombre">
                            Nombre *
                        </label>
                        <input
                            id="category-nombre"
                            name="nombre"
                            className="admin-form-input"
                            type="text"
                            value={categoryForm.nombre}
                            onChange={handleCategoryInputChange}
                            placeholder="Nombre de la categoría"
                            required
                        />

                        <label className="admin-form-label" htmlFor="category-descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="category-descripcion"
                            name="descripcion"
                            className="admin-form-input"
                            value={categoryForm.descripcion}
                            onChange={handleCategoryInputChange}
                            placeholder="Descripción breve"
                            rows={2}
                        />

                        <div className="admin-form-actions">
                            <button
                                type="submit"
                                className="admin-submit"
                                disabled={isSavingCategory || isLoading}
                            >
                                {isSavingCategory
                                    ? 'Guardando...'
                                    : editingCategoryId
                                    ? 'Guardar cambios'
                                    : 'Agregar categoría'}
                            </button>
                            {editingCategoryId && (
                                <button
                                    type="button"
                                    className="admin-secondary"
                                    onClick={handleCancelCategoryEdit}
                                    disabled={isSavingCategory}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                    {categoryFeedback && (
                        <p
                            className={`admin-feedback ${
                                categoryFeedback.type === 'error' ? 'error' : 'success'
                            }`}
                        >
                            {categoryFeedback.message}
                        </p>
                    )}
                </div>
                {!isLoading && categories.length === 0 && !error && (
                    <p className="admin-section-empty">No se encontraron categorías.</p>
                )}
                {categories.length > 0 && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Creada</th>
                                    <th>Actualizada</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.nombre || category.name || 'N/D'}</td>
                                        <td>{category.descripcion || category.description || 'Sin descripción'}</td>
                                        <td>{formatDate(category.created_at || category.createdAt)}</td>
                                        <td>{formatDate(category.updated_at || category.updatedAt)}</td>
                                        <td className="admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-button"
                                                onClick={() => handleEditCategory(category)}
                                                disabled={isSavingCategory}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-button danger"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                disabled={isSavingCategory}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
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
