import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const register = (payload) => {
    return axios.post(`${API_URL}/register/`, payload);
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login/`, {
        email,
        password,
    });
};

const logout = (token) => {
    return axios.post(`${API_URL}/logout/`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getProfile = (token) => {
    return axios.get(`${API_URL}/profile/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const authService = {
    register,
    login,
    logout,
    getProfile,
};

export default authService;
