import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const withAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const getUsers = (token) => {
    return axios.get(`${API_URL}/users/`, withAuthHeaders(token));
};

const getOrders = (token) => {
    return axios.get(`${API_URL}/orders/`, withAuthHeaders(token));
};

const getProducts = (token) => {
    return axios.get(`${API_URL}/products`, withAuthHeaders(token));
};

const getCategories = (token) => {
    return axios.get(`${API_URL}/categories`, withAuthHeaders(token));
};

const createProduct = (token, payload) => {
    return axios.post(`${API_URL}/products`, payload, withAuthHeaders(token));
};

const updateProduct = (token, productId, payload) => {
    return axios.put(`${API_URL}/products/${productId}`, payload, withAuthHeaders(token));
};

const deleteProduct = (token, productId) => {
    return axios.delete(`${API_URL}/products/${productId}`, withAuthHeaders(token));
};

const createCategory = (token, payload) => {
    return axios.post(`${API_URL}/categories`, payload, withAuthHeaders(token));
};

const updateCategory = (token, categoryId, payload) => {
    return axios.put(`${API_URL}/categories/${categoryId}`, payload, withAuthHeaders(token));
};

const deleteCategory = (token, categoryId) => {
    return axios.delete(`${API_URL}/categories/${categoryId}`, withAuthHeaders(token));
};

const updateUserRole = (token, userId, role) => {
    return axios.patch(
        `${API_URL}/users/${userId}/role`,
        { role },
        withAuthHeaders(token),
    );
};

const adminService = {
    getUsers,
    getOrders,
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    updateUserRole,
};

export default adminService;
