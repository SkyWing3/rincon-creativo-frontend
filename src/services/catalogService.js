import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const extractList = (payload) => {
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (Array.isArray(payload)) {
        return payload;
    }
    return [];
};

const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return extractList(response.data);
};

const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return extractList(response.data);
};

const catalogService = {
    getProducts,
    getCategories,
};

export default catalogService;
