import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const createOrder = (payload, token) => {
    const config = token
        ? {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
        : {};

    return axios.post(`${API_URL}/orders`, payload, config);
};

const orderService = {
    createOrder,
};

export default orderService;
