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

const adminService = {
    getUsers,
    getOrders,
};

export default adminService;
